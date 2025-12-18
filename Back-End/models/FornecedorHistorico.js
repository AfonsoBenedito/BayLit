const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Trigger = require("mongoose-trigger")
const Utilizador = require("./Utilizador")

const FornecedorHistoricoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    nome:  {type:'String', required:true},
    email: {type:'String', required:true},
    password: {type:'String', required:true},
    morada: {type:'String', required:false},
    nif: {type:'Number', required:false},
    telemovel: {type:'Number', required:false}
}, {collection: 'FornecedorHistorico'});

const UserEvents = Trigger(FornecedorHistoricoSchema, {
    events: {
      create: true
    }
});


let FornecedorHistorico = mongoose.model('FornecedorHistorico', FornecedorHistoricoSchema);
module.exports = FornecedorHistorico;