import { test } from '../fixtures/testFixures';
import { getRandomInt } from '../utils/randomValuesUtils';

test('Success Add Employee', async ({ loginToTheApp }) => {
  const { dashboardPage, pimPage, basePage } = loginToTheApp;
  await dashboardPage.click(dashboardPage.pimNavButton);
  await pimPage.addNewEmployee('Carlos', 'Test', getRandomInt());
  await basePage.elementIsVisible(pimPage.successAlert);
});
