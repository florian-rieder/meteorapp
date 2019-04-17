import '../templates/searchPage.html';
import '../templates/applicationLayout.html';
import './drugData.js';
import '../../api/collections.js';
import { Template } from 'meteor/templating';
import { changeWindow, inspectDrugData, searchResults, LoadingWheel, fireDrugAddDialog } from '../../api/utilities';
import Swal from 'sweetalert2';

Template.searchPage.helpers({
	results() {
		// get all items in collection SearchResults
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
			console.log(swalResult);
			// confirm button pressed
			if (swalResult.value) {
				// show loading wheel
				LoadingWheel.show();
				const accessURL = `https://compendium.ch${this.path}`;
				//scrape data at the path specified in the entry
				Meteor.call('scrapeDrug', accessURL, (error, result) => {
					// hide loading wheel (pretty self explanatory huh ?)
					LoadingWheel.hide();
					if (result) {
						// create a new object from the result object for db entry
						resultForEntry = {
							title: result.title,
							composition: result.composition,
							notice: result.notice,
							createdAt: new Date(),
							exp: swalResult.value,
						}

						console.log(resultForEntry);

						Meteor.call('drugs.insert', resultForEntry);

						Swal.fire({
							type: 'success',
							title: "C'est fait !",
						});
					}
					if (error) {
						Swal.fire({
							type: 'error',
							title: "Une erreur s'est produite",
							text: error.message,
						});
					}
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
			inspectDrugData.set(result);
			Router.go('/drugData');
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
			search();
		}
	}
});

function search() {
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
	});
}