import puppeteer from 'puppeteer';

puppeteerTest()
.then((val) => console.log('then', val))
.catch((err) => console.log('catch', err))

async function puppeteerTest(){
	console.log('start puppeteer')
  const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('https://compendium.ch/prod/co-dafalgan-cpr-eff-500-30mg/fr');
	await page.waitForSelector('#ctl00_MainContent_ucProductDetail1_dvProduct_lblProductDescr');
	let compounds = await page.evaluate(
		() => document.querySelector('#ctl00_MainContent_ucProductDetail1_dvProduct_lblProductDescr').textContent
	);
	await browser.close();
	
	console.log('compounds', compounds);
  
}
