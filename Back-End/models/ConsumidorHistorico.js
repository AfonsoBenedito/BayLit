const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Trigger = require("mongoose-trigger")
const Utilizador = require("./Utilizador")

const ConsumidorHistoricoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    nome:  {type:'String', required:true},
    email: {type:'String', required:true},
    password:   {type:'String',required:false},
    morada: {type:'ObjectId', ref: 'Local', required:false},
    nif: {type:'Number',required:false},
    telemovel: {type:'Number',required:false},
    encomendas: [{type:'ObjectId', ref: 'Encomenda'}],
    utilizadores_favoritos: [{type:'ObjectId', ref: 'Utilizador'}],
    produtos_favoritos: [{type:'ObjectId', ref: 'Produto'}],
    metodos_pagamento: [{
      metodo: {type:'ObjectId', ref: 'MetodoPagamento'},
      favorito: {type:'Boolean'}
    }]
}, {collection: 'ConsumidorHistorico'});

const UserEvents = Trigger(ConsumidorHistoricoSchema, {
    events: {
      create: true
    }
});

let ConsumidorHistorico = mongoose.model('ConsumidorHistorico',ConsumidorHistoricoSchema);
module.exports = ConsumidorHistorico;