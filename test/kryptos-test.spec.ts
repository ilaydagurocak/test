import { expect, test } from '@playwright/test';
import { flipFuses, FuseVersion, FuseV1Options } from '@electron/fuses';

test('Uygulamaya login yap', async ({ electron }) => {
  const password = "Linos1140!";

  // Flip the fuses before launching Electron
  flipFuses(
    require('electron'), // Path to Electron
    {
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false
    }
  );

  // Launch Electron
  const electronApp = await electron.launch({
    executablePath: "C:\\Users\\vboxuser\\Downloads\\KryptosWDE_latest.exe"
  });

  // Wait for the login window to appear
  const timeout = 120000; 
  const startTime = Date.now();

  let page;

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

  // Simulate login
  await page.fill('[role="textbox"]', password);
  const buttons = await page.$$('button');
  await buttons[1].click(); // Click the second button

  // Wait for the new window to appear
  const newWindow = await electronApp.waitForEvent('window');
  const newWindowTitle = await newWindow.title();
  expect(newWindowTitle).toBe('Kryptos Free');
  
  // Close Electron
  await electronApp.close();
});
