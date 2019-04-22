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


App.configurePlugin('cordova-plugin-camera', {
	'CAMERA_USAGE_DESCRIPTION': 'Pour scanner des codes barres'
});

// Add custom tags for a particular PhoneGap/Cordova plugin to the end of the
// generated config.xml. 'Universal Links' is shown as an example here.
App.appendToConfig(`
	<feature name="Camera">
		<param name="android-package" value="org.apache.cordova.camera.CameraLauncher" />
	</feature>
`);