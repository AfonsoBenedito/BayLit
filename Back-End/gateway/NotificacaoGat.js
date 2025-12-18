const Notificacao = require("../models/Notificacao");

async function create(utilizador, tema, mensagem, link) {

    const result = await Notificacao.create({
        utilizador: utilizador,
        tema: tema,
        mensagem: mensagem,
        link: link,
        vista: false
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

        const result = await Notificacao.findOne({
            _id: id
        })

        return result
    }

    return false
}

async function getByUtilizador(utilizadorId) {
    
    utilizadorId = String(utilizadorId)
    if (await existsUtilizador(utilizadorId)){

        const result = await Notificacao.find({
            utilizador: utilizadorId
        })

        return result
    }

    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {

        const notificacaoExists = await Notificacao.exists({
            _id: id
        })
    
        return notificacaoExists ? true : false
    }

    return false
}

async function existsUtilizador(utilizadorId) {
    if (utilizadorId.match(/^[0-9a-fA-F]{24}$/)) {
        
        const notificacaoExists = await Notificacao.exists({
            utilizador: utilizadorId
        })
    
        return notificacaoExists ? true : false
    }

    return false
}

async function updateVistasByUtilizador(utilizador) {
    
    const result = await Notificacao.updateMany(
        {utilizador: utilizador}, 
        {vista: true}
    ).exec().catch((error) => {
        throw {
            code: 400,
            message: "Error updating the entry: " + error.name
        }
    })

    if(result){
        return true
    } else {
        return false
    }
     
}

async function updateVista(id) {
    
    const result = await Notificacao.updateOne(
        {_id: id}, 
        {vista: true}
    ).exec().catch((error) => {
        throw {
            code: 400,
            message: "Error updating the entry: " + error.name
        }
    })

    if(result){
        return getById(id)
    } else {
        return false
    }
     
}

module.exports = {
    create,
    getById,
    existsId,
    getByUtilizador,
    existsUtilizador,
    updateVistasByUtilizador,
    updateVista
}