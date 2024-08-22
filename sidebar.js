// sidebar.js

// Create the new mainPage div and move the current body content into it
const wrapBodyContent = () => {
    const body = document.body;

    if (document.getElementById('mainPage')) {
        return document.getElementById('mainPage'); // Return existing mainPage if it already exists
    }

    // Create a new div to wrap the existing content
    const mainPage = document.createElement('div');
    mainPage.id = 'mainPage';

    // Move all existing children of the body into the mainPage div
    while (body.firstChild) {
        mainPage.appendChild(body.firstChild);
    }

    mainPage.style.height = '100%';

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
    const loader = document.createElement('div');

    // Create loader animation
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'circular');
    svg.setAttribute('viewBox', '25 25 50 50');

    // Create circle element
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('class', 'path');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '20');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke-width', '3');
    circle.setAttribute('stroke-miterlimit', '10');

    // Append circle to SVG
    svg.appendChild(circle);
    loader.appendChild(svg);

    loadingDiv.id = 'loadingDiv';
    loader.id = 'loader';

    // Add file tree container
    const container = document.createElement('div');
    container.id = 'container';

    sidebar.appendChild(container);
    loadingDiv.appendChild(loader);
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

    let existingFileExplorer = document.getElementById('fileExplorer');

    if (existingFileExplorer) {
        console.log('fileExplorer already exists, skipping creation.');
        return;
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


    const folderIcon = '<svg fill="#5f6368" height="20px" width="20px" focusable="false" viewBox="0 0 24 24" fill="currentColor" class="a-s-fa-Ha-pa"><g><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path><path d="M0 0h24v24H0z" fill="none"></path></g></svg>';
    const sheetsIcon = '<svg fill="#34a853" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="c7bJtd" style="width: 16px; height: 16px;"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.222 0H1.778C.8 0 .008.8.008 1.778L0 4.444v9.778C0 15.2.8 16 1.778 16h12.444C15.2 16 16 15.2 16 14.222V1.778C16 .8 15.2 0 14.222 0zm0 7.111h-7.11v7.111H5.332v-7.11H1.778V5.332h3.555V1.778h1.778v3.555h7.111v1.778z"></path></svg>';
    const formIcon = '<svg fill="#673ab7" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="G98Kb" style="width: 16px; height: 16px;"><path d="M14.222 0H1.778C.8 0 0 .8 0 1.778v12.444C0 15.2.8 16 1.778 16h12.444C15.2 16 16 15.2 16 14.222V1.778C16 .8 15.2 0 14.222 0zM5.333 12.444H3.556v-1.777h1.777v1.777zm0-3.555H3.556V7.11h1.777V8.89zm0-3.556H3.556V3.556h1.777v1.777zm7.111 7.111H6.222v-1.777h6.222v1.777zm0-3.555H6.222V7.11h6.222V8.89zm0-3.556H6.222V3.556h6.222v1.777z"></path></svg>';
    const pdfIcon = '<svg fill="#ea4335" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="k2eJge" style="width: 16px; height: 16px;"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.778 0h12.444C15.2 0 16 .8 16 1.778v12.444C16 15.2 15.2 16 14.222 16H1.778C.8 16 0 15.2 0 14.222V1.778C0 .8.8 0 1.778 0zm2.666 7.556h-.888v-.89h.888v.89zm1.334 0c0 .737-.596 1.333-1.334 1.333h-.888v1.778H2.222V5.333h2.222c.738 0 1.334.596 1.334 1.334v.889zm6.666-.89h2.223V5.334H11.11v5.334h1.333V8.889h1.334V7.556h-1.334v-.89zm-2.222 2.667c0 .738-.595 1.334-1.333 1.334H6.667V5.333h2.222c.738 0 1.333.596 1.333 1.334v2.666zm-1.333 0H8V6.667h.889v2.666z"></path></svg>';
    const documentIcon = '<svg fill="#4285f4" class="auHQVc" style="width:16px;height:16px;" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.222 0H1.778C.8 0 0 .8 0 1.778v12.444C0 15.2.8 16 1.778 16h12.444C15.2 16 16 15.2 16 14.222V1.778C16 .8 15.2 0 14.222 0zm-1.769 5.333H3.556V3.556h8.897v1.777zm0 3.556H3.556V7.11h8.897V8.89zm-2.666 3.555H3.556v-1.777h6.23v1.777z"></path></svg>';
    const presentationIcon = '<svg fill="#fbbc04" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="jqOzib" style="width: 16px; height: 16px;"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.213 0H1.77C.79 0 0 .8 0 1.778v12.444C0 15.2.791 16 1.769 16h12.444c.978 0 1.778-.8 1.778-1.778V1.778C15.991.8 15.191 0 14.213 0zm0 11.556H1.77V4.444h12.444v7.112z"></path></svg>';
    const myDriveBlackIcon = '<svg fill="#3c4043" class=" c-qd" width="24px" height="24px" viewBox="0 0 24 24" fill="#000000" focusable="false"><path d="M9.05 15H15q.275 0 .5-.137.225-.138.35-.363l1.1-1.9q.125-.225.1-.5-.025-.275-.15-.5l-2.95-5.1q-.125-.225-.35-.363Q13.375 6 13.1 6h-2.2q-.275 0-.5.137-.225.138-.35.363L7.1 11.6q-.125.225-.125.5t.125.5l1.05 1.9q.125.25.375.375T9.05 15Zm1.2-3L12 9l1.75 3ZM3 17V4q0-.825.587-1.413Q4.175 2 5 2h14q.825 0 1.413.587Q21 3.175 21 4v13Zm2 5q-.825 0-1.413-.587Q3 20.825 3 20v-1h18v1q0 .825-.587 1.413Q19.825 22 19 22Z"></path></svg>';
    const myDriveWhiteIcon = '<svg fill="#3c4043" class="a-s-fa-Ha-pa c-qd" width="24px" height="24px" viewBox="0 0 24 24" fill="#000000" focusable="false"><path d="M19 2H5C3.9 2 3 2.9 3 4V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V4C21 2.9 20.1 2 19 2ZM19 20H5V19H19V20ZM19 17H5V4H19V17Z"></path><path d="M13.1215 6H10.8785C10.5514 6 10.271 6.18692 10.0841 6.46729L7.14019 11.6075C7 11.8878 7 12.215 7.14019 12.4953L8.26168 14.4579C8.40187 14.7383 8.72897 14.9252 9.05608 14.9252H15.0374C15.3645 14.9252 15.6449 14.7383 15.8318 14.4579L16.9533 12.4953C17.0935 12.215 17.0935 11.8878 16.9533 11.6075L13.9159 6.46729C13.7757 6.18692 13.4486 6 13.1215 6ZM10.1776 12.0748L12.0467 8.8972L13.8692 12.0748H10.1776Z"></path></svg>';
    const sharedDriveBlackIcon = '<svg fill="#3c4043" width="24px" height="24px" viewBox="0 0 24 24" fill="#000000" focusable="false" class=" c-qd"><g><rect fill="none" height="24" width="24"></rect></g><g><g><path d="M19,2H5C3.9,2,3,2.9,3,4v13h18V4C21,2.9,20.1,2,19,2z M9.5,7C10.33,7,11,7.67,11,8.5c0,0.83-0.67,1.5-1.5,1.5 S8,9.33,8,8.5C8,7.67,8.67,7,9.5,7z M13,14H6v-1.35C6,11.55,8.34,11,9.5,11s3.5,0.55,3.5,1.65V14z M14.5,7C15.33,7,16,7.67,16,8.5 c0,0.83-0.67,1.5-1.5,1.5S13,9.33,13,8.5C13,7.67,13.67,7,14.5,7z M18,14h-4v-1.35c0-0.62-0.3-1.12-0.75-1.5 c0.46-0.1,0.9-0.15,1.25-0.15c1.16,0,3.5,0.55,3.5,1.65V14z"></path><path d="M3,20c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2v-2H3V20z M18,19c0.55,0,1,0.45,1,1s-0.45,1-1,1s-1-0.45-1-1S17.45,19,18,19z"></path></g></g></svg>';
    const sharedDriveWhiteIcon = '<svg fill="#3c4043" width="24px" height="24px" viewBox="0 0 24 24" fill="#000000" focusable="false" class=" a-s-fa-Ha-pa c-qd"><path d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 2v13H5V4h14zM5 20v-1h14v1H5zm6-11.5c0 .83-.67 1.5-1.5 1.5S8 9.33 8 8.5 8.67 7 9.5 7s1.5.67 1.5 1.5zm5 0c0 .83-.67 1.5-1.5 1.5S13 9.33 13 8.5 13.67 7 14.5 7s1.5.67 1.5 1.5zM9.5 11c-1.16 0-3.5.55-3.5 1.65V14h7v-1.35c0-1.1-2.34-1.65-3.5-1.65zm8.5 1.65V14h-4v-1.35c0-.62-.3-1.12-.75-1.5.46-.1.9-.15 1.25-.15 1.16 0 3.5.55 3.5 1.65z"></path></svg>';
    const expanderOn = '<svg fill="#3c4043" class="a-s-fa-Ha-pa c-qd" width="12px" height="12px" viewBox="0 0 20 20" focusable="false" fill="currentColor"><polygon points="5,8 10,13 15,8"></polygon></svg>';
    const expanderOff = '<svg fill="#3c4043" class="c-qd a-s-fa-Ha-pa" width="12px" height="12px" viewBox="0 0 20 20" focusable="false" fill="currentColor"><polygon points="8,5 13,10 8,15"></polygon></svg>'

    const renderTree = (nodes) => {
        const ul = document.createElement('ul');
        nodes.forEach(node => {
            const li = document.createElement('li');
            li.dataset.id = node.id;

            if (node.mimeType === 'application/vnd.google-apps.folder') {
                const folderDiv = document.createElement('div');
                const expander = document.createElement('div');
                const icon = document.createElement('div');
                const folderLink = document.createElement('a');

                icon.classList.add('icon');
                folderDiv.classList.add('item');
                expander.classList.add('expander');
                expander.src = chrome.runtime.getURL('/images/expander.png');
                icon.innerHTML = folderIcon;
                expander.innerHTML = expanderOff;

                folderDiv.appendChild(expander);
                folderDiv.appendChild(icon);
                folderDiv.appendChild(folderLink);

                folderLink.textContent = node.name;
                folderLink.href = '#';
                folderDiv.classList.add('folder');
                folderDiv.onclick = (e) => {
                    e.preventDefault();
                    const childUl = li.querySelector('ul');
                    if (childUl) {
                        childUl.classList.toggle('expanded');
                        if (childUl.classList.contains('expanded')) {
                            expander.innerHTML = expanderOn;
                        } else {
                            expander.innerHTML = expanderOff;
                        }
                    }
                };

                li.appendChild(folderDiv);

                const childTree = renderTree(node.children);
                if (childTree.childElementCount > 0) {
                    childTree.classList.add('collapsible');
                    li.appendChild(childTree);
                }
            } else if (node.mimeType === 'application/vnd.google-apps.spreadsheet' ||
                node.mimeType === 'application/vnd.ms-excel' ||
                node.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                node.mimeType === 'text/csv'
            ) {
                const fileDiv = document.createElement('div');
                const expander = document.createElement('img');
                const icon = document.createElement('div');
                const fileLink = document.createElement('a');

                fileDiv.classList.add('item');
                expander.classList.add('expander');
                icon.classList.add('icon');
                icon.innerHTML = sheetsIcon;

                fileDiv.appendChild(expander);
                fileDiv.appendChild(icon);
                fileDiv.appendChild(fileLink);

                fileLink.textContent = node.name;
                fileLink.href = node.url;
                fileDiv.classList.add('file');
                li.appendChild(fileDiv);
            }
            else if (node.mimeType === 'application/vnd.google-apps.presentation' ||
                node.mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            ) {
                const fileDiv = document.createElement('div');
                const expander = document.createElement('img');
                const icon = document.createElement('div');
                const fileLink = document.createElement('a');

                fileDiv.classList.add('item');
                expander.classList.add('expander');
                icon.classList.add('icon');
                icon.innerHTML = presentationIcon;

                fileDiv.appendChild(expander);
                fileDiv.appendChild(icon);
                fileDiv.appendChild(fileLink);

                fileLink.textContent = node.name;
                fileLink.href = node.url;
                fileDiv.classList.add('file');
                li.appendChild(fileDiv);
            } else if (node.mimeType === 'application/vnd.google-apps.form') {
                const fileDiv = document.createElement('div');
                const expander = document.createElement('img');
                const icon = document.createElement('div');
                const fileLink = document.createElement('a');

                fileDiv.classList.add('item');
                expander.classList.add('expander');
                icon.classList.add('icon');
                icon.innerHTML = formIcon;

                fileDiv.appendChild(expander);
                fileDiv.appendChild(icon);
                fileDiv.appendChild(fileLink);

                fileLink.textContent = node.name;
                fileLink.href = node.url;
                fileDiv.classList.add('file');
                li.appendChild(fileDiv);
            } else if (node.mimeType === 'application/pdf') {
                const fileDiv = document.createElement('div');
                const expander = document.createElement('img');
                const icon = document.createElement('div');
                const fileLink = document.createElement('a');

                fileDiv.classList.add('item');
                expander.classList.add('expander');
                icon.classList.add('icon');
                icon.innerHTML = pdfIcon;

                fileDiv.appendChild(expander);
                fileDiv.appendChild(icon);
                fileDiv.appendChild(fileLink);

                fileLink.textContent = node.name;
                fileLink.href = node.url;
                fileDiv.classList.add('file');
                li.appendChild(fileDiv);
            } else {
                const fileDiv = document.createElement('div');
                const expander = document.createElement('img');
                const icon = document.createElement('div');
                const fileLink = document.createElement('a');

                fileDiv.classList.add('item');
                expander.classList.add('expander');
                icon.classList.add('icon');
                icon.innerHTML = documentIcon;

                fileDiv.appendChild(expander);
                fileDiv.appendChild(icon);
                fileDiv.appendChild(fileLink);

                fileLink.textContent = node.name;
                fileLink.href = node.url;
                fileDiv.classList.add('file');
                li.appendChild(fileDiv);
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
        const folderDiv = document.createElement('div');
        const expander = document.createElement('div');
        const icon = document.createElement('div');
        const folderLink = document.createElement('a');

        icon.classList.add('icon');
        folderDiv.classList.add('item');
        expander.classList.add('expander');
        expander.innerHTML = expanderOff;

        icon.innerHTML = folderName === 'My Drive' ? myDriveWhiteIcon : sharedDriveWhiteIcon;

        folderDiv.appendChild(expander);
        folderDiv.appendChild(icon);
        folderDiv.appendChild(folderLink);

        folderLink.textContent = folderName;
        folderLink.href = '#';
        folderDiv.classList.add('folder');
        folderDiv.onclick = (e) => {
            e.preventDefault();
            const childUl = li.querySelector('ul');
            if (childUl) {
                childUl.classList.toggle('expanded');
                if (childUl.classList.contains('expanded')) {
                    expander.innerHTML = expanderOn;
                    folderDiv.style.backgroundColor = 'var(--active-background-color)';
                    icon.innerHTML = folderName === 'My Drive' ? myDriveBlackIcon : sharedDriveBlackIcon;
                } else {
                    expander.innerHTML = expanderOff;
                    folderDiv.style.backgroundColor = 'var(--sidebar-background-color)';
                    icon.innerHTML = folderName === 'My Drive' ? myDriveWhiteIcon : sharedDriveWhiteIcon;
                }
            }
        };

        li.appendChild(folderDiv);
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
        document.querySelectorAll('#fileExplorer .item.active').forEach(link => {
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