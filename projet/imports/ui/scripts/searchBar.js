import { Template } from "meteor/templating";
import '../../api/collections.js';
import '../templates/searchBar.html';
import { searchResults, LoadingWheel } from "../../api/utilities.js";

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
				swal({
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
			swal({
				title: "Une erreur s'est produite",
				icon: 'error',
			});
		}
	});
}