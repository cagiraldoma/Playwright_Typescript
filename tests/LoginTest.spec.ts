import { test, expect } from '../fixtures/testFixures';
import { step } from '../utils/decorators';

test('Login Success', async ({ loginToTheApp }) => {
  const { dashboardPage } = loginToTheApp;
  await expect(dashboardPage.dashboardHeader).toBeVisible();
  await dashboardPage.verifyUrlContains('dashboard/index');
  await dashboardPage.pageHasTitle('OrangeHRM');
});

test('Validate Invalid Credentials Message', async ({ invalidLoginToTheApp }) => {
  const { loginPage } = invalidLoginToTheApp;
  await expect(loginPage.invalidCredentialsMsg).toHaveText('Invalid credentials');
  await loginPage.verifyPageUrl('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await loginPage.pageHasTitle('OrangeHRM');
});
