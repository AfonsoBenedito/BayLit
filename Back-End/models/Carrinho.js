const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Trigger = require("mongoose-trigger");

const CarrinhoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    utilizador : {type:'ObjectId', ref: 'Utilizador', required:true},
    produtos: [{
        produto: {type:'ObjectId', ref:'ProdutoEspecifico'},
        quantidade: {type:'Number'},
    }],
    valor: {
        total: {type:'Number', required:false},
        sem_desconto: {type:'Number', required:false},
        desconto: {type:'Number', required:false}
    },
}, {collection: 'Carrinho'});

let Carrinho = mongoose.model('Carrinho', CarrinhoSchema);
module.exports = Carrinho;