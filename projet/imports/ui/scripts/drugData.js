import '../templates/drugData.html';

import { Template } from 'meteor/templating';
import { inspectDrugData, lastActivePage, fireDrugAddDialog, swalCustomClasses, createTreatmentGrid } from '../../api/utilities.js';
import Swal from 'sweetalert2';
import { Categories, Drugs } from '../../api/collections';

Template.drugData.helpers({
	// used to determine if we should render an "add to pharmacy" button
	isNotAlreadyInPharmacy() {
		// check if there is already an instance of this drug in pharmacy
		return Drugs.find({ 'showcaseTitle': Template.instance().data.showcaseTitle }).count() == 0;
	},
	hasNotice() {
		if (Template.instance().data.notice != undefined) {
			return Template.instance().data.notice.length > 0;
		} else {
			return false;
		}
	},
	hasImage() {
		// check if we got a path to an image
		return Template.instance().data.imgpath != null;
	},
	hasComposition() {
		return Template.instance().data.composition.length > 0;
	},
	hasPackagings() {
		return Template.instance().data.packagings.length > 0;
	},
	hasFirm() {
		return Template.instance().data.firm != undefined;
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
		if (lastActivePage.get().includes('search')) {
			// instead of going to /search/searchquery, we go back to /search, thus displaying
			// previous search results without refetching them
			Router.go('/search');
		} else if (lastActivePage.get().includes('/treatment/')) {
			Router.go('/');
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
				drugData.treatmentGrid = createTreatmentGrid();

				Meteor.call('drugs.insert', drugData, swalResult.value.categoryId);
				Swal.fire({
					type: 'success',
					title: "C'est fait !",
					buttonsStyling: false,
					customClass: swalCustomClasses,
				});
			}
		});
	},
	'click #goToTreatment'(){
		Router.go(`/treatment/${this._id}`);
		lastActivePage.set('/details');
	},
	'click #moveCategory'(){
		Swal.fire({
			title: 'Déplacer vers une autre catégorie',
			html: (() => {
				let HTMLString = '<select id="swal-input_selectCategory" class="form-control">';
				Categories.find().forEach(cat => {
					HTMLString += ` <option value="${cat._id}">${cat.name}</option> `;
				})
				HTMLString += '</select>';
				return HTMLString;
			})(),
			showCancelButton: true,
			cancelButtonText: 'Annuler',
			confirmButtonText: 'Confirmer',
			buttonsStyling: false,
			customClass: swalCustomClasses,
			preConfirm(){
				// get selected category id
				const selectForm = document.querySelector('#swal-input_selectCategory');
				return selectForm.options[selectForm.selectedIndex].value;
			}
		}).then(swalResult => {
			if(swalResult.value){
				// move drug to new category
				Meteor.call('drugs.moveCategory', this._id, swalResult.value);
			}
		})
	}
});