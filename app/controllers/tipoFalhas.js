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
var m2merr = require('../util/m2merr');

var MensagemObsViagem = mongoose.model('MensagemObsViagem');


exports.incluir = function(req, res) {
    var deferred = Q.defer();
    var msg = new m2merr.InternalError("Erro no Servidor");

    var clienteId = req.body.clienteId;
    var mensagemCod = decodeURIComponent(req.body.mensagem);

    var gmtCliente = req.user.gmtCliente;

    var filter = {
        clienteId: clienteId,
        mensagem: mensagemCod,
        ativo: true
    };

    TipoFalhas.find(filter, function(err, mensagem) {

        if (err) {
            deferred.reject(err);
        } else {

            if (mensagem.length != 0) {
                msg = new m2merr.InvalidArgument("Mensagem já cadastrada.");
                deferred.reject(msg);
            } else {

                var dataAtual = momentTimezone.tz(new Date(), gmtCliente).toDate();

                var mensagemNova = new TipoFalhas({
                    descricao: descricao,
                    observacao: mensagemCod,
                    clienteId: clienteId,
                    ativo: true,
                    dataAtualizacao: dataAtual,
                });

                mensagemNova.save(function (error) {
                    if (error) {
                        deferred.reject(new m2merr.InternalError('Server Error'));
                    } else {
                        deferred.resolve('Mensagem salva com Sucesso!');
                    }
                });

            }
        }
    });
    return deferred.promise;

}



exports.editarMensagem = function(req, res) {
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



exports.consultarMsg = function (req, res) {
    var deferred = Q.defer();
    var msg = new m2merr.InternalError("Erro no Servidor");

    var clienteId = req.params.clienteId;

    var mensagem = req.params.mensagem;

    var filter = {
        clienteId: clienteId,
        ativo: true
    };

    if(mensagem != "undefined") {
        filter.mensagem = {
            "$regex": mensagem, "$options": "i"
        }
    }

    TipoFalhas.find(filter).sort( { "mensagem" : 1 } ).exec(function(err, mensagemResul) {
        //, function(err, mensagemResul) {

        if (mensagemResul) {
            deferred.resolve(mensagemResul);
        } else {
            deferred.reject(msg);
        }

    });
    return deferred.promise;

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

exports.excluirMensagem = function(req, res) {

    var idMensagem = req.params.mensagemObsViagemId;
    var clienteId = req.params.clienteId;
    var deferred = Q.defer();

    var gmtCliente = req.user.gmtCliente;

    if (clienteId == null || clienteId == "") {
        var e = new m2merr.InvalidArgument('O código do cliente precisa ser definido');
        return Q.reject(e);
    }

    if (idMensagem == null || idMensagem == "") {
        var e = new m2merr.InvalidArgument('O código da Mensagem precisa ser definido');
        return Q.reject(e);
    }

     var filter = {
        _id : mongoose.Types.ObjectId(idMensagem),
        clienteId: clienteId
    }

    TipoFalhas.findOne(filter, function(err, mensagem) {

        if(mensagem){
            //Dados necessários para Auditoria
            req.session.dados = [];
            req.session.dados[0] = mensagem;

            TipoFalhas.remove(filter, function(err, msg) {
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