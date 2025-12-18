const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    produto: {type:'ObjectID', ref: 'Produto', required:true},
    comprador:  {type:'ObjectID', ref: 'Utilizador', required:true},
    timestamp: {type:'Date', required:true},
    classificacao: {type:'Number', required:true},
    descricao: {type:'String', required:true},
    fotografias: [{type:'String', required:false}]
}, {collection: 'Review'});

let Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;