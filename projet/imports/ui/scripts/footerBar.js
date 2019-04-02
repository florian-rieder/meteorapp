import { Template } from 'meteor/templating';
import '../templates/footerBar.html';

Template.footerBar.helpers({
	buttons: [
		{name: 'Profil'},
		{name: 'Pharmacie'},
		{name: 'Recherche'},
		{name: 'Scan'},
		{name: 'Notice'},
	]
})
//Changes to corresponding window after footer button press
Template.navButton.events({
	'click .navButton_button' () {
		switch(this.name) {
			case 'Profil':
				changeWindow('myProfile');
				break;
			case 'Pharmacie':
				changeWindow('myPharmacy');
				break;
			case 'Recherche':
				changeWindow('searchPage');
				break;
			case 'Scan':
				changeWindow('scannerWindow');
				break;		
			case 'Notice':
				changeWindow('drugDataWindow');
		}
	} 
})
//Pages are contained in divs, function hides all pages and displays the correct one with ID of div
function changeWindow(buttonID){
	let windowsArray = Array.from(document.querySelectorAll('.navWindow'));
	console.log('Got here', windowsArray);
	windowsArray.forEach((e)=>e.classList.add('hidden'));
	document.getElementById(buttonID).classList.remove('hidden');
}


