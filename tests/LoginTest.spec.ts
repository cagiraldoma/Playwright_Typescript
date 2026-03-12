import { test } from '../fixures';

test ('Login Success', async({ loginToTheApp })=>{
    const { basePage, loginPage, dashboardPage } = loginToTheApp
    await loginPage.verifyUrlContains('orangehrm')
    //Check title
    await basePage.elementIsVisible(dashboardPage.dashboardHeader)
    console.log(await basePage.getTextContent(dashboardPage.dashboardHeader))
})

test ('Validate Invalid Credentials Message', async({ invalidLoginToTheApp })=>{
    const { basePage, loginPage } = invalidLoginToTheApp
    console.log(await basePage.getTextContent(loginPage.invalidCredentialsMsg))
    await basePage.elementHasTheText(loginPage.invalidCredentialsMsg, 'Invalid credentials')
})
