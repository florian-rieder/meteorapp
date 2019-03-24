import { Template } from 'meteor/templating';
import { SearchResults } from '../../api/collections';

import '../templates/searchResults.html';

Template.searchResults.helpers({
	results(){
		return SearchResults.find({});
	}
})