import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

// export all the collections so that they are accessible from other files
export const Drugs = new Mongo.Collection('drugs'); // user pharmacy
export const SearchResults = new Mongo.Collection('search_results'); // search results

// wrap db methods in meteor methods to call them from the client
Meteor.methods({
	'drugs.insert' (drugData) {
		Drugs.insert(drugData);
	},
	'drugs.remove' (drug) {
		Drugs.remove(drug._id);
	},
	'drugs.removeAll' () {
		Drugs.remove({});
	},

	'search_results.insert' (searchResults) {
		SearchResults.insert(searchResults);
	},
	'search_results.removeAll' () {
		SearchResults.remove({});
	},
});