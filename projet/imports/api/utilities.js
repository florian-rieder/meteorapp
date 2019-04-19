import { ReactiveVar } from 'meteor/reactive-var';
import Swal from 'sweetalert2';

// this is a class with a few methods that we can use as an """API""" to controll the
// loading wheel image
class LoadingWheelController {
	show() {
		document.getElementById('loadingWheel').classList.remove('hidden');
	}
	hide() {
		document.getElementById('loadingWheel').classList.add('hidden');
	}
}

export const inspectDrugData = new ReactiveVar(undefined);
export const searchResults = new ReactiveVar(undefined);
export const lastActivePage = new ReactiveVar('/');

export const LoadingWheel = new LoadingWheelController();

// since we need to show this dialog at more than one place in the code, we export it as global
// to call the same function from different places.
export const fireDrugAddDialog = async function (title) {
	// HTML month input placeholder formatting
	const today = new Date();
	const year = today.getFullYear();
	// we add 1 to the month because getMonth() seems to be 1 month late ¯\_(ツ)_/¯
	let month = (today.getMonth() + 1).toString();
	if(month.length < 2){
		// add a zero at the start of month string (to format it for the month input)
		month = month.padStart(2, '0');
	}

	return await Swal.fire({
		title: title,
		text: "Voulez vous ajouter ce médicament à votre pharmacie ?",
		// with swal2, we can insert HTML inside the dialog, and yield the values
		// entered in inputs using preConfirm()
		html:
			// should we disallow the user to enter an expiration date that's already past ?
			// or should we let them enter it and then notify them that it's expired ?
			`EXP: <input type='month' id='swal_expInputMonth' value='${year}-${month}'>`,
		preConfirm: () => {
			// get input data and format it
			const month = document.getElementById('swal_expInputMonth').value;
			return new Date(month);
		},
		// cancel button
		showCancelButton: true,
		cancelButtonText: 'Annuler',
		// confirm button
		confirmButtonText: 'Confirmer',
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
	str.forEach((word, i, arr) => {
		// iterate through the replaceTable properties
		Object.getOwnPropertyNames(replaceTable).forEach(abrev => {
			// split by '/' to put abreviations in an array, or separate them if there are many
			abrevArray = abrev.split('/');
			abrevArray.forEach((a) => {
				// only replace in the cases we have the abreviation surrounded by spaces, 
				// to avoid detecting abreviations inside a word
				if (word === a) {
					arr[i] = replaceTable[abrev];
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