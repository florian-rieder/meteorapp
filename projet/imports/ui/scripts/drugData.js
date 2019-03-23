import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';

import '../../api/scraper.js';
import '../templates/drugData.html';

/* Template.drugData.onCreated(() => {
  
});
 
Template.drugData.helpers({
	title() {
		return 'title';
	},
	composition() {
		return [
			'component 1',
			'component 2',
		];
	},
	notice() {
		return 'lorem ipsum dolor sit amet';
	}
  
}); */

Template.drugData.events({
	'click #launchScraping' (e) {
		e.preventDefault();
		Meteor.call('createDrug', 'https://compendium.ch/prod/dafalgan-cpr-500-mg/fr', (error, result) => {
			console.log(result);
		});

	},
	'click #launchSearch' (e) {
		e.preventDefault();
		Meteor.call('searchDrug', document.getElementById('searchInput').value, (error, result) => {
			console.log(result);
		});
	}
})