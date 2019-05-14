import { Template } from 'meteor/templating';
import '../templates/footerBar.html';
import { lastActivePage } from '../../api/utilities';

Template.footerBar.helpers({
	buttons: [
		{ name: 'Profil', path: '/profile', imgsrc: '/images-svg/menu_profile.svg' },
		{ name: 'Pharmacie', path: '/', imgsrc: '/images-svg/menu_listes.svg'},
		{ name: 'Recherche', path: '/search', imgsrc: '/images-svg/menu_search.svg' },
		{ name: 'Scan', path: '/scan', imgsrc: '/images-svg/menu_codebarre.svg'},
		{ name: 'Help', path: '/help', imgsrc: '/images-svg/menu_assist.svg' },
	]
})
//Changes to corresponding window after footer button press
Template.navButton.events({
	'click .navButton_button'() {
		Router.go(this.path);
		lastActivePage.set(this.path);
	}
});

