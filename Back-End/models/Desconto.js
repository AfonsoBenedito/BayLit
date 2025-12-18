const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DescontoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    produto:  {type:'ObjectID', ref: 'Produto', required:true},
    percentagem:  {type:'Number', required:true},
    data_inicio: {type:'Date', required:false},
    data_fim: {type:'Date', required:false},
    estado: {type:'String', required:false}
}, {collection: 'Desconto'});

let Desconto = mongoose.model('Desconto', DescontoSchema);
module.exports = Desconto;