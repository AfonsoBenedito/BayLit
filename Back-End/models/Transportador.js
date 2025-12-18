const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Trigger = require("mongoose-trigger")
const Utilizador = require("./Utilizador")

const TransportadorSchema = new Schema({
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
    condutores: [{type:'ObjectId', ref: 'Condutor'}]
}, {collection: 'Transportador'});

const UserEvents = Trigger(TransportadorSchema, {
    events: {
      create: true
    }
});

UserEvents.on('create', data => Utilizador.create({_id: data._id ,tipo:'Transportador', email: data.email, isCongelado: false}))


let Transportador = mongoose.model('Transportador', TransportadorSchema);
module.exports = Transportador;