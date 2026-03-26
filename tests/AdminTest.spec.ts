import { test } from '../fixtures/testFixures';
import { base, faker } from '@faker-js/faker';

test('Create new user', async ({ loginToTheApp }) => {
  const { dashboardPage, adminPage } = loginToTheApp;
  await dashboardPage.click(dashboardPage.adminNavButton);
  await adminPage.click(adminPage.addUserButton);
  await adminPage.elementIsVisible(adminPage.addUserText);
  await adminPage.addNewUser('Admin', 'Orange Test', 'Enabled', faker.word.words(), faker.internet.password());
  await adminPage.elementIsVisible(adminPage.successAdminSavedBanner);
  await adminPage.pageHasTitle('OrangeHRM');
});
