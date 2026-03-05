import { Page, Locator, expect } from "@playwright/test";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async click(locator: Locator): Promise<void> {
    // await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  async fillInput(locator: Locator, value: string): Promise<void> {
    // await locator.waitFor({ state: "visible" });
    await locator.fill(value);
  }

  async verifyUrlContains(path: string) {
    await expect(this.page).toHaveURL(new RegExp(path));
  }

  async elementIsVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async waitForElementToBeVisible(locator: Locator, timeout: number){
    await expect(locator).toBeVisible({timeout})
  }

  async getTextContent(locator: Locator){
    return await locator.textContent()
  }

  async getAllTextContent(locator: Locator){
    // await locator.waitFor()
    return await locator.allTextContents()
  }

  async elementHasTheText (locator: Locator ,text: string, auxiliarText?: string){
    await expect(locator,auxiliarText).toHaveText(text)
  }

  async selectFirstElement (locator: Locator){
    await locator.first().textContent()
  }

  async selectElementByTextFromDropDown (dropdownLocator: Locator, elementText: string, waitForElements: number = 0){
    if ( waitForElements > 0 ){
      await this.page.waitForTimeout(waitForElements) // Visible, editable
    }
    const elements = await dropdownLocator.elementHandles();
    
    for ( let elementInList of elements){
      const textContent = await elementInList.textContent()
    
      console.log(textContent)
      if (textContent?.includes(elementText)) {
        await elementInList.click()
        break
      }
    }
  }



}
