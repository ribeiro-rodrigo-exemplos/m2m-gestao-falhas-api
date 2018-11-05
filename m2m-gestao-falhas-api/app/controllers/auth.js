// Load required packages
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy
var jwt = require('jsonwebtoken');
var redis = require("redis");
var Promise = require("bluebird");
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
var config = require('../../config/config');
var client = redis.createClient(config.portRedis, config.urlRedis, {});
client.select(1, function(err) { if(err)console.log(err)});

passport.use(new BearerStrategy(
  function(accessToken, callback) {
      try{
          var decoded = jwt.verify(accessToken, 'm2m');
      } catch(e){
          return callback(null, false);
      }
      var key = "token:"+decoded.idCliente+":"+decoded.idUsuario;
      client.get(key, function(erro, reply) {
          if(erro){          		
                return callback(erro);
          } else {
          	if(reply == null || reply != accessToken){
                console.log("nao auteticado");
                return callback(null, false);
            } else{
                console.log("auteticado");
		 client.expireAsync(key,86400).then(function(res) {console.log("retorno do expires: " + res);});
                callback(null, decoded, { scope: '*' });
            }
          }
      });
  }
));

exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });









