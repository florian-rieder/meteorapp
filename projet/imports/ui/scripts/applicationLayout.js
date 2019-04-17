import { Meteor } from 'meteor/meteor';
import Swal from 'sweetalert2';
import { lastActivePage } from '../../api/utilities.js';
import '../templates/footerBar.html';
import '../templates/drugsList.html';
import '../templates/helpPage.html';
import '../templates/searchPage.html';
import '../scripts/footerBar.js';
import '../templates/drugData.html';

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
    Meteor.call('profile.count', (error, count) => {
        console.log("got here!");
        if (lastActivePage.get() == "/profile") {
          console.log("got here too");
          if (!error && count === 0) {
            Swal.fire({
              type: 'warning',
              title: "Aucun profil détecté ! Souhaitez-vous en créer un ?",
              // cancel button
              showCancelButton: true,
              cancelButtonText: 'Annuler',
              // confirm button
              confirmButtonText: 'Oui!',
              confirmButtonColor: 'green',
      
            }).then(result => {
              // If the confirm button was pressed
              if (result.value) {
                // delete selected drugs
                document.getElementById('profile_container').classList.remove('hidden');
                // ;
              }
            })
            if (error) {
              console.log(error)
            }
          }
        }
      });
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

Router.route('/drugData', function(){
    this.render('drugData');
    this.render('footerBar', {to: 'footer'});
})