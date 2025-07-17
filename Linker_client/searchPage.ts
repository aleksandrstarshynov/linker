import { API_BASE_URL } from "./config.js";

// Search page: user enters query and clicks Search
export function setupSearchPage(): void {
  const section = document.getElementById("searchPage");
  if (!section) return;

  section.innerHTML = `
    <h1>Search Fragments</h1>
    <input type="text" id="searchInput" placeholder="Enter a word or phrase..." />
    <button id="searchBtn">Search</button>
    <div id="searchHint"></div>
  `;

  const input = document.getElementById("searchInput") as HTMLInputElement;
  const button = document.getElementById("searchBtn") as HTMLButtonElement;
  const hint = document.getElementById("searchHint") as HTMLDivElement;

  button.addEventListener("click", () => {
    const query = input.value.trim();
    if (!query) {
      hint.textContent = "Enter text to search!";
      return;
    }

    // Save query globally and navigate to results page
    (window as any).lastSearchQuery = query;
    (window as any).switchPage("results");
  });
}
