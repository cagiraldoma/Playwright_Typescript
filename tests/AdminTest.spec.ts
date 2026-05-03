import { test, expect } from '../fixtures/testFixures';
import { faker } from '@faker-js/faker';

test('Create new user', async ({ loginToTheApp }) => {
  const { dashboardPage, adminPage } = loginToTheApp;
  await dashboardPage.navigateToAdmin();
  await adminPage.openAddUserForm();
  await expect(adminPage.addUserText, 'Add User form did not open').toBeVisible();
  await adminPage.addNewUser('Admin', 'Orange Test', 'Enabled', faker.word.words(), faker.internet.password());
  await expect(adminPage.successAdminSavedBanner, 'Success banner not shown after saving user').toBeVisible();
  await adminPage.pageHasTitle('OrangeHRM', 'Pague Title is different');
});
