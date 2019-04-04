// Importer tous les fichers .js externes
import './body.html';

import './scripts/searchBar.js';
import './scripts/drugData.js';
import './scripts/drugsList.js';
import './scripts/searchResults.js';
import './scripts/quagga.js';
import './scripts/profile.js';
import './scripts/cropper.js';
import '../api/files.js';
import './scripts/helpPage.js';
import './scripts/footerBar.js';

import { Template } from 'meteor/templating';
import { changeWindow } from '../api/utilities';

Template.body.events({
	'click #body_headerLogo'(e){
		e.preventDefault();
		changeWindow('windowPharmacie');
	}
});
