import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminPage extends BasePage {
  readonly addUserButton: Locator;
  readonly addUserText: Locator;
  readonly dropdownRoleButton: Locator;
  readonly dropdownRoleList: Locator;
  readonly employeeNameInput: Locator;
  readonly employeeNameList: Locator;

  constructor(page: Page) {
    super(page);
    this.addUserButton = page.getByRole('button', { name: 'Add' });
    this.addUserText = page.getByRole('heading', { name: 'Add User' });
    this.dropdownRoleButton = page.locator("(//form//div/div[@class='oxd-select-wrapper'])[1]");
    this.dropdownRoleList = page.locator("(//form//div/div[@class='oxd-select-wrapper'])[1]//div[@role='listbox']/div");
    this.employeeNameInput = page.getByRole('textbox', { name: 'Type for hints...' });
    this.employeeNameList = page.locator('//div[@class="oxd-autocomplete-dropdown --positon-bottom"]//div');
  }

  async addNewUser(userRole: string, employeeName: string) {
    await this.click(this.dropdownRoleButton);
    await this.selectElementByTextFromDropDown(this.dropdownRoleList, userRole);
    await this.fillInput(this.employeeNameInput, employeeName);
    // await this.selectElementByTextFromDropDown(this.employeeNameList, employeeName);
    await this.selectFromDropdown(this.employeeNameList, employeeName);
  }
}
