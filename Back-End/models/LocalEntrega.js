const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Trigger = require("mongoose-trigger");

const LocalEntregaSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    consumidor:  {type:'ObjectId', ref: 'Consumidor', required:true},
    morada:  {type:'String', required: true},
    codigo_postal:  {type:'String', required: true},
    localidade:  {type:'String', required: true},
    coordenadas: [{
        x: {type:'Number'},
        y: {type:'Number'}
    }]
}, {collection: 'LocalEntrega'});

let LocalEntrega = mongoose.model('LocalEntrega', LocalEntregaSchema);
module.exports = LocalEntrega;