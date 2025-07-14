export function setupMainPage() {
    const section = document.getElementById("mainPage");
    if (!section)
        return;
    section.innerHTML = `
    <h1>Welcome to Alkmaar Linker</h1>
    <p>This project helps you manage and search text fragments.</p>
    <button id="goToDashboardBtn">Go to Dashboard</button>
  `;
    const button = document.getElementById("goToDashboardBtn");
    button.addEventListener("click", () => {
        window.switchPage("dashboard");
    });
}
