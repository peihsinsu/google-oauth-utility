//exports.credential = {
//	CLIENT_ID:'429100748693-uguki74jekdc2s78u8vg7d49n5h4kunu.apps.googleusercontent.com',
//	CLIENT_SECRET:'yqui85VOWsRH4dRn5O09zO0A',
//	REDIRECT_URL:'http://localhost:8888/oauth2callback',
//	DEFAULT_SCOPES: [
//		'https://www.googleapis.com/auth/userinfo.profile',
//		'https://www.googleapis.com/auth/userinfo.email',
//		'https://www.googleapis.com/auth/plus.me'
//	]
//}

var default_cfg_path = ( process.env.HOME ? process.env.HOME : "/tmp" ) + "/.gauth.cfg";
exports.credential = JSON.parse(require('fs').readFileSync(default_cfg_path));
exports.default_tmp_path = ( process.env.HOME ? process.env.HOME : "/tmp" ) + "/.gauth";
