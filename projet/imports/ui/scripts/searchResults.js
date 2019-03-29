import { Template } from 'meteor/templating';
import { SearchResults } from '../../api/collections';

import '../templates/searchResults.html';
import './drugData.js';

Template.searchResults.helpers({
	results() {
		// get all items in collection SearchResults
		return SearchResults.find({});
	}
})

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
	'click .result_inspect'(e) {
		e.preventDefault();
		const accessURL = `https://compendium.ch${this.path}`;
		Meteor.call('scrapeDrug', accessURL, (error, result) => {
			console.log(result);
			Meteor.call('inspected_drug.removeAll');
			Meteor.call('inspected_drug.insert', result);
		});
	}
})