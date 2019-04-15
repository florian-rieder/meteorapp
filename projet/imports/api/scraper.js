import { Meteor } from 'meteor/meteor';
import puppeteer from 'puppeteer';
import { prettifyDrugTitle } from './utilities';

/* we wrap functions that use puppeteer inside Meteor.methods to be able to access
	 them from the client */
Meteor.methods({
	'scrapeDrug': async function (compendiumURL) {
		let result = await scrapeDrug(compendiumURL)
		return result;
	},
	'searchDrug': async function (searchString) {
		let result = await searchByString(searchString);
		return result;
	}
});

// fetches the name, composition and notice from a drug's page on compendium URL
async function scrapeDrug(compendiumURL) {
	const titleSelector = '#ctl00_MainContent_ucProductDetail1_dvProduct_lblProductDescr';
	// launch puppeteer browser
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(compendiumURL);

	// await page load
	await page.waitForNavigation();

	// get the name of the drug
	const title = await page.evaluate((selector) => {
		return document.querySelector(selector).textContent;
	}, titleSelector);

	//get the list of components to the drug
	const composition = await page.evaluate((selector) => {
		return Array.from(document.querySelectorAll(selector))
			.map((tr) => {
				return { component: tr.textContent }
			});
	}, '#compEverything > table > tbody > tr');

	// get the link to this drugs images, for later use
	const imagesPath = await page.evaluate(selector => {
		return document.querySelector(selector).pathname;
	}, '#ctl00_MainContent_ucProductDetail1_tblLinkMoreInfosFIPIPhoto > tbody > tr > td:nth-child(3) > a');

	// move to the patient information page of this drug and await page loading
	await Promise.all([
		page.waitForNavigation(),
		page.click('#ctl00_MainContent_ucProductDetail1_tblLinkMoreInfosFIPIPhoto > tbody > tr > td:nth-child(2) > a:nth-child(1)')
	]);

	// get the notice of the drug
	let notice = await page.evaluate((selector) => {
		return Array.from(document.querySelectorAll(selector))
			/* get the childnodes of each paragraphs */
			.map((paragraphe) => Array.from(paragraphe.childNodes)
				/* get the text content of each element inside a paragraph */
				.map(element => element.textContent));
	}, '.monographie > .paragraph');

	// remove first element of notice (OEMéd), because we don't care about that
	notice.splice(0, 1);
	
	// close the headless browser
	await browser.close();

	//create return object
	const drugData = {
		title: prettifyDrugTitle(title),
		composition: composition,
		notice: notice,
		imgpath: imagesPath,
	}

	return drugData;
}
// fetches the results of the search of any string sent to compendium.ch search engine
async function searchByString(searchString) {
	// convert the searchString into a format suitable to be injected in an URL
	const newString = searchString.split(' ').join('!20');
	const searchURL = `https://compendium.ch/search/${newString}/fr`;
	// launch puppeteer browser
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(searchURL);

	const trSelector = '#ctl00_MainContent_ucProductFullSearch1_gvwProducts > tbody > tr';
	// await page load
	await page.waitForNavigation();

	// check if results are on multiple pages (if there are more than 100 results)
	// here, we look if there is at least one pagination button
	let numberOfPages = await page.evaluate(() => {
		let paginationButtons = Array.from(document.querySelectorAll('#ctl00_Tools_divPaginationBar > a'));
		// if the length of the array is 0, that means we have one page (there are no pagination buttons), 
		// else, we have as much pages as there are pagination buttons
		return paginationButtons.length == 0 ? 1 : paginationButtons.length;
	});

	let searchResults = [];
	// for each page
	for (let i = 1; i <= numberOfPages; i++) {
		// get the title (e.g. dafalgan), subtitle (e.g. paracetamol), and the URL path to access
		// the details of the drug (that we can transform to get the compendiumURL parameter 
		// of scrapeDrug(compendiumURL))
		const pageResults = await page.evaluate((selector) => {
			return Array.from(document.querySelectorAll(selector))
				.map((resultEntry) => {
					// complicated stuff to access the info we need in the page
					// you can find the pens that were used to find this complicated stuff
					// on codepen.io/sergenti/pens/public
					let tdThatContainsTheInfoWeNeed = Array.from(Array.from(resultEntry.childNodes)[2].childNodes);
					let informationsContainer = Array.from(tdThatContainsTheInfoWeNeed[1].childNodes)
					// create an easy to handle object to return
					const resultObject = {
						title: informationsContainer[0].textContent,
						subtitle: informationsContainer[4].textContent,
						path: tdThatContainsTheInfoWeNeed[1].pathname
					}
					
					return resultObject;
				});
		}, trSelector);

		// add page results to total results
		pageResults.forEach(result => {
			// format the title
			result.title = prettifyDrugTitle(result.title);
			// add result to results array
			searchResults.push(result);
		});

		// if there are multiple pages, go to the next page
		if (numberOfPages > 1) {
			// we need to move to the page i + 1, but then we need to ignore the last iteration
			// of the loop as there is no more page to go to
			let nextPage = i + 1 > numberOfPages ? 'last' : (i + 1);
			if (nextPage == 'last') {
				break;
			} else {
				//move to the next page and await page loading
				await Promise.all([
					page.waitForNavigation(),
					page.click(`#ctl00_Tools_divPaginationBar > a:nth-child(${nextPage})`)
				]);
			}
		}
	}

	//close the headless browser
	await browser.close();

	return searchResults;
}

/* async function scrapeDrugImages(imgpath) {
	const photosPageURL = `https://compendium.ch${imgpath}`;
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(photosPageURL);

	// await page load
	await page.waitForNavigation();

	const images = await page.evaluate(() => {

	})

} */