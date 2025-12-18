const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProdutoEspecificoSchema = new Schema({
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
    data_desconto: {type:'Date', required: false}
}, {collection: 'ProdutoEspecifico'});

let ProdutoEspecifico = mongoose.model('ProdutoEspecifico', ProdutoEspecificoSchema);
module.exports = ProdutoEspecifico;