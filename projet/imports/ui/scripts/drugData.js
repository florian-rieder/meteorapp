import { Template } from 'meteor/templating';
import '../templates/drugData.html';
import { inspectDrugData, lastActivePage, fireDrugAddDialog } from '../../api/utilities.js';
import Swal from 'sweetalert2';
import { Drugs } from '../../api/collections';

Template.drugData.helpers({
	// used to determine if we should render an "add to pharmacy" button
	isNotAlreadyInPharmacy() {
		// check if there is already an instance of this drug in pharmacy
		return Drugs.find({ 'showcaseTitle': Template.instance().data.showcaseTitle }).count() == 0;
	},
	//notice formatting
	isTitleFromIndex(index) {
		return index == 0;
	},
	isOfTwoLastFromIndex(index) {
		return index > Template.instance().data.notice.length - 3;
	},
	hasNotice() {
		if (Template.instance().data.notice != undefined) {
			return Template.instance().data.notice[0] != undefined;
		}
	},
	hasImage() {
		// check if we got a path to an image
		return Template.instance().data.imgpath != null;
	},
	hasComposition() {
		return Template.instance().data.composition[0] != undefined;
	},
	displayTitle() {
		const prettyTitle = Template.instance().data.title;
		const backupTitle = Template.instance().data.showcaseTitle;
		return prettyTitle == undefined ? backupTitle : prettyTitle;
	}
});

Template.drugData.events({
	'click #backButton'() {
		// to avoid re fetching the data we already searched after an inspection
		if(lastActivePage.get().includes('search')){
			// instead of going to /search/searchquery, we go back to /search, thus displaying
			// previous search results without refetching them
			Router.go('/search');
		} else {
			history.back();
		}
		lastActivePage.set('/details');
	},
	'click #addDrugToPharmacyButton'() {
		fireDrugAddDialog(inspectDrugData.get().showcaseTitle).then(swalResult => {
			if (swalResult.value) {
				let drugData = inspectDrugData.get();
				drugData.createdAt = new Date();
				drugData.exp = swalResult.value.exp;

				Meteor.call('drugs.insert', drugData, swalResult.categoryId);
				Swal.fire({
					type: 'success',
					title: "C'est fait !",
				});
			}
		});
	}
});