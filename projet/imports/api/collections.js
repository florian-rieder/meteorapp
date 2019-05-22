import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

// export all the collections so that they are accessible from other files
export const Drugs = new Mongo.Collection('drugs'); // user pharmacy
export const Profile = new Mongo.Collection('profile');
export const Categories = new Mongo.Collection('categories'); // categories in which the user can put his drugs
export const Pharmacies = new Mongo.Collection('pharmacies');
export const Contacts = new Mongo.Collection('contacts');

// wrap db methods in meteor methods to call them from the client
// note: i'm not sure we even need them to be wrapped like that

// Drugs
Meteor.methods({
	'drugs.insert'(drugData, targetCategoryId) {
		// insert drug and get its id
		const drugId = Drugs.insert(drugData);
		// add the id to the external keys of targeted category
		Meteor.call('categories.addExtKey', targetCategoryId, drugId);

		return drugId;
	},
	'drugs.remove'(id) {
		Drugs.remove(id);
		// remove foreign key for this drug from all categories
		Categories.find().forEach(cat => {
			Meteor.call('categories.removeExtKey', cat._id, id);
		});
	},
	'drugs.removeAll'() {
		Drugs.remove({});
		Categories.find().forEach(cat => {
			Meteor.call('categories.removeExtKey', cat._id, id);
		});
	},
});

// Profile
Meteor.methods({
	'profile.insert'(profileArray) {
		Profile.insert(profileArray);
	},
	'profile.remove'() {
		Profile.remove({});
	},
	'profile.count'() {
		return Profile.find().count();
	},
	'profile.update'(id, profile) {
		Profile.update( 
			{_id: id},
			profile
		);
	}
});

// Categories
Meteor.methods({
	'categories.insert'(categoryObject) {
		return Categories.insert(categoryObject);
	},
	'categories.addExtKey'(categoryId, drugId) {
		Categories.update(
			{ _id: categoryId },
			{ $push: { extKeys: drugId } }
		);
	},
	'categories.removeExtKey'(categoryId, drugId) {
		Categories.update(
			{ _id: categoryId },
			{ $pull: { extKeys: drugId } }
		);
	},
	'categories.remove'(categoryId) {
		let category = Categories.findOne(categoryId);
		category.extKeys.forEach((key) => Drugs.remove(key));
		Categories.remove(categoryId);
	}
});

// Pharmacies

Meteor.methods({
	'pharmacies.insert'(pharmacy){
		Pharmacies.insert(pharmacy)
	},
	'pharmacies.remove' (id){
		Pharmacies.remove(id);
	}
})

// Contacts

Meteor.methods({
	'contacts.insert'(contact){
		Contacts.insert(contact)
	},
	'contacts.remove'(id) {
		Contacts.remove(id);
	},
})

