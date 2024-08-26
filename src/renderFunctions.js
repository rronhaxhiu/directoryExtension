import { getIcon, menuIcon } from "./svgIcon";
import { createElement, wrapBodyContent } from './utils';
import { resizeFunctionality } from './resizeFunctionality.js';
import { searchFunctionality } from './searchFunctionality.js';

// Highlight opened file and expand parent folders
export const highlightActiveFile = (items) => {
    // Remove 'active' class from all active items
    document.querySelectorAll('#fileExplorer li.active').forEach(link => {
        link.classList.remove('active');
    });

    const currentUrl = window.location.href;
    const activeFileId = items.find(item => currentUrl.includes(item.id))?.id;

    if (activeFileId) {
        // Select all <li> elements that could match the active file ID
        const allLiItems = document.querySelectorAll('#fileExplorer li');

        allLiItems.forEach(li => {
            if (li.dataset.id === activeFileId) {
                // Highlight the matching file item
                li.querySelector('.item')?.classList.add('active');

                // Expand parent folders to show active item
                let parent = li.parentElement;
                while (parent && parent.tagName === 'UL') {
                    parent.classList.add('expanded');
                    parent = parent.parentElement.closest('ul');  // Move to the next parent <ul>
                }
            } else {
                // Remove 'active' class from non-matching file links
                li.querySelector('.item')?.classList.remove('active');
            }
        });
    }
};

// Dynamically render data
const renderTree = (nodes) => {
    const ul = createElement('ul');
    nodes.forEach(node => {
        ul.appendChild(renderNode(node));
    });
    return ul;
};

// Full folder structure and funtionality
export const createCollapsibleFolder = (folderName, treeNodes) => {
    const li = createElement('li');
    const { folderDiv, expander, icon, folderLink } = createFolderElements(folderName);

    setFolderIcon(icon, folderName, false);

    folderDiv.onclick = (e) => {
        e.preventDefault();
        const childUl = li.querySelector('ul');
        if (childUl) {
            toggleFolder(expander, folderDiv, icon, folderName, childUl);
        }
    };

    li.appendChild(folderDiv);
    const treeUl = renderTree(treeNodes);
    treeUl.classList.add('collapsible');
    li.appendChild(treeUl);

    return li;
};

// Structure data
export const buildTree = (items, driveNames) => {
    const itemMap = {};
    const myDriveItems = [];
    const sharedDriveMap = {};

    items.forEach(item => {
        itemMap[item.id] = item;
        item.children = [];

        if (item.driveId) {
            if (!sharedDriveMap[item.driveId]) {
                sharedDriveMap[item.driveId] = [];
            }
            sharedDriveMap[item.driveId].push(item);
        } else {
            myDriveItems.push(item);
        }
    });

    const createFolderTree = (items) => {
        const tree = [];
        items.forEach(item => {
            if (item.parents.length > 0 && itemMap[item.parents[0]]) {
                itemMap[item.parents[0]].children.push(item);
            } else {
                tree.push(item);
            }
        });
        return tree;
    };

    return {
        myDriveTree: createFolderTree(myDriveItems),
        sharedDriveTrees: Object.keys(sharedDriveMap).map(driveId => ({
            driveId: driveId,
            driveName: driveNames[driveId],
            tree: createFolderTree(sharedDriveMap[driveId])
        }))
    };
};

// Function to create a folder node
const createFolderNode = (node) => {
    const folderDiv = createElement('div', { class: 'item folder' });
    const expander = createElement('div', { class: 'expander' }, [], folderDiv);
    const icon = createElement('div', { class: 'icon' }, [], folderDiv);
    const folderLink = createElement('a', {}, [node.name], folderDiv);

    icon.innerHTML = getIcon('folder');
    expander.innerHTML = getIcon('expanderOff');

    folderDiv.onclick = (e) => {
        e.preventDefault();
        const childUl = folderDiv.nextElementSibling;
        if (childUl) {
            childUl.classList.toggle('expanded');
            expander.innerHTML = childUl.classList.contains('expanded')
                ? getIcon('expanderOn')
                : getIcon('expanderOff');
        }
    };

    return folderDiv;
};

// Function to create a file node with a specific icon
const createFileNode = (node, iconType) => {
    const fileDiv = createElement('div', { class: 'item file' });
    const expander = createElement('img', { class: 'expander' }, [], fileDiv);
    const icon = createElement('div', { class: 'icon' }, [], fileDiv);
    const fileLink = createElement('a', { href: node.url }, [node.name], fileDiv);

    icon.innerHTML = getIcon(iconType);
    return fileDiv;
};

