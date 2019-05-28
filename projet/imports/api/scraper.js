import { Meteor } from 'meteor/meteor';
import puppeteer from 'puppeteer';
import { prettifyDrugTitle } from './utilities.js';

// we wrap functions that use puppeteer inside Meteor.methods to be able to access
// them from the client
Meteor.methods({
	'scrapeDrug': async function (compendiumURL) {
		let result = await scrapeDrug(compendiumURL);
		return result;
	},
	'searchDrug': async function (searchString) {
		let result = await searchByString(searchString);
		return result;
	}
});

// list of resources to ignore while scraping to optimize performance
const blockedResourceTypes = [
	'image',
	'media',
	'font',
	'texttrack',
	'object',
	'beacon',
	'csp_report',
	'imageset',
];
const skippedResources = [
	'quantserve',
	'adzerk',
	'doubleclick',
	'adition',
	'exelator',
	'sharethrough',
	'cdn.api.twitter',
	'google-analytics',
	'googletagmanager',
	'google',
	'fontawesome',
	'facebook',
	'analytics',
	'optimizely',
	'clicktale',
	'mixpanel',
	'zedo',
	'clicksor',
	'tiqcdn',
];

// fetches the name, composition, notice and images from a drug's page on compendium URL
async function scrapeDrug(compendiumURL) {
	console.log('scraping started...');

	// annex pages that will interest us and that we will want to scrape stuff on
	const additionalInfoPages = ["Photo", "Info patient"];

	// launch puppeteer browser
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	// optimize performance by blocking requests that are not necessary
	await page.setRequestInterception(true);
	page.on('request', request => {
		const requestUrl = request._url.split('?')[0].split('#')[0];
		if (
			blockedResourceTypes.indexOf(request.resourceType()) !== -1 ||
			skippedResources.some(resource => requestUrl.indexOf(resource) !== -1)
		) {
			request.abort();
		} else {
			request.continue();
		}
	});

	await page.goto(compendiumURL);

	// await page load
	await page.waitForNavigation();

	console.log('scraping showcaseTitle...');

	// get the name of the drug
	const title = await page.evaluate((selector) => {
		return document.querySelector(selector).textContent;
	}, '#ctl00_MainContent_ucProductDetail1_dvProduct_lblProductDescr');

	console.log('scraping composition...');

	//get the list of components of the drug
	const composition = await page.evaluate((selector) => {
		return Array.from(document.querySelectorAll(selector))
			.map((tr) => {
				return { component: tr.textContent }
			});
	}, '#compEverything > table > tbody > tr');

	console.log('scraping packagings...');

	// get the packagings quantity and corresponding prices
	const packagings = await page.evaluate(() => {
		// get the nodes containing quantities and prices and get their text content
		let quantities = Array.from(document.querySelectorAll('span[id*="lblQuantity"]')).map(node => node.textContent);
		let prices = Array.from(document.querySelectorAll('span[id*="lblPrice"]')).map(node => node.textContent)
		
		// format the data in an array of objects with a quantity and price property
		let packagings = [];
		quantities.forEach((el, i) => {
			packagings.push({
				quantity: el,
				price: prices[i],
			})
		});

		return packagings;
	});

	console.log('evaluating patient info and photos links...');

	// we check which links are available in the "informations supplémentaires" container on
	// a drug's page on compendium.ch
	const availableLinks = await page.evaluate(args => {
		const links = Array.from(document.querySelectorAll(args.selector));
		let returnLinks = [];
		// for each of the links there are, we check which ones are the ones we need 
		// (specified in the additionalInfoPages array), 
		// and return the position of that link in its container for later use.
		links.forEach((link, i) => {
			args.additionalPages.forEach(name => {
				// we check the text inside the link against the names that interest us
				if (link.childNodes[1].textContent === name) {
					// i + 1 because arrays start at 0, but :nth-child(n) starts at 1
					returnLinks.push({ name: name, position: i + 1 });
				}
			});
		});
		return returnLinks;
	}, {
			selector: '#ctl00_MainContent_ucProductDetail1_tblLinkMoreInfosFIPIPhoto > tbody > tr > td > a:not(.otherLang)',
			additionalPages: additionalInfoPages,
		});

	// i don't really know how to describe this...
	// we create a table of boolean values. Each of the values in the resulting array is a boolean 
	// value that indicates if there is an available link for the corresponding page in additionalInfoPages.
	// we can then use this table to fetch the data we have access to
	const availableLinksBoolean = additionalInfoPages.map(n => availableLinks.filter(a => a.name == n)[0] != undefined);

	// set return variables to get variables out of the if scopes
	let imagesPath, noticePath, imagesReturn, noticeTitleReturn, noticeFirmReturn, noticeReturn;

	// get paths to additional info pages
	if (availableLinksBoolean[0]) {
		console.log('scraping images path...');

		// get the position of the link to photos page
		const imagesPosition = availableLinks.filter(a => a.name == "Photo")[0].position;

		// store the link to this drugs images, for later use
		imagesPath = await page.evaluate(selector => {
			const photoAnchor = document.querySelector(selector);
			return photoAnchor.pathname;
		}, `#ctl00_MainContent_ucProductDetail1_tblLinkMoreInfosFIPIPhoto > tbody > tr > td:nth-child(${imagesPosition}) > a`);
	} else {
		console.log('images path not available')
	}
	if (availableLinksBoolean[1]) {
		console.log('scraping notice path...');

		// get the position of the link to notice page
		const noticePosition = availableLinks.filter(a => a.name == "Info patient")[0].position;

		// store the link to this drugs notice, for later use
		noticePath = await page.evaluate(selector => {
			const noticeAnchor = document.querySelector(selector);
			return noticeAnchor.pathname;
		}, `#ctl00_MainContent_ucProductDetail1_tblLinkMoreInfosFIPIPhoto > tbody > tr > td:nth-child(${noticePosition}) > a`);
	} else {
		console.log('notice path not available')
	}

	// scrape data at info pages
	if (availableLinksBoolean[0]) {
		console.log('images found. moving to images page');
		console.log('images path', imagesPath);

		// go to images page and wait for load
		await Promise.all([
			page.waitForNavigation(),
			page.goto(`https://compendium.ch/${imagesPath}`),
		]);

		// It seems like I can't use document.querySelector to get the image, because the element is not
		// classically rendered, and is not in the source of the page.
		// by taking a look at it, it seems like the images we are looking for are on another
		// source server, which is specified in the <iframe> element, that we can access.

		const pathToSource = await page.evaluate(() => document.querySelector('iframe').src);
		/* framesReturn = await page.frames(); */
		console.log('iframe passed', pathToSource);

		// go to images source page and wait for load
		await Promise.all([
			page.waitForNavigation(),
			page.goto(pathToSource),
		]);

		console.log('scraping image source...');

		// finally, get the url of the image
		const imgpath = await page.evaluate(() => {
			// [id*="tabs-"] is used to get the div that uses an id unique for each drug
			// like "#tabs-1498893-1" for example.
			const img = document.querySelector('div[id*="tabs-"] > div > ul > li > a > img');
			// avoid getting an error that crashes the scraper if there is actually no image there, despite our efforts
			return img == null ? undefined : img.src;
		});

		imagesReturn = imgpath;
	}

	if (availableLinksBoolean[1]) {
		console.log('notice link found. moving to notice page');
		// move to the patient information page of this drug and await page loading
		await Promise.all([
			page.waitForNavigation(),
			page.goto(`https://compendium.ch/${noticePath}`)
		]);

		console.log('scraping notice title and firm...');

		const noticePageData = await page.evaluate(() => {
			const title = document.querySelector('h1').textContent;
			const firm = document.querySelector('#ctl00_MainContent_ucProductFiPi1_infos > div.monographie > div.ownerCompany').textContent;
			return {
				title: title,
				firm: firm,
			};
		});

		console.log('scraping notice...');

		// get the notice of the drug
		const notice = await page.evaluate((selector) => {
			let paragraphs = document.querySelectorAll(selector);

			// add responsive wrapper to tables (if table is larger than phone screen, add a scroll bar)
			paragraphs.forEach(parent => {
				// from https://stackoverflow.com/questions/53794834/javascript-how-to-append-node-in-its-correct-index-with-wrapper
				const { childNodes } = parent;
				for (let i = 0; i < childNodes.length; i++) {
					const el = childNodes[i];
					// if the node type is an element
					if (el.nodeType === 1) {
						// if the node is a table
						if (el.tagName === 'TABLE') {
							// wrap it in a div with bootstrap class "table-responsive"
							const div = document.createElement('div');
							div.classList.add('table-responsive');
							div.appendChild(el);
				
							// Replace the child node with the new div node
							parent.replaceChild(div, childNodes[i]);    
						}
					}
				};
			})
			
			// transform the nodeList into an HTML string that we will be able to inject in drugData.html
			// from https://stackoverflow.com/questions/21792722/convert-nodelist-back-to-html
			const html = Array.prototype.reduce.call(paragraphs, function (html, node) {
				return html + (node.outerHTML || node.nodeValue);
			}, "");

			return html;
		}, '.monographie > .paragraph');

		noticeTitleReturn = noticePageData.title;
		noticeFirmReturn = noticePageData.firm;
		noticeReturn = notice;
	}

	console.log('scraping complete !');

	// close the headless browser
	await browser.close();

	// create return object
	const drugData = {
		title: noticeTitleReturn,
		firm: noticeFirmReturn,
		showcaseTitle: prettifyDrugTitle(title),
		composition: composition,
		notice: noticeReturn,
		imgpath: imagesReturn,
		packagings: packagings
	}

	return drugData;
}

