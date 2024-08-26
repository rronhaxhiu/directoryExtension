// Handles getting and setting storage data
export function getStoredData(keys, callback) {
    chrome.storage.local.get(keys, (result) => {
        if (chrome.runtime.lastError) {
            console.error('Error getting stored data:', chrome.runtime.lastError.message);
            return;
        }
        callback(result);
    });
}

export function setStoredData(data, callback) {
    chrome.storage.local.set(data, () => {
        if (chrome.runtime.lastError) {
            console.error('Error setting stored data:', chrome.runtime.lastError.message);
            return;
        }
        if (callback) callback();
    });
}
