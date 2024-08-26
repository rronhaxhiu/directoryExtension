// sidebar.js
import { injectFileExplorer } from './injectFileExplorer.js';
import { createSidebar } from './renderFunctions.js';


// Inject sidebar and toggle button into the DOM when the extension is activated
let existingSideBar = document.querySelector('#google-docs-sidebar');
if (!existingSideBar) {
    createSidebar();
    console.log(`Sidebar created`);
};

// Listen for messages from background.js to load the file explorer
let existingFileExplorer = document.getElementById('fileExplorer');
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.action === 'filesFetched') {
        if (!window.filesLoaded && !existingFileExplorer) { // Check if files are already loaded
            window.filesLoaded = true; // Set flag to prevent repeated loading
            injectFileExplorer();
            console.log(`Files loaded`);
        }
    }
});
