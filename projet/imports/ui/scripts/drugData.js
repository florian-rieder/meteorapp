import { Template } from 'meteor/templating';
import { TempDrugInspected } from '../../api/collections.js';
import '../templates/drugData.html';
import { changeWindow, inspectDrugData, lastActivePage } from '../../api/utilities.js';

Template.drugData.helpers({
	drugData() {
		return inspectDrugData.get();
	},
	//notice formatting
	isTitleFromIndex(index){
		return index == 0;
	},
	isOfTwoLastFromIndex(index){
		return index > TempDrugInspected.findOne({}).notice.length-3;
	}
});

Template.drugData.events({
	'click #backButton' (){
		changeWindow(lastActivePage.get());
	}
})