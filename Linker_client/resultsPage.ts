import { API_BASE_URL } from "./config.js";

// Results page: fetches and displays results for saved query
export function setupResultsPage(): void {
  const section = document.getElementById("resultsPage");
  if (!section) return;

  const query = (window as any).lastSearchQuery;

  section.innerHTML = `
    <h1>Results for: "${query}"</h1>
    <button id="backToSearchBtn">Back to Search</button>
    <h2>Exact Matches (Supabase)</h2>
    <div id="exactMatches">Loading exact matches...</div>
    <hr />
    <h2>Vector Matches (Qdrant)</h2>
    <div id="vectorMatches">Loading vector matches...</div>
  `;

  const backButton = document.getElementById("backToSearchBtn") as HTMLButtonElement;
  backButton.addEventListener("click", () => {
    (window as any).switchPage("search");
  });

  if (!query) {
    section.innerHTML += "<p>No query provided.</p>";
    return;
  }

  loadExactMatches(query);
  loadVectorMatches(query);
}

// Load exact text matches from Supabase
async function loadExactMatches(query: string): Promise<void> {
  const container = document.getElementById("exactMatches") as HTMLDivElement;

  try {
    const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Supabase search failed");

    const data = await response.json();
    const results = data.results;

    if (!results || results.length === 0) {
      container.textContent = "No exact matches found.";
      return;
    }

    container.innerHTML = "<ul>" +
      results.map((f: any) => `<li>${f.text_fragment}</li>`).join("") +
      "</ul>";

  } catch (error) {
    container.textContent = "Error loading exact matches.";
  }
}

// Load vector search results from Qdrant
async function loadVectorMatches(query: string): Promise<void> {
  const container = document.getElementById("vectorMatches") as HTMLDivElement;

  try {
    const response = await fetch(`${API_BASE_URL}/vector_search?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Vector search failed");

    const data = await response.json();
    const results = data.results;

    if (!results || results.length === 0) {
      container.textContent = "No vector matches found.";
      return;
    }

    container.innerHTML = "<ul>" +
      results.map((f: any) => `<li>${f.text_fragment}</li>`).join("") +
      "</ul>";

  } catch (error) {
    container.textContent = "Error loading vector matches.";
  }
}
