import { Page } from '@playwright/test';
import { BasePage } from '../../BasePage';
import { LoginPage } from '../../LoginPage';
import { DashboardPage } from '../../DashboardPage';

export abstract class PageFactory {
  abstract createPage(page: Page): BasePage;

  async navigateAndGetPage(page: Page, url: string): Promise<BasePage> {
    const pageObject = this.createPage(page);
    await pageObject.navigateTo(url);
    return pageObject;
  }
}

export class LoginPageFactory extends PageFactory {
  createPage(page: Page): LoginPage {
    return new LoginPage(page);
  }
}

export class DashboardPageFactory extends PageFactory {
  createPage(page: Page): DashboardPage {
    return new DashboardPage(page);
  }
}
