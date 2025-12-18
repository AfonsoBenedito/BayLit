const MetodoPagamento = require("../models/MetodoPagamento");

async function create(tipo) {
    

    const result = await MetodoPagamento.create({
        tipo: tipo
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

            const result = await MetodoPagamento.findOne({
                _id: id
            })

            return result
        }

    return false
}

async function getByTipo(tipo) {
    

    if (await existsTipo(tipo)){

        const result = await MetodoPagamento.find({
            tipo: tipo
        })

        return result
    }

    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const metodoDePagamentoExists = await MetodoPagamento.exists({
            _id: id
        })
    
        return metodoDePagamentoExists ? true : false
    }
    
    return false
}

async function existsTipo(tipo) {
    
  
    const consumerExists = await MetodoPagamento.exists({
        tipo: tipo
    })

    return consumerExists ? true : false
}

async function updateTipo(id, tipo){
    

    if (await existsId(id)){
        
        const result = await MetodoPagamento.updateOne(
            {_id: id}, 
            {tipo: tipo}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error updating the entry: " + error.name
            }
        })

        if(result){
            return getById(id)
        }
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
    existsId,
    getByTipo,
    existsTipo,
    updateTipo
}