import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { getDateDaysFromToday } from '../utils/dateUtils';
import { step } from '../utils/decorators';

export class AssignLeavePage extends BasePage {
  readonly employeeNameInput: Locator;
  readonly employeeList: Locator;
  readonly openLeaveTpyeList: Locator;
  readonly leaveTypeInput: Locator;
  readonly leaveTypeList: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly partialDaysInput: Locator;
  readonly partialDaysButton: Locator;
  readonly durationButton: Locator;
  readonly durationList: Locator;
  readonly commentsTextArea: Locator;

  constructor(page: Page) {
    super(page);
    this.employeeNameInput = page.locator('div[class="oxd-autocomplete-text-input oxd-autocomplete-text-input--active"]>input');
    this.employeeList = page.locator('//div[@role="listbox"]/div/span');
    this.openLeaveTpyeList = page.locator('.oxd-select-wrapper');
    this.leaveTypeInput = page.locator('//div[@class="oxd-input-group oxd-input-field-bottom-space"]//div[@class="oxd-select-wrapper"]');
    this.leaveTypeList = page.locator('.oxd-select-option');
    this.fromDateInput = page.locator('//div[@class="oxd-date-input"]/input').first();
    this.toDateInput = page.locator('//div[@class="oxd-date-input"]/input').last();
    this.partialDaysInput = page.locator('//div[@class="oxd-select-wrapper"]/div[@role="listbox"]/div');
    this.durationButton = page.locator('(//div[@class="oxd-select-text oxd-select-text--active"])[2]');
    this.partialDaysButton = page.locator('//div[@class="oxd-select-text oxd-select-text--active"]//div[contains(text(),"-- Select --")]');
    this.durationList = page.locator('//div[@class="oxd-select-dropdown --positon-bottom"]/div/span');
    this.commentsTextArea = page.locator('//div/textarea[@class="oxd-textarea oxd-textarea--active oxd-textarea--resize-vertical"]');
  }

  @step
  async assignLeave(
    employeeName: string,
    leaveType: string,
    durationType: string,
    fromDateAfterToday: number,
    toDateAfterToday: number,
    _partialDaysType?: string,
  ) {
    await this.fillInput(this.employeeNameInput, employeeName);
    await this.selectElementByTextFromDropDown(this.employeeList, employeeName);
    await this.leaveTypeInput.click();
    await this.selectElementByTextFromDropDown(this.leaveTypeList, leaveType);
    await this.fillInput(this.fromDateInput, getDateDaysFromToday(fromDateAfterToday));
    await this.toDateInput.clear();
    await this.fillInput(this.toDateInput, getDateDaysFromToday(toDateAfterToday));
    await this.click(this.durationButton);
    await this.selectElementByTextFromDropDown(this.durationList, durationType);
    await this.click(this.commentsTextArea);
  }

}
