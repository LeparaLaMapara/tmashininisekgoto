import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
const [,, html, out] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 848 }, deviceScaleFactor: 2 });
await p.goto(pathToFileURL(html).href);
await p.screenshot({ path: out });
await b.close();
console.log('wrote ' + out);
