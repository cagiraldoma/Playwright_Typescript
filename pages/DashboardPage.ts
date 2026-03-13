import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { getDateDaysFromToday } from "../utils/dateUtils";

export class DashboardPage extends BasePage {
  readonly adminTab: Locator;
  readonly dashboardHeader: Locator;
  readonly assignLeaveButton: Locator;
  readonly adminNavButton: Locator

  constructor(page: Page) {
    super(page);
    this.adminTab = page.locator(
      'a[href="/web/index.php/admin/viewAdminModule"]',
    );
    this.dashboardHeader = page.locator(
      'h6[class="oxd-text oxd-text--h6 oxd-topbar-header-breadcrumb-module"]',
    );
    this.assignLeaveButton = page.locator('button[title="Assign Leave"]');

    this.adminNavButton = page.getByText('Admin')
  }
}
