import '../templates/drugTrt.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Drugs } from '../../api/collections.js'

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
    ]
});