// Render files dynamically
const renderNode = (node) => {
    switch (node.mimeType) {
        case 'application/vnd.google-apps.folder':
            const folderLi = createElement('li', { 'data-id': node.id });
            folderLi.appendChild(createFolderNode(node));
            const childTree = renderTree(node.children);
            if (childTree.childElementCount > 0) {
                childTree.classList.add('collapsible');
                folderLi.appendChild(childTree);
            }
            return folderLi;
        case 'application/vnd.google-apps.spreadsheet':
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return createElement('li', { 'data-id': node.id }, [createFileNode(node, 'sheets')]);
        case 'application/vnd.google-apps.presentation':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        case 'application/vnd.ms-powerpoint':
            return createElement('li', { 'data-id': node.id }, [createFileNode(node, 'presentation')]);
        case 'application/vnd.google-apps.form':
            return createElement('li', { 'data-id': node.id }, [createFileNode(node, 'form')]);
        case 'application/pdf':
            return createElement('li', { 'data-id': node.id }, [createFileNode(node, 'pdf')]);
        case 'video/mp4':
        case 'video/x-msvideo':
        case 'video/x-matroska':
        case 'video/quicktime':
        case 'video/x-flv':
            return createElement('li', { 'data-id': node.id }, [createFileNode(node, 'video')]);
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
            return createElement('li', { 'data-id': node.id }, [createFileNode(node, 'image')]);
        default:
            return createElement('li', { 'data-id': node.id }, [createFileNode(node, 'document')]);
    }
};

// Create HTML element for folder
const createFolderElements = (folderName) => {
    const folderDiv = createElement('div', { class: 'item folder' });
    const expander = createElement('div', { class: 'expander', innerHTML: getIcon('expanderOff') }, [], folderDiv);
    const icon = createElement('div', { class: 'icon' }, [], folderDiv);
    const folderLink = createElement('a', { href: '#' }, [folderName], folderDiv);

    return { folderDiv, expander, icon, folderLink };
};


// Set folder icon dynamically
const setFolderIcon = (icon, folderName, expanded) => {
    if (expanded) {
        icon.innerHTML = folderName === 'My Drive' ? getIcon('myDriveBlack') : getIcon('sharedDriveBlack');
    } else {
        icon.innerHTML = folderName === 'My Drive' ? getIcon('myDriveWhite') : getIcon('sharedDriveWhite');
    }
};

// Folder collapsing functionality
const toggleFolder = (expander, folderDiv, icon, folderName, childUl) => {
    const expanded = childUl.classList.toggle('expanded');
    expander.innerHTML = expanded ? getIcon('expanderOn') : getIcon('expanderOff');
    folderDiv.style.backgroundColor = expanded ? 'var(--active-background-color)' : 'var(--sidebar-background-color)';
    setFolderIcon(icon, folderName, expanded);
};

// Create and style the sidebar
export const createSidebar = () => {
    const sidebar = createElement('div', { id: 'google-docs-sidebar' });

    // Add explorer header
    const explorerHeader = createElement('div', { id: 'explorerHeader' }, [], sidebar);
    const title = createElement('p', { id: 'explorerTitle' }, ['DirExt'], explorerHeader);
    const searchBarDiv = createElement('div', { id: 'searchBarDiv' }, [], explorerHeader);
    const searchInput = createElement('input', { id: 'searchInput', type: 'text', placeholder: 'Search...' }, [], searchBarDiv);
    const button = createElement('div', { id: 'explorerButton' }, [], explorerHeader);

    // Add 'Fetching files...' message
    const loadingDiv = createElement('div', { id: 'loadingDiv' }, [], sidebar);
    const loader = createElement('div', { id: 'loader' }, [], loadingDiv);

    // Add SVGs for loader and button icon
    loader.innerHTML = getIcon('loaderSVG');
    button.innerHTML = menuIcon(`#1a73e8`);

    // Add file tree container
    const container = createElement('div', { id: 'container' }, [], sidebar);

    // Add resize handle
    const resizeHandle = createElement('div', { id: 'resize-handle' }, [], sidebar);

    // Specific for Google Docs
    const docsHeader = document.querySelector('.gb_Da.gb_Xa.gb_od') || createElement('div', { id: 'docsHeader' });

    const mainPage = wrapBodyContent();
    mainPage.style.marginLeft = '345px';

    const toggleSidebar = () => {
        const isHidden = sidebar.classList.toggle('hidden');

        sidebar.style.visibility = isHidden ? 'hidden' : 'visible';
        mainPage.style.marginLeft = isHidden ? '0px' : '345px';
        container.style.display = isHidden ? 'none' : 'block';
        loadingDiv.style.opacity = isHidden ? '0' : '1';
        title.style.display = isHidden ? 'none' : 'block';
        button.style.background = isHidden ? '#1a73e8' : '#f8fafd';
        button.innerHTML = isHidden ? menuIcon(`#f8fafd`) : menuIcon(`#1a73e8`);
        button.style.position = isHidden ? 'fixed' : 'relative';
        button.style.bottom = isHidden ? '10px' : '';
        button.style.left = isHidden ? '10px' : '';

        if (docsHeader) docsHeader.style.width = isHidden ? '100%' : 'calc(100% - 340px)';
    };

    button.onclick = toggleSidebar;

    // Toggle sidebar when opening files
    const currentUrl = window.location.href;
    if (!currentUrl.startsWith('https://docs.google.com/document/u/') &&
        !currentUrl.startsWith('https://drive.google.com/drive/')) {
        button.click();
    }

    // Insert sidebar as first element
    document.body.insertBefore(sidebar, document.body.firstChild);

    // Resizing functionality
    resizeFunctionality(resizeHandle, sidebar, container, mainPage, docsHeader, toggleSidebar); // Assuming resizeFunctionality is defined elsewhere

    // Search functionality
    searchFunctionality(searchInput); // Assuming searchFunctionality is defined elsewhere
};
