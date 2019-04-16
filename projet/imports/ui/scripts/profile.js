//ligne qui permet de gérer des templates
import {Template} from 'meteor/templating'
import '../templates/profile.html';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Images } from '../../api/files.js'
import { Profile } from '../../api/collections';



Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  }
});
Meteor.subscribe('files.images.all');
Template.uploadForm.events({
  'change #fileInput'(e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      const upload = Meteor.call(Images.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false));
      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          alert('File "' + fileObj.name + '" successfully uploaded');
        }
        template.currentUpload.set(false);
      });

      upload.start();
    }
  }
});





Template.profile.helpers({
    /* fields: [
        {fieldName: 'sexe'},
        {fieldName: 'prénom'},
        {fieldName: 'nom'},
        {fieldName: 'age'},
    ] */
    fields() {
        return [
        {fieldName: 'Sexe'},
        {fieldName: 'Prénom'},
        {fieldName: 'Nom'},
        {fieldName: 'Age'},
        {fieldName: 'Taille'},
        {fieldName: 'Poids'},
        {fieldName: 'Numéro AVS'},
        ]
    },

});

Template.field.events({
  
})

Template.profile.events({
    'click #confirmButton' () {
      console.log(Array.from(document.querySelectorAll('.field_textInput')).map(v => v.value))
      Meteor.call('profile.count', (error, result) => {
          console.log("got here!");
        if(!error && result === 0){
          console.log(result)
        }
        if(error){
          console.log(error)
        }
      });
    },  
  
  
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