const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MeioTransporteHistoricoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    transportador: {type:'ObjectId', ref: 'Transportador', required:true},
    sede: {type:'ObjectId', ref: 'Local', required:true},
    tipo:  {type:'String', required: true},
    marca:  {type:'String', required: true},
    modelo:  {type:'String', required: true},
    consumo: {type:'Number',required: false},
    emissao: {type:'Number',required: false}
}, {collection: 'MeioTransporteHistorico'});

let MeioTransporteHistorico = mongoose.model('MeioTransporteHistorico', MeioTransporteHistoricoSchema);
module.exports = MeioTransporteHistorico;