const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Trigger = require("mongoose-trigger");

const VendaSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    fornecedor:  {type:'ObjectId', ref: 'Fornecedor', required:true},
    comprador:  {type:'ObjectId', ref: 'Comprador', required:true},
    produto: {type:'ObjectId', ref:'ProdutoEspecifico'},
    quantidade: {type:'Number'},
    itens: [{type:'ObjectId', ref:'Item'}],
    data: {type: 'Date', required:true},
    valor: {type: 'Number', required:true},
    estado: {type: 'String', required: false} // Confirmada, Cancelada
}, {collection: 'Venda'});


let Venda = mongoose.model('Venda', VendaSchema);
module.exports = Venda;