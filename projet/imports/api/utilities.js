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
// function to replace abreviations in drug titles with full length word
export const prettifyDrugTitle = function (str) {
	// table of abreviations (couples key/values where the key is the abreviation and the value(s) is the full length word
	const replaceTable = {
		// we use '/' to indicate that there are more than one
		// abreviation for that word, we will use it later
		'amp': 'ampoule',
		'caps': 'capsule',
		'cpr/comp/compr': 'comprimé',
		'conc': 'concentré',
		'disp': 'dispersible',
		'drg/drag': 'dragée',
		'eff': 'effervescent',
		'gran': 'granulé',
		'gtt/Gtt': 'goutte',
		'inj': 'à injecter',
		'opht': 'ophtalmologique',
		'orodisp': 'orodispersible',
		'p': 'préparation pour',
		'pdr': 'poudre',
		'pell': 'pelliculé',
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
	// now we are going to separate the string into an array to be able to check each word
	// individually (we had problems with the program detecting abreviations inside words,
	// so we detected if the abreviation had spaces on each side, but then it did not work
	// with abreviations placed at the end of the string)
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
	});
	return str.join(' ');
}