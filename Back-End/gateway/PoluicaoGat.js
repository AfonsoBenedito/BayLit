const Poluicao = require("../models/Poluicao");

async function create(tipo, unidade_medida) {
    

    const result = await Poluicao.create({
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

            const result = await Poluicao.findOne({
                _id: id
            })

            return result
        }

    return false
}

async function getByTipo(tipo) {
    

    if (await existsTipo(tipo)){
        
        const result = await Poluicao.find({
            nome: tipo
        })

        return result
    }

    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const poluicaoExists = await Poluicao.exists({
            _id: id
        })
    
        return poluicaoExists ? true : false
    }
    
    return false
}

async function existsTipo(tipo) {
    
  
    const poluicaoExists = await Poluicao.exists({
        tipo: tipo
    })

    return poluicaoExists ? true : false
}

module.exports = {
    create,
    getById,
    existsId,
    getByTipo,
    existsTipo
}