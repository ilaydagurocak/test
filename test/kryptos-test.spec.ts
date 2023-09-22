import { test, expect } from '@playwright/test';
import { ElectronApplication, Page } from '@playwright/test';

let electronApp: ElectronApplication;
let page: Page;
const password = 'Linos1140!'; // Define your password or import it from another file/module.

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

test.beforeAll(async () => {
  process.env.CI = 'e2e';
  electronApp = await test._electron.launch({  // Adjusted the electron launch function.
    executablePath: "C:\\Users\\vboxuser\\Downloads\\KryptosWDE_latest.exe"
  });
  electronApp.on('window', async (page) => {
    const filename = page.url()?.split('/').pop();
    console.log(`Window opened: ${filename}`);
    page.on('pageerror', (error) => {
      console.error(error);
    });
    page.on('console', (msg) => {
      console.log(msg.text());
    });
  });
});

test.afterAll(async () => {
  await sleep(10000);
  if (electronApp) {
    await electronApp.close();
  }
});

test('Uygulamaya login yap', async () => {
  const newPage = await electronApp.waitForEvent('window', { timeout: 120000 });
  const title = await newPage.title();
  
  if (title !== "Kryptos Free") {
    throw new Error('Timeout waiting for the login window');
  }
  
  page = newPage;

  await page.fill('[role="textbox"]', password);
  const buttons = await page.$$('button');
  await buttons[1].click(); // Assuming the second button is the one you need to click.

  const newWindow = await electronApp.waitForEvent('window', { timeout: 120000 });
  const newWindowTitle = await newWindow.title();
  expect(newWindowTitle).toBe('Kryptos Free');

  page = newWindow;
});
