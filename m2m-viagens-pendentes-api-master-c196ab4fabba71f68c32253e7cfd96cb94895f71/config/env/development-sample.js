/*******************************************************************************
 * Copyright (c) 2015 M2M Solutions S/A.
 * Todos os direitos reservados.
 *
 * ATEN��O:
 * Todas as informa��es contidas neste documento, conceitos intelectuais
 * e t�cnicas s�o de propridedade da M2M Solutions S/A e podem estar
 * cobertas por patentes brasileiras ou estrangeiras e s�o protegidas por
 * segredo comercial  ou a lei de direitos autorais.
 *
 *  A divulga��o destas informa��es ou reprodu��o deste material �
 *  expressamente proibida sem a autoriza��o pr�via por escrito da
 *  M2M Solutions S/A.
 *
 * Contribuidores:
 *     1STi - Estrutura inicial
 *******************************************************************************/
module.exports = {
    serverPort : 3005,
    db: {
        url: 'mongodb://172.18.107.197/frota_znh',
        options: {
            db: {native_parser: true},
            mongos: true,
            server: {
                poolSize: 50,
                socketOptions: {keepAlive: 1},
                auto_reconnect: true
            }
        }
    },
    sessionSecret: '12345678',
    urlRedis: '10.0.1.138',
    portRedis: '6379',
    secondsCache: 60000,
    mysql: {
        host: '172.18.107.248',
        database: 'frota_znh',
        usr: 'frota',
        pwd: 'frota'
    },
    pathLog: 'm2m-api-error.log',
};
