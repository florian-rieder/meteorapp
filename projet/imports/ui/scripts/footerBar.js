import { Template } from 'meteor/templating';
import '../templates/footerBar.html';

Template.footerBar.helpers({
	buttons: [
		{name: 'Profil'},
		{name: 'Pharmacie'},
		{name: 'Recherche'},
		{name: 'Scan'},
		{name: 'Aide'},
	]
})