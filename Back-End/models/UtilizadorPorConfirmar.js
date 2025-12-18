const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UtilizadorPorConfirmarSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    tipo : {type:'String', enum: ['Consumidor','Fornecedor','Transportador','NaoAutenticado'], default: 'NaoAutenticado' ,required:true},
    email : {type:'String'},
    isCongelado : {type: 'Boolean'},
    confirmation: {type:'String',required:true}
}, {collection : 'UtilizadorPorConfirmar'});

let UtilizadorPorConfirmar = mongoose.model('UtilizadorPorConfirmar', UtilizadorPorConfirmarSchema);

module.exports = UtilizadorPorConfirmar;