import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });

  console.log("Navigating to http://localhost:3000/");
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'home-2d.png' });
  console.log("Saved home-2d.png");

  console.log("Navigating to http://localhost:3000/projects/qurik");
  await page.goto('http://localhost:3000/projects/qurik', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'qurik-2d.png' });
  console.log("Saved qurik-2d.png");

  console.log("Navigating to http://localhost:3000/projects/ir-bot");
  await page.goto('http://localhost:3000/projects/ir-bot', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'ir-bot-2d.png' });
  console.log("Saved ir-bot-2d.png");
  
  await browser.close();
})();
