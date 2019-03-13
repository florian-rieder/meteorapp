import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
	await page.goto('https://compendium.ch/prod/co-dafalgan-cpr-eff-500-30mg/fr');
	const compounds = await page.evaluate(
		() => document.querySelector('#compEverything > table').innerHTML
	);
	console.log('compounds', compounds);
  await browser.close();
})();
