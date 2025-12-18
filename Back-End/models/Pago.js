const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PagoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    encomendaId:  {type:'ObjectId', ref: 'Encomenda', required:true},
}, {collection: 'Pago'});

let Pago = mongoose.model('Pago', PagoSchema);
module.exports = Pago;