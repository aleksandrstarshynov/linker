export function setupDashboardPage(): void {
  const section = document.getElementById("dashboardPage");
  if (!section) return;

  // Render dashboard content
  section.innerHTML = `
    <h1>Dashboard</h1>
    <p>Welcome to your project dashboard.</p>
    <nav>
      <button id="fragmentsBtn">Fragments</button>
      <button id="profileBtn">Profile</button>
    </nav>
  `;

  const fragmentsButton = document.getElementById("fragmentsBtn") as HTMLButtonElement;
  const profileButton = document.getElementById("profileBtn") as HTMLButtonElement;

  // Navigate to fragments page
  fragmentsButton.addEventListener("click", () => {
    (window as any).switchPage("fragments");
  });

  // Navigate to profile page
  profileButton.addEventListener("click", () => {
    (window as any).switchPage("profile");
  });
}
