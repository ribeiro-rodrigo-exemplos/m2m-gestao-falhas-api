/*******************************************************************************
 * Copyright (c) 2015 M2M Solutions S/A.
 * Todos os direitos reservados.
 *
 * ATENÇÃO:
 * Todas as informações contidas neste documento, conceitos intelectuais
 * e técnicas são de propridedade da M2M Solutions S/A e podem estar
 * cobertas por patentes brasileiras ou estrangeiras e são protegidas por
 * segredo comercial  ou a lei de direitos autorais.
 *
 *  A divulgação destas informações ou reprodução deste material é
 *  expressamente proibida sem a autorização prévia por escrito da
 *  M2M Solutions S/A.
 *
 * Contribuidores:
 *     1STi - Estrutura inicial 
 *******************************************************************************/
'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./config/config');
if(config.enable_newrelic){
    require('newrelic');
}



// Include the cluster module
var cluster = require('cluster');

//map global
//Map = require('./app/util/map');

// Code to run if we're in the master process
if (config.enable_node_cluster && cluster.isMaster) {
// Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }



// Code to run if we're in a worker process
} else {

    var mongoose = require('mongoose'),
        bluebird = require('bluebird'),
        moment   = require('moment'),
        route_adapter = require('m2m-node-utils/util/route_promisse_adapter'),
        Response = require('m2m-node-utils/util/Response');
        
    global.emitter = require('events').EventEmitter;
    global.emitter = new emitter();

    require("moment-duration-format");

    bluebird.promisifyAll( mongoose );

    var logger = require('m2m-node-utils/util/logger');

    var db = mongoose.connection;

    db.on('connecting', function() {
        logger.info('MongoDB: Conectando...');
    });

    db.on('error', function(error) {
        logger.error('Error na conexão MongoDB: ' + error);
        mongoose.disconnect();
    });
    db.on('connected', function() {
        logger.info('MongoDB: conectado!');
    });
    db.once('open', function() {
        logger.info('MongoDB: conexão aberta!');
    });
    db.on('reconnected', function () {
        logger.info('MongoDB: reconectado!');
    });
    db.on('disconnected', function() {
        logger.error('MongoDB desconectado!');
    });

   mongoose.connect(config.db.url, config.db.options);

    //var restify = require('./config/restify');
    //var server = restify();
    var express = require('./config/express');
    var server = express();

    var port = config.serverPort || 3005;

    var idx = 1 + process.argv.indexOf('-port');
    if (idx > 0 && idx < process.argv.length) {
        var tmp = Math.floor(process.argv[idx]);
        if (tmp) port = tmp;

    }

    server.listen(port);

    console.log('Server running at http://localhost:'+port+'/');
    logger.info('Server running at http://localhost:'+port+'/');

    var __setOptions = mongoose.Query.prototype.setOptions;

    mongoose.Query.prototype.setOptions = function(options, overwrite) {
      __setOptions.apply(this, arguments);
      if (this.options.lean == null) this.options.lean = true;
      return this;
    };




    process.on('uncaughtException', function(err) {
        // handle the error safely    
        logger.error("Essa foi uma excessão não tratada!!!");
        route_adapter.clientErrorHandler(err);
    });


    emitter.on('error', function(err, req, res){
        route_adapter.clientErrorHandler(err);
        return new Response(req, res, {
            status: 500,
            data: err
        });
    });
}


