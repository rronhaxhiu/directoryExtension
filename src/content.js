const injectCSS = (callback) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('../style.css'); // URL to your CSS file
    link.onload = callback; // Ensure CSS is loaded before proceeding
    document.head.appendChild(link);
};

// Inject sidebar.js into the web page
const injectSidebar = () => {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('sidebar.bundle.js');
    script.onload = () => script.remove(); // Clean up after injecting
    document.body.appendChild(script);
};


// Call the function to inject CSS and sidebar.js when needed
injectCSS(() => {
    injectSidebar();
});