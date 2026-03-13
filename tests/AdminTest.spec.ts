import {test} from '../fixures'
import { DashboardPage } from '../pages/DashboardPage'
import {AdminPage} from "../pages/AdminPage"
import { expect } from '@playwright/test'


test ('Create new user', async({loginToTheApp})=>{
    const { basePage, dashboardPage, assignLeavePage, adminPage} = loginToTheApp
    await dashboardPage.click(dashboardPage.adminNavButton)
    await adminPage.click(adminPage.addUserButton)
    await adminPage.elementIsVisible(adminPage.addUserText)

})