/****************************************
 **************** SEARCH ****************
 ****************************************/

// fetches the results of the search of any string sent to compendium.ch search engine
async function searchByString(searchString) {
	console.log('search started...');
	// convert the searchString into a format suitable to be injected in an URL
	const newString = searchString.split(' ').join('!20');
	const searchURL = `https://compendium.ch/search/${newString}/fr`;
	// launch puppeteer browser
	/* browser = await puppeteer.connect({ browserWSEndpoint }); */
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	// optimize performance by blocking requests that are not necessary
	await page.setRequestInterception(true);
	page.on('request', request => {
		const requestUrl = request._url.split('?')[0].split('#')[0];
		if (
			blockedResourceTypes.indexOf(request.resourceType()) !== -1 ||
			skippedResources.some(resource => requestUrl.indexOf(resource) !== -1)
		) {
			request.abort();
		} else {
			request.continue();
		}
	});

	await page.goto(searchURL);

	const trSelector = '#ctl00_MainContent_ucProductFullSearch1_gvwProducts > tbody > tr';
	// await page load
	await page.waitForNavigation();

	// check if results are on multiple pages (if there are more than 100 results)
	// here, we look if there is at least one pagination button
	let numberOfPages = await page.evaluate(() => {
		let paginationButtons = Array.from(document.querySelectorAll('#ctl00_Tools_divPaginationBar > a'));
		// if the length of the array is 0, that means we have one page (there are no pagination buttons), 
		// else, we have as many pages as there are pagination buttons
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