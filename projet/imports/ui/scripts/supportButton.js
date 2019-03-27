import { Template } from "meteor/templating";
import '../../api/collections.js';
import '../templates/supportButton.html'
import { Meteor } from "meteor/meteor";
Template.serachButton.events({
    'click #supportButton_Button' (e) {
        e.preventDefault();
        Meteor.call()
    }
})