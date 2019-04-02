import { Template } from 'meteor/templating';
import '../templates/footerBar.html';
import { changeWindow } from '../../api/utilities.js';

Template.footerBar.helpers({
	buttons: [
		{ name: 'Profil' },
		{ name: 'Pharmacie' },
		{ name: 'Recherche' },
		{ name: 'Scan' },
		{ name: 'Notice' },
	]
})
//Changes to corresponding window after footer button press
Template.navButton.events({
	'click .navButton_button'() {
		changeWindow(`window${this.name}`);
	}
});

