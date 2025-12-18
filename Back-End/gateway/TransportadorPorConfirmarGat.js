const TransportadorPorConfirmar = require("../models/TransportadorPorConfirmar");
var crypto = require("crypto");

async function create(nome, email, password, morada, nif, telemovel, portes_encomenda) {
    
    var random = crypto.randomBytes(10).toString('hex');
    const result = await TransportadorPorConfirmar.create({
        nome: nome,
        email: email,
        password: password,
        morada: morada,
        nif: nif,
        telemovel: telemovel,
        portes_encomenda: portes_encomenda,
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
    
    const result = await TransportadorPorConfirmar.findOne({
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