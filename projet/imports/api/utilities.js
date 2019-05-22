import { ReactiveVar } from 'meteor/reactive-var';
import Swal from 'sweetalert2';
import { Categories } from './collections.js';

// this is a class with a few methods that we can use as an """API""" to controll the
// loading wheel image
class LoadingWheelController {
	show() {
		const spinner = document.getElementById('loadingWheel');
		if (spinner) {
			spinner.classList.remove('hidden');
		}
	}
	hide() {
		const spinner = document.getElementById('loadingWheel');
		if (spinner) {
			spinner.classList.add('hidden');
		}
	}
}

export class CategoryItem {
	constructor(name) {
		this.name = name;
		this.extKeys = [];
	}
}

export const inspectDrugData = new ReactiveVar(undefined);
export const searchResults = new ReactiveVar(undefined);
export const lastActivePage = new ReactiveVar('/');

export const LoadingWheel = new LoadingWheelController();

export const swalCustomClasses = {
	actions: 'swal-buttonsContainer d-flex justify-content-around',
	confirmButton: 'btn btn-lg btn-primary btn-swal-left',
	cancelButton: 'btn btn-lg btn-danger btn-swal-right'
};

// since we need to show this dialog at more than one place in the code, we export it as global
// to call the same function from different places.
export const fireDrugAddDialog = async function (title) {
	// HTML month input placeholder formatting
	const today = new Date();
	const year = today.getFullYear();
	// we add 1 to the month because getMonth() seems to be 1 month late ¯\_(ツ)_/¯
	let month = (today.getMonth() + 1).toString();
	// add zero padding to month so that it's always two characters long (to format it for the month input)
	month = month.padStart(2, '0');

	return await Swal.fire({
		title: title,
		text: "Voulez vous ajouter ce médicament à votre pharmacie ?",
		// with swal2, we can insert HTML inside the dialog, and yield the values
		// entered in inputs using preConfirm()
		html: (() => {
			// should we disallow the user to enter an expiration date that's already past ?
			// or should we let them enter it and then notify them that it's expired ?
			let htmlString = `<div style='text-align: left;'>EXP:</div>`;
			htmlString += `<input type='month' id='swal-input_expirationMonth' class='form-control' value='${year}-${month}'> <br>`
			htmlString += `<div style='text-align: left;'>Catégorie:</div>`;
			htmlString += `<div style="width: 100%; position: relative">`;
			// create a drop down list listing all categories for the user to select one
			htmlString += `<div style='width: calc(100% - 4em)'><select id='swal-input_select' class='form-control'>`;
			Categories.find().forEach(cat => {
				htmlString += ` <option value="${cat._id}">${cat.name}</option> `;
			});
			htmlString += `</select>`;
			// create button to add new category
			htmlString += '<div style="position: absolute; top: 3px; right: 0px;" class="d-flex flex-row align-middle">'
			htmlString += `<button id="swal-input_addCategory" class="btn btn-info btn-sm">+</button>`;
			htmlString += `<img src="/images/info_icon.png" class="infoIcon" data-toggle="tooltip" data-placement="top" data-trigger="click" title="Create new category" style='margin-left: 4px'>`;
			htmlString += '</div></div>';

			// return the generated html string
			return htmlString;
		})(),
		onOpen() { // when modal has opened
			// initialize bootstrap tooltips
			$(function () {
				$('[data-toggle="tooltip"]').tooltip();
			});

			// add listener to category add button
			$('#swal-input_addCategory').click((e) => {
				e.preventDefault();
				fireCategoryAddDialog().then(swalResult => {
					if (swalResult.value) {
						Meteor.call('categories.insert', new CategoryItem(swalResult.value));
					}
					// resume drug add dialog (launch a new one)
					fireDrugAddDialog(title);
				});
			});
		},
		preConfirm: () => {
			// get input data and format it
			const expirationDate = new Date(document.getElementById('swal-input_expirationMonth').value);
			const selectForm = document.querySelector('#swal-input_select');
			const selectedCategoryId = selectForm.options[selectForm.selectedIndex].value;

			return {
				exp: expirationDate,
				categoryId: selectedCategoryId,
			};
		},
		// cancel button
		showCancelButton: true,
		cancelButtonText: 'Annuler',
		// confirm button
		confirmButtonText: 'Confirmer',
		focusConfirm: true,
		buttonsStyling: false,
		customClass: swalCustomClasses,
	});
}

