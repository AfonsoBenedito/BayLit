const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Fornecedor = require("../gateway/FornecedorGat");
const Trigger = require("mongoose-trigger")

const FuncionarioArmazemSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    fornecedor: {type:'ObjectId', ref: 'Fornecedor', required:true},
    armazem: {type:'ObjectId', ref: 'Armazem', required:true},
    nome:  {type:'String', required: true},
    idade: {type:'Number',required: false}
}, {collection: 'FuncionarioArmazem'});

let FuncionarioArmazem = mongoose.model('FuncionarioArmazem', FuncionarioArmazemSchema);
module.exports = FuncionarioArmazem;