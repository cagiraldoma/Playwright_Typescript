import { test } from '../fixtures/testFixures';
import { DashboardPage } from '../pages/DashboardPage';
import { AdminPage } from '../pages/AdminPage';
import { expect } from '@playwright/test';

test('Create new user', async ({ loginToTheApp }) => {
  const { dashboardPage, adminPage } = loginToTheApp;
  await dashboardPage.click(dashboardPage.adminNavButton);
  await adminPage.click(adminPage.addUserButton);
  await adminPage.elementIsVisible(adminPage.addUserText);
  await adminPage.addNewUser('Admin', 'Orange Test');
});
