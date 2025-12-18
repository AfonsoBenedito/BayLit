const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Trigger = require("mongoose-trigger");
const Etapa = require("./Etapa");

const ProducaoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    produto: {type:'ObjectId', ref:'Produto', required: true},
    local: {type:'ObjectId', ref: 'Local', required: true},
    tipo: {type: 'String', required: true}, // Biologica, Organica, Intensiva
    recursos: [{
        nome: {type:'String'},
        quantidade: {type:'Number'},
        unidade_medida: {type:'String'}
    }],
    poluicao: [{
        nome: {type:'String'},
        quantidade: {type:'String'}, // Residual, Marginal, Moderada, Severa, Critica
    }],
    classificacao: {type: 'Number', required: true}
}, {collection: 'Producao'});

const UserEvents = Trigger(ProducaoSchema, {
    events: {
      create: true
    }
});

UserEvents.on('create', data => Etapa.create({_id: data._id}))

let Producao = mongoose.model('Producao', ProducaoSchema);
module.exports = Producao;