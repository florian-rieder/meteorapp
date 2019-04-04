import { ReactiveVar } from 'meteor/reactive-var';

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