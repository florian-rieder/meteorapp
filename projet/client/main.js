import '../imports/ui/body.js';

Push.Configure({
    android: {
      senderID: 111111111111,
      alert: true,
      badge: true,
      sound: true,
      vibrate: true,
      clearNotifications: true
      // icon: '',
      // iconColor: ''
    },
    ios: {
      alert: true,
      badge: true,
      sound: true
    }
  });