const Pago = require("../models/Pago");

async function create(encomenda) {
    const result = await Pago.create({
        encomendaId: encomenda
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    console.log(result)

    return result
}

async function getByEncomenda(encomenda) {

    encomenda = String(encomenda)
    const result = await Pago.findOne({
        encomendaId: encomenda
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
    getByEncomenda
}