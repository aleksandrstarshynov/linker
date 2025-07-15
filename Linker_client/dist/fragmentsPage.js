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
// Fragments page setup
export function setupFragmentsPage() {
    const section = document.getElementById("fragmentsPage");
    if (!section)
        return;
    // Render Fragments page content
    section.innerHTML = `
    <h1>Fragments</h1>

    <button id="backToDashboardBtnFragments">Back to Dashboard</button>

    <h2>Add New Fragment</h2>
    <input type="text" id="sourceInput" placeholder="Enter source..." />
    <br />
    <textarea id="textInput" rows="4" cols="50" placeholder="Enter fragment..."></textarea>
    <br />
    <button id="sendBtn">Save Fragment</button>
    <div id="sendResult"></div>

    <h2>Search Fragments</h2>
    <input type="text" id="searchInput" placeholder="Search fragments..." />
    <button id="searchBtn">Search</button>
    <div id="searchResults"></div>

    <h2>All Fragments</h2>
    <button id="loadBtn">Load Fragments</button>
    <div id="allFragments"></div>
  `;
    // Back button
    const backButton = document.getElementById("backToDashboardBtnFragments");
    backButton.addEventListener("click", () => {
        window.switchPage("dashboard");
    });
    // Save fragment logic
    const sendButton = document.getElementById("sendBtn");
    const textInput = document.getElementById("textInput");
    const sourceInput = document.getElementById("sourceInput");
    const sendResult = document.getElementById("sendResult");
    sendButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        const text = textInput.value.trim();
        const source = sourceInput.value.trim();
        if (!text || !source) {
            sendResult.textContent = "Please enter both fragment and source.";
            return;
        }
        try {
            const response = yield fetch(`${API_BASE_URL}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, source }), // ✅ Send both text and source
            });
            if (!response.ok)
                throw new Error("Save failed");
            const data = yield response.json();
            sendResult.textContent = `Saved successfully. ID: ${data.message}`;
            textInput.value = "";
            sourceInput.value = "";
        }
        catch (error) {
            sendResult.textContent = "Error saving fragment.";
        }
    }));
    // Search fragments
    const searchButton = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    searchButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        const query = searchInput.value.trim();
        if (!query) {
            searchResults.textContent = "Please enter search text.";
            return;
        }
        try {
            const response = yield fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
            if (!response.ok)
                throw new Error("Search failed");
            const data = yield response.json();
            const results = data.results;
            if (results.length === 0) {
                searchResults.textContent = "No fragments found.";
                return;
            }
            searchResults.innerHTML = "<ul>" +
                results.map((f) => `<li>${f.text}</li>`).join("") +
                "</ul>";
        }
        catch (error) {
            searchResults.textContent = "Error searching fragments.";
        }
    }));
    // Load all fragments
    const loadButton = document.getElementById("loadBtn");
    const allFragments = document.getElementById("allFragments");
    loadButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${API_BASE_URL}/get_fragments`);
            if (!response.ok)
                throw new Error("Load failed");
            const data = yield response.json();
            const fragments = data.fragments;
            allFragments.innerHTML = "<ul>" +
                fragments.map((f) => `<li>${f.text}</li>`).join("") +
                "</ul>";
        }
        catch (error) {
            allFragments.textContent = "Error loading fragments.";
        }
    }));
}
