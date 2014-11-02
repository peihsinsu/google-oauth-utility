var cp = require('child_process');
var fs = require('fs');
var log = require('nodeutil').logger.getInstance('process');

var cfg = require('./cfg');
var oauth = require('./oauth2');

/**
 * Process auth flow:
 * 1. If tmpPath file exist, will refresh token from the file's refresh_token.
 * 2. If tmpPath file not exist, will new inital Oauth auth flow that need user participate.
 */
exports.authflow = authflow;
function authflow(scopes, opts, cb) {
	if(typeof(opts) == 'function') {
		cb = opts;
		opts = null;
	}

	if(opts) {
		log.trace('Using opts:', opts);
		init(opts, worker);
	} else {
		log.trace('No opts defined...');
		init({}, worker); //TOOD: test
	}

	function worker() {
		log.trace('tmpPath:' + process.env.TMPPATH);
		if(fs.existsSync(process.env.TMPPATH)) {
			var tokens = JSON.parse(fs.readFileSync(process.env.TMPPATH));
			log.trace('Exchange key using tokens:', tokens);
			oauth.refreshToken(tokens, function(err, token){
				if(err) {
					log.error('Exchange token error:', err);
					return cb(err);
				}
				cb(null, token);
			});
			return;
		}
		log.trace('New retrieve oauth2 token...');
		log.trace('Fork process:' + (__dirname + '/oauth2.js'));
		log.trace('Scopes:' + scopes.join(','));
		
		if(!scopes || scopes.length == 0) {
			scopes = cfg.credential.DEFAULT_SCOPES;
		}
		
		var p  = cp.fork([__dirname + '/oauth2.js'], scopes.join(','));
		p.send(scopes);
		p.on('message', function(m) {
			log.trace('Parent got message: ', m);
			//persistence tokens
			var cfg_file = process.env.TMPPATH;
			fs.writeFileSync(cfg_file, JSON.stringify(m), {encoding:'utf8'});
			cb(null, m);
		});
	}
}

/**
 * Initial configuation info
 */
function init(opts, cb) {
	if(opts && opts.tmpPath ) {
		process.env.TMPPATH=opts.tmpPath;
	} else {
		process.env.TMPPATH = cfg.default_tmp_path;
		cfg.tmpPath = cfg.default_tmp_path;
	}
	log.trace('Set token save tmpPath: ', process.env.TMPPATH);
	check(opts, 'clientId', 'CLIENT_ID');
	check(opts, 'clientSecret', 'CLIENT_SECRET');
	check(opts, 'redirectUrl', 'REDIRECT_URL');
  log.trace('Using opts:', opts);

	cb();
}
exports.init = init;

/**
 * Check and setup data to opts
 */
function check(opts, key, envKey) {
	if(opts && opts[key] && !proess.env[envKey]) {
		process.env[envKey] = opts[key];
	} else if(!process.env[envKey]) {
		process.env[envKey] = cfg.credential[envKey];
		if(!opts) opts = {};
		opts[key] = cfg.credential[envKey];
	}
}


