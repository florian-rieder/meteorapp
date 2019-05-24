import '../imports/api/scraper.js';
import '../imports/api/collections.js';
import '../imports/api/push.js';

import { Meteor } from 'meteor/meteor';
import { Categories, Pharmacies, Contacts } from '../imports/api/collections.js';
import { CategoryItem } from '../imports/api/utilities.js';

Meteor.startup(() => {
	// code to run on server at startup
	Push.send({
		from: 'test',
		title: 'test',
		 text: 'hello',
			android_channel_id:this.userId,		//The android channel should match the id on the client
			query: {
				userId: this.userId
			}, 
			gcm: {
			  style: 'inbox',
			  summaryText: 'There are %n% notifications'
			},          
  });  
	// if there are no categories, create one
	if (Categories.findOne() == undefined) {
		Categories.insert(new CategoryItem('Mes médicaments'));
	}
	if (Pharmacies.findOne() == undefined) {
		Pharmacies.insert({
			name: 'Pharmacie MetroFlon',
			tel: '021 318 73 10',
			address: "Place de l'Europe 5, 1003 Lausanne"
		});
		Pharmacies.insert({
			name: 'Pharmacie MetroOuchy',
			tel: '021 612 03 03',
			address: 'Place de la Navigation 6, 1006 Lausanne'
		});
	}
	if (Contacts.findOne() == undefined) {
		Contacts.insert({
			place: 'Emergency Rescue Service (Ambulance)',
			phone: '144'
		});
		Contacts.insert({
			place: 'CHUV',
			phone: '021 314 11 11'
		});
	}
});


