const Recurso = require("../models/Recurso");

async function create(tipo, unidade_medida) {
    

    const result = await Recurso.create({
        tipo: tipo,
        unidade_medida: unidade_medida
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
        
        const result = await Recurso.findOne({
            _id: id
        })

        return result
    }

    return false
}


async function getByTipo(tipo) {

    if (await existsTipo(tipo)){
        
        const result = await Recurso.find({
            nome: tipo
        })

        return result
    }
    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        
        
        const recursoExists = await Recurso.exists({
            _id: id
        })
    
        return recursoExists ? true : false
    }
    
    return false
}

async function existsTipo(tipo) {
    
    const recursoExists = await Recurso.exists({
        tipo: tipo
    })

    return recursoExists ? true : false
}

module.exports = {
    create,
    getById,
    existsId,
    getByTipo,
    existsTipo
}