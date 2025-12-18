const Mensagem = require("../models/Mensagem");

async function create(de, para, texto, imagem, timestamp) {
    

    const result = await Mensagem.create({
        de: de,
        para: para,
        texto: texto,
        imagem: imagem,
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

        const result = await Mensagem.findOne({
            _id: id
        })

        return result
    }
    
    return false
}

async function getByFrom(fromId) {
        

        if (await existsFrom(fromId)){

            const result = await Mensagem.find({
                de: fromId
            })

            return result
        }

    return false
}

async function getByTo(toId) {
        

        if (await existsTo(toId)){

            const result = await Mensagem.find({
                para: toId
            })

            return result
        }

    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const mensagemExists = await Mensagem.exists({
            _id: id
        })
    
        return mensagemExists ? true : false
    }
    
    return false
}

async function existsFrom(fromId) {
    if (fromId.match(/^[0-9a-fA-F]{24}$/)) {
        

        const mensagemExists = await Mensagem.exists({
            de: fromId
        })
    
        return mensagemExists ? true : false
    }
    
    return false
}

async function existsTo(toId) {
    if (toId.match(/^[0-9a-fA-F]{24}$/)) {
        

        const mensagemExists = await Mensagem.exists({
            para: toId
        })
    
        return mensagemExists ? true : false
    }
    
    return false
}

async function deleteById(id){
    

    if (await existsId(id)){

        const result = Mensagem.deleteOne({
            _id: id
        }).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error deleting the entry: " + error.name
            }
        })

        if(result){
            return true
        }
        return false
    } else{
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }
}

module.exports = {
    create,
    getById,
    getByFrom,
    getByTo,
    existsId,
    existsFrom,
    existsTo,
    deleteById
}