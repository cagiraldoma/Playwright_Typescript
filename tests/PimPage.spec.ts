import { test, expect } from '../fixtures/testFixures';
import { getRandomInt } from '../utils/randomValuesUtils';
import { faker } from '@faker-js/faker';

test.describe('PIM Module', () => {
  test.describe('Add employee flow', () => {
    test('Add and search employee', async ({ loginToTheApp }) => {
      const { dashboardPage, pimPage } = loginToTheApp;

      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const employeeId = getRandomInt();
      const employeeName = `${firstName} ${lastName}`;

      await dashboardPage.navigateToPim();
      await pimPage.addNewEmployee(firstName, lastName, employeeId);
      await expect(pimPage.successAlert, 'Success alert not shown after saving employee').toBeVisible();
      await pimPage.searchEmployee(employeeName, employeeId);
      await pimPage.waitForSearchResults();
      console.log(await pimPage.getSearchResults());
    });
  });
});
