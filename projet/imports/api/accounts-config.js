import { Accounts } from 'meteor/accounts-base';
 
T9n.setLanguage('fr');

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});