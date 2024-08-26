// resize.js

export function resizeFunctionality(resizeHandle, sidebar, container, mainPage, docsHeader, toggleSidebar) {
    let isResizing = false;

    resizeHandle.addEventListener('mousedown', (e) => {
        if (sidebar.classList.contains('hidden')) {
            return; // Exit early if the sidebar is hidden
        }
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
    });
}
