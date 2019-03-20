import puppeteer from 'puppeteer';

/* for test purposes */
scrapeDrug('https://compendium.ch/prod/co-dafalgan-cpr-eff-500-30mg/fr')
.then((result) => {
	console.log(result);
})
.catch((err) => console.log(err));

async function scrapeDrug(compendiumURL){
	const titleSelector = '#ctl00_MainContent_ucProductDetail1_dvProduct_lblProductDescr';
	// launch puppeteer browser
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(compendiumURL);

	// await page load
	await page.waitForSelector(titleSelector);
	
	// get the name of the drug
	const title = await page.evaluate((selector) => {
		return document.querySelector(selector).textContent;
	}, titleSelector);

	//get the list of components to the drug
	const composition = await page.evaluate((selector) => {
		return Array.from(document.querySelectorAll(selector))
			.map((tr) => tr.textContent);
	}, '#compEverything > table > tbody > tr');

	//move to the patient information page of this drug and await page loading
	await Promise.all([
		page.waitForNavigation(),
		page.click('#ctl00_MainContent_ucProductDetail1_tblLinkMoreInfosFIPIPhoto > tbody > tr > td:nth-child(2) > a:nth-child(1)')
	]);

	//get the notice of the drug
	let noticeHTML = await page.evaluate((selector) => {
		return document.querySelectorAll(selector);
	}, '.monographie > .paragraph');

	let notice = Array.from(noticeHTML)
		.map(paragraph => paragraph.innerText);

	console.log(notice[0]);

	await browser.close();


	const drugData = {
		title: title,
		composition: composition,
		notice: noticeHTML
	}

  return drugData;
}
