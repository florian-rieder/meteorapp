import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import '../templates/drugData.html';
import '../../api/scraper.js';
import '../../api/collections.js';

Template.drugData.events({
	'click #launchScraping' (e) {
		e.preventDefault();
		/* call scrapedrug on a fixed URL (at the moment) and insert the result in the Drugs collection */
		Meteor.call('scrapeDrug', 'https://compendium.ch/prod/dafalgan-cpr-500-mg/fr', (error, result) => {
		console.log(result);
			Meteor.call('drugs.insert', result);
		});

	},
	'click #launchSearch' (e) {
		e.preventDefault();
		/* call searchDrug with the value of the text input, log the result */
		Meteor.call('searchDrug', document.getElementById('searchInput').value, (error, result) => {
			Meteor.call('search_results.removeAll');
			console.log(result);
			result.forEach((resultEntry) => {
				Meteor.call('search_results.insert', resultEntry);
			})
		});
	}
})