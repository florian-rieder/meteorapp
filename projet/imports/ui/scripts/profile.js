//ligne qui permet de gérer des templates
import { Template } from 'meteor/templating'
import '../templates/profile.html';
import { ReactiveVar } from 'meteor/reactive-var';

Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  }
});

Template.profile.helpers({
  /* fields: [
      {fieldName: 'sexe'},
      {fieldName: 'prénom'},
      {fieldName: 'nom'},
      {fieldName: 'age'},
  ] */
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
  },

});

Template.profile.events({
  'click #confirmButton'() {
    console.log(Array.from(document.querySelectorAll('.field_textInput')).map(v => v.value))
  }
})

