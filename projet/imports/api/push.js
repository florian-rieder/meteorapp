import {SERVER_API_KEY} from './credentials.js';

Push.Configure({
    gcm: {
      apiKey: `${SERVER_API_KEY}`,
      projectNumber: 1
    }
})