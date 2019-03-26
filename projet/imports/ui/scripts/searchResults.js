import { Template } from 'meteor/templating';
import { SearchResults } from '../../api/collections';

import '../templates/searchResults.html';

Template.searchResults.helpers({
	results(){
		// get all items in collection SearchResults
		return SearchResults.find({});
	}
})

Template.result.events({
	//remove a search result when user clicks on it (test)
	'click .result_container' () {
		SearchResults.remove(this._id);
	}
})