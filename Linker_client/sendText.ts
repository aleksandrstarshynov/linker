import { API_BASE_URL } from "./config.js";

export function setupSendPage(): void {
  const section = document.getElementById("sendPage");
  if (!section) return;

  section.innerHTML = `
    <h1>Send text</h1>
    <textarea id="textInput" rows="5" cols="50" placeholder="Enter text..."></textarea>
    <br />
    <button id="sendBtn">Send</button>
    <div id="sendResult"></div>
  `;

  const button = document.getElementById("sendBtn") as HTMLButtonElement;
  const input = document.getElementById("textInput") as HTMLTextAreaElement;
  const result = document.getElementById("sendResult") as HTMLDivElement;

  button.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) {
      result.textContent = "Enter text!";
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Sending error");

      const data = await response.json();
      result.textContent = `Successfully: ${data.message}`;
    } catch (error) {
      result.textContent = "Error sending text.";
    }
  });
}
