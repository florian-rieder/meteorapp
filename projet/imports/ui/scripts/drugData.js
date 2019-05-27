import '../templates/drugData.html';

import { Template } from 'meteor/templating';
import { inspectDrugData, lastActivePage, fireDrugAddDialog, swalCustomClasses, createTreatmentGrid } from '../../api/utilities.js';
import Swal from 'sweetalert2';
import { Categories, Drugs } from '../../api/collections';

let expDeleteEnabled = new ReactiveVar(false);

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
		// check if we have a "pretty" title. If not, show the "backup" title
		return prettyTitle == undefined ? backupTitle : prettyTitle;
	},
	plusOne(val) {
		return val + 1;
	},
	isExpired(index) {
		const today = new Date();
		return Template.instance().data.exp[index].getTime() < today.getTime();
	},
	getExp(index) {
		let exp = Template.instance().data.exp[index];
		return `${exp.getMonth()} / ${exp.getFullYear()}`;
	},
	deleteEnabled(){
		return expDeleteEnabled.get();
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
				drugData.exp = [swalResult.value.exp];
				drugData.treatmentGrid = createTreatmentGrid();

				Meteor.call('drugs.insert', drugData, swalResult.value.categoryId);
				Swal.fire({
					toast: true,
					type: 'success',
					title: "C'est fait !",
					position: 'top-end',
					showConfirmButton: false,
					timer: 1500
				});
			}
		});
	},
	'click #goToTreatment'() {
		Router.go(`/treatment/${this._id}`);
		lastActivePage.set('/details');
	},
	'click #moveCategory'() {
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
			preConfirm() {
				// get selected category id
				const selectForm = document.querySelector('#swal-input_selectCategory');
				return selectForm.options[selectForm.selectedIndex].value;
			}
		}).then(swalResult => {
			if (swalResult.value) {
				// move drug to new category
				Meteor.call('drugs.moveCategory', this._id, swalResult.value);
			}
		})
	},
	'click #addBox'(e) {
		e.preventDefault();
		// get template data, because we can't when in .then(() => {...})
		let drugData = Template.instance().data;

		// HTML month input placeholder formatting (from fireDrugAddDialog)
		const today = new Date();
		const year = today.getFullYear();
		// we add 1 to the month because getMonth() seems to be 1 month late ¯\_(ツ)_/¯
		let month = (today.getMonth() + 1).toString();
		// add zero padding to month so that it's always two characters long (to format it for the month input)
		month = month.padStart(2, '0');

		Swal.fire({
			title: 'Ajouter une boîte',
			html: (() => {
				let HTMLString = `<div style='text-align: left;'>EXP:</div>`;
				HTMLString += `<input type='month' id='swal-input_expirationMonth' class='form-control' value='${year}-${month}'>`;
				return HTMLString;
			})(),
			showCancelButton: true,
			cancelButtonText: 'Annuler',
			confirmButtonText: 'Confirmer',
			buttonsStyling: false,
			customClass: swalCustomClasses,
			preConfirm() {
				const expirationDate = new Date(document.getElementById('swal-input_expirationMonth').value);
				return expirationDate;
			}
		}).then(swalResult => {
			if (swalResult.value) {
				// add expiration date to exp array in drug data
				drugData.exp.push(swalResult.value);
				// update in db
				Meteor.call('drugs.update', drugData);
			}
		});
	},
	'click #removeBoxes'(e){
		e.preventDefault();
		if(expDeleteEnabled.get()){
			expDeleteEnabled.set(false);
		} else {
			expDeleteEnabled.set(true);
		}
	},
	'click .removeBox'(e){
		e.preventDefault();
		let drugData = Template.instance().data;
		// get index of currently clicked item (solution from https://forums.meteor.com/t/blaze-template-event-how-to-get-index/23609)
		let index = $(e.target).data("index");
		// remove this box
		drugData.exp.splice(index, 1);
		// update drug in db
		Meteor.call('drugs.update', drugData);
	}
});