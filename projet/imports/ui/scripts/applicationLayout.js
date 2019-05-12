import '../templates/footerBar.html';
import '../templates/drugsList.html';
import '../templates/helpPage.html';
import '../templates/searchPage.html';
import '../scripts/footerBar.js';
import '../templates/drugData.html';

import { search, inspectDrugData } from '../../api/utilities.js';
import { Drugs, Profile, Categories } from '../../api/collections.js';
import { startScanner, scannerIsRunning, stopScanner } from './quagga';


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

	// added small delay because Quagga would throw an error because of the target selector not being loaded yet
	setTimeout(startScanner, 50);
}, {
	onStop: function() {
		// when user leaves the page
		if(scannerIsRunning) {
			stopScanner();
		}
}
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
	this.render('profile',{data: Profile.findOne()});
	this.render('footerBar', { to: 'footer' });
});