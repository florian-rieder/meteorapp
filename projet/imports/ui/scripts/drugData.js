import { Template } from 'meteor/templating';
import '../templates/drugData.html';
import { changeWindow, inspectDrugData, lastActivePage } from '../../api/utilities.js';
import { Drugs } from '../../api/collections';

Template.drugData.helpers({
	drugData() {
		return inspectDrugData.get();
	},
	originIsSearchInspect(){
		return lastActivePage.get() == 'windowRecherche';
	},
	//notice formatting
	isTitleFromIndex(index){
		return index == 0;
	},
	isOfTwoLastFromIndex(index){
		return index > inspectDrugData.get().notice.length-3;
	}
});

Template.drugData.events({
	'click #backButton' (){
		changeWindow(lastActivePage.get());
	},
	'click #addDrugToPharmacyButton'(){
		Meteor.call('drugs.insert', inspectDrugData.get(), () => alert('Médicament ajouté à votre pharmacie'));
	}
})