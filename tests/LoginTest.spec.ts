import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BasePage } from '../pages/BasePage';
import { DashboardPage } from '../pages/DashboardPage';

test ('Login Success', async({page})=>{
    const loginPage = new LoginPage(page)
    const basePage = new BasePage (page)
    const dashboardPage = new DashboardPage (page)
    await basePage.navigateTo('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    await loginPage.verifyUrlContains('orangehrm')
    await loginPage.login('Admin','admin123')
    await basePage.elementIsVisible(dashboardPage.dashboardHeader)
    console.log(await basePage.getTextContent(dashboardPage.dashboardHeader))
})

test ('Validate Invalid Credentials Message', async({page})=>{
    const loginPage = new LoginPage(page)
    const basePage = new BasePage(page)
    await basePage.navigateTo('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    await loginPage.login('Admin','admin1234')
    console.log(await basePage.getTextContent(loginPage.invalidCredentialsMsg))
    await basePage.elementHasTheText(loginPage.invalidCredentialsMsg, 'Invalid credentials')
})