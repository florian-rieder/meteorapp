//ligne qui permet de gérer des templates
import {Template} from 'meteor/templating'
import '../templates/profile.html';

Template.profile.helpers({
    /* fields: [
        {fieldName: 'sexe'},
        {fieldName: 'prénom'},
        {fieldName: 'nom'},
        {fieldName: 'age'},
    ] */
    fields() {
        return [
        {fieldName: 'Sexe'},
        {fieldName: 'Prénom'},
        {fieldName: 'Nom'},
        {fieldName: 'Age'},
        {fieldName: 'Taille'},
        {fieldName: 'Poids'},
        {fieldName: 'Numéro AVS'},
        ]
    }
});

Template.field.events({
    'click button' () {//broken
        console.log(document.querySelector('.field_textInput').value)
    }
})