export const fireCategoryAddDialog = async function () {
	return Swal.fire({
		title: 'Ajouter une catégorie',
		showCancelButton: true,
		cancelButtonText: 'Annuler',
		confirmButtonText: 'Valider',
		buttonsStyling: false,
		customClass: swalCustomClasses,
		html: (() => {
			let htmlString = `<div class='container'>` +
				`<div class='row>` +
				`<div class='col-xs'>Nom :</div>` +
				`<div class='col-xs'><input type='text' id='swal-input_categoryName' placeholder='Mes médicaments'></div>` +
				`</div></div>`;
			return htmlString;
		})(),
		onOpen: () => {
			// focus on text input
			document.getElementById('swal-input_categoryName').focus();
		},
		preConfirm: () => {
			// get the value in input
			const input = document.getElementById('swal-input_categoryName');
			let catName = input.value;
			// if user left it empty, replace the value with the placeholder
			if (catName.length == 0) {
				catName = input.placeholder;
			}

			return catName;
		}
	});
}
// function to replace abreviations in drug titles with full length word
export const prettifyDrugTitle = function (str) {
	// table of abreviations (couples key/values where the key is the abreviation and the value(s) is the full length word
	const replaceTable = {
		// we use '/' to indicate that there are more than one
		// abreviation for that word, we will use it later
		'amp': 'ampoule',
		'bucc': 'buccal',
		'caps': 'capsule',
		'cpr/comp/compr': 'comprimé',
		'conc': 'concentré',
		'disp': 'dispersible',
		'drg/drag': 'dragée',
		'eff': 'effervescent',
		'glob': 'globule',
		'gran': 'granulé',
		'gtt/Gtt': 'goutte',
		'inj': 'à injecter',
		'opht': 'ophtalmologique',
		'orodisp': 'orodispersible',
		'p': 'préparation pour',
		'pdr': 'poudre',
		'pell': 'pelliculé',
		'refroidissem': 'refroidissements',
		'ret': 'à retardement',
		's': 'sans',
		'sir': 'sirop',
		'sol': 'solution',
		'subling': 'sublingual',
		'subst': 'substance',
		'susp': 'suspension',
		'supp': 'suppositoire',
		'vag': 'vaginal',
	}
	// now we are going to separate the string into an array to be able to check each word individually
	str = str.split(' ');
	str.forEach((word, i, string) => {
		// iterate through the replaceTable properties
		Object.getOwnPropertyNames(replaceTable).forEach(abrev => {
			// split by '/' to put abreviations in an array, or separate them if there are many
			abrevArray = abrev.split('/');
			// replace words that are abreviations with the corresponding full word
			abrevArray.forEach((a) => {
				// only replace in the cases we have the abreviation surrounded by spaces, 
				// to avoid detecting abreviations inside a word
				if (word === a) {
					string[i] = replaceTable[abrev];
				}
			});

		});

		// try to optimise it a bit by adding breaks when an abreviation is found for a word in the title
		// not working atm
		/* const abreviations = Object.getOwnPropertyNames(replaceTable);
		for (abrev in abreviations) {
			// split by '/' to put abreviations in an array, or separate them if there are many
			const abrevArray = abrev.split('/');
			for(a in abrevArray) {
				if (word === a) {
					arr[i] = replaceTable[abrev];
					console.log('break', a);
					break;
				}
			}
			console.log('first loop looping');
		}
		console.log('loop finished'); */
	});
	return str.join(' ');
}

export const search = function (query) {
	// timestamp used to measure the time duration of the scraper
	const t0 = performance.now();
	// empty searchResults (to hide results from page)
	searchResults.set(undefined);
	// show loading wheel
	LoadingWheel.show();
	/* call searchDrug with the value of the text input, log the result */
	Meteor.call('searchDrug', query, (error, result) => {
		// hide loading wheel
		LoadingWheel.hide();
		if (result) {
			console.log(result.length + ' results for query "' + query + '"');
			/* add all the results of the search to SearchResults */
			searchResults.set(result);
		}
		if (error) {
			Swal.fire({
				title: "Une erreur s'est produite",
				text: error.message,
				type: 'error',
				buttonsStyling: false,
				customClass: swalCustomClasses,
			});
		}
		const t1 = performance.now();
		console.log(`search duration: ~${Math.round(t1 - t0)}ms`);
	});
}

export const fireErrorDialog = function(error) {
	Swal.fire({
		title: "Une erreur s'est produite",
		text: error.message,
		type: 'error',
		buttonsStyling: false,
		customClass: {
			actions: 'swal-buttonsContainer d-flex justify-content-center',
			confirmButton: 'btn btn-lg btn-primary',
		}
	});
}