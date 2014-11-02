var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var CLIENT_ID='429100748693-uguki74jekdc2s78u8vg7d49n5h4kunu.apps.googleusercontent.com';
var CLIENT_SECRET='yqui85VOWsRH4dRn5O09zO0A';
var REDIRECT_URL='http://localhost:8888/oauth2callback';
var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = [
	'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/plus.me'
];

var code=	'1/n8q8UVVzkDRqkmFLFG6X1QqKtCRXwZmr-A2jJ7DEEf4'
oauth2Client.getToken(code, function(err, tokens) {
  // Now tokens contains an access_token and an optional refresh_token. Save them.
  if(err) console.log(err);
  if(!err) {
    oauth2Client.setCredentials(tokens);
  }
	console.log(tokens);
});
