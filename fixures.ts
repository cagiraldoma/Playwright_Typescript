import { test as base } from '@playwright/test'
import { BasePage } from "./pages/BasePage"
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { userInfo } from 'os'

type MyFixure = {
    loginToTheApp: {
        basePage: BasePage
        loginPage: LoginPage
        dashboardPage: DashboardPage
    },

    invalidLoginToTheApp: {
        basePage: BasePage
        loginPage: LoginPage
        dashboardPage: DashboardPage
    }
}

export const test = base.extend<MyFixure>({


    loginToTheApp: async ({page}, use) => {
        const basePage = new BasePage(page)
        const loginPage = new LoginPage(page)
        const dashboardPage = new DashboardPage(page)
        await basePage.navigateTo(process.env.BASE_URL!)
        await loginPage.login(process.env.ADMIN_USERNAME!, process.env.ADMIN_PASSWORD!)


        await use({basePage,loginPage,dashboardPage})

    },

    invalidLoginToTheApp: async ({page},use) =>{
        const basePage = new BasePage(page)
        const loginPage = new LoginPage(page)
        const dashboardPage = new DashboardPage(page)
        await basePage.navigateTo(process.env.BASE_URL!)
        await loginPage.login(process.env.ADMIN_USERNAME!, process.env.ADMIN_INVALID_PASSWORD!)

        await use({basePage,loginPage,dashboardPage})
    }


    
})