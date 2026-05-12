import { test as base, expect, Page } from '@playwright/test';
export { expect };
import { BasePage } from '../pages/BasePage';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AssignLeavePage } from '../pages/AssignLeavePage';
import { AdminPage } from '../pages/AdminPage';
import { PimPage } from '../pages/PimPage';

type MyFixure = {
  navigateToApp: {
    page: Page;
    loginPage: LoginPage;
  };

  loginToTheApp: {
    basePage: BasePage;
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    assignLeavePage: AssignLeavePage;
    adminPage: AdminPage;
    pimPage: PimPage;
  };

  invalidLoginToTheApp: {
    basePage: BasePage;
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
  };
};

export const test = base.extend<MyFixure>({
  navigateToApp: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await page.goto(process.env.BASE_URL!);
    await use({ page, loginPage });
  },

  loginToTheApp: async ({ page }, use) => {
    const basePage = new BasePage(page);
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const assignLeavePage = new AssignLeavePage(page);
    const adminPage = new AdminPage(page);
    const pimPage = new PimPage(page);
    await basePage.navigateTo(process.env.BASE_URL!);
    await loginPage.login(process.env.ADMIN_USERNAME!, process.env.ADMIN_PASSWORD!);

    await use({ basePage, loginPage, dashboardPage, assignLeavePage, adminPage, pimPage });
  },

  invalidLoginToTheApp: async ({ page }, use) => {
    const basePage = new BasePage(page);
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    await basePage.navigateTo(process.env.BASE_URL!);
    await loginPage.login(process.env.ADMIN_USERNAME!, process.env.ADMIN_INVALID_PASSWORD!);

    await use({ basePage, loginPage, dashboardPage });
  },
});
