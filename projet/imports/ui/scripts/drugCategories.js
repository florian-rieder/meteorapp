import '../templates/drugCategories.html';

import { Template } from 'meteor/templating';
import { Categories } from '../../api/collections';
import Swal from 'sweetalert2';
import { CategoryItem } from '../../api/utilities';

export const catDeleteEnabled = new ReactiveVar(false);

Template.drugCategories.helpers({
	categories() {
		return Categories.find();
	},
});

Template.drugCategories.events({
	'click #drugCategories_addCategory' (e) {
		e.preventDefault();
		// stop deletion if enabled
		if(catDeleteEnabled.get()) {
			catDeleteEnabled.set(false);
		}
		Swal.fire({
			title: 'Ajouter une catégorie',
			showCancelButton: true,
			cancelButtonText: 'Annuler',
			confirmButtonText: 'Valider',
			html: (() => {
				let htmlString = '';
				htmlString += `<div class='container'>` +
				`<div class='row>` +
				`<div class='col-xs'>Nom :</div>` +
				`<div class='col-xs'><input type='text' id='swal-input_categoryName' placeholder='Mes médicaments'></div>`+
				`</div></div>`;
				return htmlString;
			})(),
			onOpen: () => {
				document.getElementById('swal-input_categoryName').focus();
			},
			preConfirm: () => {
				const input = document.getElementById('swal-input_categoryName');
				const catName = input.value;
				if(catName == ''){
					catName = input.placeholder;
				}

				return catName;
			}
		}).then((swalResult) => {
			if(swalResult.value) {
				Meteor.call('categories.insert', new CategoryItem(swalResult.value));
			}
		});
	},
	'click #drugCategories_remove' (e) {
		e.preventDefault();
		if(catDeleteEnabled.get()) {
			catDeleteEnabled.set(false);
		} else {
			catDeleteEnabled.set(true);
		}
	}
})

Template.category.helpers({
	drugsInCategory() {
		return Template.instance().data.extKeys.length;
	},
	deleteEnabled() {
		return catDeleteEnabled.get();
	}
})

Template.category.events({
	'click .category_container' (e) {
		e.preventDefault();
		if(!catDeleteEnabled.get()) {
		Router.go(`/category/${Template.instance().data._id}`);
		}
	},
	'click .category_remove' (e) {
		e.preventDefault();
		Swal.fire({
			title: `Êtes-vous sûr de vouloir supprimer ${this.name} ?`,
			text: 'Les médicaments contenus dans cette catégorie seront supprimés',
			confirmButtonText: 'Confirmer',
			showCancelButton: true,
			cancelButtonText: 'Annuler',
		}).then(swalResult => {
			if(swalResult.value) {
				Meteor.call('categories.remove', this._id);
			}
		});
	}
});