//ligne qui permet de gérer des templates
import { Template } from 'meteor/templating'
import '../templates/profile.html';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Profile } from '../../api/collections';
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

Template.profile.helpers({
  fields() {
    return [
      { fieldName: 'Sexe' },
      { fieldName: 'Prénom' },
      { fieldName: 'Nom' },
      { fieldName: 'Age' },
      { fieldName: 'Taille' },
      { fieldName: 'Poids' },
      { fieldName: 'Numéro AVS' },
    ]
  }
});

Template.profile.events({
  'click #confirmButton'() {
    let profileArray = Array.from(document.querySelectorAll('.field_textInput')).map(v => v.value);
    console.log(profileArray);
    Meteor.call('profile.insert', profileArray);
    console.log('Added');
    console.log(Profile.findOne());
  }
})

