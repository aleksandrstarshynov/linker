import { API_BASE_URL } from "./config.js";

export function setupReceivePage(): void {
  const section = document.getElementById("receivePage");
  if (!section) return;

  section.innerHTML = `
    <h1>Получить ответ</h1>
    <button id="receiveBtn">Получить</button>
    <div id="receiveResult"></div>
  `;

  const button = document.getElementById("receiveBtn") as HTMLButtonElement;
  const result = document.getElementById("receiveResult") as HTMLDivElement;

  button.addEventListener("click", async () => {
    result.textContent = "Загрузка...";

    try {
      const response = await fetch(`${API_BASE_URL}/response`);
      if (!response.ok) throw new Error("Ошибка получения");

      const data = await response.json();
      result.textContent = `Ответ: ${data.response}`;
    } catch (error) {
      result.textContent = "Ошибка при получении ответа.";
    }
  });
}
