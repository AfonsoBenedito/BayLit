const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PayPalSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true},
    email:  {type:'String', required:true},
}, {collection: 'PayPal'});

let PayPal = mongoose.model('PayPal', PayPalSchema);
module.exports = PayPal;