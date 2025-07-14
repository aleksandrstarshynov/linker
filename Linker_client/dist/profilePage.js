import { fetchUserProfile } from "./userService.js";
export function setupProfilePage() {
    const section = document.getElementById("profilePage");
    if (!section)
        return;
    section.innerHTML = `
    <h1>Профиль пользователя</h1>
    <div id="profileInfo">Загрузка...</div>
  `;
    const info = document.getElementById("profileInfo");
    fetchUserProfile()
        .then(data => {
        info.innerHTML = `
        <p><strong>Имя:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>ID:</strong> ${data.id}</p>
      `;
    })
        .catch(() => {
        info.innerHTML = "Ошибка при загрузке профиля.";
    });
}
