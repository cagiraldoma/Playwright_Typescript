import { test as base, expect, Browser, Page } from '@playwright/test';
export { expect };
import { LoginPage } from '../pages/LoginPage';

type PatternFixtures = {
  loginToTheApp: {
    page: Page;
    browser: Browser;
  };
  navigateToApp: {
    page: Page;
  };
};

export const test = base.extend<PatternFixtures>({
  navigateToApp: async ({ page }, use) => {
    await page.goto(process.env.BASE_URL!);
    await use({ page });
  },

  loginToTheApp: async ({ page, browser }, use) => {
    const loginPage = new LoginPage(page);

    await page.goto(process.env.BASE_URL!);
    await loginPage.login(process.env.ADMIN_USERNAME!, process.env.ADMIN_PASSWORD!);

    await use({ page, browser });
  },
});
