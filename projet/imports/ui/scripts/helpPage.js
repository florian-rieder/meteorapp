import {Template} from 'meteor/templating'
import '../templates/helpPage.html';
import { Pharmacies, Contacts } from '../../api/collections';
import Swal from 'sweetalert2';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

const contactDeleteEnabled = new ReactiveVar(false);

Template.helpBar.helpers({
    buttons() {
        return [
			{ name: 'Paramètres', path: 'parameters'},
			{ name: 'Contacts', path: 'contacts' },
			{ name: 'Pharmacies', path: 'nearby-stores' },
			{ name: 'Support techniques', path: 'support' },
			{ name: 'F à Q', path: 'faq' },
        ]
    }
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
	}
})

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
		// user is already deleting drugs
		if (contactDeleteEnabled.get()) {
			return 'Confirmer';
		}
		// user is not already deleting drugs
		else {
			return 'Supprimer des contacts';
		}
	}
})

Template.stores.events({
	'click #stores_add'(e){
		e.preventDefault();
		Swal.fire({
			title: 'Ajouter une pharmacie',
			html: (() => {
				let HTMLString = "<input type='text' class='form-control' id='swal-input_name'>"
				HTMLString += "<input type='tel' class='form-control' id='swal-input_tel'>"
				HTMLString += "<input type='text' class='form-control' id='swal-input_address'>"
				return HTMLString;
			})(),
			preConfirm(){
				let name = document.getElementById('swal-input_name').value
				let tel = document.getElementById('swal-input_tel').value
				let address = document.getElementById('swal-input_address').value

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
	}
})

Template.contactList.events({
	'click #contacts_add'(e){
		e.preventDefault();
		Swal.fire({
			title: 'Ajouter un contact',
			html: (() => {
				let HTMLString = "<input type='text' class='form-control' id='swal-input_place'>"
				HTMLString += "<input type='tel' class='form-control' id='swal-input_phone'>"
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
				// user is already deleting drugs
				contactDeleteEnabled.set(false);
			} else {
				// user is not already deleting drugs
				contactDeleteEnabled.set(true);
		}
	}
});

Template.contact.events({
	'click .contact_remove'(e){
		e.preventDefault();
		Meteor.call('contacts.remove', this._id);
	}
})