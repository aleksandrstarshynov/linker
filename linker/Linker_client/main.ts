import { setupSendPage } from "./sendText.js";
import { setupReceivePage } from "./receiveText.js";
import { setupProfilePage } from "./profilePage.js";

function switchPage(pageId: string): void {
  const sections = document.querySelectorAll<HTMLElement>("main > section");

  sections.forEach(section => {
    section.hidden = section.id !== `${pageId}Page`;
  });

  if (pageId === "send") {
    setupSendPage();
  } else if (pageId === "receive") {
    setupReceivePage();
  } else if (pageId === "profile") {
    setupProfilePage();
  }
}

(window as any).switchPage = switchPage;
switchPage("send");
