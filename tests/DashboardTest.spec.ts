import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BasePage } from '../pages/BasePage';
import { DashboardPage } from '../pages/DashboardPage';

test ('Admin assign Leave', async ({page})=>{
    const basePage = new BasePage (page)
    const loginPage = new LoginPage (page)
    const dashboardPage = new DashboardPage(page)
    await basePage.navigateTo('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    await loginPage.login('Admin','admin123')
    await loginPage.click(dashboardPage.assignLeaveButton)
    await dashboardPage.assignLeave('Test')
    // await basePage.elementHasTheText(dashboardPage.employeeNameInput,'Test')
})