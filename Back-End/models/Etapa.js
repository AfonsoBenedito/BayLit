const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EtapaSchema = new Schema({
    _id : {type:'ObjectId'}
}, {collection: 'Etapa'});

let Etapa = mongoose.model('Etapa',EtapaSchema);

module.exports = Etapa;