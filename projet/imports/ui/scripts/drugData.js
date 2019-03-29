import { Template } from 'meteor/templating';
import { TempDrugInspected } from '../../api/collections.js';
import '../templates/drugData.html';


Template.drugData.helpers({
	drugData() {
		return TempDrugInspected.findOne({});
	},
});