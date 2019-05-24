import {Template} from 'meteor/templating'
import '../templates/helpPage.html';
import { Pharmacies, Contacts } from '../../api/collections';
import Swal from 'sweetalert2';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

const contactDeleteEnabled = new ReactiveVar(false);
const pharmacyDeleteEnabled = new ReactiveVar(false);

Template.helpBar.helpers({
    buttons: [
			{ name: 'Contacts', path: 'contacts', imgsrc: '/images-svg/contactes_icon.svg' },
			{ name: 'Pharmacies', path: 'stores', imgsrc: '/images-svg/pharma_icon.svg' },
			{ name: 'Support', path: 'support', imgsrc: '/images-svg/supp_tech_icon.svg' }
    ]
});

Template.helpPage.helpers({
	pageIs(string){
		return Template.instance().data.page === string;
	}
});

Template.stores.helpers({
	pharmacies(){
		return Pharmacies.find();
	},
	plusOne(index){
		return index + 1;
	},
	deleteEnabled() {
		return pharmacyDeleteEnabled.get();
	},
	deleteButtonName() {
		// user is already deleting pharmacies
		if (pharmacyDeleteEnabled.get()) {
			return 'Confirmer';
		}
		// user is not already deleting pharmacies
		else {
			return 'Supprimer';
		}
	}	
});

Template.contactList.helpers({
	contacts(){
		return Contacts.find();
	},
	plusOne(index){
		return index + 1;
	},
	deleteEnabled() {
		return contactDeleteEnabled.get();
	},
	deleteButtonName() {
		// user is already deleting contacts
		if (contactDeleteEnabled.get()) {
			return 'Confirmer';
		}
		// user is not already deleting contacts
		else {
			return 'Supprimer';
		}
	}
});

Template.stores.events({
	'click #stores_add'(e) {
		e.preventDefault();
		Swal.fire({
			title: 'Ajouter une pharmacie',
			html: (() => {
				let HTMLString = "<input type='text' class='form-control' id='swal-input_name' placeholder='Nom :'>"
				HTMLString += "<input type='tel' class='form-control' id='swal-input_tel' placeholder='Téléphone :'>"
				HTMLString += "<input type='text' class='form-control' id='swal-input_address' placeholder='Addresse :'>"
				return HTMLString;
			})(),
			preConfirm(){
				let name = document.getElementById('swal-input_name').value
				let tel = document.getElementById('swal-input_tel').value
				let address = document.getElementById('swal-input_address').value

				/*if(name.length == 0){
					Swal.showValidationError('Veuillez entrer un nom!');
				} else {
					
					Swal.resetValidationError();
				}*/

				return {
					name: name,
					tel: tel,
					address: address
				}
			}
		}).then((swalResult) => {
			if(swalResult.value){
				console.log(swalResult.value)
				Meteor.call('pharmacies.insert', swalResult.value);
			}
		})
	},
	'click #clearPharmacies'(e) {
		e.preventDefault();
		if (pharmacyDeleteEnabled.get()) {
			// user is already deleting pharmacies
			pharmacyDeleteEnabled.set(false);
		} else {
			// user is not already deleting pharmacies
			pharmacyDeleteEnabled.set(true);
		}
	},
	'click .pharmacies_remove'(e) {
		e.preventDefault();
		console.log(this._id)
		Meteor.call('pharmacies.remove', this._id)
	}	
});

Template.contactList.events({
	'click #contacts_add'(e){
		e.preventDefault();
		Swal.fire({
			title: 'Ajouter un contact',
			html: (() => {
				let HTMLString = "<input type='text' class='form-control' id='swal-input_place' placeholder='Nom :'>"
				HTMLString += "<input type='tel' class='form-control' id='swal-input_phone' placeholder='Téléphone :'>"
				return HTMLString;
			})(),
			preConfirm(){
				let place = document.getElementById('swal-input_place').value
				let phone = document.getElementById('swal-input_phone').value
				return {
					place: place,
					phone: phone
				}
			}
		}).then((swalResult) => {
			if(swalResult.value){
				console.log(swalResult.value)
				Meteor.call('contacts.insert', swalResult.value);
			}
		})
	}
	,'click #clearContacts'(e) {
			e.preventDefault();
			if (contactDeleteEnabled.get()) {
				// user is already deleting contacts
				contactDeleteEnabled.set(false);
			} else {
				// user is not already deleting contacts
				contactDeleteEnabled.set(true);
		}
	},
	'click .contacts_remove'(e){
		e.preventDefault();
		Meteor.call('contacts.remove', this._id)
	}
});
