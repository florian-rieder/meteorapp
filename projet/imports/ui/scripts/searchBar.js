import { Template } from "meteor/templating";
import '../../api/collections.js';
import '../templates/searchBar.html';
import { searchResults, LoadingWheel } from "../../api/utilities.js";

Template.searchBar.events({
	'click .searchBar_searchButton'(e) {
		e.preventDefault();
		//show loading wheel
		LoadingWheel.show();
		/* call searchDrug with the value of the text input, log the result */
		Meteor.call('searchDrug', document.querySelector('.searchBar_searchSquare').value, (error, result) => {
			// hide loading wheel
			LoadingWheel.hide();
			if (result) {
				console.log(result.length + ' results');
				/* add all the results of the search to SearchResults */
				searchResults.set(result);
			}
			if (error) {
				swal({
					title: "Une erreur s'est produite",
					icon: 'error',
				});
			}
		});
	}
})