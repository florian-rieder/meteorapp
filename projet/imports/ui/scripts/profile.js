//ligne qui permet de gérer des templates
import { Template } from 'meteor/templating'
import '../templates/profile.html';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Profile } from '../../api/collections';
import Swal from 'sweetalert2';
//uncomment to clear Db 
//Meteor.call('profile.remove');

Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  }
});

Template.profile.onCreated(function () {
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
        }
      });
    } else {

    }
  });
});
Template.profile.helpers({
  fields: [
      { fieldName: 'Sexe',
        fieldId: 'sex' },
      { fieldName: 'Prénom', 
        fieldId: 'fn'},
      { fieldName: 'Nom',
        fieldId: 'ln' },
      { fieldName: 'Age',
        fieldId: 'age' },
      { fieldName: 'Taille',
        fieldId: 'hgt' },
      { fieldName: 'Poids',
        fieldId: 'wgt' },
      { fieldName: 'Numéro AVS',
        fieldId: 'avs' },
    ],
  hasProfileData() {
    return Template.instance().data != undefined;
  },
  getProfileField(index){
    return Template.instance().data[index];
  }
});

Template.profile.events({
  'click #confirmButton'() {
    let profileArray = Array.from(document.querySelectorAll('.field_textInput')).map(v => v.value);
    Meteor.call('profile.insert', profileArray);
  }
});