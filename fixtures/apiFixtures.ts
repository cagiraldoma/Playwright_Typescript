import { test as base, APIRequestContext } from '@playwright/test';

const ORANGEHRM_BASE = 'https://opensource-demo.orangehrmlive.com';

type ApiFixture = {
  authenticatedRequest: APIRequestContext;
};

export const test = base.extend<ApiFixture>({
  authenticatedRequest: async ({ browser, playwright }, use) => {
    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();

    await page.goto(process.env.BASE_URL!);
    await page.locator('input[name="username"]').fill(process.env.ADMIN_USERNAME!);
    await page.locator('input[name="password"]').fill(process.env.ADMIN_PASSWORD!);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/dashboard/);

    const storageState = await browserContext.storageState();
    await browserContext.close();

    const apiContext = await playwright.request.newContext({
      baseURL: ORANGEHRM_BASE,
      storageState,
    });

    await use(apiContext);
    await apiContext.dispose();
  },
});

export { expect } from '@playwright/test';
