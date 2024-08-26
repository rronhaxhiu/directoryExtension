export const getIcon = iconName => {
    if (iconName === 'folder') {
        return '<svg fill="#5f6368" height="20px" width="20px" focusable="false" viewBox="0 0 24 24" fill="currentColor" class="a-s-fa-Ha-pa"><g><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path><path d="M0 0h24v24H0z" fill="none"></path></g></svg>';
    }
    if (iconName === 'video') {
        return `<svg fill="#ea4335" viewBox="0 0 16 12" xmlns="http://www.w3.org/2000/svg" class="k2eJge" style="width: 16px; height: 16px;"><path d="M12.8 0l1.6 3.2H12L10.4 0H8.8l1.6 3.2H8L6.4 0H4.8l1.6 3.2H4L2.4 0h-.8C.72 0 .008.72.008 1.6L0 11.2c0 .88.72 1.6 1.6 1.6h12.8c.88 0 1.6-.72 1.6-1.6V0h-3.2z"></path></svg>`;
    }
    if (iconName === 'sheets') {
        return '<svg fill="#34a853" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="c7bJtd" style="width: 16px; height: 16px;"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.222 0H1.778C.8 0 .008.8.008 1.778L0 4.444v9.778C0 15.2.8 16 1.778 16h12.444C15.2 16 16 15.2 16 14.222V1.778C16 .8 15.2 0 14.222 0zm0 7.111h-7.11v7.111H5.332v-7.11H1.778V5.332h3.555V1.778h1.778v3.555h7.111v1.778z"></path></svg>';
    }
    if (iconName === 'form') {
        return '<svg fill="#673ab7" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="G98Kb" style="width: 16px; height: 16px;"><path d="M14.222 0H1.778C.8 0 0 .8 0 1.778v12.444C0 15.2.8 16 1.778 16h12.444C15.2 16 16 15.2 16 14.222V1.778C16 .8 15.2 0 14.222 0zM5.333 12.444H3.556v-1.777h1.777v1.777zm0-3.555H3.556V7.11h1.777V8.89zm0-3.556H3.556V3.556h1.777v1.777zm7.111 7.111H6.222v-1.777h6.222v1.777zm0-3.555H6.222V7.11h6.222V8.89zm0-3.556H6.222V3.556h6.222v1.777z"></path></svg>';
    }
    if (iconName === 'pdf') {
        return '<svg fill="#ea4335" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="k2eJge" style="width: 16px; height: 16px;"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.778 0h12.444C15.2 0 16 .8 16 1.778v12.444C16 15.2 15.2 16 14.222 16H1.778C.8 16 0 15.2 0 14.222V1.778C0 .8.8 0 1.778 0zm2.666 7.556h-.888v-.89h.888v.89zm1.334 0c0 .737-.596 1.333-1.334 1.333h-.888v1.778H2.222V5.333h2.222c.738 0 1.334.596 1.334 1.334v.889zm6.666-.89h2.223V5.334H11.11v5.334h1.333V8.889h1.334V7.556h-1.334v-.89zm-2.222 2.667c0 .738-.595 1.334-1.333 1.334H6.667V5.333h2.222c.738 0 1.333.596 1.333 1.334v2.666zm-1.333 0H8V6.667h.889v2.666z"></path></svg>';
    }
    if (iconName === 'document') {
        return '<svg fill="#4285f4" class="auHQVc" style="width:16px;height:16px;" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.222 0H1.778C.8 0 0 .8 0 1.778v12.444C0 15.2.8 16 1.778 16h12.444C15.2 16 16 15.2 16 14.222V1.778C16 .8 15.2 0 14.222 0zm-1.769 5.333H3.556V3.556h8.897v1.777zm0 3.556H3.556V7.11h8.897V8.89zm-2.666 3.555H3.556v-1.777h6.23v1.777z"></path></svg>';
    }
    if (iconName === 'presentation') {
        return '<svg fill="#fbbc04" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="jqOzib" style="width: 16px; height: 16px;"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.213 0H1.77C.79 0 0 .8 0 1.778v12.444C0 15.2.791 16 1.769 16h12.444c.978 0 1.778-.8 1.778-1.778V1.778C15.991.8 15.191 0 14.213 0zm0 11.556H1.77V4.444h12.444v7.112z"></path></svg>';
    }
    if (iconName === 'myDriveBlack') {
        return '<svg fill="#3c4043" class=" c-qd" width="24px" height="24px" viewBox="0 0 24 24" fill="#000000" focusable="false"><path d="M9.05 15H15q.275 0 .5-.137.225-.138.35-.363l1.1-1.9q.125-.225.1-.5-.025-.275-.15-.5l-2.95-5.1q-.125-.225-.35-.363Q13.375 6 13.1 6h-2.2q-.275 0-.5.137-.225.138-.35.363L7.1 11.6q-.125.225-.125.5t.125.5l1.05 1.9q.125.25.375.375T9.05 15Zm1.2-3L12 9l1.75 3ZM3 17V4q0-.825.587-1.413Q4.175 2 5 2h14q.825 0 1.413.587Q21 3.175 21 4v13Zm2 5q-.825 0-1.413-.587Q3 20.825 3 20v-1h18v1q0 .825-.587 1.413Q19.825 22 19 22Z"></path></svg>';
    }
    if (iconName === 'myDriveWhite') {
        return '<svg fill="#3c4043" class="a-s-fa-Ha-pa c-qd" width="24px" height="24px" viewBox="0 0 24 24" fill="#000000" focusable="false"><path d="M19 2H5C3.9 2 3 2.9 3 4V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V4C21 2.9 20.1 2 19 2ZM19 20H5V19H19V20ZM19 17H5V4H19V17Z"></path><path d="M13.1215 6H10.8785C10.5514 6 10.271 6.18692 10.0841 6.46729L7.14019 11.6075C7 11.8878 7 12.215 7.14019 12.4953L8.26168 14.4579C8.40187 14.7383 8.72897 14.9252 9.05608 14.9252H15.0374C15.3645 14.9252 15.6449 14.7383 15.8318 14.4579L16.9533 12.4953C17.0935 12.215 17.0935 11.8878 16.9533 11.6075L13.9159 6.46729C13.7757 6.18692 13.4486 6 13.1215 6ZM10.1776 12.0748L12.0467 8.8972L13.8692 12.0748H10.1776Z"></path></svg>';
    }
    if (iconName === 'sharedDriveBlack') {
        return '<svg fill="#3c4043" width="24px" height="24px" viewBox="0 0 24 24" fill="#000000" focusable="false" class=" c-qd"><g><rect fill="none" height="24" width="24"></rect></g><g><g><path d="M19,2H5C3.9,2,3,2.9,3,4v13h18V4C21,2.9,20.1,2,19,2z M9.5,7C10.33,7,11,7.67,11,8.5c0,0.83-0.67,1.5-1.5,1.5 S8,9.33,8,8.5C8,7.67,8.67,7,9.5,7z M13,14H6v-1.35C6,11.55,8.34,11,9.5,11s3.5,0.55,3.5,1.65V14z M14.5,7C15.33,7,16,7.67,16,8.5 c0,0.83-0.67,1.5-1.5,1.5S13,9.33,13,8.5C13,7.67,13.67,7,14.5,7z M18,14h-4v-1.35c0-0.62-0.3-1.12-0.75-1.5 c0.46-0.1,0.9-0.15,1.25-0.15c1.16,0,3.5,0.55,3.5,1.65V14z"></path><path d="M3,20c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2v-2H3V20z M18,19c0.55,0,1,0.45,1,1s-0.45,1-1,1s-1-0.45-1-1S17.45,19,18,19z"></path></g></g></svg>';
    }
    if (iconName === 'sharedDriveWhite') {
        return '<svg fill="#3c4043" width="24px" height="24px" viewBox="0 0 24 24" fill="#000000" focusable="false" class=" a-s-fa-Ha-pa c-qd"><path d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 2v13H5V4h14zM5 20v-1h14v1H5zm6-11.5c0 .83-.67 1.5-1.5 1.5S8 9.33 8 8.5 8.67 7 9.5 7s1.5.67 1.5 1.5zm5 0c0 .83-.67 1.5-1.5 1.5S13 9.33 13 8.5 13.67 7 14.5 7s1.5.67 1.5 1.5zM9.5 11c-1.16 0-3.5.55-3.5 1.65V14h7v-1.35c0-1.1-2.34-1.65-3.5-1.65zm8.5 1.65V14h-4v-1.35c0-.62-.3-1.12-.75-1.5.46-.1.9-.15 1.25-.15 1.16 0 3.5.55 3.5 1.65z"></path></svg>';
    }
    if (iconName === 'expanderOn') {
        return '<svg fill="#3c4043" class="a-s-fa-Ha-pa c-qd" width="12px" height="12px" viewBox="0 0 20 20" focusable="false" fill="currentColor"><polygon points="5,8 10,13 15,8"></polygon></svg>';
    }
    if (iconName === 'expanderOff') {
        return '<svg fill="#3c4043" class="c-qd a-s-fa-Ha-pa" width="12px" height="12px" viewBox="0 0 20 20" focusable="false" fill="currentColor"><polygon points="8,5 13,10 8,15"></polygon></svg>';
    }
    if (iconName === 'loaderSVG') {
        return '<svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg>';
    }
    if (iconName === 'image') {
        return '<path fill="#ea4335" fill-rule="evenodd" clip-rule="evenodd" d="M16 14.222V1.778C16 .796 15.204 0 14.222 0H1.778C.796 0 0 .796 0 1.778v12.444C0 15.204.796 16 1.778 16h12.444c.982 0 1.778-.796 1.778-1.778zM4.889 9.333l2.222 2.671L10.222 8l4 5.333H1.778l3.11-4z"></path>'
    }
}

export const menuIcon = color => {
    return `<svg fill="${color}" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 18L20 18" stroke="${color}" stroke-width="2" stroke-linecap="round"/><path d="M4 12L20 12" stroke="${color}" stroke-width="2" stroke-linecap="round"/><path d="M4 6L20 6" stroke="${color}" stroke-width="2" stroke-linecap="round"/></svg>`;
}

