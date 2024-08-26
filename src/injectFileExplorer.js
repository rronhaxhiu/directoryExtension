import { getStoredData } from "./storage";
import { buildTree, createCollapsibleFolder, highlightActiveFile } from "./renderFunctions";
import { createElement } from "./utils";

export const injectFileExplorer = async () => {
    // Remove loader after files are fetched
    const loadingDiv = document.getElementById('loadingDiv');
    if (loadingDiv) {
        loadingDiv.style.display = 'none';
    }

    const fileExplorer = createElement('div', { id: 'fileExplorer' });
    document.getElementById('container').appendChild(fileExplorer);

    let driveNames;  // Declare a local variable

    const items = await new Promise((resolve) => {
        getStoredData(['items', 'driveNames'], (result) => {
            resolve(result.items || []);
            driveNames = result.driveNames || {}; // Assign to the local variable
        });
    });

    const { myDriveTree, sharedDriveTrees } = buildTree(items, driveNames);

    const topLevelFolders = createElement('div', { id: 'topLevelFolders' }, [], fileExplorer);

    const SharedDrives = sharedDriveTrees.map(drive => {
        return {
            name: drive.driveName,
            mimeType: 'application/vnd.google-apps.folder',
            children: drive.tree
        };
    });
    const myDriveLi = createCollapsibleFolder('My Drive', myDriveTree);
    const sharedDriveLi = createCollapsibleFolder('Shared Drives', SharedDrives);
    topLevelFolders.appendChild(myDriveLi);
    topLevelFolders.appendChild(sharedDriveLi);

    // Highlight opened file and expand parent folders
    highlightActiveFile(items);
};