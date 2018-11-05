var express = require('express'),
	config = require('./config'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	expressSession = require('express-session'),
	logger = require('m2m-node-utils/util/logger'),
	timeout = require('connect-timeout'),
	load = require('express-load'),
	multer = require('multer'),
	passport = require('passport'),
	cors = require('cors'),
	compression = require('compression'),
	xmlparser = require('express-xml-bodyparser'),
	util = require('util');

xmlparser.regexp = /\/xml$/i;


/**
 * Rotas abertas (Sem Token))
 * @type {string[]}
 */
var openRoutes = [
	
];

module.exports = function() {
	var app = express();
	if(config.usaTimeout){
		app.use(timeout('120s'));
	}

	/*app.use(function(req, res, next) {
		console.log(req.method+": "+req.url);
		next();
	});*/

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
		next();
	});

	app.use(xmlparser({
		limit: '50mb'
	}));
	app.use(bodyParser.json({
		limit: '50mb'
	}));
	app.use(bodyParser.urlencoded({
		extended: true,
		limit: '50mb'
	}));
	app.use(bodyParser.text({
		limit: '50mb',
		defaultCharset: 'utf-8'
	}));

	app.use(cookieParser());

	app.use(
		multer({
			dest: process.env.TEMP,
			limits: {
				fieldSize: 5 * 1024 * 1024
			},
			onFileUploadStart: function(file) {
				logger.log(file.fieldname + ' is starting ...')
			},
			onError: function(error, next) {
				logger.log(error);
				next(error)
			}
		}).any()
	);

	app.use(expressSession({
		secret: config.sessionSecret,
		saveUninitialized: true,
		resave: true
	}));

	app.use(compression());

	if (config.validaAutenticacao) {
		app.use(passport.initialize());
		app.use(function(req, res, next) {
			//Rota do busChat incluida temporariamente, precisa mudar a chamada do socket para usar o token no header.
			if (req.method !== 'OPTIONS' && !indexOfInLote(req.path, openRoutes)) {
				return passport.authenticate('bearer', {
					session: false
				}).apply(null, arguments);

			} else {
				return next();
			}
		});
		app.use(function(req, res, next) {
			req.user = req.user || {};
			next();
		});
	}

	load('app/models').then('app/controllers').then('app/routes').into(app);
	app.use(function(err, req, res, next) {
		if (util.isError(err)) {
			emitter.emit('error', err, req, res);
		}
		next();
	})

	return app;
};

var indexOfInLote = function(path, arr) {
	var bool = false;

	for (var i = 0; i < arr.length; i++) {
		bool = !!~path.indexOf(arr[i]);
		if (bool) {
			return bool;
		}
	}

	return bool;
};
