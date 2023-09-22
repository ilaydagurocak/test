import { expect, test } from '@playwright/test';
import { ElectronApplication, Page, _electron as electron } from '@playwright/test';

let electronApp: ElectronApplication;
let page: Page;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

test.beforeAll(async () => {
  testInfo.timeout = 60000;
  process.env.CI = 'e2e';
  electronApp = await electron.launch({
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
  if(electronApp) {
    await electronApp.close();
  }  
});

test('Uygulamaya login yap', async () => {
  test.setTimeout(120000);
  const timeout = 120000; 
  const startTime = Date.now();
while ((Date.now() - startTime) <= timeout) {
    const newPage = await electronApp.waitForEvent('window');
    const title = await newPage.title();

    if (title === "Kryptos Free") {
      page = newPage;
      break;
    }
  }

  if (!page) {
    throw new Error('Timeout waiting for the login window');
  }

  await sleep(60000);
  await page.fill('[role="textbox"]', password);
  const buttons = await page.$$('button');
  await buttons[1].click(); // 2. butona tıkla

  const newWindow = await electronApp.waitForEvent('window');
  const newWindowTitle = await newWindow.title();
  expect(newWindowTitle).toBe('Kryptos Free');
  
  page = newWindow;
});  
