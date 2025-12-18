const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdministradorSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    nome: {type:'String', required:true},
    password: {type:'String', required:true},
    congelamentos: [{
        utilizador: {type:'ObjectId', ref:'Utilizador'},
        inicio: {type:'Date'},
        fim: {type:'Date'},
        motivo: {type:'String'},
    }],
}, {collection: 'Administrador'});

let Administrador = mongoose.model('Administrador',AdministradorSchema);

module.exports = Administrador;