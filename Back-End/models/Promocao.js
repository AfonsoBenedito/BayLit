const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PromocaoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    produtos: [{type:'ObjectID', ref: 'Produto', required:true}],
    compre:  {type:'Number', required:true},
    pague:  {type:'Number', required:true},
    data_inicio: {type:'Date', required:false},
    data_fim: {type:'Date', required:false},
    estado: {type:'String', required:false}
}, {collection: 'Promocao'});

let Promocao = mongoose.model('Promocao', PromocaoSchema);
module.exports = Promocao;