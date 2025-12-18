const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubCategoriaSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    nome: {type:'String', required:true},
    fotografia: {type: 'String', required:false},
    categoria: {type:'ObjectId', ref:'Categoria'},
    atributos:[{type:'ObjectId', ref:'Atributo'}],
    validado: {type:'Boolean', required:true},
}, {collection: 'SubCategoria'});

let SubCategoria = mongoose.model('SubCategoria', SubCategoriaSchema);
module.exports = SubCategoria;