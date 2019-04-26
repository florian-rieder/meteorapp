import { Meteor } from 'meteor/meteor';
import Swal from 'sweetalert2';
import { lastActivePage, search, inspectDrugData } from '../../api/utilities.js';

import '../templates/footerBar.html';
import '../templates/drugsList.html';
import '../templates/helpPage.html';
import '../templates/searchPage.html';
import '../scripts/footerBar.js';
import '../templates/drugData.html';
import { Drugs, Profile, Categories } from '../../api/collections.js';


// routes definition using Iron:router

Router.configure({
	layoutTemplate: 'applicationLayout',
	notFoundTemplate: '404-NOT-FOUND',
});

Router.route('/', function () {
	this.render('drugCategories');
	this.render('footerBar', { to: 'footer' });
});

Router.route('/category/:_id', function () {
	this.render('drugsList', {
		data: Categories.findOne(this.params._id)
	});
	this.render('footerBar', { to: 'footer' });
});

// access an url with a search query launches search for said query
Router.route('/search/:searchquery', function () {
	this.render('searchPage', {
		data: () => {
			return { searchQuery: this.params.searchquery };
		}
	});
	search(this.params.searchquery);

	this.render('footerBar', { to: 'footer' });
});

Router.route('/search', function () {
	this.render('searchPage');
	this.render('footerBar', { to: 'footer' });
});

Router.route('/scan', function () {
	this.render('quagScan');
	this.render('footerBar', { to: 'footer' });
});

Router.route('/help', function () {
	Router.go('/help/contacts');
});

Router.route('/help/:subPage', function () {
	this.render('helpPage', {
		data: { page: this.params.subPage },
	});
	this.render('footerBar', { to: 'footer' });
});

Router.route('/details', function () {
	this.render('drugData', {
		data: inspectDrugData.get()
	});
	this.render('footerBar', { to: 'footer' });
});

Router.route('/details/:_id', function () {
	this.render('drugData', {
		data: Drugs.findOne({ _id: this.params._id })
	});
	this.render('footerBar', { to: 'footer' });
});


Router.route('/profile', function () {
	// Show dialog on page enter if user has no profile
	Meteor.call('profile.count', (error, count) => {
		if (!error && count === 0) {
			// if the user has not made a profile yet, show a dialog asking if the user wants to create one
			Swal.fire({
				type: 'warning',
				title: "Aucun profil détecté ! Souhaitez-vous en créer un ?",
				// cancel button
				showCancelButton: true,
				cancelButtonText: 'Non',
				// confirm button
				confirmButtonText: 'Oui !',
				confirmButtonColor: 'green',

			}).then(result => {
				// If the confirm button was pressed
				if (result.value) {
					// remove hidden tag
					document.getElementById('profile_container').classList.remove('hidden');
				}
			});
		} else {
			let profileObj = Profile.findOne();
			/* for(let i=0; i<8; ++i) {

			} */
			document.getElementById('profile_container').classList.remove('hidden');
		}
		if (error) {
			console.error(error);
		}
	});
	this.render('profile');
	this.render('footerBar', { to: 'footer' });
});