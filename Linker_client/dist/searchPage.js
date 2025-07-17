// Search page: user enters query and clicks Search
export function setupSearchPage() {
    const section = document.getElementById("searchPage");
    if (!section)
        return;
    section.innerHTML = `
    <h1>Search Fragments</h1>
    <input type="text" id="searchInput" placeholder="Enter a word or phrase..." />
    <button id="searchBtn">Search</button>
    <div id="searchHint"></div>
  `;
    const input = document.getElementById("searchInput");
    const button = document.getElementById("searchBtn");
    const hint = document.getElementById("searchHint");
    button.addEventListener("click", () => {
        const query = input.value.trim();
        if (!query) {
            hint.textContent = "Enter text to search!";
            return;
        }
        // Save query globally and navigate to results page
        window.lastSearchQuery = query;
        window.switchPage("results");
    });
}
