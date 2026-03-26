import { test } from '../fixtures/testFixures';

test('Login Success', async ({ loginToTheApp }) => {
  const { basePage, loginPage, dashboardPage } = loginToTheApp;
  await loginPage.verifyPageUrl('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
  await basePage.elementIsVisible(dashboardPage.dashboardHeader);
  await basePage.getTextContent(dashboardPage.dashboardHeader);
  await loginPage.verifyUrlContains('dashboard/index');
  await dashboardPage.pageHasTitle('OrangeHRM');
});

test('Validate Invalid Credentials Message', async ({ invalidLoginToTheApp }) => {
  const { basePage, loginPage } = invalidLoginToTheApp;
  await basePage.getTextContent(loginPage.invalidCredentialsMsg);
  await basePage.elementHasTheText(loginPage.invalidCredentialsMsg, 'Invalid credentials');
  await loginPage.verifyPageUrl('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await loginPage.pageHasTitle('OrangeHRM');
});
