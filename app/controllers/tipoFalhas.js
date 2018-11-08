/*******************************************************************************
 * Copyright (c) 2016 M2M Solutions S/A.
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

var Q = require('q');
var moment = require('moment');
var mongoose = require('mongoose');
var momentTimezone = require('moment-timezone');
//var m2merr = require('../util/m2merr');

var TipoFalhas = mongoose.model('TipoFalhas');


exports.incluir = function(req, res) {
    var deferred = Q.defer();
  //  var msg = new m2merr.InternalError("Erro no Servidor");

    var clienteId = req.body.clienteId;
    var observacao = decodeURIComponent(req.body.mensagem);
    var descricao = decodeURIComponent(req.body.descricao);

    var gmtCliente = req.user.gmtCliente;
    
    if(observacao == "undefined"){
        var observacao = "Sem Observação";
    }

    var filter = {
        clienteId: clienteId,
        descricao: descricao,
        observacao: observacao,
        ativo: true
    };
    
    if(req.body._id){
        TipoFalhas.update({
            '_id': mongoose.Types.ObjectId(req.body._id),
            clienteId: clienteId
        }, {
            $set: {
                descricao: descricao,
                observacao: observacao,
                //dataAtualizacao: dataAtualizacao
            }
        }, function(err, mensagemResult) {
            if (err) {
                var e = new m2merr.InternalError('Server Error');
                deferred.reject(e);
            } else {
                deferred.resolve('Mensagem alterada com Sucesso!');
            }
        });
    }

    TipoFalhas.find(filter, function(err, mensagem) {

        if (err) {
            deferred.reject(err);
        } /*else {

            if (mensagem.length != 0) {
                msg = new m2merr.InvalidArgument("Mensagem já cadastrada.");
                deferred.reject(err);
            } else {*/

                var dataAtual = momentTimezone.tz(new Date(), gmtCliente).toDate();

                var mensagemNova = new TipoFalhas({
                    descricao: descricao,
                    observacao: observacao,
                    clienteId: clienteId,
                    ativo: true,
                    dataAtualizacao: dataAtual,
                });

                mensagemNova.save(function (error) {
                    if (error) {
                      //  deferred.reject(new m2merr.InternalError('Server Error'));
                    } else {
                        deferred.resolve('Mensagem salva com Sucesso!');
                    }
                });

        //    }
      //  }
    });
    return deferred.promise;

}



exports.editar = function(req, res) {
    var deferred = Q.defer();

    var gmtCliente = req.user.gmtCliente;

    //zerar millisecond
    var mensagemEditar = req.body.mensagem;
    var dataAtualizacao = momentTimezone.tz(new Date(), gmtCliente).toDate();
    var mensagemId = req.params.mensagemObsViagemId;

    TipoFalhas.update({
        '_id': mongoose.Types.ObjectId(mensagemId),
        clienteId: req.params.clienteId
    }, {
        $set: {
            mensagem: mensagemEditar,
            dataAtualizacao: dataAtualizacao
        }
    }, function(err, mensagemResult) {
        if (err) {
            var e = new m2merr.InternalError('Server Error');
            deferred.reject(e);
        } else {
            deferred.resolve('Mensagem alterada com Sucesso!');
        }
    });

    return deferred.promise;
}



// exports.consultarFalha = function (req, res) {
//     var deferred = Q.defer();
//    // var msg = new m2merr.InternalError("Erro no Servidor");
//    var clienteId = req.params.clienteId;
//    //var mensagem = req.params.mensagem;

//     var filtroQuery = {
//         "ativo": true,
//         "clienteId" : Number(clienteId),
//         "descricao": {$exists: true}
//     };

//     var camposDeRetornos = "clienteId descricao observacao"

//     TipoFalhas.find(filtroQuery, camposDeRetornos, function ( err, tipoFalhas/*{ "descricao" : 1 } ).exec(function(err, mensagemResul)*/) {
//         //, function(err, mensagemResul) {

//         if (tipoFalhas) {
//             deferred.resolve(tipoFalhas);
//         } else {
//             deferred.reject(err);
//         }

//     });
//     return deferred.promise;

// }

exports.consultar = function (req, res) {
    var deferred = Q.defer();
   // var msg = new m2merr.InternalError("Erro no Servidor");
   
   var mensagem = req.params.mensagem;
if(req.params.mensagem != 209){
    var descricao = mensagem;
    
    var filtroQuery = {
        "ativo": true,
        //"clienteId" : Number(clienteId),
        "descricao": [/descricao/]
    };

    var camposDeRetornos = "clienteId descricao observacao"

    TipoFalhas.find(filtroQuery, camposDeRetornos, function ( err, tipoFalhas/*{ "descricao" : 1 } ).exec(function(err, mensagemResul)*/) {
        //, function(err, mensagemResul) {

        if (tipoFalhas) {
            deferred.resolve(tipoFalhas);
        } else {
            deferred.reject(err);
        }

    });
    return deferred.promise;
}else{
    var filtroQuery = {
        "ativo": true,
        "clienteId" : req.user.idCliente,
        "descricao": {$exists: true}
    }

    var camposDeRetornos = "clienteId descricao observacao"

    TipoFalhas.find(filtroQuery, camposDeRetornos, function ( err, tipoFalhas/*{ "descricao" : 1 } ).exec(function(err, mensagemResul)*/) {
        //, function(err, mensagemResul) {

        if (tipoFalhas) {
            deferred.resolve(tipoFalhas);
        } else {
            deferred.reject(err);
        }

    });
    return deferred.promise;
}
}

exports.consultarTodos = function (req, res) {
    var deferred = Q.defer();
    var msg = new m2merr.InternalError("Erro no Servidor");

    var clienteId = req.params.clienteId;

    var filter = {
        clienteId: clienteId,
        ativo: true
    };

    TipoFalhas.find(filter , function(err, mensagem) {
        if(err)
            deferred.reject(msg);
        else
            deferred.resolve(mensagem);
    });

    return deferred.promise;
}

exports.excluir = function(req, res) {

    var id = req.params.id;
    var deferred = Q.defer();


     var filter = {
        _id : mongoose.Types.ObjectId(id),
    }

    TipoFalhas.findOne(filter, function(err, id) {

        if(id){
            //Dados necessários para Auditoria
            req.session.dados = [];
            req.session.dados[0] = id;

            TipoFalhas.remove(filter, function(err) {
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve();
                }
            });

        }
    });

    return deferred.promise;

}