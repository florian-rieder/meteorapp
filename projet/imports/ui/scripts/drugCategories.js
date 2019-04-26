import '../templates/drugCategories.html';

import { Template } from 'meteor/templating';
import { Categories } from '../../api/collections';
import Swal from 'sweetalert2';
import { CategoryItem } from '../../api/utilities';

Template.drugCategories.helpers({
	categories() {
		return Categories.find();
	}
});

Template.drugCategories.events({
	'click .drugCategories_addCategory' (e) {
		e.preventDefault();
		console.log('clicked');
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
	}
})

Template.category.helpers({
	drugsInCategory() {
		return Template.instance().data.extKeys.length;
	}
})

Template.category.events({
	'click .category_container' (e) {
		e.preventDefault();
		Router.go(`/category/${Template.instance().data._id}`);
	}
});