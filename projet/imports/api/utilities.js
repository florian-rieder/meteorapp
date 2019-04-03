import { ReactiveVar } from 'meteor/reactive-var';

// This file contains js functions that we want to call from anywhere in the project
// We need to export a function variable here (export const funcName = function(){...}), 
// and we can then import it in any file with:
//
// import { funcName } from pathToThisFile;

//Pages are contained in divs, function hides all pages and displays the correct one with ID of div
export const changeWindow = function (windowID){
	let windowsArray = Array.from(document.querySelectorAll('.navWindow'));
	windowsArray.forEach((e)=>e.classList.add('hidden'));
	document.getElementById(windowID).classList.remove('hidden');
}

export let inspectDrugData = new ReactiveVar('test');