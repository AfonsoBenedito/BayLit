const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocalSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    tipo: {type: 'String', required: true}, // [local_entrega, sede, armazem, local_producao]
    utilizador: {type:'ObjectId', ref: 'Utilizador'},
    morada: {type:'String', required:true},
    cod_postal: {type:'String', required:true},
    localidade: {type:'String', required:true},
    pais: {type:'String', required:true},
    lon: {type:'String', required:false},
    lat: {type:'String', required:false}
}, {collection: 'Local'});

let Local = mongoose.model('Local', LocalSchema);

module.exports = Local;