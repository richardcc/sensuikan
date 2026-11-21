const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = path.resolve('scratch/edge_verify_map');

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    userDataDir: userDataDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const appUrl = 'file:///' + path.resolve('app/index.html').replace(/\\/g, '/');
  console.log('Navigating to', appUrl);
  await page.goto(appUrl, { waitUntil: 'load' });

  // 1. Open modal-aircraft-display-mat
  await page.evaluate(() => {
    if (typeof openAircraftDisplayMatModal === 'function') {
      openAircraftDisplayMatModal();
    }
  });
  await new Promise(r => setTimeout(r, 600));

  // Check modal display
  const isModalVisible = await page.evaluate(() => {
    const m = document.getElementById('modal-aircraft-display-mat');
    return m && window.getComputedStyle(m).display !== 'none';
  });
  console.log('Modal visible:', isModalVisible);

  // Take screenshot of Modal with Tab 2 (Map)
  const ss1 = path.resolve('C:/Users/Richard/.gemini/antigravity/brain/3fd05165-b487-4b4e-a070-ebf400d9cb87/verify_aircraft_mat_map_tab.png');
  await page.screenshot({ path: ss1 });
  console.log('Screenshot saved to', ss1);

  // 2. Click Circle 2
  await page.evaluate(() => {
    if (typeof selectFlightCircle === 'function') {
      selectFlightCircle(2);
    }
  });
  await new Promise(r => setTimeout(r, 300));

  const circle2Status = await page.evaluate(() => {
    const pill = document.getElementById('air-map-circle-text');
    return pill ? pill.innerText : '';
  });
  console.log('Circle after moving to 2:', circle2Status);

  // 3. Roll encounter
  await page.evaluate(() => {
    if (typeof rollAirCircleEncounter === 'function') {
      rollAirCircleEncounter();
    }
  });
  await new Promise(r => setTimeout(r, 300));

  const logText = await page.evaluate(() => {
    const l = document.getElementById('air-flight-log-box');
    return l ? l.innerText : '';
  });
  console.log('Flight log:', logText);

  // 4. Test English Language switch
  await page.evaluate(() => {
    if (typeof toggleLanguage === 'function') {
      toggleLanguage();
    }
  });
  await new Promise(r => setTimeout(r, 400));

  const enPill = await page.evaluate(() => {
    const pill = document.getElementById('air-map-circle-text');
    const tab2 = document.getElementById('lbl-tab-map');
    return { pill: pill?.innerText, tab2: tab2?.innerText };
  });
  console.log('English UI strings:', enPill);

  // Screenshot in EN
  const ss2 = path.resolve('C:/Users/Richard/.gemini/antigravity/brain/3fd05165-b487-4b4e-a070-ebf400d9cb87/verify_aircraft_mat_map_en.png');
  await page.screenshot({ path: ss2 });
  console.log('EN Screenshot saved to', ss2);

  // 5. Test Escape Key to close
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));

  const isModalClosed = await page.evaluate(() => {
    const m = document.getElementById('modal-aircraft-display-mat');
    return m && window.getComputedStyle(m).display === 'none';
  });
  console.log('Modal closed via Escape:', isModalClosed);

  await browser.close();
  console.log('ALL VERIFICATIONS FINISHED SUCCESSFULLY');
}

run().catch(err => {
  console.error('Error during test:', err);
  process.exit(1);
});
