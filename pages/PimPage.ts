import { Page, Locator, test } from '@playwright/test';
import { BasePage } from './BasePage';

export class PimPage extends BasePage {
  readonly addEmployeeButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;
  readonly successAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.addEmployeeButton = page.getByRole('button', { name: ' Add ' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.employeeIdInput = page.locator("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']");
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.successAlert = page.locator('//div[@class="oxd-toast-container oxd-toast-container--bottom"]');
  }

  async addNewEmployee(employeeFirtsName: string, employeeLastName: string, employeeId?: string, employeeMiddleName?: string) {
    await test.step(`Click add button ${this.addEmployeeButton}`, async () => {
      this.click(this.addEmployeeButton);
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
}
