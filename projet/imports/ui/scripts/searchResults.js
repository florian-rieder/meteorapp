import { Template } from 'meteor/templating';
import { changeWindow, inspectDrugData, searchResults } from '../../api/utilities';

import '../templates/searchResults.html';
import './drugData.js';

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
		const accessURL = `https://compendium.ch${this.path}`;
		//scrape data at the path specified in the entry
		Meteor.call('scrapeDrug', accessURL, (error, result) => {
			console.log(result);
			Meteor.call('drugs.insert', result);
		});
	},
	// if the user clicks the inspect button on a search result, we scrape
	// the data at seach result path and add it to TempDrugInspected to display it in drugData
	'click .result_inspect'(e) {
		e.preventDefault();
		const accessURL = `https://compendium.ch${this.path}`;
		Meteor.call('scrapeDrug', accessURL, (error, result) => {
			console.log(result);
			inspectDrugData.set(result);
			changeWindow('windowNotice');
		});
	}
})