import { LoginPage } from '../pages/LoginPage';
import { BasePage } from '../pages/BasePage';
import { DashboardPage } from '../pages/DashboardPage';
import { test } from '../fixures';

test.describe('', async () => {

    test('Create a leave request', async ({ page, loginToTheApp }) => {

        const basePage = new BasePage(page)
        const dashboardPage = new DashboardPage(page)
        loginToTheApp
        await test.step('Admin creates a leave vacation request', async () => {
            await dashboardPage.click(dashboardPage.assignLeaveButton)
            await dashboardPage.assignLeave('Orange Test', 'CAN - Vacation', 'All Days', 'Half Day - Morning')
            await page.waitForTimeout(5000)
            await basePage.elementHasTheText(dashboardPage.employeeNameInput, 'Test')
        })


    })

})

