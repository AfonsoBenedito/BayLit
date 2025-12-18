const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AtributoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    nome: {type:'String', required:true},
    descricao: {type:'String'},
    valido: {type: 'Boolean'},
    valores: [{type:'String'}],
    valoresPorValidar: [{type:'String'}]
}, {collection: 'Atributo'});

let Atributo = mongoose.model('Atributo', AtributoSchema);
module.exports = Atributo;