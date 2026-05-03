import { Browser, BrowserContext } from '@playwright/test';

export class BrowserContextManager {
  private static instance: BrowserContextManager | null = null;

  private context: BrowserContext | null = null;

  private browser: Browser;

  private constructor(browser: Browser) {
    this.browser = browser;
  }

  static getInstance(browser: Browser): BrowserContextManager {
    if (BrowserContextManager.instance === null) {
      BrowserContextManager.instance = new BrowserContextManager(browser);
    }
    return BrowserContextManager.instance;
  }

  async getContext(): Promise<BrowserContext> {
    if (this.context === null) {
      this.context = await this.browser.newContext();
    }
    return this.context;
  }

  async closeContext(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
  }

  static resetInstance(): void {
    BrowserContextManager.instance = null;
  }
}
