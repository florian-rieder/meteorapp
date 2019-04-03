import { Template } from 'meteor/templating';
import { TempDrugInspected } from '../../api/collections.js';
import '../templates/drugData.html';


Template.drugData.helpers({
	drugData() {
		return TempDrugInspected.findOne({});
	},
	//notice formatting
	isTitleFromIndex(index){
		return index == 0;
	},
	isOfTwoLastFromIndex(index){
		return index > TempDrugInspected.findOne({}).notice.length-3;
	}
});