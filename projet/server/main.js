import '../imports/api/scraper.js';
import '../imports/api/collections.js';

import { Meteor } from 'meteor/meteor';
import { Categories, Pharmacies, Contacts, Drugs } from '../imports/api/collections.js';
import { CategoryItem } from '../imports/api/utilities.js';

Meteor.startup(() => {
	// code to run on server at startup
	// add default elements to dbs
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
	// check expirations on startup (or every month, but that would need a job scheduler, which we don't have time to implement)
	checkExpirations();
	// then send notifications for expired drugs
});

function checkExpirations(){
	const today = new Date();
	let expiredDrugs = [];
	Drugs.find().forEach(drug => {
		if(drug.exp.getTime() < today.getTime()){
			expiredDrugs.push(drug);
		}
	});
	return expiredDrugs;
}