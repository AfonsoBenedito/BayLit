const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecursoSchema = new Schema({
    _id: {type:'ObjectId', auto: true, required:true},
    categoria: {type: 'String', required: true},
    tipo: {type:'String', required:true},
    unidade_medida: {type:'String', required:true}
}, {collection: 'Recurso'});

let Recurso = mongoose.model('Recurso',RecursoSchema);

module.exports = Recurso;