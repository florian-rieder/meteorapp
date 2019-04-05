import '../templates/searchResults.html';
import './drugData.js';

import { Template } from 'meteor/templating';
import { changeWindow, inspectDrugData, searchResults, LoadingWheel } from '../../api/utilities';
import swal from 'sweetalert';

Template.searchResults.helpers({
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
		swal({
			title: this.title,
			text: "Voulez vous ajouter ce médicament à votre pharmacie ?",
			buttons: {
				cancel: {
					text: "Annuler",
					value: 'cancel',
					visible: 'true',
				},
				confirm: {
					text: "Confirmer",
					value: 'confirm',
				},
			}
		})
			.then(result => {
				if (result == 'confirm') {
					// show loading wheel
					LoadingWheel.show();
					const accessURL = `https://compendium.ch${this.path}`;
					//scrape data at the path specified in the entry
					Meteor.call('scrapeDrug', accessURL, (error, result) => {
						// hide loading wheel (pretty self explanatory huh ?)
						LoadingWheel.hide();
						if(result){
							console.log(result);

							// create a new object from the result object for db entry
							resultForEntry = {
								title: result.title,
								composition: result.composition,
								notice: result.notice,
								createdAt: new Date(),
							}

							Meteor.call('drugs.insert', resultForEntry);

							swal({
								title: "C'est fait !",
								icon: 'success',
							});
						}
						if (error){
							swal({
								title: "Une erreur s'est produite",
								icon: 'error',
							});
						}
						
					});
				}
			})

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
			changeWindow('windowNotice');
		});
	}
})