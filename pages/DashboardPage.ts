import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { step } from '../utils/decorators';

export class DashboardPage extends BasePage {
  readonly adminTab: Locator;
  readonly dashboardHeader: Locator;
  readonly assignLeaveButton: Locator;
  readonly adminNavButton: Locator;
  readonly pimNavButton: Locator;

  constructor(page: Page) {
    super(page);
    this.adminTab = page.locator('a[href="/web/index.php/admin/viewAdminModule"]');
    this.dashboardHeader = page.getByRole('heading', { name: 'Dashboard' });
    this.assignLeaveButton = page.locator('button[title="Assign Leave"]');
    this.adminNavButton = page.getByRole('link', { name: 'Admin' });
    this.pimNavButton = page.getByRole('link', { name: 'PIM' });
  }

  @step
  async navigateToAdmin() {
    await this.click(this.adminNavButton);
  }

  @step
  async navigateToPim() {
    await this.click(this.pimNavButton);
  }

  @step
  async openAssignLeave() {
    await this.click(this.assignLeaveButton);
  }
}
