
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Drugs } from '../../api/collections.js';

import '../templates/drugsList.html';

Template.drugsList.helpers({
	drugs(){
		return Drugs.find({});
	},
});

Template.drugsList.events({
	'click #addDrug' () {
		Meteor.call('drugs.insert', {title: 'drug'});
	},
	'click #clearDrugs' () {
		Meteor.call('drugs.removeAll');
	}
})