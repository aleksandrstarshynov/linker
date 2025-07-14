import { API_BASE_URL } from "./config.js";

export function setupSendPage(): void {
  const section = document.getElementById("sendPage");
  if (!section) return;

  section.innerHTML = `
    <h1>Отправить текст</h1>
    <textarea id="textInput" rows="5" cols="50" placeholder="Введите текст..."></textarea>
    <br />
    <button id="sendBtn">Отправить</button>
    <div id="sendResult"></div>
  `;

  const button = document.getElementById("sendBtn") as HTMLButtonElement;
  const input = document.getElementById("textInput") as HTMLTextAreaElement;
  const result = document.getElementById("sendResult") as HTMLDivElement;

  button.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) {
      result.textContent = "Введите текст!";
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Ошибка отправки");

      const data = await response.json();
      result.textContent = `Успешно: ${data.message}`;
    } catch (error) {
      result.textContent = "Ошибка при отправке текста.";
    }
  });
}
