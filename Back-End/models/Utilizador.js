const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UtilizadorSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    tipo : {type:'String', enum: ['Consumidor','Fornecedor','Transportador','NaoAutenticado'], default: 'NaoAutenticado' ,required:true},
    email : {type:'String'},
    isCongelado : {type: 'Boolean'}
}, {collection : 'Utilizador'});

let Utilizador = mongoose.model('Utilizador',UtilizadorSchema);

module.exports = Utilizador;