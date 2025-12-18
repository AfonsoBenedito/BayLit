const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PoluicaoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    tipo: {type:'String', required:true}
}, {collection: 'Poluicao'});

let Poluicao = mongoose.model('Poluicao',PoluicaoSchema);

module.exports = Poluicao;