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

var routeAdapter = require('m2m-node-utils/util/route_promisse_adapter');
//var routeCache = require('route-cache');
//var config = require('../../config/config');

module.exports = function(server) {
    var tipoFalhas = server.app.controllers.tipoFalhas;
    var routeAdapter = require('m2m-node-utils/util/route_promisse_adapter');
    server.post('/tipoFalhas/:clienteId', routeAdapter.resolvePromisse(tipoFalhas.incluir));
    server.get('/tipoFalhas/:mensagem', routeAdapter.resolvePromisse(tipoFalhas.consultar));
    server.get('/tipoFalhas/:mensagem', routeAdapter.resolvePromisse(tipoFalhas.consultarFalha));
    server.delete('/tipoFalhas/:id', routeAdapter.resolvePromisse(tipoFalhas.excluir));
    //server.delete('/tipoFalhas/:clienteId/', /*routeCache.cacheSeconds(config.secondsCache),*/ routeAdapter.resolvePromisse(tipoFalhas.update));

    
};