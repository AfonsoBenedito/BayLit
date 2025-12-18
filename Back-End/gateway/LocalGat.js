const Local = require("../models/Local");
const LocalHistorico = require("../models/LocalHistorico");

async function create(tipo, utilizador, morada, codigo_postal, localidade, pais, lon, lat) {
    
  
    const local = await Local.create({
        tipo: tipo,
        utilizador: utilizador,
        morada: morada,
        cod_postal: codigo_postal,
        localidade: localidade,
        pais: pais,
        lon: lon,
        lat: lat
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    await LocalHistorico.create({
        _id: local._id,
        tipo: tipo,
        utilizador: utilizador,
        morada: morada,
        cod_postal: codigo_postal,
        localidade: localidade,
        pais: pais,
        lon: lon,
        lat: lat
    })
    
    return local
}

async function getById(id) {
    
    id = String(id)

    if (await existsId(id)){

        const result = await Local.findOne({
            _id: id
        })

        return result
    }
    
    return false
}

async function getHistoricoById(id) {
    
    id = String(id)

    const result = await LocalHistorico.findOne({
        _id: id
    })

    return result

}

async function getByUtilizador(utilizador_id) {
    
    utilizador_id = String(utilizador_id)
    if (await existsUtilizador(utilizador_id)){

        const result = await Local.find({
            utilizador: utilizador_id
        })

        return result
    }
    
    return false
}

async function getSedesFromPais(pais) {
    

    const result = await Local.find({
        tipo: "sede",
        pais: pais
    })

    return result
}

async function existsUtilizador(utilizador_id) {
    if (utilizador_id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const localExists = await Local.exists({
            utilizador: utilizador_id
        })
    
        return localExists ? true : false
    }
    
    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const localExists = await Local.exists({
            _id: id
        })
    
        return localExists ? true : false
    }
    
    return false
}

// por fazer
async function deleteById(id){
    
    
    if (await existsId(id)){

        const result = await Local.deleteOne({
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
    getHistoricoById,
    getByUtilizador,
    getSedesFromPais,
    deleteById
}