import { Template } from 'meteor/templating';
import '../templates/footerBar.html';
import { changeWindow, lastActivePage } from '../../api/utilities.js';

Template.footerBar.helpers({
	buttons: [
		{ name: 'Profil' },
		{ name: 'Pharmacie' },
		{ name: 'Recherche' },
		{ name: 'Scan' },
		{ name: 'Help' },
	]
})
//Changes to corresponding window after footer button press
Template.navButton.events({
	'click .navButton_button'() {
		changeWindow(`window${this.name}`);
		lastActivePage = `window${this.name}`;
	}
});

