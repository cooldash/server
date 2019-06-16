// This defines a starting set of data to be loaded if the app is loaded with an empty db.
// import './fixtures.js';
//
// // This file configures the Accounts package to define the UI of the reset password email.
// import './reset-password-email.js';
//
// // Set up some rate limiting and other important security settings.
import './security';
import './settings';

import './unhandled-promise';
import './syslog';
import './email';

import './fixtures';
import migrate from './migrations';

import { saveCollected } from '../i18n';
//
// // This defines all the collections, publications and methods that the application provides
// // as an API to the client.
// import './register-api.js';
//
import '../utils/promise-sequence';

// import '../tree/server';
import '../mods/server';
// import '../common';

import { restart } from './restart-server';
restart();

migrate();
// save collected i18n strings to file to collect with lingui
saveCollected();
