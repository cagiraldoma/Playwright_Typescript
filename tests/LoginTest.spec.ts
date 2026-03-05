import { LoginPage } from '../pages/LoginPage';
import { BasePage } from '../pages/BasePage';
import { DashboardPage } from '../pages/DashboardPage';
import { test } from '../fixures';

test ('Login Success', async({page, loginToTheApp})=>{
    const loginPage = new LoginPage (page)
    const basePage = new BasePage (page)
    const dashboardPage = new DashboardPage (page)
    loginToTheApp
    await loginPage.verifyUrlContains('orangehrm')
    //Check title
    await basePage.elementIsVisible(dashboardPage.dashboardHeader)
    console.log(await basePage.getTextContent(dashboardPage.dashboardHeader))
})

test ('Validate Invalid Credentials Message', async({page, loginToTheApp})=>{
    const loginPage = new LoginPage(page)
    const basePage = new BasePage(page)
    loginToTheApp
    console.log(await basePage.getTextContent(loginPage.invalidCredentialsMsg))
    await basePage.elementHasTheText(loginPage.invalidCredentialsMsg, 'Invalid credentials')
    //assertion -> Expects
})