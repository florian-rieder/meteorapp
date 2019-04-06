import '../templates/searchBar.html';

import '../../api/collections.js';
import { Template } from "meteor/templating";
import { searchResults, LoadingWheel } from "../../api/utilities.js";
import Swal from 'sweetalert2';

Template.searchBar.events({
	'click .searchBar_searchButton'(e) {
		e.preventDefault();
		//show loading wheel
		search();
	},
	//trigger the search when the enter key is pressed
	'keyup .searchBar_searchSquare'(e) {
		if (e.keyCode == 13) {// ENTER
			search();
		}
	}
});

function search() {
	// empty searchResults (to hide results from page)
	searchResults.set(undefined);
	// show loading wheel
	LoadingWheel.show();
	/* call searchDrug with the value of the text input, log the result */
	Meteor.call('searchDrug', document.querySelector('.searchBar_searchSquare').value, (error, result) => {
		// hide loading wheel
		LoadingWheel.hide();
		if (result) {
			console.log(result.length + ' results');
			if(result[0] == undefined){
				Swal.fire({
					title: "Nous n'avons trouvé aucun résultat",
				});
				// prevents the "Nous avons trouvé 0 resultats." from showing up, since
				// we have an alert for that
				result = undefined;
			}
			/* add all the results of the search to SearchResults */
			searchResults.set(result);
		}
		if (error) {
			Swal.fire({
				title: "Une erreur s'est produite",
				text: error.message,
				type: 'error',
			});
		}
	});
}