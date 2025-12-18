const Utilizador = require("../models/Utilizador");

async function create(tipo, email) {
    
  
    const result = await Utilizador.create({
        tipo: tipo,
        email: email,
        isCongelado: false
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    return result
}

async function getAll() {
    
    
    const result = await Utilizador.find()

    return result
}

async function getById(id) {
    
    id = String(id)
    if (await existsId(id)){

        const result = await Utilizador.findOne({
            _id: id
        })

        return result
    }

    return false
}

async function getByEmail(email) {
    

    if (await existsEmail(email)){
        
        const result = await Utilizador.findOne({
            email: email
        })

        return result
    }
    return false
}

async function getByTipo(tipo) {
    

    if (await existsTipo(tipo)){
        
        const result = await Utilizador.find({
            tipo: tipo
        })

        return result
    }
    return false
}

async function getByIsCongelado(isCongelado) {
    

    if (await existsIsCongelado(isCongelado)){
        
        const result = await Utilizador.find({
            isCongelado: isCongelado
        })

        return result
    }
    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const utilizadorExists = await Utilizador.exists({
            _id: id
        })
    
        return utilizadorExists ? true : false
    }
    
    return false
}

async function existsEmail(email) {
    
  
    const utilizadorExists = await Utilizador.exists({
        email: email
    })

    return utilizadorExists ? true : false
}

async function existsTipo(tipo) {
    
  
    const utilizadorExists = await Utilizador.exists({
        tipo: tipo
    })

    return utilizadorExists ? true : false
}

async function existsIsCongelado(isCongelado) {
    
  
    const utilizadorExists = await Utilizador.exists({
        isCongelado: isCongelado
    })

    return utilizadorExists ? true : false
}

async function updateTipo(id, newType) {
    

    if (await existsId(id)){

        const result = await Utilizador.updateOne(
            {_id: id}, 
            {tipo: newType}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error updating the entry: " + error.name
            }
        })

        if(result){
            return z
        }
    } else{
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }
}

async function updateEmail(id, email) {
    

    if (await existsId(id)){

        const result = await Utilizador.updateOne(
            {_id: id}, 
            {email: email}).exec().catch((error) => {
                throw {
                    code: 400,
                    message: "Error updating the entry: " + error.name
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

async function congelar(id){
    
    id = String(id)
    if (await existsId(id)){

        const result = await Utilizador.updateOne(
            {_id: id}, 
            {isCongelado: true}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error \"congelando\" the entry: " + error.name
            }
        })

        if(result){
            return true
        }
    } else{
        throw {
            code: 400,
            message: "O ID do utilizador não está registado"
        }
    }
}

async function descongelar(id){
    
    id = String(id)
    if (await existsId(id)){
        
        const result = await Utilizador.updateOne(
            {_id: id}, 
            {isCongelado: false}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error \"descongelando\" the entry: " + error.name
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

async function deleteById(id){
    

    if (await existsId(id)){
        
        const result = await Utilizador.deleteOne({
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
    getAll,
    getById,
    getByEmail,
    getByTipo,
    getByIsCongelado,
    existsId,
    existsEmail,
    existsTipo,
    existsIsCongelado,
    deleteById,
    updateEmail,
    updateTipo,
    congelar,
    descongelar
};
