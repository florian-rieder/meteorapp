//ligne qui permet de gérer des templates
import { Template } from 'meteor/templating'
import '../templates/profile.html';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Profile } from '../../api/collections';
import Swal from 'sweetalert2';

let displayInputs = new ReactiveVar(Profile.findOne() == undefined ? false : true);
console.log(displayInputs);

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
    returnTemplate.instance().data != undefined;
  },
  getProfileField(index){
    return Template.instance().data[index];
  },
  getDisplay(){
    return displayInputs.get();
  }
});

Template.profile.events({
  'click #confirmButton'() {
    let profileArray = Array.from(document.querySelectorAll('.field_textInput')).map(v => v.value);
    Meteor.call('profile.insert', profileArray)
    displayInputs.set(false);
  },
  'click #modifyButton'() {
    displayInputs.set(true);
  }
});
