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
export function setupSendPage() {
    const section = document.getElementById("sendPage");
    if (!section)
        return;
    section.innerHTML = `
    <h1>Send text</h1>
    <textarea id="textInput" rows="5" cols="50" placeholder="Enter text..."></textarea>
    <br />
    <input id="sourceInput" type="text" placeholder="Источник (необязательно)" />
    <br/>
    <button id="sendBtn">Send</button>
    <div id="sendResult"></div>
  `;
    const button = document.getElementById("sendBtn");
    const input = document.getElementById("textInput");
    const result = document.getElementById("sendResult");
    const sourceInput = document.getElementById("sourceInput");
    button.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        const text = input.value.trim();
        if (!text) {
            result.textContent = "Enter text!";
            return;
        }
        try {
            const source = sourceInput.value.trim();
            const response = yield fetch(`${API_BASE_URL}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, source }),
            });
            if (!response.ok)
                throw new Error("Sending error");
            const data = yield response.json();
            result.textContent = `Successfully: ${data.message}`;
        }
        catch (error) {
            result.textContent = "Error sending text.";
        }
    }));
}
