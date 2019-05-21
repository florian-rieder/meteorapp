import {Template} from 'meteor/templating'
import '../templates/helpPage.html';
import { Pharmacies } from '../../api/collections';
import Swal from 'sweetalert2';
import { Meteor } from 'meteor/meteor';

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