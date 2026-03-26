import { test } from '../fixtures/testFixures';
import { getRandomInt } from '../utils/randomValuesUtils';
import { faker } from '@faker-js/faker';

test.describe.only('PIM Module', () => {
  test.describe('Add employee flow', () => {
    test('Add and search employee', async ({ loginToTheApp }) => {
      const { dashboardPage, pimPage, basePage } = loginToTheApp;

      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const employeeId = getRandomInt();
      const employeeName = `${firstName} ${lastName}`;

      await test.step('Add new employee', async () => {
        await dashboardPage.click(dashboardPage.pimNavButton);
        await pimPage.addNewEmployee(firstName, lastName, employeeId);
        await basePage.elementIsVisible(pimPage.successAlert);
      });

      await test.step('Search for existing employee', async () => {
        await pimPage.searchEmployee(employeeName, employeeId);
        await pimPage.waitForElementToDisappear(pimPage.loadingSpinner);
        console.log(await pimPage.getAllTextContent(pimPage.employeeListTable));
      });
    });
  });
});
