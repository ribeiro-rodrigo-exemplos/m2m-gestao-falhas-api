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


var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var tipoFalhasSchema = new Schema({
    clienteId : { type: Number, required: true },
    //_id : {type : Schema.Types.ObjectId, required: false},
    descricao: { type : String, required : true, trim : true },
    observacao: { type : String, required : true, trim : true },
    ativo: {type: Boolean, default: true},
    dataAtualizacao : { type: Date, default: Date.now },
    dataExclusao : { type : Date, select : false }
}, {collection : "TipoFalhas"});

tipoFalhasSchema.set('toJSON', {
    getters: true,
    virtuals: true
});


mongoose.model('TipoFalhas', tipoFalhasSchema);


