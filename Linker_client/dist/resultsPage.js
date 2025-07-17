var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { API_BASE_URL } from "./config.js";
// Results page: fetches and displays results for saved query
export function setupResultsPage() {
    const section = document.getElementById("resultsPage");
    if (!section)
        return;
    const query = window.lastSearchQuery;
    section.innerHTML = `
    <h1>Results for: "${query}"</h1>
    <button id="backToSearchBtn">Back to Search</button>
    <h2>Exact Matches (Supabase)</h2>
    <div id="exactMatches">Loading exact matches...</div>
    <hr />
    <h2>Vector Matches (Qdrant)</h2>
    <div id="vectorMatches">Loading vector matches...</div>
  `;
    const backButton = document.getElementById("backToSearchBtn");
    backButton.addEventListener("click", () => {
        window.switchPage("search");
    });
    if (!query) {
        section.innerHTML += "<p>No query provided.</p>";
        return;
    }
    loadExactMatches(query);
    loadVectorMatches(query);
}
// Load exact text matches from Supabase
function loadExactMatches(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const container = document.getElementById("exactMatches");
        try {
            const response = yield fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
            if (!response.ok)
                throw new Error("Supabase search failed");
            const data = yield response.json();
            const results = data.results;
            if (!results || results.length === 0) {
                container.textContent = "No exact matches found.";
                return;
            }
            container.innerHTML = "<ul>" +
                results.map((f) => `<li>${f.text_fragment}</li>`).join("") +
                "</ul>";
        }
        catch (error) {
            container.textContent = "Error loading exact matches.";
        }
    });
}
// Load vector search results from Qdrant
function loadVectorMatches(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const container = document.getElementById("vectorMatches");
        try {
            const response = yield fetch(`${API_BASE_URL}/vector_search?query=${encodeURIComponent(query)}`);
            if (!response.ok)
                throw new Error("Vector search failed");
            const data = yield response.json();
            const results = data.results;
            if (!results || results.length === 0) {
                container.textContent = "No vector matches found.";
                return;
            }
            container.innerHTML = "<ul>" +
                results.map((f) => `<li>${f.text_fragment}</li>`).join("") +
                "</ul>";
        }
        catch (error) {
            container.textContent = "Error loading vector matches.";
        }
    });
}
