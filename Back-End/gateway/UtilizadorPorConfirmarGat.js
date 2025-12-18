const UtilizadorPorConfirmar = require("../models/UtilizadorPorConfirmar");

async function getByConfirmation(confirmation) {
    
    const result = await UtilizadorPorConfirmar.findOne({
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
    getByConfirmation
}