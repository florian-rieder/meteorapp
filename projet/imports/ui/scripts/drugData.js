import { Template } from 'meteor/templating';
import '../templates/drugData.html';
import { changeWindow, inspectDrugData } from '../../api/utilities.js';


Template.drugData.helpers({
	drugData() {
		return inspectDrugData.get();
	},
	//notice formatting
	isTitleFromIndex(index){
		return index == 0;
	},
	isOfTwoLastFromIndex(index){
		return index > inspectDrugData.notice.length-3;
	}
});

Template.drugData.events({
	'click #backButton' (){
		changeWindow('windowRecherche');
	}
})