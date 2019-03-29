import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Drugs } from '../../api/collections.js';

import '../templates/drugsList.html';

export let selectedDrugData = {
	title: 'title',
	composition: [
		{component: 'comp 1'},
		{component: 'comp 2'},
		{component: 'comp 3'},
	],
	notice: [
		['11', '12', '13'],
		['21', '22', '23'],
		['31', '32', '33']
	]
};

Template.drugsList.helpers({
	drugs(){
		return Drugs.find({});
	},
});

Template.drugsList.events({
	'click #addDrug' () {
		Meteor.call('drugs.insert', {title: 'placeholder drug'});
	},
	'click #clearDrugs' () {
		Meteor.call('drugs.removeAll');
	}
});

Template.drug.events({
	'click .drug_inspect' (e) {
		e.preventDefault();
		let data = Drugs.findOne(this._id);
		Meteor.call('inspected_drug.removeAll');
		Meteor.call('inspected_drug.insert', data);
	}
});