const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EncomendaSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    comprador:  {type:'ObjectId', ref: 'Utilizador', required:true},
    transportador: {type:'ObjectId', ref: 'Transportador', required:true},
    valor: {
      total: {type:'Number', required:true},
      compra: {type:'Number', required:true},
      portes: {type:'Number', required:false},
      desconto: {type:'Number', required:false}
    },
    transporte: {type:'ObjectId', ref:'Transporte'},
    prazo_cancelamento: {type:'Date', required:false},
    data_encomenda: {type:'Date', required:false},
    data_entrega: {type:'Date', required:false},
    local_entrega: {type: 'ObjectId', ref:'Local'},
    estado: {type:'String', required:false}, // Por confirmar, Confirmada, Cancelada, Em transporte, Entregue
    produtos: [{
      produto: {type:'ObjectId', ref:'ProdutoEspecifico'},
      quantidade: {type:'Number'},
      itens: [{type:'ObjectId', ref:'Item'}],
    }]
}, {collection: 'Encomenda'});

let Encomenda = mongoose.model('Encomenda', EncomendaSchema);
module.exports = Encomenda;