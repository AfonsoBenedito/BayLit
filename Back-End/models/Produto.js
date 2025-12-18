const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Fornecedor = require("../gateway/FornecedorGat");
const Trigger = require("mongoose-trigger")

const ProdutoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    nome:  {type:'String', required:true},
    fornecedor:  {type:'ObjectID', ref: 'Fornecedor', required:true},
    categoria:  {type:'ObjectID', ref: 'Categoria', required:true},
    subcategoria:  {type:'ObjectID', ref: 'Subcategoria', required:true},
    fotografia: [{type:'String', required:false}],
    informacao_adicional:  {type:'String', required:false},
    reviews: [{type:'ObjectID', ref: 'Review', required:false}],
    transporte_armazem: {
      distancia: {type: 'Number'},
      consumo: {type:'Number'},
      emissao: {type:'Number'},
      classificacao: {type:'Number'},
      n_itens: {type: 'Number'},
      desperdicio: {type: 'Number'}
    },
    armazenamento: {
      duracao: {type:'Number'},
      consumo: {type: 'Number'},
      classificacao: {type: 'Number'}
    }
}, {collection: 'Produto'});

const UserEvents = Trigger(ProdutoSchema, {
    events: {
      create: true
    }
});

UserEvents.on('create', data => Fornecedor.addCatalog(String(data.fornecedor), String(data._id)))

let Produto = mongoose.model('Produto', ProdutoSchema);
module.exports = Produto;