import { API_BASE_URL } from "./config.js";

export function setupSearchPage(): void {
  const section = document.getElementById("searchPage");
  if (!section) return;

  section.innerHTML = `
    <h1>Search for fragments</h1>
    <input type="text" id="searchInput" placeholder="Enter a word or phrase..." />
    <button id="searchBtn">Search</button>
    <div id="searchResults"></div>
  `;

  const input = document.getElementById("searchInput") as HTMLInputElement;
  const button = document.getElementById("searchBtn") as HTMLButtonElement;
  const resultsDiv = document.getElementById("searchResults") as HTMLDivElement;

  button.addEventListener("click", async () => {
    const query = input.value.trim();
    if (!query) {
      resultsDiv.textContent = "Enter text to search!";
      return;
    }

    resultsDiv.textContent = "Searching...";

    try {
      const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Search error");

      const data = await response.json();
      const fragments = data.results;

      if (fragments.length === 0) {
        resultsDiv.textContent = "Nothing found.";
        return;
      }

      resultsDiv.innerHTML = "<ul>" +
        fragments.map((f: any) => `<li>${f.text}</li>`).join("") +
        "</ul>";

    } catch (error) {
      resultsDiv.textContent = "Error while searching.";
    }
  });
}
