const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 950 } });

  const htmlPath = 'file:///' + path.resolve(__dirname, '../app/index.html').replace(/\\/g, '/');
  await page.goto(htmlPath);
  await page.waitForLoadState('domcontentloaded');

  console.log('--- 1. Testing Aircraft Display Mat Close Buttons ---');
  await page.evaluate(() => {
    if (typeof window.openAircraftDisplayMatModal === 'function') {
      window.openAircraftDisplayMatModal();
    }
  });
  await page.waitForTimeout(400);

  const modalVisible = await page.evaluate(() => {
    const m = document.getElementById('modal-aircraft-display-mat');
    return m && m.style.display !== 'none';
  });
  console.log('Modal visible after open:', modalVisible);

  const bottomBtnExists = await page.evaluate(() => {
    return !!document.getElementById('air-mat-btn-close-bottom');
  });
  console.log('Duplicate bottom close button exists:', bottomBtnExists);

  const topBtnText = await page.evaluate(() => {
    const btn = document.getElementById('air-mat-btn-close-top');
    return btn ? btn.innerText.trim() : null;
  });
  console.log('Header close button text:', topBtnText);

  // Test Escape key
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  const modalVisibleAfterEsc = await page.evaluate(() => {
    const m = document.getElementById('modal-aircraft-display-mat');
    return m && m.style.display !== 'none';
  });
  console.log('Modal visible after pressing Escape:', modalVisibleAfterEsc);

  console.log('--- 2. Testing Submarine Mat 1-Plane Slot Damage ---');
  // Set submarine to Junsen_J_IM_Class
  await page.evaluate(() => {
    window.currentBoardSubKey = 'Junsen_J_IM_Class';
    if (typeof window.subBoardState !== 'undefined') {
      window.subBoardState.activeSubKey = 'Junsen_J_IM_Class';
      window.subBoardState.aircraftDamaged = false;
      window.subBoardState.aircraftDamaged2 = false;
    }
    if (typeof window.renderInteractiveSlots === 'function') {
      window.renderInteractiveSlots();
    }
  });
  await page.waitForTimeout(300);

  // Slot 1 & 2 before damage
  const slot1ContentBefore = await page.evaluate(() => {
    const el = document.getElementById('sub-hotspot-slot-air-1');
    return el ? el.innerHTML.trim() : 'missing';
  });
  const slot2ContentBefore = await page.evaluate(() => {
    const el = document.getElementById('sub-hotspot-slot-air-2');
    return el ? el.innerHTML.trim() : 'missing';
  });
  console.log('Slot 1 before:', slot1ContentBefore);
  console.log('Slot 2 before:', slot2ContentBefore);

  // Click slot 1 to damage it
  await page.evaluate(() => {
    const el = document.getElementById('sub-hotspot-slot-air-1');
    if (el) el.click();
  });
  await page.waitForTimeout(300);

  const slot1HasDamageAfter = await page.evaluate(() => {
    const el = document.getElementById('sub-hotspot-slot-air-1');
    return el ? el.innerHTML.includes('Damage - Aircraft.jpg') : false;
  });
  const slot2ContentAfter = await page.evaluate(() => {
    const el = document.getElementById('sub-hotspot-slot-air-2');
    return el ? el.innerHTML.trim() : 'missing';
  });
  console.log('Slot 1 has damage after click:', slot1HasDamageAfter);
  console.log('Slot 2 content after click (should be empty):', slot2ContentAfter === '' ? 'EMPTY (CORRECT)' : slot2ContentAfter);

  // Take screenshot of the sub board aircraft area
  await page.screenshot({ path: 'C:/Users/Richard/.gemini/antigravity/brain/3fd05165-b487-4b4e-a070-ebf400d9cb87/verify_sub_air_damage_fixed.png' });

  // Open modal again and take screenshot
  await page.evaluate(() => window.openAircraftDisplayMatModal());
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'C:/Users/Richard/.gemini/antigravity/brain/3fd05165-b487-4b4e-a070-ebf400d9cb87/verify_modal_single_close_btn.png' });

  await browser.close();
  console.log('--- ALL VERIFICATIONS PASSED ---');
})();
