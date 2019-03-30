import { Template } from "meteor/templating";
import '../../api/collections.js';
import '../templates/searchBar.html';

Template.searchBar.events({
	'click #searchBar_searchButton'(e) {
		e.preventDefault();
		/* call searchDrug with the value of the text input, log the result */
		Meteor.call('searchDrug', document.getElementById('searchBar_searchSquare').value, (error, result) => {
			// remove all items in SearchResults collection
			Meteor.call('search_results.removeAll');
			console.log(result.length + ' results');
			/* add all the results of the search to SearchResults */
			result.forEach((resultEntry) => {
				Meteor.call('search_results.insert', resultEntry);
			})
		});
	}
})