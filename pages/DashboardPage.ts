import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  readonly adminTab: Locator;
  readonly dashboardHeader: Locator;
  readonly employeeNameInput: Locator;
  readonly employeeList: Locator;
  readonly assignLeaveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.adminTab = page.locator('a[href="/web/index.php/admin/viewAdminModule"]');
    this.dashboardHeader = page.locator(
        'h6[class="oxd-text oxd-text--h6 oxd-topbar-header-breadcrumb-module"]'
      );
    this.employeeNameInput = page.locator('div[class="oxd-autocomplete-text-input oxd-autocomplete-text-input--active"]>input')
    this.employeeList = page.locator('//div[@role="listbox"]/div')
    this.assignLeaveButton = page.locator('button[title="Assign Leave"]')
    

  }

  async assignLeave (employeeName: string){
    await this.fillInput(this.employeeNameInput, employeeName)
    await this.SelectElementFromDropDown(employeeName, 2000)
  }
}
