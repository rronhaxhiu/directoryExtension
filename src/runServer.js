import { fetchFilesAndNotify } from './fetchData.js';
import { getStoredData } from './storage.js';

let sideBarInjected = false;
let fetchedFilesSent = false;

export function runServer() {
    chrome.webNavigation.onCompleted.addListener((details) => {
        if (!details || !details.url) {
            console.error('Invalid details or URL is undefined');
            return;
        }

        const { tabId, url } = details;

        if (url && (url.startsWith('https://docs.google.com/') || url.startsWith('https://drive.google.com/'))) {
            getStoredData(['items', 'driveFolders', 'driveNames'], (result) => {

                if (result.items && result.driveFolders && result.driveNames) {
                    console.log('Using cached data');
                    chrome.scripting.executeScript({
                        target: { tabId },
                        files: ['dist/sidebar.bundle.js']
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
                        files: ['dist/sidebar.bundle.js']
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
}


