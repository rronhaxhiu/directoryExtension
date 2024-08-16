// sidebar.js

// Create and style the sidebar
const createSidebar = () => {
    const sidebar = document.createElement('div');
    sidebar.id = 'google-docs-sidebar';
    sidebar.style.position = 'fixed';
    sidebar.style.top = '0';
    sidebar.style.left = '0';
    sidebar.style.width = '300px';
    sidebar.style.height = '100%';
    sidebar.style.backgroundColor = '#fff';
    sidebar.style.overflowY = 'scroll';
    sidebar.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    sidebar.style.zIndex = '1000';
    sidebar.style.padding = '10px';
    sidebar.style.borderLeft = '1px solid #ccc';
    sidebar.style.backgroundColor = '#f4f4f4';

    // Add explorer header
    const explorerHeader = document.createElement('div');
    explorerHeader.id = 'explorerHeader';

    const title = document.createElement('p');
    title.id = 'explorerTitle';
    title.textContent = 'Explorer';
    explorerHeader.appendChild(title);

    sidebar.appendChild(explorerHeader);

    // Add 'Fetching files...' message
    const loadingMessage = document.createElement('p');
    loadingMessage.id = 'loadingMessage';
    loadingMessage.textContent = 'Fetching files...';
    sidebar.appendChild(loadingMessage);

    document.body.appendChild(sidebar);
};

// Add the file explorer to the sidebar
const loadFileExplorer = async () => {
    // Hide the loading message initially
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
        loadingMessage.style.display = 'none';
    }

    // Create the file explorer div
    const fileExplorer = document.createElement('div');
    fileExplorer.id = 'fileExplorer';

    // Create and add the header separately
    const header = document.createElement('div');
    header.id = 'explorerHeader';

    const title = document.createElement('p');
    title.id = 'explorerTitle';
    title.textContent = 'Explorer';

    header.appendChild(title);
    fileExplorer.appendChild(header);

    // Append fileExplorer to the sidebar
    document.getElementById('google-docs-sidebar').appendChild(fileExplorer);

    // Fetch and display files
    const items = await new Promise((resolve) => {
        chrome.storage.local.get('items', (result) => {
            resolve(result.items || []);
        });
    });

    const buildTree = (items) => {
        const itemMap = {};
        const tree = [];

        items.forEach(item => {
            itemMap[item.id] = item;
            item.children = [];
        });

        items.forEach(item => {
            if (item.parents.length > 0 && itemMap[item.parents[0]]) {
                itemMap[item.parents[0]].children.push(item);
            } else {
                tree.push(item);
            }
        });

        return tree;
    };

    const renderTree = (nodes, activeFileId) => {
        const ul = document.createElement('ul');

        nodes.forEach(node => {
            const li = document.createElement('li');
            li.dataset.id = node.id; // Add data-id for easy access

            if (node.mimeType === 'application/vnd.google-apps.folder') {
                const folderLink = document.createElement('a');
                folderLink.textContent = node.name;
                folderLink.href = '#';
                folderLink.classList.add('folder');
                folderLink.onclick = (e) => {
                    e.preventDefault();
                    const childUl = li.querySelector('ul');
                    if (childUl) {
                        childUl.style.display = childUl.style.display === 'none' ? 'block' : 'none';
                    }
                };

                li.appendChild(folderLink);

                // Create a nested UL for the folder's children and hide it initially
                const childTree = renderTree(node.children, activeFileId);
                if (childTree.childElementCount > 0) {
                    childTree.style.display = 'none';  // Hide child folders by default
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

    const tree = buildTree(items);
    const fileExplorerContent = renderTree(tree);

    fileExplorer.appendChild(fileExplorerContent);

    //highlight opened file
    const highlightActiveFile = () => {
        // Ensure only one item gets the active class
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
                        parent.style.display = 'block';
                        parent = parent.parentElement.parentElement;
                    }

                } else {
                    // Remove the active class from other items
                    li.querySelector('a')?.classList.remove('active');
                }
            });
            
        }
    };



    highlightActiveFile();
};

// Create and style the toggle button
const createToggleButton = () => {
    const button = document.createElement('button');
    button.id = 'explorerButton';
    button.textContent = '-';
    button.style.position = 'fixed';
    button.style.top = '5.25%';

    button.onclick = () => {
        const sidebar = document.getElementById('google-docs-sidebar');
        const isHidden = sidebar.classList.toggle('hidden');
        button.textContent = isHidden ? '+' : '-';
        button.style.left = isHidden ? '0px' : '310px';
        const borderRadiusValue = isHidden ? '0px' : '50%';

        button.style.setProperty('border-bottom-left-radius', borderRadiusValue, 'important');
        button.style.setProperty('border-top-left-radius', borderRadiusValue, 'important');
    };

    document.body.appendChild(button);
};

// Initial load of the sidebar
createSidebar();
createToggleButton();

// Listen for message from the background script
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'filesFetched') {
        loadFileExplorer();
    }
});
