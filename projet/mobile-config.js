import {SENDER_ID} from './imports/api/credentials.js'
// This section sets up some basic app metadata, the entire section is optional.
App.info({
	name: 'Medintake',
	description: 'Your mobile pharmacy',
	website: 'http://github.com/Sergenti/meteorapp'
});

// Set PhoneGap/Cordova preferences.
App.setPreference('BackgroundColor', '0xffffffff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
z

App.configurePlugin('cordova-plugin-camera', {
	'CAMERA_USAGE_DESCRIPTION': 'Pour scanner des codes barres'
});

// Add custom tags for a particular PhoneGap/Cordova plugin to the end of the
// generated config.xml. 'Universal Links' is shown as an example here.
App.appendToConfig(`

`);
App.configurePlugin('phonegap-plugin-push', {
	SENDER_ID: SENDER_ID
  });