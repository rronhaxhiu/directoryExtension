// Creates and returns a DOM element with specified attributes and child elements.
export const createElement = (tag, attributes = {}, children = [], parent = null) => {
    const element = document.createElement(tag);

    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'innerHTML') {
            element.innerHTML = value;
        } else {
            element.setAttribute(key, value);
        }
    });

    // Append children
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });

    // Append to parent if specified
    if (parent) {
        parent.appendChild(element);
    }

    return element;
};


// Create the new mainPage div and move the current DOM body content into it
export const wrapBodyContent = () => {
    const body = document.body;
    let mainPage = document.getElementById('mainPage');
    if (mainPage) return mainPage; // Return existing mainPage if it already exists

    mainPage = createElement('div', { id: 'mainPage', style: 'height: 100%' });
    while (body.firstChild) mainPage.appendChild(body.firstChild);
    body.appendChild(mainPage);
    return mainPage;
};