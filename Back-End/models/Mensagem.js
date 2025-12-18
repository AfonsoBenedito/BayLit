const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MensagemSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    de: {type:'ObjectId', ref:'Utilizador', required:true},
    para: {type:'ObjectId', ref:'Utilizador', required:true},
    texto: {type:'String', required:true},
    imagem: {type:'String', required:true},
    timestamp: {type:'Date', required:true}
}, {collection: 'Mensagem'});

let Mensagem = mongoose.model('Mensagem', MensagemSchema);

module.exports = Mensagem;