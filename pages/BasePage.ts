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
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.fill(value);
  }

  async verifyUrlContains(path: string) {
    await expect(this.page).toHaveURL(new RegExp(path));
  }

  async elementIsVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async getTextContent(locator: Locator){
    return await locator.textContent()
  }

  async getAllTextContent(locator: Locator){
    // await locator.waitFor()
    return await locator.allTextContents()
  }

  async elementHasTheText (locator: Locator, text: string){
    await expect(locator).toHaveText(text)
  }

  async selectFirstElement (locator: Locator){
    await locator.first().textContent()
  }

  async SelectElementFromDropDown (element: string, waitForElements: number = 0){
    if ( waitForElements > 0 ){
      await this.page.waitForTimeout(waitForElements)
    }
    const elements = await this.page.$$("//div[@role='listbox']/div")
    
    for ( let elementInList of elements){
      const employeeName = await elementInList.textContent()
      console.log(employeeName)
      if (employeeName?.includes(element)){
        await elementInList.click()
        break
      }
    }
  }
}
