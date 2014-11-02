var fs = require('fs');
var _ = require('underscore');
var google = require('googleapis');
var readline = require('readline');
var OAuth2 = google.auth.OAuth2;
var log = require('nodeutil').logger.getInstance('oauth2');

var cfg = require('./cfg');
var default_scopes = cfg.credential.DEFAULT_SCOPES;

function doauth(scopes, opts, cb) {
	var oauth2Client = new OAuth2(
			process.env.CLIENT_ID, 
			process.env.CLIENT_SECRET, 
			process.env.REDIRECT_URL);

	// merge scopes
	scopes = _.union(scopes, default_scopes);
	// merge options
	opts = _.extend(opts, {
		approval_prompt:'force',
		access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
		scope: scopes // If you only need one scope you can pass it as string
	});
	log.trace('generate url using opts:', opts);
	var url = oauth2Client.generateAuthUrl(opts);

	console.log('Please use the url for auth...');
	console.log(url);
	console.log('');

	var http = require("http");
	var server = http.createServer(function(req, res){
		res.writeHead(200, {'Content-Type': 'text/html'});
		var querystring = require('url').parse(req.url, true).query;
    log.trace('querystring:', querystring);
		var code = querystring['code'];
    log.trace('code:',code);
		if(code) {
			var html_index = fs.readFileSync(__dirname + '/../html/index.html');
			res.end(html_index);
		} else {
			res.end('...');
		}

		if(code)
			oauth2Client.getToken(code, function(err, tokens) {
				// Now tokens contains an access_token and an optional refresh_token. Save them.
				if(err) {
					log.error(err);
				} else {
					oauth2Client.setCredentials(tokens);
				}
				
				log.trace('Tokens:', tokens);
				process.send(tokens);
				if(tokens) {
					server.close();
					process.exit(0);
				}
			});
	});
	server.on('close',cb);//useless
  server.listen(8888, '127.0.0.1');
}
exports.oauth_3way = doauth;

function getToken(code, cb) {
	var oauth2Client = new OAuth2(
			process.env.CLIENT_ID, 
			process.env.CLIENT_SECRET, 
			process.env.REDIRECT_URL);
	oauth2Client.getToken(code, function(err, tokens) {
		// Now tokens contains an access_token and an optional refresh_token. Save them.
		if(err) {
			log.error('Get token from code error:', err);
			cb(err);
		} else {
			log.trace(tokens);
			oauth2Client.setCredentials(tokens);
			cb(err, tokens);
		}
	});
}
exports.getToken = getToken;

function refreshToken(tokens, cb) {
	var oauth2Client = new OAuth2(
			process.env.CLIENT_ID, 
			process.env.CLIENT_SECRET, 
			process.env.REDIRECT_URL);
	oauth2Client.setCredentials(tokens);
	oauth2Client.refreshAccessToken(function(err, tokens) {
		if(err) log.error('Refresh token error:', err);
		cb(err, tokens);
	});
}
exports.refreshToken = refreshToken;


var scopes = null;

/**
 * Starter point for child_process.fork use
 */
process.on('message', function(m) {
	if(m.length >0 )
		doauth(scopes, {}, function(){
			console.log('DONE....!!!');
		});
});

