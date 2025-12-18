const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoriaSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    nome: {type:'String', required:true},
    fotografia: {type: 'String', required:false},
    validado: {type:'Boolean', required:true},
}, {collection: 'Categoria'});

let Categoria = mongoose.model('Categoria', CategoriaSchema);
module.exports = Categoria;