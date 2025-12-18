const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MetodoPagamentoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    tipo:  {type:'String', required:true},
}, {collection: 'MetodoPagamento'});

let MetodoPagamento = mongoose.model('MetodoPagamento', MetodoPagamentoSchema);
module.exports = MetodoPagamento;