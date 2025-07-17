// Import page rendering functions
import { setupDashboardPage } from "./dashboardPage.js";
import { setupFragmentsPage } from "./fragmentsPage.js";
import { setupProfilePage } from "./profilePage.js";
import { setupMainPage } from "./mainPage.js";
import { setupResultsPage } from "./resultsPage.js";

// Function to switch between visible pages
function switchPage(pageId: string): void {
  const sections = document.querySelectorAll<HTMLElement>("main > section");

  // Hide all sections except the active one
  sections.forEach(section => {
    section.hidden = section.id !== `${pageId}Page`;
  });

  // Initialize the active page
  if (pageId === "main") {
    setupMainPage();
  } else if (pageId === "dashboard") {
    setupDashboardPage();
  } else if (pageId === "fragments") {
    setupFragmentsPage();
  } else if (pageId === "profile") {
    setupProfilePage();
  } else if (pageId === "results") {
    setupResultsPage();
}
}

// Expose the switchPage function globally for navigation buttons
(window as any).switchPage = switchPage;

// Show main page when application starts
switchPage("main");
