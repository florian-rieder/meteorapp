import '../templates/drugTrt.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Drugs } from '../../api/collections.js'

Template.drugTrt.helpers({
    weekDays: [
        {day: 'Lun'},
        {day: 'Mar'},
        {day: 'Mer'},
        {day: 'Jeu'},
        {day: 'Ven'},
        {day: 'Sam'},
        {day: 'Dim'},

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
        {time: '18h00'},
        {time: '20h00'},
        {time: '22:00'},
    ]
});