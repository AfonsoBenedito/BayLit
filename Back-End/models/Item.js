const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    produto_especifico:  {type:'ObjectId', ref: 'ProdutoEspecifico', required:true},
    prazo_validade: {type:'Date', required:false},
    desperdicio: {type:'Boolean'}
}, {collection: 'Item'});

let Item = mongoose.model('Item', ItemSchema);
module.exports = Item;