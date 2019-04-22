import { Template } from 'meteor/templating';
import '../templates/footerBar.html';
import { lastActivePage } from '../../api/utilities';

Template.footerBar.helpers({
	buttons: [
		{ name: 'Profil', path: '/profile' },
		{ name: 'Pharmacie', path: '/'},
		{ name: 'Recherche', path: '/search' },
		{ name: 'Scan', path: '/scan'},
		{ name: 'Help', path: '/help' },
	]
})
//Changes to corresponding window after footer button press
Template.navButton.events({
	'click .navButton_button'() {
		Router.go(this.path);
		lastActivePage.set(this.path);
	}
});

