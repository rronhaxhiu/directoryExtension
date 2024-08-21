const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

chrome.webNavigation.onCompleted.addListener((details) => {
    if (!details || !details.url) {
        console.error('Invalid details or URL is undefined');
        return;
    }

    const { tabId, url } = details;

    if (url && (url.startsWith('https://docs.google.com/') || url.startsWith('https://drive.google.com/'))) {
        chrome.storage.local.get(['items', 'driveFolders', 'driveNames', 'timestamp'], (result) => {
            const currentTime = Date.now();
            const isCacheValid = result.timestamp && (currentTime - result.timestamp < CACHE_EXPIRATION_TIME);

            if (isCacheValid && result.items && result.driveFolders && result.driveNames) {
                console.log('Using cached data');
                chrome.scripting.executeScript({
                    target: { tabId },
                    files: ['sidebar.js']
                }, () => {
                    if (chrome.runtime.lastError) {
                        console.error('Script injection failed: ', chrome.runtime.lastError.message);
                        return;
                    }

                    setTimeout(() => {
                        chrome.tabs.sendMessage(tabId, { action: 'filesFetched' }, (response) => {
                            if (chrome.runtime.lastError) {
                                console.log('Could not send message to content script:', chrome.runtime.lastError.message);
                            } else {
                                console.log('Message sent to content script:', response);
                            }
                        });
                    }, 500); // Ensure the content script is ready
                });
            } else {
                console.log('Cache is invalid or data not found. Fetching new data.');
                chrome.scripting.executeScript({
                    target: { tabId },
                    files: ['sidebar.js']
                }, () => {
                    if (chrome.runtime.lastError) {
                        console.error('Script injection failed: ', chrome.runtime.lastError.message);
                        return;
                    }

                    setTimeout(() => {
                        fetchFilesAndNotify(tabId);
                    }, 500);
                });
            }
        });
    }
}, { url: [{ hostSuffix: 'google.com' }] });

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
            setTimeout(() => {
                chrome.tabs.sendMessage(tabId, { action: 'filesFetched' }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error('Could not send message to content script:', chrome.runtime.lastError.message);
                    } else {
                        console.log('Message sent to content script:', response);
                    }
                });
            }, 500); // Ensure the content script is ready
        });
    });
}
