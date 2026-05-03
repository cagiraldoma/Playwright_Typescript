import { test, expect } from '../../fixtures/patternFixtures';
import { BrowserContextManager } from '../../pages/patterns/singleton/BrowserContextManager';
import { LoginPage } from '../../pages/LoginPage';

const BASE_URL = process.env.BASE_URL!;
const VALID_USER = process.env.ADMIN_USERNAME!;
const VALID_PASS = process.env.ADMIN_PASSWORD!;
const INVALID_PASS = process.env.ADMIN_INVALID_PASSWORD!;

test.describe('Singleton Pattern — Login Scenarios', () => {
  test.afterEach(async ({ loginToTheApp }) => {
    await BrowserContextManager.getInstance(loginToTheApp.browser).closeContext();
  });

  test.afterAll(() => {
    BrowserContextManager.resetInstance();
  });

  test('Login Success: contexto del Singleton permite autenticarse correctamente', async ({ loginToTheApp }) => {
    const { browser } = loginToTheApp;

    const manager = BrowserContextManager.getInstance(browser);
    const context = await manager.getContext();
    const newPage = await context.newPage();

    const loginPage = new LoginPage(newPage);
    await loginPage.navigateTo(BASE_URL);
    await loginPage.login(VALID_USER, VALID_PASS);

    await loginPage.verifyUrlContains('/dashboard');

    await newPage.close();
  });

  test('Login Fail: contexto del Singleton muestra error con credenciales inválidas', async ({ loginToTheApp }) => {
    const { browser } = loginToTheApp;

    const manager = BrowserContextManager.getInstance(browser);
    const context = await manager.getContext();
    const newPage = await context.newPage();

    const loginPage = new LoginPage(newPage);
    await loginPage.navigateTo(BASE_URL);
    await loginPage.login(VALID_USER, INVALID_PASS);

    await loginPage.elementIsVisible(loginPage.invalidCredentialsMsg);

    await newPage.close();
  });
});

test.describe('Singleton Pattern — BrowserContextManager', () => {
  test.afterAll(() => {
    BrowserContextManager.resetInstance();
  });

  test('getInstance() returns the same instance on multiple calls', async ({ loginToTheApp }) => {
    const { browser } = loginToTheApp;

    const instanceA = BrowserContextManager.getInstance(browser);
    const instanceB = BrowserContextManager.getInstance(browser);

    expect(instanceA === instanceB).toBe(true);
  });

  test('shared context is functional — can navigate to OrangeHRM login page', async ({ loginToTheApp }) => {
    const { browser } = loginToTheApp;

    const manager = BrowserContextManager.getInstance(browser);
    const context = await manager.getContext();

    const newPage = await context.newPage();
    await newPage.goto(process.env.BASE_URL!);

    await expect(newPage).toHaveTitle('OrangeHRM');

    await newPage.close();
  });
});
