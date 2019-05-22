import '../templates/drugCategories.html';

import { Template } from 'meteor/templating';
import { Categories } from '../../api/collections';
import Swal from 'sweetalert2';
import { CategoryItem, fireCategoryAddDialog, swalCustomClasses } from '../../api/utilities';

export const catDeleteEnabled = new ReactiveVar(false);

Template.drugCategories.helpers({
	categories() {
		return Categories.find();
	},
	trashIc: [
		{imgsrc: '/images-svg/rubbish-bin2.svg'}
	],
});

Template.drugCategories.events({
	'click #drugCategories_addCategory'(e) {
		e.preventDefault();
		// stop deletion if enabled
		if (catDeleteEnabled.get()) {
			catDeleteEnabled.set(false);
		}
		fireCategoryAddDialog().then((swalResult) => {
			if (swalResult.value) {
				Meteor.call('categories.insert', new CategoryItem(swalResult.value));
			}
		});
	},
	'click #drugCategories_remove'(e) {
		e.preventDefault();
		$('#drugCategories_remove').toggleClass('delRed');
		if (catDeleteEnabled.get()) {
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
	'click .category_container'(e) {
		e.preventDefault();
		if (!catDeleteEnabled.get()) {
			Router.go(`/category/${Template.instance().data._id}`);
		}
	},
	'click .category_remove'(e) {
		e.preventDefault();
		Swal.fire({
			title: `Êtes-vous sûr de vouloir supprimer ${this.name} ?`,
			text: 'Les médicaments contenus dans cette catégorie seront supprimés',
			confirmButtonText: 'Confirmer',
			showCancelButton: true,
			cancelButtonText: 'Annuler',
			buttonsStyling: false,
			customClass: swalCustomClasses,
		}).then(swalResult => {
			if (swalResult.value) {
				Meteor.call('categories.remove', this._id);
			}
		});
	}
});