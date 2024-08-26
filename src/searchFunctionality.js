// search.js

export function searchFunctionality(searchInput) {
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
}
