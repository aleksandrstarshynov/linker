import { API_BASE_URL } from "./config.js";

export function setupReceivePage(): void {
  const section = document.getElementById("receivePage");
  if (!section) return;

  section.innerHTML = `
    <h1>List of fragments</h1>
    <button id="receiveBtn">Get fragments</button>
    <div id="receiveResult"></div>
  `;

  const button = document.getElementById("receiveBtn") as HTMLButtonElement;
  const result = document.getElementById("receiveResult") as HTMLDivElement;

  button.addEventListener("click", async () => {
    result.textContent = "Loading...";

    try {
      const response = await fetch(`${API_BASE_URL}/get_fragments`);
      if (!response.ok) throw new Error("");

      const data = await response.json();
      const fragments = data.fragments;

      // Display all fragments as a list
      result.innerHTML = "<ul>" + 
        fragments.map((f: any) => `<li>${f.text}</li>`).join("") + 
        "</ul>";

    } catch (error) {
      result.textContent = "Error getting fragments.";
    }
  });
}
