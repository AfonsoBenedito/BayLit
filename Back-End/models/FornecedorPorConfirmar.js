const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Trigger = require("mongoose-trigger")
const UtilizadorPorConfirmar = require("./UtilizadorPorConfirmar")

const FornecedorPorConfirmarSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    nome:  {type:'String', required:true},
    email: {type:'String', required:true},
    password: {type:'String', required:true},
    morada: {type:'String', required:false},
    nif: {type:'Number', required:false},
    telemovel: {type:'Number', required:false},
    confirmation: {type:'String',required:true}
}, {collection: 'FornecedorPorConfirmar'});

const UserEvents = Trigger(FornecedorPorConfirmarSchema, {
    events: {
      create: true
    }
});

UserEvents.on('create', data => UtilizadorPorConfirmar.create({_id: data._id , tipo:'Fornecedor', email: data.email, isCongelado: false, confirmation: data.confirmation }))


let FornecedorPorConfirmar = mongoose.model('FornecedorPorConfirmar', FornecedorPorConfirmarSchema);
module.exports = FornecedorPorConfirmar;