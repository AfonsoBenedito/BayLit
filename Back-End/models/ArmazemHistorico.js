const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Fornecedor = require("../gateway/FornecedorGat");
const Trigger = require("mongoose-trigger")

const ArmazemHistoricoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    fornecedor: {type:'ObjectId', ref: 'Fornecedor', required:true},
    funcionarios: [{type:'ObjectId', ref: 'FuncionarioArmazem'}],
    localizacao:  {type:'ObjectId', ref: 'Local', required: true},
    tamanho:  {type:'Number', required: true},
    gasto_diario:  {type:'Number', required: true},
    inventario: [{
      produto: {type:'ObjectId', ref:'ProdutoEspecifico'},
      quantidade: {type:'Number'},
      itens: [{type:'ObjectId', ref:'Item'}],
    }]
}, {collection: 'ArmazemHistorico'});

const UserEvents = Trigger(ArmazemHistoricoSchema, {
    events: {
      create: true
    }
});

let ArmazemHistorico = mongoose.model('ArmazemHistorico', ArmazemHistoricoSchema);
module.exports = ArmazemHistorico;