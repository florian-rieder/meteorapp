import '../imports/api/scraper.js';
import '../imports/api/collections.js';

import { Meteor } from 'meteor/meteor';
import { Categories, Pharmacies } from '../imports/api/collections.js';
import { CategoryItem } from '../imports/api/utilities.js';

Meteor.startup(() => {
	// code to run on server at startup

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
});


