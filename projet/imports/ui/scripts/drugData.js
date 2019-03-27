import { Template } from 'meteor/templating';

import '../templates/drugData.html';
import '../../api/scraper.js';
import '../../api/collections.js';
import { Drugs } from '../../api/collections.js';

Template.drugData.helpers({
	data() {
		return Drugs.findOne({});
	},
	/* data: {
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
	} */
	hasData() {
		console.log(this.data != undefined);
		return this.data != undefined;
	}
});