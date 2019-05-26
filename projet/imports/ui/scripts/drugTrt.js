import '../templates/drugTrt.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Drugs } from '../../api/collections.js';

let grid = new ReactiveVar([]);

Template.drugTrt.onCreated(() => {
	grid.set(Template.instance().data);
	console.log(grid.get());
})

Template.drugTrt.helpers({
    weekDays: [
        {day: 'L'},
        {day: 'M'},
        {day: 'M'},
        {day: 'J'},
        {day: 'V'},
        {day: 'S'},
        {day: 'D'},

    ],
    timeStamp: [
        {time: '00:00'},
        {time: '02:00'},
        {time: '04:00'},
        {time: '08:00'},
        {time: '10:00'},
        {time: '12:00'},
        {time: '14:00'},
        {time: '16:00'},
        {time: '18:00'},
        {time: '20:00'},
        {time: '22:00'},
		],
		test(){
			return grid.get();
		},
		getTime(index){
			let timeStamps = [
        {time: '00:00'},
        {time: '02:00'},
				{time: '04:00'},
				{time: '06:00'},
        {time: '08:00'},
        {time: '10:00'},
        {time: '12:00'},
        {time: '14:00'},
        {time: '16:00'},
        {time: '18:00'},
        {time: '20:00'},
        {time: '22:00'},
		];
		return timeStamps[index].time;
		}
});

Template.hourCell.helpers({
	isChecked(){
		return Template.instance().data.checked;
	}
})

Template.hourCell.events({
	'click .cell'(e){
		e.preventDefault();
		let data = Template.instance().data;

		if(data.checked){
			data.checked = false;
		} else {
			data.checked = true;
		}
		// modify in grid
		let totalGrid = grid.get();
		totalGrid[data.pos.time][data.pos.day] = data;
		grid.set(totalGrid);
		console.log(grid.get());
	}
})