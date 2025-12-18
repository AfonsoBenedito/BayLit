const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Trigger = require("mongoose-trigger");
const Utilizador = require("./Utilizador")

const NaoAutenticadoSchema = new Schema({
    _id : {type:'ObjectId', auto: true, required:true}
}, {collection: 'NaoAutenticado'});

const UserEvents = Trigger(NaoAutenticadoSchema, {
    events: {
      create: true
    }
});

UserEvents.on('create', data => Utilizador.create({_id: data._id ,tipo:'NaoAutenticado', isCongelado: false}))

let NaoAutenticado = mongoose.model('NaoAutenticado', NaoAutenticadoSchema);
module.exports = NaoAutenticado;