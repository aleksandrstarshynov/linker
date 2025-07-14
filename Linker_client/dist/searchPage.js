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
export function setupSearchPage() {
    const section = document.getElementById("searchPage");
    if (!section)
        return;
    section.innerHTML = `
    <h1>Search for fragments</h1>
    <input type="text" id="searchInput" placeholder="Enter a word or phrase..." />
    <button id="searchBtn">Search</button>
    <div id="searchResults"></div>
  `;
    const input = document.getElementById("searchInput");
    const button = document.getElementById("searchBtn");
    const resultsDiv = document.getElementById("searchResults");
    button.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        const query = input.value.trim();
        if (!query) {
            resultsDiv.textContent = "Enter text to search!";
            return;
        }
        resultsDiv.textContent = "Searching...";
        try {
            const response = yield fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
            if (!response.ok)
                throw new Error("Search error");
            const data = yield response.json();
            const fragments = data.results;
            if (fragments.length === 0) {
                resultsDiv.textContent = "Nothing found.";
                return;
            }
            resultsDiv.innerHTML = "<ul>" +
                fragments.map((f) => `<li>${f.text}</li>`).join("") +
                "</ul>";
        }
        catch (error) {
            resultsDiv.textContent = "Error while searching.";
        }
    }));
}
