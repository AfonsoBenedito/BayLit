const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificacaoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    utilizador:  {type:'ObjectId', ref: 'Utilizador', required:true},
    tema: {type:'String', required: true},
    mensagem: {type:'String', required: true},
    link: {type:'String', required: true},
    vista: {type:'Boolean', default: true}
    
}, {collection: 'Notificacao'});

let Notificacao = mongoose.model('Notificacao', NotificacaoSchema);
module.exports = Notificacao;