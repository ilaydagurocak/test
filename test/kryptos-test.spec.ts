import { expect, test } from '@playwright/test';
import { ElectronApplication, Page, _electron as electron } from '@playwright/test';

let electronApp: ElectronApplication;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const beforeAllTimeout = 60000;

test.beforeAll(async () => {
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

test.configure({ timeout: beforeAllTimeout });
  await sleep(10000);
  if(electronApp) {
    await electronApp.close();
  }  
})

let page: Page;
let password = "Linos1140!";

test('Uygulamaya login yap', async () => {
  test.setTimeout(120000);

  const timeout = 120000; 
  const startTime = Date.now();

  if (page.title() != "Kryptos Free" ) {
    while (true) {
  
      if (Date.now() - startTime > timeout) {
        throw new Error('Timeout waiting for the login window');
      }
      const newPage = await electronApp.waitForEvent('window');
      const title = await newPage.title();
      
      if (title == "Kryptos Free") {
        page = newPage;
        break;
      }
    }
  }

  await sleep(30000);

  await page.getByRole('textbox').fill(password);
  await page.$$eval('button', (buttons, index) => buttons[index].click(), 1);

  const newWindow = await electronApp.waitForEvent('window');
  const newWindowTitle = await newWindow.title();
  expect(newWindowTitle).toBe('Kryptos Free');
  
  page = newWindow;
});
