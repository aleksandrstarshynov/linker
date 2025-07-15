import { API_BASE_URL } from "./config.js";

// Fragments page setup
export function setupFragmentsPage(): void {
  const section = document.getElementById("fragmentsPage");
  if (!section) return;

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
  const backButton = document.getElementById("backToDashboardBtnFragments") as HTMLButtonElement;
  backButton.addEventListener("click", () => {
    (window as any).switchPage("dashboard");
  });

  // Save fragment logic
  const sendButton = document.getElementById("sendBtn") as HTMLButtonElement;
  const textInput = document.getElementById("textInput") as HTMLTextAreaElement;
  const sourceInput = document.getElementById("sourceInput") as HTMLInputElement;
  const sendResult = document.getElementById("sendResult") as HTMLDivElement;

  sendButton.addEventListener("click", async () => {
    const text = textInput.value.trim();
    const source = sourceInput.value.trim();

    if (!text || !source) {
      sendResult.textContent = "Please enter both fragment and source.";
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, source }),  // ✅ Send both text and source
      });

      if (!response.ok) throw new Error("Save failed");

      const data = await response.json();
      sendResult.textContent = `Saved successfully. ID: ${data.message}`;
      textInput.value = "";
      sourceInput.value = "";

    } catch (error) {
      sendResult.textContent = "Error saving fragment.";
    }
  });

  // Search fragments
  const searchButton = document.getElementById("searchBtn") as HTMLButtonElement;
  const searchInput = document.getElementById("searchInput") as HTMLInputElement;
  const searchResults = document.getElementById("searchResults") as HTMLDivElement;

  searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (!query) {
      searchResults.textContent = "Please enter search text.";
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      const results = data.results;

      if (results.length === 0) {
        searchResults.textContent = "No fragments found.";
        return;
      }

      searchResults.innerHTML = "<ul>" +
        results.map((f: any) => `<li>${f.text}</li>`).join("") +
        "</ul>";

    } catch (error) {
      searchResults.textContent = "Error searching fragments.";
    }
  });

  // Load all fragments
  const loadButton = document.getElementById("loadBtn") as HTMLButtonElement;
  const allFragments = document.getElementById("allFragments") as HTMLDivElement;

  loadButton.addEventListener("click", async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_fragments`);
      if (!response.ok) throw new Error("Load failed");

      const data = await response.json();
      const fragments = data.fragments;

      allFragments.innerHTML = "<ul>" +
        fragments.map((f: any) => `<li>${f.text}</li>`).join("") +
        "</ul>";

    } catch (error) {
      allFragments.textContent = "Error loading fragments.";
    }
  });
}
