import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

 export class AdminPage extends BasePage {
  readonly addUserButton: Locator;
  readonly addUserText: Locator;

  constructor(page: Page) {
    super(page);
    this.addUserButton = page.getByRole("button", { name: "Add" });
    this.addUserText = page.getByRole("heading",{name: "Add User"})
  }

  async addNewUser() {
    await this.click(this.addUserButton);
  }
}
