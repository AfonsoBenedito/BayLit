const MeioTransporte = require("../models/MeioTransporte");
const MeioTransporteHistorico = require("../models/MeioTransporteHistorico");

async function create(transportador, sede, tipo, marca, modelo, consumo, emissao) {
    

    const result = await MeioTransporte.create({
        transportador: transportador,
        sede: sede,
        tipo: tipo,
        marca: marca,
        modelo: modelo,
        consumo: consumo,
        emissao: emissao
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    await MeioTransporteHistorico.create({
        _id: result._id,
        transportador: transportador,
        sede: sede,
        tipo: tipo,
        marca: marca,
        modelo: modelo,
        consumo: consumo,
        emissao: emissao
    })

    return result
}

async function getAll() {
    

    const result = await MeioTransporte.find({}).catch((error) => {
        throw {
            code: 400,
            message: "Error querying: " + error.name
        }
    })

    return result
    
}

async function getById(id) {
    

    id = String(id)

    if (await existsId(id)){

        const result = await MeioTransporte.findOne({
            _id: id
        })

        return result
    }
    
    return false
}

async function getByTransportador(transportador) {
    


    const result = await MeioTransporte.find({
        transportador: transportador
    })

    if (result.length == 0) {
        return false
    } else {
        return result
    }

}

async function getBySede(sede) {
    


    const result = await MeioTransporte.find({
        sede: sede
    })

    if (result.length == 0) {
        return false
    } else {
        return result
    }

}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const meioDeTransporteExists = await MeioTransporte.exists({
            _id: id
        })
    
        return meioDeTransporteExists ? true : false
    }
    
    return false
}

async function updateSede(id, sede){
    

    if (await existsId(id)){

        const result = await MeioTransporte.updateOne(
            {_id: id}, 
            {consumo: consumo}
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

async function updateConsumo(id, consumo){
    

    if (await existsId(id)){

        const result = await MeioTransporte.updateOne(
            {_id: id}, 
            {consumo: consumo}
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

async function updateEmissao(id, emissao){
    

    if (await existsId(id)){
        
        const result = await MeioTransporte.updateOne(
            {_id: id}, 
            {emissao: emissao}
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
        const result = await MeioTransporte.deleteOne({
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
    getAll,
    create,
    getById,
    getByTransportador,
    getBySede,
    existsId,
    deleteById,
    updateConsumo,
    updateEmissao
}