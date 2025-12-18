const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PagamentoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    utilizador:  {type:'ObjectId', ref: 'Utilizador', required:true},
    encomenda: {type:'ObjectId', ref: 'Encomenda', required:true},
    valor: {type:'Number', required:true},
    metodo: {type:'ObjectId', ref:'MetodoPagamento', required: true},
    timestamp: {type:'Date', required: true}
}, {collection: 'Pagamento'});

let Pagamento = mongoose.model('Pagamento', PagamentoSchema);
module.exports = Pagamento;