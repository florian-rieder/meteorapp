import { Template } from 'meteor/templating';
import '../templates/drugData.html';
import { inspectDrugData, lastActivePage, fireDrugAddDialog } from '../../api/utilities.js';
import Swal from 'sweetalert2';

Template.drugData.helpers({
	drugData() {
		return inspectDrugData.get();
	},
	originIsSearchInspect() {
		return lastActivePage.get() == '/searching';
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
		Router.go(lastActivePage.get());
	},
	'click #addDrugToPharmacyButton'() {
		fireDrugAddDialog(inspectDrugData.get().title).then(swalResult => {
			if(swalResult.value){
				resultForEntry = {
					title: inspectDrugData.get().title,
					composition: inspectDrugData.get().composition,
					notice: inspectDrugData.get().notice,
					createdAt: new Date(),
					exp: swalResult.value,
				}
				Meteor.call('drugs.insert', resultForEntry);
				Swal.fire({
					type: 'success',
					title: "C'est fait !",
				});
			}
		});
	}
});