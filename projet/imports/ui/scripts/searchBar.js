import { Template } from "meteor/templating";
import '../../api/collections.js';
import '../templates/searchBar.html';
import { searchResults } from "../../api/utilities.js";

Template.searchBar.events({
	'click #searchBar_searchButton'(e) {
		e.preventDefault();
		/* call searchDrug with the value of the text input, log the result */
		Meteor.call('searchDrug', document.getElementById('searchBar_searchSquare').value, (error, result) => {
			console.log(result.length + ' results');
			/* add all the results of the search to SearchResults */
			searchResults.set(result);
		});
	}
})