import { test } from '../fixures';

test.describe('Create a leave request for an specific employee', async () => {

    test('Create a leave request', async ({ loginToTheApp }) => {
        const { basePage, dashboardPage } = loginToTheApp
        await test.step('Admin creates a leave vacation request', async () => {
            await dashboardPage.click(dashboardPage.assignLeaveButton)
            await dashboardPage.assignLeave('Orange Test', 'CAN - Personal', 'Full Day', 1,1)
            await basePage.elementHasValue(dashboardPage.employeeNameInput, 'Orange  Test')
        })
    })

})
