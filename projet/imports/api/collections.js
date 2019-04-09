import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

// export all the collections so that they are accessible from other files
export const Drugs = new Mongo.Collection('drugs'); // user pharmacy

// wrap db methods in meteor methods to call them from the client
// note: i'm not sure we event need them to be wrapped like that - florian
Meteor.methods({
	'drugs.insert' (drugData) {
		Drugs.insert(drugData);
	},
	'drugs.remove' (id) {
		Drugs.remove(id);
	},
	'drugs.removeAll' () {
		Drugs.remove({});
	},
});