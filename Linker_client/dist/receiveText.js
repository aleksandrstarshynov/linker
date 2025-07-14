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
export function setupReceivePage() {
    const section = document.getElementById("receivePage");
    if (!section)
        return;
    section.innerHTML = `
    <h1>List of fragments</h1>
    <button id="receiveBtn">Get fragments</button>
    <div id="receiveResult"></div>
  `;
    const button = document.getElementById("receiveBtn");
    const result = document.getElementById("receiveResult");
    button.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        result.textContent = "Loading...";
        try {
            const response = yield fetch(`${API_BASE_URL}/get_fragments`);
            if (!response.ok)
                throw new Error("");
            const data = yield response.json();
            const fragments = data.fragments;
            // Display all fragments as a list
            result.innerHTML = "<ul>" +
                fragments.map((f) => `<li>${f.text}</li>`).join("") +
                "</ul>";
        }
        catch (error) {
            result.textContent = "Error getting fragments.";
        }
    }));
}
