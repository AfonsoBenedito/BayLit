const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProdutoEspecificoHistoricoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    fornecedor:  {type:'ObjectId', ref: 'Fornecedor', required:true},
    produto:  {type:'ObjectId', ref: 'Produto', required:true},
    fotografia: [{type:'String', required:false}],
    especificidade: [{
        atributo: {type:'String'},
        valor: {type:'String'}
    }],
    preco: {type:'Number', required:true},
    desconto: {type:'Number', required:false},
}, {collection: 'ProdutoEspecificoHistorico'});

let ProdutoEspecificoHistorico = mongoose.model('ProdutoEspecificoHistorico', ProdutoEspecificoHistoricoSchema);
module.exports = ProdutoEspecificoHistorico;