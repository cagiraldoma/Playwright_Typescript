import { test } from '../fixtures/testFixures';
import { AssignLeavePage } from '../pages/AssignLeavePage';

test.describe('Create a leave request for an specific employee', async () => {
  test('Create a leave request from Dashboard Page', async ({ loginToTheApp }) => {
    const { basePage, dashboardPage, assignLeavePage } = loginToTheApp;
    await test.step('Admin creates a leave vacation request', async () => {
      await dashboardPage.click(dashboardPage.assignLeaveButton);
      await assignLeavePage.assignLeave('Orange  Test', 'CAN - Personal', 'Full Day', 1, 1);
      await basePage.elementHasValue(assignLeavePage.employeeNameInput, 'Orange  Test');
    });
  });
});
