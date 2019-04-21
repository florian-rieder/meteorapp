import { Template } from 'meteor/templating';
import '../templates/drugData.html';
import { inspectDrugData, lastActivePage, fireDrugAddDialog } from '../../api/utilities.js';
import Swal from 'sweetalert2';
import { Drugs } from '../../api/collections';

Template.drugData.helpers({
	drugData() {
		return inspectDrugData.get();
	},
	// used to determine if we should render an "add to pharmacy" button
	isNotAlreadyInPharmacy() {
		// check if there is already an instance of this drug in pharmacy
		return Drugs.find({ 'title': inspectDrugData.get().title }).count() == 0;
	},
	//notice formatting
	isTitleFromIndex(index) {
		return index == 0;
	},
	isOfTwoLastFromIndex(index) {
		return index > inspectDrugData.get().notice.length - 3;
	},
	hasNotice() {
		if (inspectDrugData.get() != undefined) {
			return inspectDrugData.get().notice[0] != undefined;
		}
	},
	hasImage() {
		return inspectDrugData.get().imgpath != null;
	},
});

Template.drugData.events({
	'click #backButton'() {
		history.back();
	},
	'click #addDrugToPharmacyButton'() {
		fireDrugAddDialog(inspectDrugData.get().title).then(swalResult => {
			if (swalResult.value) {
				let drugData = inspectDrugData.get();
				drugData.createdAt = new Date();
				drugData.exp = swalResult.value;

				Meteor.call('drugs.insert', drugData);
				Swal.fire({
					type: 'success',
					title: "C'est fait !",
				});
			}
		});
	}
});