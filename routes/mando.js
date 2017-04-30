var express = require('express');
var path = require('path');
var router = express.Router();
var exec = require('child_process').exec;
var block = false;

/* GET mando. */
router.get('/', function(req, res, next) {

	res.render('mando', {
		title: 'Mando'
	});
});

router.post('/', function(req, res, next) {
	var direccion = '-';
	switch (req.body.comando) {
		case "mas":
			direccion = '+';
			break;
		default:

	}
	console.log('amixer sset Master 10%'+direccion);
	exec('amixer -q sset Master 10%'+direccion, {timeout:100}, function (error, stdout, stderr) {
		console.log('stdout: ', stdout);
		console.log('stderr: ', stderr);
		if (error !== null) {
			console.log('exec error: ', error);
		}
	});
	res.send('ok');
});

module.exports = router;
