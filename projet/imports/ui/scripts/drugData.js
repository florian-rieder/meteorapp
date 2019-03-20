import { Template } from 'meteor/templating';

import '../../scraper.js'
import '../templates/drugData.html';
 
Template.drugData.helpers({
	title: () => "Hello World!"
  
});

Template.drugData.events({//not working: says 'scrapeDrug is not defined'
	'click #launchScraping' (e) {
		e.preventDefault();
		let data = scrapeDrug('https://compendium.ch/prod/co-dafalgan-cpr-eff-500-30mg/fr')
		
		console.log(data);
		this.drugData = data;
	}
})