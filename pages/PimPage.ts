import { Page, Locator, test } from '@playwright/test';
import { BasePage } from './BasePage';

export class PimPage extends BasePage {
  //Add Employee Subpage
  readonly addEmployeeButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;
  readonly successAlert: Locator;

  //Employee List Subpage
  readonly employeeListLink: Locator;
  readonly employeeNameInput: Locator;
  readonly employeeId: Locator;
  readonly searchButton: Locator;

  readonly employeeListTable: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    super(page);
    //Add Employee Subpage
    this.addEmployeeButton = page.getByRole('button', { name: ' Add ' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.employeeIdInput = page.locator("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']");
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.successAlert = page.locator('//div[@class="oxd-toast-container oxd-toast-container--bottom"]');

    //Employee List Subpage
    this.employeeNameInput = page.locator("//div[@class='oxd-grid-4 orangehrm-full-width-grid']//div[1]//div[1]//div[2]//div[1]//div[1]//input[1]");
    this.employeeId = page.locator("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']");
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.employeeListLink = page.getByRole('link', { name: 'Employee List' });

    this.employeeListTable = page.locator('(//div[@class="oxd-table-cell oxd-padding-cell"])[3]/div');
    this.loadingSpinner = page.locator('//div[@class="oxd-loading-spinner-container"]');
  }

  async addNewEmployee(employeeFirtsName: string, employeeLastName: string, employeeId?: string, employeeMiddleName?: string) {
    await test.step(`Click add button ${this.addEmployeeButton}`, async () => {
      await this.click(this.addEmployeeButton);
    });
    await test.step('Fill Add new EE form', async () => {
      await this.fillInput(this.firstNameInput, employeeFirtsName);
      await this.fillInput(this.lastNameInput, employeeLastName);
      if (employeeId) {
        await this.fillInput(this.employeeIdInput, employeeId);
      }
    });
    await test.step(`Click on Save Button ${this.saveButton}`, async () => {
      await this.click(this.saveButton);
    });
  }

  async searchEmployee(employeeName: string, employeeId: string) {
    await this.click(this.employeeListLink);
    await this.fillInput(this.employeeNameInput, employeeName);
    await this.fillInput(this.employeeId, employeeId);
    await this.click(this.searchButton);
  }
}
