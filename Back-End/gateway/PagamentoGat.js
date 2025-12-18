const Pagamento = require("../models/Pagamento");

async function create(utilizador, encomenda, valor, metodo, timestamp) {
    

    const result = await Pagamento.create({
        utilizador: utilizador,
        encomenda: encomenda,
        valor: valor,
        metodo: metodo,
        timestamp: timestamp
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    return result
}

async function getById(id) {
        

        if (await existsId(id)){

            const result = await Pagamento.findOne({
                _id: id
            })

            return result
        }
    return false
}

async function getByUtilizador(utilizadorId) {
        

        if (await existsUtilizador(utilizadorId)){

            const result = await Pagamento.findOne({
                utilizador: utilizadorId
            })

            return result
        }
    return false
}

async function getByEncomenda(encomendaId) {
        

        if (await existsUtilizador(encomendaId)){

            const result = await Pagamento.findOne({
                encomenda: encomendaId
            })

            return result
        }
    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const pagamentoExists = await Pagamento.exists({
            _id: id
        })
    
        return pagamentoExists ? true : false
    }

    return false
}

async function existsUtilizador(utilizadorId) {
    if (utilizadorId.match(/^[0-9a-fA-F]{24}$/)) {
        

        const pagamentoExists = await Pagamento.exists({
            utilizador: utilizadorId
        })
    
        return pagamentoExists ? true : false
    }

    return false
}

async function existsEncomenda(encomendaId) {
    if (encomendaId.match(/^[0-9a-fA-F]{24}$/)) {
        

        const pagamentoExists = await Pagamento.exists({
            encomenda: encomendaId
        })
    
        return pagamentoExists ? true : false
    }

    return false
}

module.exports = {
    create,
    getById,
    existsId,
    getByUtilizador,
    existsUtilizador,
    getByEncomenda,
    existsEncomenda
}