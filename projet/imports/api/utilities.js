//Pages are contained in divs, function hides all pages and displays the correct one with ID of div
export const changeWindow = function (windowID){
	let windowsArray = Array.from(document.querySelectorAll('.navWindow'));
	windowsArray.forEach((e)=>e.classList.add('hidden'));
	document.getElementById(windowID).classList.remove('hidden');
}
