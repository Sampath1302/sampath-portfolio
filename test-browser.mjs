import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER ${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log(`[BROWSER ERROR] ${err.toString()}`);
  });

  console.log("Navigating to http://localhost:3000");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  console.log("Waiting 3 seconds...");
  await new Promise(r => setTimeout(r, 3000));
  
  console.log("Checking Qurik page...");
  await page.goto('http://localhost:3000/projects/qurik', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000));
  
  await browser.close();
})();
