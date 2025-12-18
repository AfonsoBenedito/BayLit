const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Trigger = require("mongoose-trigger")
const Utilizador = require("./Utilizador")

const ConsumidorSchema = new Schema({
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
}, {collection: 'Consumidor'});

const UserEvents = Trigger(ConsumidorSchema, {
    events: {
      create: true
    }
});

UserEvents.on('create', data => Utilizador.create({_id: data._id ,tipo:'Consumidor', email: data.email, isCongelado: false}))

let Consumidor = mongoose.model('Consumidor',ConsumidorSchema);
module.exports = Consumidor;