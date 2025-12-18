const FornecedorPorConfirmar = require("../models/FornecedorPorConfirmar");
var crypto = require("crypto");

async function create(nome, email, password, morada, nif, telemovel) {
    
    var random = crypto.randomBytes(10).toString('hex');
    const result = await FornecedorPorConfirmar.create({
        nome: nome,
        email: email,
        password: password,
        morada: morada,
        nif: nif,
        telemovel: telemovel,
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
    
    const result = await FornecedorPorConfirmar.findOne({
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