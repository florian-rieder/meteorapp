//ligne qui permet de gérer des templates
import {Template} from 'meteor/templating'
import '../templates/profile.html';

Template.profile.helpers({
    /* fields: [
        {fieldName: 'sexe'},
        {fieldName: 'prénom'},
        {fieldName: 'nom'},
        {fieldName: 'age'},
    ] */
    fields() {
        return [
        {fieldName: 'sexe'},
        {fieldName: 'prénom'},
        {fieldName: 'nom'},
        {fieldName: 'age'},
        ]
    }
});

Template.field.events({
    'click button' () {//broken
        console.log(document.querySelector('.field_textInput').value)
    }
})

Template.profile.events({
    'click #btnEditPhoto': function(event, template) {
        $('.profilePhotoFile').click();
    },
    'change .profilePhotoFile': function(event, template) {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        } else {
            var $inputImage = $(event.target);
            var URL = window.URL || window.webkitURL;
            var file = event.target.files[0];
            var blobURL = URL.createObjectURL(file);
            $image = $('#cropper > img');

            $('#cropper-modal').modal();

            $('#cropper-modal').on('shown.bs.modal', function() {
                $image.cropper({
                    aspectRatio: 1.0,
                    autoCropArea: 1.0
                }).cropper('replace', blobURL);

                $inputImage.val('');
            }).on('hidden.bs.modal', function() {
                $image.cropper('destroy');
                URL.revokeObjectURL(blobURL); // Revoke url
            });
        }
    },
    'click #btnSavePhoto': function(event, template) {
        $image = $('#cropper > img');

        //Change the width and height to your desired size
        var base64EncodedImage = $image.cropper('getCroppedCanvas', {width: 10, height: 10}).toDataURL('image/jpeg');
        $('#cropper-modal').modal('hide');

        var newImage = new FS.File(base64EncodedImage);

        Images.insert(newImage, function(err, fileObj) {
            if (err) {
                console.log(err);
            } else {
                //do something after insert
            }
        });
    },
    'click #btnCancel': function(event, template) {
        $('#cropper-modal').modal('hide');
    }
});