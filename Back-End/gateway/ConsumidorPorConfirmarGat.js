const ConsumidorPorConfirmar = require("../models/ConsumidorPorConfirmar");
var crypto = require("crypto");

async function create(nome, email, password) {
    
    var random = crypto.randomBytes(10).toString('hex');
    const result = await ConsumidorPorConfirmar.create({
        nome: nome,
        email: email,
        password: password,
        confirmation: random
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    return result
}

async function getByConfirmation(confirmation) {
    
    const result = await ConsumidorPorConfirmar.findOne({
        confirmation: confirmation
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    return result
}

module.exports = {
    create,
    getByConfirmation
}