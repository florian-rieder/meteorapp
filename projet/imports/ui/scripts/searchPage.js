import '../templates/searchPage.html';
import '../templates/applicationLayout.html';
import './drugData.js';
import '../../api/collections.js';

import { Template } from 'meteor/templating';
import { inspectDrugData, searchResults, LoadingWheel, fireDrugAddDialog, lastActivePage } from '../../api/utilities';
import Swal from 'sweetalert2';

Template.searchPage.helpers({
	results() {
		// get all items in searchResults array
		return searchResults.get();
	},
	numberOfResults() {
		return searchResults.get().length;
	},
	hasResults() {
		return searchResults.get() != undefined;
	}
});

Template.result.events({
	'click .result_add'(e) {
		e.preventDefault();
		// display dialog window (we need to pass this.title as an argument to the fireDrugAddDialog to
		// be able to display the title in the alert)
		fireDrugAddDialog(this.title).then(swalResult => {
			// confirm button pressed
			if (swalResult.value) {
				// this whole test here is to avoid getting an error if inspectDrugData is not already set
				// if the users wants to add a drug and has not inspected any drug this session
				let drugDataCache = inspectDrugData.get();
				if (drugDataCache == undefined) {
					drugDataCache = {
						showcaseTitle: 'string that will not match any drug name'
					}
				}
				// if the drug is already in the inspectDrugData "cache"
				if (drugDataCache.showcaseTitle === this.title) {
					// we can simply copy it and not worry about scraping it again, gaining time
					let drugData = inspectDrugData.get();
					// add fields to the result object before addind it to db
					drugData.exp = swalResult.value;
					drugData.createdAt = new Date();

					console.log(drugData);
					// this is a way of calling the drugs.insert method like with Meteor.call, but that way we can return
					// the id of the newly inserted drug in the db
					const id = Meteor.apply('drugs.insert', [drugData], { returnStubValue: true });

					Swal.fire({
						type: 'success',
						title: "C'est fait !",
						confirmButtonText: 'Voir',
						showCancelButton: true,
						cancelButtonText: 'Ok',
					}).then(swalResult => {
						if (swalResult.value) { // pressed confirm button
							Router.go(`/details/${id}`);
							lastActivePage.set('/search');
						}
					});
				}
				// else we do the scraping
				else {
					// show loading wheel
					LoadingWheel.show();
					const accessURL = `https://compendium.ch${this.path}`;
					// timestamp used to measure the time duration of the scraper
					const t0 = performance.now();
					//scrape data at the path specified in the entry
					Meteor.call('scrapeDrug', accessURL, (error, result) => {
						// hide loading wheel (pretty self explanatory huh ?)
						LoadingWheel.hide();
						if (result) {
							// add fields to the result object before addind it to db
							result.exp = swalResult.value;
							result.createdAt = new Date();

							console.log(result);
							// this is a way of calling the drugs.insert method like with Meteor.call, but that way we can return
							// the id of the newly inserted drug in the db
							const id = Meteor.apply('drugs.insert', [result], { returnStubValue: true });

							Swal.fire({
								type: 'success',
								title: "C'est fait !",
								confirmButtonText: 'Voir',
								showCancelButton: true,
								cancelButtonText: 'Ok',
							}).then(swalResult => {
								if (swalResult.value) { // pressed confirm button
									Router.go(`/details/${id}`);
									lastActivePage.set('/search');
								}
							});
						}
						if (error) {
							Swal.fire({
								type: 'error',
								title: "Une erreur s'est produite",
								text: error.message,
							});
						}
						const t1 = performance.now();
						console.log(`scrape duration: ~${Math.round(t1 - t0)}ms`);
					});
				}
			}
		});
	},
	// if the user clicks the inspect button on a search result, we scrape
	// the data at seach result path and add it to TempDrugInspected to display it in drugData
	'click .result_inspect'(e) {
		e.preventDefault();
		const t0 = performance.now();
		LoadingWheel.show();
		const accessURL = `https://compendium.ch${this.path}`;
		Meteor.call('scrapeDrug', accessURL, (error, result) => {
			LoadingWheel.hide();
			if (result) {
				inspectDrugData.set(result);
				Router.go('/details');
				lastActivePage.set('/search');
			}
			if (error) {
				Swal.fire({
					title: "Une erreur s'est produite",
					text: error.message,
					type: 'error',
				});
			}
			const t1 = performance.now();
			console.log(`scraping duration: ~${Math.round(t1 - t0)}ms`);
		});
	}
})

Template.searchBar.events({
	'click .searchBar_searchButton'(e) {
		e.preventDefault();
		const query = document.querySelector('.searchBar_searchSquare').value;
		Router.go(`/search/${query}`);
		lastActivePage.set('/search');
	},
	//trigger the search when the enter key is pressed
	'keyup .searchBar_searchSquare'(e) {
		if (e.keyCode == 13) {// ENTER
			const query = document.querySelector('.searchBar_searchSquare').value;
			Router.go(`/search/${query}`);
			lastActivePage.set('/search');
		}
	}
});