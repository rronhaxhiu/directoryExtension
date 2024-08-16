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
            });

            // Fetch files and notify the content script once they are fetched
            fetchFilesAndNotify(activeTabId);
            firstTimeRender = false;} else {
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

        console.log('Token received:', token);

        const allItems = new Map();  // Use Map to avoid duplicate entries

        const fetchFiles = async (pageToken = '', folderId = null) => {
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
                'mimeType=\'application/x-tar\'';
            let url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=nextPageToken,files(id,name,mimeType,webViewLink,webContentLink,parents)`;
            if (pageToken) {
                url += `&pageToken=${pageToken}`;
            }

            console.log('Fetching URL:', url);

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
                    console.log('Processing file:', file);
                    allItems.set(file.id, file);
                } else {
                    console.error('Invalid file data:', file);
                }
            });

            if (data.nextPageToken) {
                return fetchFiles(data.nextPageToken, folderId);
            }
        };

        const fetchFolderContents = async (folderId) => {
            await fetchFiles('', folderId);
            const folderItems = Array.from(allItems.values()).filter(item => item && item.parents && item.parents.includes(folderId));
            const subFolderPromises = folderItems.filter(item => item.mimeType === 'application/vnd.google-apps.folder').map(subFolder => {
                if (subFolder && subFolder.id) {
                    return fetchFolderContents(subFolder.id);
                }
                return Promise.resolve();
            });

            await Promise.all(subFolderPromises);
        };

        await fetchFiles();
        const rootFolders = Array.from(allItems.values()).filter(item => item.mimeType === 'application/vnd.google-apps.folder' && (!item.parents || item.parents.length === 0));

        if (rootFolders.length) {
            const rootFolderPromises = rootFolders.map(folder => fetchFolderContents(folder.id));
            await Promise.all(rootFolderPromises);
        }

        const items = Array.from(allItems.values());
        const constructDocUrl = (fileId) => `https://docs.google.com/document/d/${fileId}/view`;

        const itemsWithLinks = items.map(item => ({
            id: item.id,
            name: item.name,
            mimeType: item.mimeType,
            url: item.webViewLink || item.webContentLink || (item.mimeType === 'application/vnd.google-apps.document' ? constructDocUrl(item.id) : 'No Link Available'),
            parents: item.parents || []
        }));

        console.log('Items with links:', itemsWithLinks);

        chrome.storage.local.set({ items: itemsWithLinks }, () => {
            chrome.tabs.sendMessage(tabId, { action: 'filesFetched' });
        });
    });
}