const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartaoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    n_cartao:  {type:'Number', required:true},
    data_expiracao:  {type:'Date', required:true},
    codigo:  {type:'Number', required:true},
    nome:  {type:'String', required:true},
}, {collection: 'Cartao'});

let Cartao = mongoose.model('Cartao', CartaoSchema);
module.exports = Cartao;