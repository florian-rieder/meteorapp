import {Template} from 'meteor/templating'
import '../templates/helpPage.html';
import '../templates/applicationLayout.html';

Template.helpPage.helpers({
    buttons() {
        return [
        { name: 'Paramètres' },
        { name: 'Contacts' },
        { name: 'Pharmacies' },
        { name: 'Support techniques' },
        ]
    }
});

Template.contactList.helpers({
    buttons() {
        return [
            {name: 'CHUV'}
        ]
    }
});


