import {Template} from 'meteor/templating'
import '../templates/helpPage.html';

Template.helpBar.helpers({
    buttons() {
        return [
			{ name: 'Paramètres', path: 'parameters'},
			{ name: 'Contacts', path: 'contacts' },
			{ name: 'Pharmacies', path: 'nearby-stores' },
			{ name: 'Support techniques', path: 'support' },
        ]
    }
});

Template.helpPage.helpers({
	pageIs(string){
		return Template.instance().data.page === string;
	}
})

Template.contactList.helpers({
    buttons() {
        return [
            {name: 'CHUV'}
        ]
    }
});


