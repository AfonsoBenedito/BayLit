const LocalEntrega = require("../models/LocalEntrega");

async function create(consumidor, morada, codigo_postal, localidade, x, y) {
    

    const result = await LocalEntrega.create({
        consumidor: consumidor,
        morada: morada,
        codigo_postal: codigo_postal,
        localidade: localidade,
        coordenadas: [{
            x: x,
            y: y
        }]
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

        const result = await LocalEntrega.findOne({
            _id: id
        })

        return result
    }

    return false
}

async function getByConsumidor(consumidor) {
    

    if (await existsConsumidor(consumidor)){

        const result = await LocalEntrega.findOne({
            consumidor: consumidor
        })

        return result
    }

    return false
}

async function getByMorada(morada) {
    

    const result = await LocalEntrega.findOne({
        morada: morada,
    })

    return result
}

async function getByCodigoPostal(codigo_postal) {
    

    const result = await LocalEntrega.findOne({
        codigo_postal: codigo_postal,
    })

    return result
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const localEntregaExists = await LocalEntrega.exists({
            _id: id
        })
    
        return localEntregaExists ? true : false
    }
    
    return false
}

async function existsConsumidor(consumidor) {
    if (consumidor.match(/^[0-9a-fA-F]{24}$/)) {
        

        const localEntregaExists = await LocalEntrega.exists({
            consumidor: consumidor
        })
    
        return localEntregaExists ? true : false
    }
    
    return false
}

async function updateMorada(id, morada){
    

    if (await existsId(id)){

        const result = await LocalEntrega.updateOne(
            {_id: id}, 
            {morada: morada}
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

async function updateCodigoPostal(id, codigo_postal){
    

    if (await existsId(id)){

        const result = await LocalEntrega.updateOne(
            {_id: id}, 
            {codigo_postal: codigo_postal}
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

async function updateLocalidade(id, localidade){
    

    if (await existsId(id)){

        const result = await LocalEntrega.updateOne(
            {_id: id}, 
            {localidade: localidade}
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

async function deleteById(id){
    

    if (await existsId(id)){
        
        const result = await LocalEntrega.deleteOne({
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
    getByConsumidor,
    getByMorada,
    getByCodigoPostal,
    existsId,
    existsConsumidor,
    updateMorada,
    updateCodigoPostal,
    updateLocalidade,
    deleteById
}