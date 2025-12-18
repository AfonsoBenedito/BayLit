const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Trigger = require("mongoose-trigger");
const Etapa = require("./Etapa");

const TransporteArmazemSchema = new Schema({
    _id: {type:'ObjectId', auto: true, required:true},
    item: {type:'ObjectId', ref:'Item'},
    distancia: {type: 'Number'},
    consumo: {type:'Number'},
    emissao: {type:'Number'},
    classificacao: {type:'Number'},
    desperdicio: {type:'Number'}
}, {collection: 'TransporteArmazem'});

const UserEvents = Trigger(TransporteArmazemSchema, {
    events: {
      create: true
    }
});

UserEvents.on('create', data => Etapa.create({_id: data._id}))

let TransporteArmazem = mongoose.model('TransporteArmazem', TransporteArmazemSchema);
module.exports = TransporteArmazem;