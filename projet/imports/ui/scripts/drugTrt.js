import '../templates/drugTrt.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { lastActivePage } from '../../api/utilities.js';

let grid = new ReactiveVar(undefined);
let currentDrug = undefined;

Template.drugTrt.helpers({
	weekDays: [
		{ day: 'L' },
		{ day: 'M' },
		{ day: 'M' },
		{ day: 'J' },
		{ day: 'V' },
		{ day: 'S' },
		{ day: 'D' },
	],
	grid() {
		// setup variables in helper, because for some reason it doesn't work in onCreated
		currentDrug = Template.instance().data;
		grid.set(Template.instance().data.treatmentGrid);
		// return grid
		return grid.get();
	},
	getTime(index) {
		let timeStamps = [
			{ time: '00:00' },
			{ time: '02:00' },
			{ time: '04:00' },
			{ time: '06:00' },
			{ time: '08:00' },
			{ time: '10:00' },
			{ time: '12:00' },
			{ time: '14:00' },
			{ time: '16:00' },
			{ time: '18:00' },
			{ time: '20:00' },
			{ time: '22:00' },
		];
		return timeStamps[index].time;
	}
});

Template.hourCell.helpers({
	isChecked() {
		return Template.instance().data.checked;
	}
})

Template.hourCell.events({
	'click .cell'(e) {
		e.preventDefault();
		let data = Template.instance().data;

		// toggle checked boolean
		if (data.checked) {
			data.checked = false;
		} else {
			data.checked = true;
		}

		// modify in grid
		let totalGrid = grid.get();
		totalGrid[data.pos.time][data.pos.day] = data;
		grid.set(totalGrid);

		// update drug in db
		currentDrug.treatmentGrid = grid.get();
		Meteor.call('drugs.update', currentDrug);
		
	},
})

Template.drugTrt.events({
	'click #backButton'() {
		lastActivePage.set(`/treatment/${currentDrug._id}`);
		Router.go(`/details/${currentDrug._id}`);
	}
})