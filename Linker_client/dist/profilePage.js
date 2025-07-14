import { fetchUserProfile } from "./userService.js";
export function setupProfilePage() {
    const section = document.getElementById("profilePage");
    if (!section)
        return;
    // Completely clear previous content
    section.innerHTML = "";
    // Render profile page content
    section.innerHTML = `
    <h1>User Profile</h1>

    <button id="backToDashboardBtnProfile">Back to Dashboard</button>

    <div id="profileInfo">Loading...</div>
  `;
    const backButton = document.getElementById("backToDashboardBtnProfile");
    backButton.addEventListener("click", () => {
        window.switchPage("dashboard");
    });
    const info = document.getElementById("profileInfo");
    fetchUserProfile()
        .then(data => {
        info.innerHTML = `
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>ID:</strong> ${data.id}</p>
      `;
    })
        .catch(() => {
        info.innerHTML = "Error loading profile.";
    });
}
