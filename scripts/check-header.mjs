import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
try{const page=await browser.newPage({viewport:{width:1050,height:260}});const svg=await readFile('docs/header.svg');await page.setContent(`<img alt="PolicyPilot" src="data:image/svg+xml;base64,${svg.toString('base64')}"/>`);await page.locator('img').waitFor();const a=await page.screenshot();await page.waitForTimeout(1500);const b=await page.screenshot();assert.equal(a.equals(b),false);console.log('PASS animated SVG changes frames when embedded as an image');}finally{await browser.close();}
