const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Trigger = require("mongoose-trigger")
const UtilizadorPorConfirmar = require("./UtilizadorPorConfirmar")

const ConsumidorPorConfirmarSchema = new Schema({
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
    }],
    confirmation: {type:'String',required:true}
}, {collection: 'ConsumidorPorConfirmar'});

const UserEvents = Trigger(ConsumidorPorConfirmarSchema, {
    events: {
      create: true
    }
});

UserEvents.on('create', data => UtilizadorPorConfirmar.create({_id: data._id ,tipo:'Consumidor', email: data.email, isCongelado: false, confirmation: data.confirmation}))

let ConsumidorPorConfirmar = mongoose.model('ConsumidorPorConfirmar',ConsumidorPorConfirmarSchema);
module.exports = ConsumidorPorConfirmar;