import { Template } from 'meteor/templating';
import '../templates/footerBar.html';
import { changeWindow, lastActivePage } from '../../api/utilities.js';

Template.footerBar.helpers({
	buttons: [
		{ name: 'Profil', path: '/profile' },
		{ name: 'Pharmacie', path: '/'},
		{ name: 'Recherche', path: '/searching' },
		{ name: 'Scan', path: '/scan'},
		{ name: 'Help', path: '/help' },
	]
})
//Changes to corresponding window after footer button press
Template.navButton.events({
	'click .navButton_button'() {
		Router.go(this.path);
		lastActivePage.set(`window${this.name}`);
	}
});

