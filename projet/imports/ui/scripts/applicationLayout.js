import '../templates/applicationLayout.html';
import '../templates/footerBar.html';
import '../templates/drugsList.html';
import '../scripts/footerBar.js';

Router.configure({
    layoutTemplate: 'applicationLayout'
  });   

  Router.route('/', function () {
    this.render('drugsList');
    this.render('footerBar', {to: 'footer'});
});

Router.route('/profile', function () {
    this.render('profile');
    this.render('footerBar', {to: 'footer'});
  });
  
  Router.route('/searching', function(){
	this.render('searchPage');
	this.render('footerBar', {to: 'footer'});
});

Router.route('/scan', function(){
	this.render('quagScan');
	this.render('footerBar', {to: 'footer'});
});

Router.route('/help', function(){
    this.render('helpPage');
    this.render('footerBar', {to: 'footer'});
});