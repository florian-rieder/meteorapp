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

//Pages are contained in divs, function hides all pages and displays the correct one with ID of div
export const changeWindow = function (windowID) {
	let windowsArray = Array.from(document.querySelectorAll('.navWindow'));
	windowsArray.forEach((e) => e.classList.add('hidden'));
	document.getElementById(windowID).classList.remove('hidden');
}

export const inspectDrugData = new ReactiveVar(undefined);
export const searchResults = new ReactiveVar(undefined);
export const lastActivePage = new ReactiveVar('windowPharmacie');

export const LoadingWheel = new LoadingWheelController();

// since we need to show this dialog at more than one place in the code, we export it as global
// to call the same function from different places.
export const fireDrugAddDialog = async function (title) {
	return await Swal.fire({
		title: title,
		text: "Voulez vous ajouter ce médicament à votre pharmacie ?",
		// with swal2, we can insert HTML inside the dialog, and recuperate the values
		// entered in inputs using preConfirm
		html:
			"EXP: <input type='number' id='swal_expInputMonth' placeholder='12' max='12' min='1'>/" +
			"<input type='number' id='swal_expInputYear' placeholder='2020'>",
		preConfirm: () => {
			const month = Number(document.getElementById('swal_expInputMonth').value);
			const year = Number(document.getElementById('swal_expInputYear').value);

			const monthStr = `${month > 10 ? '' : '0'}${month}`;

			return new Date(`${monthStr}-01-${year}`);
		},
		// cancel button
		showCancelButton: true,
		cancelButtonText: 'Annuler',
		// confirm button
		confirmButtonText: 'Confirmer',
	});
}

export const prettifyDrugTitle = function (str) {
	// table of abreviations and corresponding full length word
	const replaceTable = {
		// we use '/' to indicate that there are more than one
		// abreviation for that word, we will use it later
		'amp': 'ampoule',
		'caps': 'capsule',
		'cpr/comp/compr': 'comprimé',
		'conc': 'concentré',
		'drg/drag': 'dragée',
		'eff': 'effervescent',
		'gran': 'granulé',
		'gtt/Gtt': 'goutte',
		'orodisp': 'orodispersible',
		'pell': 'pelliculé',
		'supp': 'suppositoire',
		'sir': 'sirop',
	}
	// now we are going to separate the string into an array to be able to check each word
	// individually (we had problems with the program detecting abreviations inside words,
	// so we detected if the abreviation had spaces on each side, but then it did not work
	// with abreviations placed at the end of the string)
	str = str.split(' ');
	str.forEach((word, i, arr) => {
		Object.getOwnPropertyNames(replaceTable).forEach(abrev => {
			// split by '/' to put abreviations in an array, and separate them if there are many
			abrevArray = abrev.split('/');
			abrevArray.forEach((a) => {
				// only replace in the cases we have the abreviation surrounded by spaces, 
				// to avoid detecting abreviations inside a word
				if (word === a) {
					arr[i] = replaceTable[abrev];
				}
			});
		});
	});
	return str.join(' ');
}