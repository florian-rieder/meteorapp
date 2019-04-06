import '../templates/drugsList.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Drugs } from '../../api/collections.js';
import { changeWindow, inspectDrugData } from '../../api/utilities.js';
import Swal from 'sweetalert2';

Template.drugsList.helpers({
	drugs() {
		return Drugs.find({});
	},
});

Template.drugsList.events({
	'click #clearDrugs'(e) {
		e.preventDefault();
		Meteor.call('drugs.removeAll');
	}
});

Template.drug.events({
	'click .drug_inspect'(e) {
		e.preventDefault();
		inspectDrugData.set(Drugs.findOne(this._id));
		changeWindow('windowNotice');
	},
	'click .drug_remove'(e) {
		e.preventDefault();
		Swal.fire({
			type: 'warning',
			title: this.title,
			text: "Êtes vous sûr de vouloir supprimer ce médicament de votre pharmacie ?",
			// cancel button
			showCancelButton: true,
			cancelButtonText: 'Annuler',
			// confirm button
			confirmButtonText: 'Supprimer',
			confirmButtonColor: 'red',
		}).then(result => {
			// If the confirm button was pressed
			if(result.value) {
				Meteor.call('drugs.remove', this);
			}
		});
	}
});