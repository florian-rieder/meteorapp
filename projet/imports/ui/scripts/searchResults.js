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
	//remove a search result when user clicks on it (test)
	'click .result_container'() {
		const accessURL = `https://compendium.ch${this.path}`;
		console.log(accessURL);
		
		Template.drugData.data = Meteor.call('scrapeDrug', accessURL, (error, result) => {
			console.log(result);
			Meteor.call('drugs.insert', result);
			return result;
		});
	}
})