// HTML elements selection
const searchTermElem = document.querySelector('#searchTerm');
const searchResultElem = document.querySelector('#searchResult');

// Focus on the search input field
searchTermElem.focus();
console.log("Focused on search input field.");

// Event listener for keyup event to trigger search
searchTermElem.addEventListener('keyup', function (event) {
    const searchTerm = event.target.value.trim(); // Trim white spaces from search term
    console.log("Search term:", searchTerm);
    if (searchTerm !== '') {
        console.log("Searching...");
        search(searchTerm);
    } else {
        console.log("Search term is empty. Clearing search results.");
        searchResultElem.innerHTML = ''; // Clear search results if search term is empty
    }
});

// Function to highlight search term in results
const highlight = (str, keyword, className = "highlight") => {
    const hl = `<span class="${className}">${keyword}</span>`;
    console.log("Highlighting:", str, "with", keyword);
    return str.replace(new RegExp(keyword, 'gi'), hl);
    // console.log("Highlighting:", str, "with", keyword);
};

// Function to generate HTML for search results
const generateHTML = (results, searchTerm) => {
    console.log("mithilesh this is results array",results)
    console.log("Generating HTML for search results.");
    return results.map(result => {
        const title = highlight(result.title, searchTerm);
        console.log("mithilesh this is the title",title)
        const snippet = highlight(result.snippet, searchTerm);

        return `<article>
            <a href="https://en.wikipedia.org/?curid=${result.pageid}">
                <h2>${title}</h2>
            </a>
            <div class="summary">${snippet}...</div>
        </article>`;
    }).join('');
};

// Debounce function to limit API requests
const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

// Function to fetch search results from Wikipedia API
const search = debounce(async (searchTerm) => {
    console.log("Making API request for search term:", searchTerm);
    try {
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info|extracts&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch search results');
        }
        const searchResults = await response.json();
        const searchResultHtml = generateHTML(searchResults.query.search, searchTerm);
        searchResultElem.innerHTML = searchResultHtml;
    } catch (error) {
        console.error("Error occurred during search:", error);
    }
}, 1000); // Delay of 300ms for debounce
