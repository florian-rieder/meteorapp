import {Template} from 'meteor/templating'
import '../templates/helpPage.html';

Template.helpPage.helpers({
    buttons() {
        return [
        { name: 'Paramétres' },
        { name: 'Contacts' },
        { name: 'Pharmacies' },
        { name: 'Support techniques' },
        ]
    }
});

Template.helpButton.events({

    

})
