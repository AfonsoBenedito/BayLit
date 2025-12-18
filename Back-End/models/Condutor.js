const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CondutorSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    transportador: {type:'ObjectId', ref: 'Transportador', required:true},
    nome:  {type:'String', required: true},
    idade: {type:'Number',required: false}
}, {collection: 'Condutor'});

let Condutor = mongoose.model('Condutor', CondutorSchema);
module.exports = Condutor;