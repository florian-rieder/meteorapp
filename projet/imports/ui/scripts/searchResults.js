import { Template } from 'meteor/templating';
import { SearchResults } from '../../api/collections';

import '../templates/searchResults.html';

Template.searchResults.helpers({
	results(){
		// get all items in collection SearchResults
		return SearchResults.find({});
	}
})