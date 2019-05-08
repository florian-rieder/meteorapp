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
	stopScanIfRunning()
});

Router.route('/category/:_id', function () {
	this.render('drugsList', {
		data: Categories.findOne(this.params._id)
	});
	this.render('footerBar', { to: 'footer' });
	stopScanIfRunning()
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
	stopScanIfRunning()
});

Router.route('/search', function () {
	this.render('searchPage');
	this.render('footerBar', { to: 'footer' });
	stopScanIfRunning()
});

Router.route('/scan', function () {
	this.render('quagScan');
	this.render('footerBar', { to: 'footer' });

	// added small delay because Quagga would throw an error because of the target selector was not loaded yet
	setTimeout(startScanner, 50);
});

Router.route('/help', function () {
	Router.go('/help/contacts');
	stopScanIfRunning()
});

Router.route('/help/:subPage', function () {
	this.render('helpPage', {
		data: { page: this.params.subPage },
	});
	this.render('footerBar', { to: 'footer' });
	stopScanIfRunning()
});

Router.route('/details', function () {
	this.render('drugData', {
		data: inspectDrugData.get()
	});
	this.render('footerBar', { to: 'footer' });
	stopScanIfRunning()
});

Router.route('/details/:_id', function () {
	this.render('drugData', {
		data: Drugs.findOne({ _id: this.params._id })
	});
	this.render('footerBar', { to: 'footer' });
	stopScanIfRunning()
});


Router.route('/profile', function () {
	this.render('profile',{data: Profile.findOne()});
	this.render('footerBar', { to: 'footer' });
	stopScanIfRunning()
});


// i'd like to have a way of stopping the scanner when user goes to another page that is less ugly than this...
function stopScanIfRunning() {
	if(scannerIsRunning) {
		stopScanner();
	}
}