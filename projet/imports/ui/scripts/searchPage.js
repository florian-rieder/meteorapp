import '../templates/searchPage.html';
import '../templates/applicationLayout.html';
import './drugData.js';
import '../../api/collections.js';

import { Template } from 'meteor/templating';
import { inspectDrugData, searchResults, LoadingWheel, fireDrugAddDialog } from '../../api/utilities';
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

						Meteor.call('drugs.insert', result);

						Swal.fire({
							type: 'success',
							title: "C'est fait !",
							confirmButtonText: 'Voir',
							showCancelButton: true,
							cancelButtonText: 'Ok',
						}).then(swalResult => {
							if(swalResult.value){ // pressed confirm button
								inspectDrugData.set(result);
								Router.go('/drugData');
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
		});
	},
	// if the user clicks the inspect button on a search result, we scrape
	// the data at seach result path and add it to TempDrugInspected to display it in drugData
	'click .result_inspect'(e) {
		e.preventDefault();
		LoadingWheel.show();
		const accessURL = `https://compendium.ch${this.path}`;
		Meteor.call('scrapeDrug', accessURL, (error, result) => {
			LoadingWheel.hide();
			if(result){
				inspectDrugData.set(result);
				Router.go('/drugData');
			}
			if (error) {
				Swal.fire({
					title: "Une erreur s'est produite",
					text: error.message,
					type: 'error',
				});
			}
		});
	}
})

Template.searchBar.events({
	'click .searchBar_searchButton'(e) {
		e.preventDefault();
		//show loading wheel
		search();
	},
	//trigger the search when the enter key is pressed
	'keyup .searchBar_searchSquare'(e) {
		if (e.keyCode == 13) {// ENTER
			e.currentTarget.click();
		}
	}
});

function search() {
	// timestamp used to measure the time duration of the scraper
	const t0 = performance.now();
	// empty searchResults (to hide results from page)
	searchResults.set(undefined);
	// show loading wheel
	LoadingWheel.show();
	/* call searchDrug with the value of the text input, log the result */
	Meteor.call('searchDrug', document.querySelector('.searchBar_searchSquare').value, (error, result) => {
		// hide loading wheel
		LoadingWheel.hide();
		if (result) {
			console.log(result.length + ' results');
			if(result[0] == undefined){
				Swal.fire({
					title: "Nous n'avons trouvé aucun résultat",
				});
				// prevents the "Nous avons trouvé 0 resultats." from showing up, since
				// we have an alert for that
				result = undefined;
			}
			/* add all the results of the search to SearchResults */
			searchResults.set(result);
		}
		if (error) {
			Swal.fire({
				title: "Une erreur s'est produite",
				text: error.message,
				type: 'error',
			});
		}
		const t1 = performance.now();
		console.log(`search duration: ~${Math.round(t1-t0)}ms`);
	});
}