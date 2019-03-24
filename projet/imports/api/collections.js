import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Drugs = new Mongo.Collection('drugs');

Meteor.methods({
	'drugs.insert' (drugData) {
		Drugs.insert(drugData);
	},
	'drugs.remove' (drug) {
		Drugs.remove(drug._id);
	},
	'drugs.removeAll' () {
		return Drugs.remove({});
	}
});