import { test, expect } from '../fixtures/testFixures';

test('Login Success', async ({ loginToTheApp }) => {
  const { dashboardPage } = loginToTheApp;
  await expect(dashboardPage.dashboardHeader, 'Dashboard header not visible after login').toBeVisible();
  await dashboardPage.verifyUrlContains('dashboard/index');
  await dashboardPage.pageHasTitle('OrangeHRM');
});

test('Validate Invalid Credentials Message', async ({ invalidLoginToTheApp }) => {
  const { loginPage } = invalidLoginToTheApp;
  await expect(loginPage.invalidCredentialsMsg, 'Invalid credentials message not displayed').toHaveText('Invalid credentials');
  await loginPage.verifyPageUrl('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await loginPage.pageHasTitle('OrangeHRM', 'Pague Title is diffenrent');
});
