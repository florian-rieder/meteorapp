import { Template } from 'meteor/templating';
import '../templates/drugData.html';
import { inspectDrugData, lastActivePage, fireDrugAddDialog } from '../../api/utilities.js';
import Swal from 'sweetalert2';
import { Drugs } from '../../api/collections';

Template.drugData.helpers({
	// used to determine if we should render an "add to pharmacy" button
	isNotAlreadyInPharmacy() {
		// check if there is already an instance of this drug in pharmacy
		return Drugs.find({ 'showcaseTitle': Template.instance().data.showcaseTitle }).count() == 0;
	},
	hasNotice() {
		if (Template.instance().data.notice != undefined) {
			return Template.instance().data.notice[0] != undefined;
		} else {
			return false;
		}
	},
	hasImage() {
		// check if we got a path to an image
		return Template.instance().data.imgpath != null;
	},
	hasComposition() {
		return Template.instance().data.composition[0] != undefined;
	},
	displayTitle() {
		const prettyTitle = Template.instance().data.title;
		const backupTitle = Template.instance().data.showcaseTitle;
		return prettyTitle == undefined ? backupTitle : prettyTitle;
	},
	// this function takes the notice array and outputs html code for it
	renderNotice() {
		const notice = Template.instance().data.notice;
		let HTMLString = '';
		// for each paragraph (element in the notice array) create a div
		notice.forEach(paragraph => {
			HTMLString += '<div>'
			// then, render recursively all nodes in the paragraph
			paragraph.forEach(el => renderItem(el));
			HTMLString += '</div>';
		});
		return HTMLString;

		// this function takes a notice item ({name: <nodeName>, value: <string> or <array of child nodes>})
		// and adds it to the HTMLString in HTML code, and does it recursively.
		function renderItem(item) {
			const name = item.name;
			const value = item.value;
			// if the value of the current item is an array (-> there are child nodes to the current node)
			if (Array.isArray(value)) {
				HTMLString += `<${name}>`;
				// render children
				value.forEach(el => {
					renderItem(el);
				});
				HTMLString += `</${name}>`;
			} 
			// if the value of the current node is a string, simply render it, we're at the end of one branch
			else {
				HTMLString += `<${name}>${value}</${name}>`;
			}
		}
	}
});

Template.drugData.events({
	'click #backButton'() {
		// to avoid re fetching the data we already searched after an inspection
		if (lastActivePage.get().includes('search')) {
			// instead of going to /search/searchquery, we go back to /search, thus displaying
			// previous search results without refetching them
			Router.go('/search');
		} else {
			history.back();
		}
		lastActivePage.set('/details');
	},
	'click #addDrugToPharmacyButton'() {
		fireDrugAddDialog(inspectDrugData.get().showcaseTitle).then(swalResult => {
			if (swalResult.value) {
				let drugData = inspectDrugData.get();
				drugData.createdAt = new Date();
				drugData.exp = swalResult.value.exp;

				Meteor.call('drugs.insert', drugData, swalResult.value.categoryId);
				Swal.fire({
					type: 'success',
					title: "C'est fait !",
					buttonsStyling: false,
					customClass: swalCustomClasses,
				});
			}
		});
	}
});