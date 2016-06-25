var express = require('express');
var router = express.Router();
var shell = require('shelljs');
var fs = require("fs");
var validator = require('validator');
var slug = require('slug');
var md5 = require('md5');
var validLangs = ['en-US', 'en-GB', 'es-ES', 'it-IT', 'de-DE', 'fr-FR'];

router.get('/', function(req, res, next) {
	return res.render('index', {hostname: req.headers.host, languages : validLangs});
});

router.get('/api/:lang', function(req, res, next) {
	//Generate the audio file
	var lang = req.params.lang;
	var text = req.query.text.substring(0, 250).replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
	var play = req.query.play;
	//var fileName = md5(text); //The old way naming
	var fileName = slug(text);
	
	if (validLangs.indexOf(lang) > -1) {
		var shellCommand = 'pico2wave --lang=' + lang + ' -w public/' + fileName + '.wav "' + text + '"';
		console.log('Params: ' + lang + ' - ' + fileName + ' - ' + text);
		console.log('Shell command: ' + shellCommand);
		if (fileName != '') {
			if (shell.exec(shellCommand).code !== 0) {
				return res.send({error: 'Error creating audio file. Did you install SVOX?'});
			} else {
				if (play == 'true') {
					return res.render('player', {path: fileName, lang: lang});
				} else {
					return res.redirect('/' + fileName + '.wav');
				}
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
