import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Drugs } from '../../api/collections.js';

import '../templates/drugsList.html';
import { changeWindow } from '../../api/utilities.js';

Template.drugsList.helpers({
	drugs() {
		return Drugs.find({});
	},
});

Template.drugsList.events({
	'click #clearDrugs'(e) {
		e.preventDefault();
		Meteor.call('drugs.removeAll');
	}
});

Template.drug.events({
	'click .drug_inspect'(e) {
		e.preventDefault();
		let data = Drugs.findOne(this._id);
		Meteor.call('inspected_drug.removeAll');
		Meteor.call('inspected_drug.insert', data);
		changeWindow('windowNotice');
	},
	'click .drug_remove' (e) {
		e.preventDefault();
		Meteor.call('drugs.remove', this);
	}
});