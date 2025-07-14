import { fetchUserProfile } from "./userService.js";

export function setupProfilePage(): void {
  const section = document.getElementById("profilePage");
  if (!section) return;

  section.innerHTML = `
    <h1>User profile</h1>
    <div id="profileInfo">Loading...</div>
  `;

  const info = document.getElementById("profileInfo") as HTMLDivElement;

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
