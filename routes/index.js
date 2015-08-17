var express = require('express');
var router = express.Router();
var shell = require('shelljs');
var fs = require("fs");
var validator = require('validator');
var slug = require('slug');
var md5 = require('md5');
var NoCaptcha = require('no-captcha');
var validLangs = ['en-US', 'en-GB', 'es-ES', 'it-IT', 'de-DE', 'fr-FR'];
var blacklistedIps = []; //Blacklisted ips go here, one IP per item

noCaptcha = new NoCaptcha(process.env.NOCAPTCHA_SITE, process.env.NOCAPTCHA_SECRET);

router.get('/', function(req, res, next) {
	return res.render('index', {hostname: req.headers.host, languages : validLangs});
});

router.post('/unblock', function(req, res, next) {
	data = {
		response: req.body['g-recaptcha-response'],
		remoteip: req.connection.remoteAddress
	};
	
	noCaptcha.verify(data, function(err, resp){
		if (err === null) {
			var index = blacklistedIps.indexOf(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
			if (index > -1) {
				blacklistedIps.splice(index, 1);
			}
		}
		return res.redirect(req.headers.referrer || req.headers.referer);
	});
});

router.get('/api/:lang', function(req, res, next) {
	//Check for blacklisted ips
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	if (blacklistedIps.indexOf(ip) > -1) {
		return res.render('unblock', {captcha_field: noCaptcha.toHTML()});
	}
	var prob = Math.random();
	if (prob <= 0.1) {
		blacklistedIps.push(ip);
	}
	console.log(ip);
	console.log(prob);
	
	//Generate the audio file
	var lang = req.params.lang;
	var text = req.query.text.substring(0, 250).replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
	//var fileName = md5(text); //The old way naming
	var fileName = slug(text);
	
	if (validLangs.indexOf(lang) > -1) {
		var shellCommand = 'pico2wave --lang=' + lang + ' -w public/' + fileName + '.wav "' + text + '"';
		console.log('Params: ' + lang + ' - ' + fileName + ' - ' + text);
		console.log('Shell command: ' + shellCommand);
		if (fileName != '') {
			if (shell.exec(shellCommand).code !== 0) {
				return res.send({error: 'Error creating audio file. SVOX is probably not installed.'});
			} else {
				return res.redirect('/' + fileName + '.wav');
			}	
		} else {
			return res.send({error: 'Error creating audio file. Empty file name.'});
		}
	} else {
		return res.send({error: lang + ' is not a valid language, valid languages are ' + validLangs.join(', ')});
	}

	return res.redirect('/');
});

module.exports = router;
