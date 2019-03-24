import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Drugs = new Mongo.Collection('drugs');
export const SearchResults = new Mongo.Collection('search_results');

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
	}
});