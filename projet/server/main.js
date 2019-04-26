import '../imports/api/scraper.js';
import '../imports/api/collections.js';

import { Meteor } from 'meteor/meteor';
import { Categories } from '../imports/api/collections.js';
import { CategoryItem } from '../imports/api/utilities.js';

Meteor.startup(() => {
	// code to run on server at startup

	// if there are no categories, create one
	if (Categories.findOne() == undefined) {
		Categories.insert(new CategoryItem('Mes médicaments'));
	}
});
