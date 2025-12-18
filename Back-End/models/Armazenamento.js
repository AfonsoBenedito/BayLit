const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Trigger = require("mongoose-trigger");
const Etapa = require("./Etapa");

const ArmazenamentoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    armazem:  {type:'ObjectId', ref: 'Armazem', required:true},
    produto: {type:'ObjectId', ref: 'Produto', required: true},
    item: {type:'ObjectId', ref: 'Item', required: true},
    data_inicio: {type:'Date', required:true},
    data_fim: {type:'Date', required:false},
    consumo_total: {type: 'Number', required:false},
    classificacao: {type: 'Number', required:false},
    updated: {type: 'Date', required: true}
}, {collection: 'Armazenamento'});

const UserEvents = Trigger(ArmazenamentoSchema, {
    events: {
      create: true
    }
});

UserEvents.on('create', data => Etapa.create({_id: data._id}))

let Armazenamento = mongoose.model('Armazenamento', ArmazenamentoSchema);
module.exports = Armazenamento;