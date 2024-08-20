chrome.runtime.onInstalled.addListener(() => {
    console.log('Google Docs Explorer installed');
});


chrome.action.onClicked.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTabId = tabs[0].id;
        const activeTabUrl = tabs[0].url;

        // Check if the URL is docs.google.com
        if (activeTabUrl.startsWith('https://docs.google.com/') || activeTabUrl.startsWith('https://drive.google.com/')) {
            chrome.scripting.executeScript({
                target: { tabId: activeTabId },
                files: ['sidebar.js']
            }, () => {
                // Check for any errors in script injection
                if (chrome.runtime.lastError) {
                    console.error('Script injection failed: ', chrome.runtime.lastError.message);
                    return;
                }

                // Add a delay to ensure the content script is loaded
                setTimeout(() => {
                    fetchFilesAndNotify(activeTabId);
                }, 500); // Adjust delay as necessary
            });
        } else {
            console.error('Script can only be injected in Google Drive or Google Docs');
        }
    });
});

function fetchFilesAndNotify(tabId) {
    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
        if (chrome.runtime.lastError) {
            console.error('Error getting auth token:', chrome.runtime.lastError.message);
            return;
        }

        console.log('Token received');

        const allItems = new Map();  // Use Map to avoid duplicate entries
        const driveFolders = {};     // Store files separately for each drive
        const driveNames = {};       // Store drive names by driveId

        const fetchFiles = async (pageToken = '', folderId = null, driveId = null) => {
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

            console.log('Drive API request on:', url);

            const response = await fetch(url, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched data:', data);

            data.files.forEach(file => {
                if (file && file.id) {
                    file.driveId = driveId || null;
                    allItems.set(file.id, file);
                    if (!driveFolders[driveId]) {
                        driveFolders[driveId] = [];
                    }
                    driveFolders[driveId].push(file);
                } else {
                    console.error('Invalid file data:', file);
                }
            });

            if (data.nextPageToken) {
                return await fetchFiles(data.nextPageToken, folderId, driveId);
            }
        };

        // Fetch My Drive
        await fetchFiles();

        // Fetch Shared Drives
        const sharedDrivesResponse = await fetch('https://www.googleapis.com/drive/v3/drives', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (sharedDrivesResponse.ok) {
            const sharedDrivesData = await sharedDrivesResponse.json();
            const sharedDrives = sharedDrivesData.drives || [];

            for (const drive of sharedDrives) {
                console.log('Fetching Shared Drive:', drive.name);
                driveNames[drive.id] = drive.name;  // Store the drive name
                await fetchFiles('', null, drive.id);
            }
        } else {
            console.error('Failed to fetch Shared Drives:', sharedDrivesResponse.statusText);
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

        chrome.storage.local.set({ items: itemsWithLinks, driveFolders: driveFolders, driveNames: driveNames }, () => {
            chrome.tabs.sendMessage(tabId, { action: 'filesFetched' }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Could not send message to content script:', chrome.runtime.lastError.message);
                } else {
                    console.log('Message sent to content script:', response);
                }
            });

        });
    });
}
