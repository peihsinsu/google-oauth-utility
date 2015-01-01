google-oauth-utility
====

# Why this module
This is a module simplify the Google Oauth2 3 way handshack flow.
Google's Oauth2 3 way handshack should participate with human, and we can use refresh token for extend the token's life. The module is use for transparent the refresh token exchange another token process. And user just need to do the first time to generate token file.

# Install
For command line command:
```
$ npm install google-oauth-utility -g
```

For module:
```
$ npm install google-oauth-utility
```

# Before start using it

You must apply a web server application account from google. You can using the link:

https://console.developers.google.com/project/[your-project-id]/apiui/credential

Please note to replace your project id in the link...
And choice "Create new client id" > "Web application" ... After create the web application account, you must set up your callback url to http://localhost:8888/callback for catching the return token from google.

# Generate token file

Using os path web application account.
```
gnutil -d [path-to-tmp-file]
```

The os path config file(name: .gauth.cfg):
```
{
  "CLIENT_ID":"429************kunu.apps.googleusercontent.com",
  "CLIENT_SECRET":"yq***********0A",
  "REDIRECT_URL":"http://localhost:8888/oauth2callback",
  "DEFAULT_SCOPES": [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/plus.me"
  ]
}
```
In Mac or linux, you can put the config file under $HOME. In windows, please set the %HOME% for your system to let the module can find a path to store the file.

Using your own credential in command line:
```
gnutil -d [path-to-tmp-file] \
	-c [your-client-id] \
  -k [your-secret-key] \
  -u [your-redirect-url] \
  -s [your-scopes]
```

# Usage

```
var oauth = require('google-oauth-utility');
var scopes = [ 'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
  ];

var opts = {
  clientId:'your-client-id',
  clientSecret:'your-client-secret',
  redirectUrl: 'your-redirect-url',
  tmpPath:'/tmp/.gauth'
};

oauth.authflow(scopes, opts, function(err, tokens){
  if(err) log.error(err);
  console.log('process end..........');
  console.log(tokens);
});
```

The function authflow will auto save the token to the tmpPath path. And if the path file exist, system will use the token file's refresh token to exchange token. The user side will no-need to join the token retrieve flow. If the tmpPath file not exist, user need join to do the Oauth2 auth flow.
