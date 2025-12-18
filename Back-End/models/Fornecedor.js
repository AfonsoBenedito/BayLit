const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Trigger = require("mongoose-trigger")
const Utilizador = require("./Utilizador")

const FornecedorSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    nome:  {type:'String', required:true},
    email: {type:'String', required:true},
    password: {type:'String', required:true},
    morada: {type:'String', required:false},
    nif: {type:'Number', required:false},
    telemovel: {type:'Number', required:false}
}, {collection: 'Fornecedor'});

const UserEvents = Trigger(FornecedorSchema, {
    events: {
      create: true
    }
});

UserEvents.on('create', data => Utilizador.create({_id: data._id , tipo:'Fornecedor', email: data.email, isCongelado: false }))


let Fornecedor = mongoose.model('Fornecedor', FornecedorSchema);
module.exports = Fornecedor;