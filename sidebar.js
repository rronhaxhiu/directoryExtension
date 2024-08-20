// sidebar.js

// Create the new mainPage div and move the current body content into it
const wrapBodyContent = () => {
    const body = document.body;

    // Create a new div to wrap the existing content
    const mainPage = document.createElement('div');
    mainPage.id = 'mainPage';

    // Move all existing children of the body into the mainPage div
    while (body.firstChild) {
        mainPage.appendChild(body.firstChild);
    }

    // Append the new mainPage div back to the body
    body.appendChild(mainPage);

    return mainPage;
};

// Create and style the sidebar
const createSidebar = () => {
    const sidebar = document.createElement('div');
    sidebar.id = 'google-docs-sidebar';

    // Add explorer header
    const explorerHeader = document.createElement('div');
    explorerHeader.id = 'explorerHeader';

    const title = document.createElement('p');
    title.id = 'explorerTitle';
    title.textContent = 'DirExt';

    explorerHeader.appendChild(title);
    sidebar.appendChild(explorerHeader);

    // Add search bar
    const searchBarDiv = document.createElement('div');
    searchBarDiv.id = 'searchBarDiv';

    const searchInput = document.createElement('input');
    searchInput.id = 'searchInput';
    searchInput.type = 'text';
    searchInput.placeholder = 'Search...';

    searchBarDiv.appendChild(searchInput);
    explorerHeader.appendChild(searchBarDiv);

    // Add 'Fetching files...' message
    const loadingDiv = document.createElement('div');
    const loadingMessage = document.createElement('p');
    const loader = document.createElement('div');

    loadingDiv.id = 'loadingDiv';
    loadingMessage.id = 'loadingMessage';
    loader.id = 'loader';
    loadingMessage.textContent = 'Fetching files';

    // Add file tree container
    const container = document.createElement('div');
    container.id = 'container';

    sidebar.appendChild(container);
    loadingDiv.appendChild(loader);
    loadingDiv.appendChild(loadingMessage);
    sidebar.appendChild(loadingDiv);

    // Add resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.id = 'resize-handle';
    sidebar.appendChild(resizeHandle);

    const fileExplorer = document.querySelector('#fileExplorer');

    // Add toggle button inside the sidebar
    const button = document.createElement('button');
    button.id = 'explorerButton';
    button.textContent = '+';
    button.style.transform = 'rotate(45deg)';

    //Specific for Google Docs
    const docsHeader = document.querySelector('.gb_Da.gb_Xa.gb_od') || '';
    docsHeader.id = 'docsHeader';

    const toggleSidebar = () => {
        const isHidden = sidebar.classList.toggle('hidden');

        sidebar.style.backgroundColor = isHidden ? '#1a73e8' : '#f8fafd';
        sidebar.style.borderTopRightRadius = isHidden ? '100px' : '0px';
        sidebar.style.height = isHidden ? '15px' : '100%';
        sidebar.style.width = isHidden ? '25px' : `330px`;
        sidebar.style.minWidth = isHidden ? '25px' : '130px';
        sidebar.style.overflowY = isHidden ? 'hidden' : 'scroll';
        sidebar.style.paddingLeft = isHidden ? '0px' : '10px';
        sidebar.style.top = isHidden ? 'auto' : '0px';
        sidebar.style.bottom = isHidden ? '0px' : '';

        mainPage.style.marginLeft = isHidden ? '0px' : `345px`;

        container.style.display = isHidden ? 'none' : 'block';

        loadingDiv.style.opacity = isHidden ? '0' : '1';

        title.style.display = isHidden ? 'none' : 'block';

        button.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(45deg)';
        button.style.color = isHidden ? '#f8fafd' : '#1a73e8';
        button.style.background = isHidden ? '#1a73e8' : '#f8fafd';

        explorerHeader.style.borderBottom = isHidden ? 'none' : '0.5px #bfbfbf solid';

        resizeHandle.style.display = isHidden ? 'none' : 'block';

        searchBarDiv.style.display = isHidden ? 'none' : 'block';

        if (docsHeader) {
            docsHeader.style.width = isHidden ? '100%' : `calc(100% - 340px)`
        }
    };

    button.onclick = toggleSidebar;

    explorerHeader.appendChild(button);

    const mainPage = wrapBodyContent();
    mainPage.style.marginLeft = '345px';

    // Insert sidebar as first element
    document.body.insertBefore(sidebar, document.body.firstChild);

    // Resizing functionality
    let isResizing = false;

    resizeHandle.addEventListener('mousedown', (e) => {
        if (sidebar.classList.contains('hidden')) {
            return; // Exit early if the sidebar is hidden
        }
        sidebar.style.transition = 'none';
        isResizing = true;
        document.body.style.cursor = 'ew-resize';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const newWidth = Math.max(130, e.clientX);
        if (newWidth < 135) {
            toggleSidebar;
        }
        sidebar.style.width = `${newWidth}px`;
        container.style.width = `${newWidth}px`;
        mainPage.style.marginLeft = `${newWidth + 15}px`;
        if (docsHeader) {
            docsHeader.style.width = `calc(100% - ${newWidth + 15}px)`;
        }
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
        document.body.style.cursor = 'default';
        sidebar.style.transition = 'all 0.1s ease-out';
    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const items = document.querySelectorAll('#fileExplorer li');

        items.forEach(item => {
            const link = item.querySelector('a');
            const text = item.textContent.toLowerCase();
            const isMatch = text.includes(query);
            const isFolder = item.querySelector('folder');

            if (isMatch) {
                item.style.display = '';

                const highlightedText = link.textContent.replace(new RegExp(query, 'gi'), (match) => {
                    return `<span class="highlight">${match}</span>`;
                });
                link.innerHTML = highlightedText;

                if (isFolder) {
                    // If the matching item is a folder, expand it
                    const childUl = item.querySelector('ul');
                    if (childUl) {
                        childUl.classList.add('expanded');
                        childUl.style.display = '';
                    }
                }

                // Ensure all parent folders are expanded
                let parent = item.parentElement;
                while (parent && parent.tagName === 'UL') {
                    parent.classList.add('expanded');
                    parent.style.display = '';
                    parent = parent.parentElement.closest('li');
                }
            } else {
                item.style.display = 'none';

                // Collapse non-matching folders
                if (isFolder) {
                    const childUl = item.querySelector('ul');
                    if (childUl) {
                        childUl.classList.remove('expanded');
                        childUl.style.display = 'none';
                    }
                }
            }
        });
    });


};

