const NaoAutenticado = require("../models/NaoAutenticado");

async function create() {
    

    const result = await NaoAutenticado.create({})
                                       .catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    return result
}

async function getById(id) {
    

    if (await existsId(id)){

        const result = await NaoAutenticado.findOne({
            _id: id
        })

        return result
    }

    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const naoAutenticadoExists = await NaoAutenticado.exists({
            _id: id
        })
    
        return naoAutenticadoExists ? true : false
    }
    
    return false
}

async function deleteById(id){
    

    if (await existsId(id)){
        
        const result = await NaoAutenticado.deleteOne({
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
    existsId,
    deleteById
}