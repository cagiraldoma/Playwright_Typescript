import { test, expect } from '../fixtures/testFixures';

test.describe('Create a leave request for an specific employee', async () => {
  test('Create a leave request from Dashboard Page', async ({ loginToTheApp }) => {
    const { dashboardPage, assignLeavePage } = loginToTheApp;
    await dashboardPage.openAssignLeave();
    await assignLeavePage.assignLeave('Orange  Test', 'CAN - Personal', 'Full Day', 1, 1);
    await expect(assignLeavePage.employeeNameInput).toHaveValue('Orange  Test');
  });
});
