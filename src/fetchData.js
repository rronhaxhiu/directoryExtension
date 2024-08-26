// Handles fetching data from the Google Drive API
export async function fetchFiles(token, pageToken = '', folderId = null, driveId = null) {

    let query = folderId ? `'${folderId}' in parents and ` : '';
    query += 'mimeType=\'application/vnd.google-apps.document\' or ' +
        'mimeType=\'application/vnd.google-apps.folder\' or ' +
        'mimeType=\'application/vnd.google-apps.spreadsheet\' or ' +
        'mimeType=\'application/vnd.google-apps.presentation\' or ' +
        'mimeType=\'application/vnd.google-apps.form\' or ' +
        'mimeType=\'text/plain\' or ' +
        'mimeType=\'text/csv\' or ' +
        'mimeType=\'application/pdf\' or ' +
        'mimeType=\'image/jpeg\' or ' +
        'mimeType=\'image/png\' or ' +
        'mimeType=\'image/gif\' or ' +
        'mimeType=\'application/vnd.ms-excel\' or ' +
        'mimeType=\'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\' or ' +
        'mimeType=\'application/vnd.ms-powerpoint\' or ' +
        'mimeType=\'application/vnd.openxmlformats-officedocument.presentationml.presentation\' or ' +
        'mimeType=\'application/msword\' or ' +
        'mimeType=\'application/vnd.openxmlformats-officedocument.wordprocessingml.document\' or ' +
        'mimeType=\'application/zip\' or ' +
        'mimeType=\'application/x-tar\' or ' +
        'mimeType=\'video/mp4\' or ' +
        'mimeType=\'video/x-msvideo\' or ' +
        'mimeType=\'video/x-matroska\' or ' +
        'mimeType=\'video/quicktime\' or ' +
        'mimeType=\'video/x-flv\'';

    let url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=nextPageToken,files(id,name,mimeType,webViewLink,webContentLink,parents)&includeItemsFromAllDrives=true&supportsAllDrives=true`;

    if (driveId) {
        url += `&driveId=${driveId}&corpora=drive`;
    } else {
        url += `&corpora=user`;
    }

    if (pageToken) {
        url += `&pageToken=${pageToken}`;
    }

    console.log('Fetching from URL:', url); // Log the URL being fetched

    const response = await fetch(url, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    if (!response.ok) {
        console.error('HTTP error:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched data:', data); // Log the fetched data
    return data;
}

export async function fetchSharedDrives(token) {

    const response = await fetch('https://www.googleapis.com/drive/v3/drives', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch Shared Drives: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Fetched shared data:', data); // Log the fetched data
    return data;
}

export async function fetchFilesAndNotify(tabId) {
    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
        if (chrome.runtime.lastError) {
            console.error('Error getting auth token:', chrome.runtime.lastError.message);
            return;
        }

        console.log('Token received');

        const allItems = new Map();  // Use Map to avoid duplicate entries
        const driveFolders = {};     // Store files separately for each drive
        const driveNames = {};       // Store drive names by driveId

        try {
            // Fetch My Drive
            const myDriveData = await fetchFiles(token);
            myDriveData.files.forEach(file => {
                if (file && file.id) {
                    file.driveId = null;
                    allItems.set(file.id, file);
                    if (!driveFolders[file.driveId]) {
                        driveFolders[file.driveId] = [];
                    }
                    driveFolders[file.driveId].push(file);
                } else {
                    console.error('Invalid file data:', file);
                }
            });

            // Fetch Shared Drives
            const sharedDrivesData = await fetchSharedDrives(token);
            const sharedDrives = sharedDrivesData.drives || [];
            console.log(`SHARED DRIVES : ${sharedDrivesData}`);

            for (const drive of sharedDrives) {
                console.log('Fetching Shared Drive:', drive.name);

                driveNames[drive.id] = drive.name; // Store the drive name
                const sharedDriveData = await fetchFiles(token, '', null, drive.id);
                sharedDriveData.files.forEach(file => {
                    if (file && file.id) {
                        file.driveId = drive.id;
                        allItems.set(file.id, file);
                        if (!driveFolders[drive.id]) {
                            driveFolders[drive.id] = [];
                        }
                        driveFolders[drive.id].push(file);
                    } else {
                        console.error('Invalid file data:', file);
                    }
                });
            }

            // Store the items separately for My Drive and each Shared Drive
            const items = Array.from(allItems.values());
            const itemsWithLinks = items.map(item => ({
                id: item.id,
                name: item.name,
                mimeType: item.mimeType,
                url: item.webViewLink || item.webContentLink,
                parents: item.parents || [],
                driveId: item.driveId || null
            }));

            console.log('Items with links:', itemsWithLinks);

            setStoredData({ items: itemsWithLinks, driveFolders: driveFolders, driveNames: driveNames });

            if (!fetchedFilesSent) {
                chrome.tabs.sendMessage(tabId, { action: 'filesFetched' });
                fetchedFilesSent = true;
            }

        } catch (error) {
            console.error('Error during fetch:', error);
        }
    });
}
