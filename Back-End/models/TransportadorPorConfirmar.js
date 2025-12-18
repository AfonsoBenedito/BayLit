const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Trigger = require("mongoose-trigger")
const Utilizador = require("./Utilizador")
const UtilizadorPorConfirmar = require("./UtilizadorPorConfirmar")

const TransportadorPorConfirmarSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    nome:  {type:'String', required:true},
    email: {type:'String', required:true},
    password:   {type:'String', required:true},
    morada: {type:'String', required:false},
    nif: {type:'Number', required:false},
    telemovel: {type:'Number', required:false},
    sede: {type:'String', required:false},
    raio_acao: {type:'Number', required:false},
    portes_encomenda: {type:'Number', required:false},
    encomendas: [{type:'ObjectId', ref: 'Encomenda'}],
    meios_transporte: [{type:'ObjectId', ref: 'MeioTransporte'}],
    condutores: [{type:'ObjectId', ref: 'Condutor'}],
    confirmation: {type:'String',required:true}
}, {collection: 'TransportadorPorConfirmar'});

const UserEvents = Trigger(TransportadorPorConfirmarSchema, {
    events: {
      create: true
    }
});

UserEvents.on('create', data => UtilizadorPorConfirmar.create({_id: data._id ,tipo:'Transportador', email: data.email, isCongelado: false, confirmation: data.confirmation}))


let TransportadorPorConfirmar = mongoose.model('TransportadorPorConfirmar', TransportadorPorConfirmarSchema);
module.exports = TransportadorPorConfirmar;