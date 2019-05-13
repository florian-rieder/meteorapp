import '../templates/drugsList.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Drugs } from '../../api/collections.js';
import { lastActivePage } from '../../api/utilities.js';

export const deleteEnabled = new ReactiveVar(false);

Template.drugsList.helpers({
	drugs() {
		// return all drugs whose _id is containd in this category's foreign keys
		return Drugs.find({ _id: { $in: Template.instance().data.extKeys } });
	},
	deleteButtonName() {
		// user is already deleting drugs
		if (deleteEnabled.get()) {
			return 'Confirmer';
		}
		// user is not already deleting drugs
		else {
			return 'Supprimer des médicaments';
		}
	}
});

Template.drugsList.events({
	'click #clearDrugs'(e) {
		e.preventDefault();
		if (deleteEnabled.get()) {
			// user is already deleting drugs
			deleteEnabled.set(false);
		} else {
			// user is not already deleting drugs
			deleteEnabled.set(true);
		}
	}
});

Template.drug.helpers({
	deleteEnabled() {
		return deleteEnabled.get();
	}
})

Template.drug.events({
	'click .drug_container'(e) {
		e.preventDefault();
		Router.go(`/details/${this._id}`);
		lastActivePage.set('/');
	},
	'click .drug_remove'(e) {
		e.preventDefault();
		Meteor.call('drugs.remove', this._id)
	}
});