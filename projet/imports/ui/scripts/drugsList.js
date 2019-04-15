import '../templates/drugsList.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Drugs } from '../../api/collections.js';
import { changeWindow, inspectDrugData } from '../../api/utilities.js';
import Swal from 'sweetalert2';

let deleteEnabled = new ReactiveVar(false);
let drugsToDelete = [];

Template.drugsList.helpers({
	drugs() {
		return Drugs.find({});
	},
	deleteButtonName() {
		// user is already deleting drugs
		if (deleteEnabled.get()) {
			return 'Confirmer';
		}
		// user is not already deleting drugs
		else {
			return 'Supprimer des médicaments';
		}
	}
});

Template.drugsList.events({
	'click #clearDrugs'(e) {
		e.preventDefault();
		// user is already deleting drugs
		if (deleteEnabled.get()) {
			if (drugsToDelete.length > 0) {
				// ask for confirmation if any drug was selected to be deleted
				Swal.fire({
					type: 'warning',
					title: "Êtes-vous sûr de vouloir supprimer ces médicaments de votre pharmacie ?",
					html: (() => {
						let displayText = '';
						drugsToDelete.forEach(drugId => {
							displayText += Drugs.findOne(drugId).title;
							displayText += '<br>';
						});
						return displayText;
					})(),
					// cancel button
					showCancelButton: true,
					cancelButtonText: 'Annuler',
					// confirm button
					confirmButtonText: 'Supprimer',
					confirmButtonColor: 'red',

				}).then(result => {
					// If the confirm button was pressed
					if (result.value) {
						// delete selected drugs
						drugsToDelete.forEach(id => Meteor.call('drugs.remove', id));
						// show complete message
						Swal.fire({
							type: 'success',
							title: "C'est fait !",
						});
					}
					// either way, reset drugsToDelete array
					drugsToDelete = [];
				});
			}
			deleteEnabled.set(false);
		}
		// user is not already deleting drugs
		else {
			deleteEnabled.set(true);
		}

	}
});
Template.drug.onCreated(() => {
	Template.instance().drugIsInDeleteList = new ReactiveVar(false);
})

Template.drug.helpers({
	deleteButtonIsVisible() {
		return deleteEnabled.get() && !Template.instance().drugIsInDeleteList.get();
	}
})

Template.drug.events({
	'click .drug_container'(e) {
		e.preventDefault();
		inspectDrugData.set(Drugs.findOne(this._id));
		changeWindow('windowNotice');
	},
	'click .drug_remove'(e) {
		e.preventDefault();
		drugsToDelete.push(this._id);
		Template.instance().drugIsInDeleteList.set(true); // this makes delete button not reappear after deletion was aborted
	}
});