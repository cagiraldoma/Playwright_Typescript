import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { faker, th } from '@faker-js/faker';
import { step } from '../utils/decorators';

export class AdminPage extends BasePage {
  readonly addUserButton: Locator;
  readonly addUserText: Locator;
  readonly dropdownRoleButton: Locator;
  readonly dropdownRoleList: Locator;
  readonly employeeNameInput: Locator;
  readonly employeeNameList: Locator;
  readonly statusInput: Locator;
  readonly statusList: Locator;
  readonly employeeUserName: Locator;
  readonly employeePassword: Locator;
  readonly employeeConfirmPassword: Locator;
  readonly successAdminSavedBanner: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addUserButton = page.getByRole('button', { name: 'Add' });
    this.addUserText = page.getByRole('heading', { name: 'Add User' });
    this.dropdownRoleButton = page.locator("(//form//div/div[@class='oxd-select-wrapper'])[1]");
    this.dropdownRoleList = page.locator("(//form//div/div[@class='oxd-select-wrapper'])[1]//div[@role='listbox']/div");
    this.employeeNameInput = page.getByRole('textbox', { name: 'Type for hints...' });
    this.employeeNameList = page.locator('//div[@class="oxd-autocomplete-dropdown --positon-bottom"]//div');
    this.statusInput = page.locator('(//div[@class="oxd-select-text oxd-select-text--active"])[2]');
    this.statusList = page.locator('//div[@class="oxd-select-dropdown --positon-bottom"]');
    this.employeeUserName = page.locator(
      "//div[@class='oxd-form-row']//div[@class='oxd-grid-2 orangehrm-full-width-grid']//div[@class='oxd-grid-item oxd-grid-item--gutters']//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']",
    );
    this.employeePassword = page.locator('(//div/input[@type="password"])[1]');
    this.employeeConfirmPassword = page.locator('(//div/input[@type="password"])[2]');
    this.successAdminSavedBanner = page.locator('//div[@id="oxd-toaster_1"]');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async openAddUserForm() {
    await this.click(this.addUserButton);
  }

  @step
  async addNewUser(userRole: string, employeeName: string, employeeStatus: string, employeeUserName: string, employeePassword: string) {
    await this.click(this.dropdownRoleButton);
    await this.selectElementByTextFromDropDown(this.dropdownRoleList, userRole);
    await this.fillInput(this.employeeNameInput, employeeName);
    await this.selectFromDropdown(employeeName);
    await this.click(this.statusInput);
    await this.selectFromDropdown(employeeStatus);
    await this.fillInput(this.employeeUserName, employeeUserName);
    await this.fillInput(this.employeePassword, employeePassword);
    await this.fillInput(this.employeeConfirmPassword, employeePassword);
    await this.click(this.saveButton);
  }
}
