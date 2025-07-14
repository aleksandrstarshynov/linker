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
    <h1>Получить ответ</h1>
    <button id="receiveBtn">Получить</button>
    <div id="receiveResult"></div>
  `;
    const button = document.getElementById("receiveBtn");
    const result = document.getElementById("receiveResult");
    button.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        result.textContent = "Загрузка...";
        try {
            const response = yield fetch(`${API_BASE_URL}/response`);
            if (!response.ok)
                throw new Error("Ошибка получения");
            const data = yield response.json();
            result.textContent = `Ответ: ${data.response}`;
        }
        catch (error) {
            result.textContent = "Ошибка при получении ответа.";
        }
    }));
}
