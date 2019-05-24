import '../imports/ui/body.js';
import {SENDER_ID} from '../imports/api/credentials.js';

Push.Configure({
    android: {
      senderID: SENDER_ID,
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