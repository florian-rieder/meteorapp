import { ReactiveVar } from 'meteor/reactive-var';
import Swal from 'sweetalert2';

// this is a class with a few methods that we can use as an """API""" to controll the
// loading wheel image
class LoadingWheelController{
	show(){
		document.getElementById('loadingWheel').classList.remove('hidden');
	}
	hide(){
		document.getElementById('loadingWheel').classList.add('hidden');
	}
}

//Pages are contained in divs, function hides all pages and displays the correct one with ID of div
export const changeWindow = function (windowID){
	let windowsArray = Array.from(document.querySelectorAll('.navWindow'));
	windowsArray.forEach((e)=>e.classList.add('hidden'));
	document.getElementById(windowID).classList.remove('hidden');
}

export const inspectDrugData = new ReactiveVar(undefined);
export const searchResults = new ReactiveVar(undefined);
export const lastActivePage = new ReactiveVar('windowPharmacie');

export const LoadingWheel = new LoadingWheelController();

// since we need to show this dialog at more than one place in the code, we export it as global
// to call the same function from different places.
export const fireDrugAddDialog = async function (title){
	return await Swal.fire({
		title: title,
		text: "Voulez vous ajouter ce médicament à votre pharmacie ?",
		// with swal2, we can insert HTML inside the dialog, and recuperate the values
		// entered in inputs using preConfirm
		html:
			"EXP: <input type='number' id='swal_expInputMonth' placeholder='12' max='12' min='1'>/" +
			"<input type='number' id='swal_expInputYear' placeholder='2020'>",
		preConfirm: () => {
			return {
				month: document.getElementById('swal_expInputMonth').value,
				year: document.getElementById('swal_expInputYear').value
			};
		},
		// cancel button
		showCancelButton: true,
		cancelButtonText: 'Annuler',
		// confirm button
		confirmButtonText: 'Confirmer',
	})
}