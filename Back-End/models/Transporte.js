const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Trigger = require("mongoose-trigger");
const Etapa = require("./Etapa");

const TransporteSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    transportador:  {type:'ObjectId', ref: 'Transportador', required:true},
    condutor: {type:'ObjectId', ref: 'Condutor'},
    meio_transporte: {type:'ObjectId', ref: 'MeioTransporte', required:true},
    data_inicio: {type:'Date', required:false},
    data_fim: {type:'Date', required:false},
    distancia: {type:'Number', required:false},
    custo: {type:'Number', required:false},
    estado: {type:'String', required:false}, // Disponivel, Cancelado, Por iniciar, Em movimento, Terminado 
    mercadoria: [{
        produto_especifico: {type:'ObjectId', ref:'ProdutoEspecifico'},
        item: {type:'ObjectId', ref:'Item'},
        local_recolha: {type:'ObjectId', ref:'Local'},
        local_entrega: {type:'ObjectId', ref:'Local'},
    }],
    rota: [{type:'ObjectId', ref:'Local'}],
    consumo: {type:'Number'},
    emissao: {type:'Number'},
    classificacao: {type: 'Number'},
    estado_transporte: [{
        local: {type:'ObjectId', ref:'Local'},
        estado: {type:'String'} // Por passar, A chegar, Concluido
    }]
}, {collection: 'Transporte'});

const UserEvents = Trigger(TransporteSchema, {
    events: {
      create: true
    }
});

UserEvents.on('create', data => Etapa.create({_id: data._id}))

let Transporte = mongoose.model('Transporte', TransporteSchema);
module.exports = Transporte;