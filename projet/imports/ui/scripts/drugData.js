import { Template } from 'meteor/templating';
import '../templates/drugData.html';
import { changeWindow, inspectDrugData, lastActivePage } from '../../api/utilities.js';
import swal from 'sweetalert';

Template.drugData.helpers({
	drugData() {
		return inspectDrugData.get();
	},
	originIsSearchInspect() {
		return lastActivePage.get() == 'windowRecherche';
	},
	//notice formatting
	isTitleFromIndex(index) {
		return index == 0;
	},
	isOfTwoLastFromIndex(index) {
		return index > inspectDrugData.get().notice.length - 3;
	},
	hasNotice(){
		if(inspectDrugData.get() != undefined){
			return inspectDrugData.get().notice[0] != undefined;
		}
	}
});

Template.drugData.events({
	'click #backButton'() {
		changeWindow(lastActivePage.get());
	},
	'click #addDrugToPharmacyButton'() {
		Meteor.call('drugs.insert', inspectDrugData.get(), () => {
			swal({
				title: "C'est fait !",
				icon: 'success',
			});
		});
	}
});