// Load the file explorer into the sidebar
const loadFileExplorer = async () => {
    const loadingDiv = document.getElementById('loadingDiv');
    if (loadingDiv) {
        loadingDiv.style.display = 'none';
    }

    const fileExplorer = document.createElement('div');
    fileExplorer.id = 'fileExplorer';
    document.getElementById('container').appendChild(fileExplorer);

    const items = await new Promise((resolve) => {
        chrome.storage.local.get(['items', 'driveNames'], (result) => {
            resolve(result.items || []);
            this.driveNames = result.driveNames || {}; // Access the stored drive names
        });
    });

    const buildTree = (items) => {
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
                tree: createFolderTree(sharedDriveMap[driveId])
            }))
        };
    };

    const renderTree = (nodes) => {
        const ul = document.createElement('ul');

        nodes.forEach(node => {
            const li = document.createElement('li');
            li.dataset.id = node.id;

            if (node.mimeType === 'application/vnd.google-apps.folder') {
                const folderLink = document.createElement('a');
                folderLink.textContent = node.name;
                folderLink.href = '#';
                folderLink.classList.add('folder');
                folderLink.onclick = (e) => {
                    e.preventDefault();
                    const childUl = li.querySelector('ul');
                    if (childUl) {
                        childUl.classList.toggle('expanded');
                    }
                };

                li.appendChild(folderLink);

                const childTree = renderTree(node.children);
                if (childTree.childElementCount > 0) {
                    childTree.classList.add('collapsible');
                    li.appendChild(childTree);
                }
            } else {
                const fileLink = document.createElement('a');
                fileLink.textContent = node.name;
                fileLink.href = node.url;
                fileLink.classList.add('file');
                li.appendChild(fileLink);
            }

            ul.appendChild(li);
        });

        return ul;
    };

    const { myDriveTree, sharedDriveTrees } = buildTree(items);

    const topLevelFolders = document.createElement('div');
    topLevelFolders.id = 'topLevelFolders';

    const createCollapsibleFolder = (folderName, treeNodes) => {
        const li = document.createElement('li');
        const folderLink = document.createElement('a');
        folderLink.textContent = folderName;
        folderLink.href = '#';
        folderLink.classList.add('folder');
        folderLink.onclick = (e) => {
            e.preventDefault();
            const childUl = li.querySelector('ul');
            if (childUl) {
                childUl.classList.toggle('expanded');
            }
        };

        li.appendChild(folderLink);
        const treeUl = renderTree(treeNodes);
        treeUl.classList.add('collapsible');
        li.appendChild(treeUl);

        return li;
    };

    const myDriveLi = createCollapsibleFolder('My Drive', myDriveTree);
    const sharedDriveLi = createCollapsibleFolder('Shared Drives', sharedDriveTrees.map(drive => {
        return {
            name: this.driveNames[drive.driveId] || drive.driveId,
            mimeType: 'application/vnd.google-apps.folder',
            children: drive.tree
        };
    }));

    topLevelFolders.appendChild(myDriveLi);
    topLevelFolders.appendChild(sharedDriveLi);
    fileExplorer.appendChild(topLevelFolders);

    // Highlight opened file
    const highlightActiveFile = () => {
        document.querySelectorAll('#fileExplorer li a.active').forEach(link => {
            link.classList.remove('active');
        });

        const currentUrl = window.location.href;
        const activeFileId = items.find(item => currentUrl.includes(item.id))?.id;

        if (activeFileId) {
            const allLiItems = document.querySelectorAll('#fileExplorer li');
            const openParentFolders = new Set();

            allLiItems.forEach(li => {
                if (li.dataset.id === activeFileId) {
                    li.querySelector('a')?.classList.add('active');
                    let parent = li.parentElement;

                    while ((parent && parent.tagName) === 'UL') {
                        parent.classList.add('expanded');
                        parent = parent.parentElement.parentElement;
                    }
                } else {
                    li.querySelector('a')?.classList.remove('active');
                }
            });
        }
    };

    highlightActiveFile();
};

// Inject sidebar and toggle button into the DOM when the extension is activated
createSidebar();

// Listen for messages from background.js to load the file explorer
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'filesFetched') {
        loadFileExplorer();
    }
});
