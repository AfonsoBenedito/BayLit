const Categoria = require("../models/Categoria");

// async function create(nome) {
//     

//     const result = await Categoria.create({
//         nome: nome,
//         validado: false
//     }).catch((error) => {
//         throw {
//             code: 400,
//             message: "Error creating the entry: " + error.name
//         }
//     })

//     return result
// }

async function createPorValidar(nome) {
    

    const result = await Categoria.create({
        nome: nome,
        validado: false
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    return result
}

async function create(nome) {
    

    const result = await Categoria.create({
        nome: nome,
        validado: true
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    return result
}

async function addFotografia(id, fotografia){
    

    id = String(id)
    if (await existsId(id)){

        const result = await Categoria.updateMany(
            {_id: id},
            {fotografia: fotografia}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error adding the entry: " + error.name
            }
        })

        if (result) {
            return true
        }
    } else{
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }
}

async function getAll() {
    
    
    const result = await Categoria.find()

    return result
}

async function getById(id) {
    

    id = String(id)
    if (await existsId(id)){

        const result = await Categoria.findOne({
            _id: id
        })

        return result
    }
    
    return false
}

async function getVerified() {
    

    const result = await Categoria.find({
        validado: true
    })

    return result
}

async function getNotVerified() {
    

    const result = await Categoria.find({
        validado: false
    })

    return result
}

async function getByName(name) {
    

    if (await existsName(name)){

        const result = await Categoria.find({
            nome: name
        })

        return result
    }

    return false
}

async function existsId(id) {  
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        
        
        const cartaoExists = await Categoria.exists({
            _id: id
        })
    
        return cartaoExists ? true : false
    }
    
    return false
}

async function existsName(name) {
    
  
    const cartaoExists = await Categoria.exists({
        nome: name
    })

    return cartaoExists ? true : false
}

async function updateName(id, name){
    

    if (await existsId(id)){

        const result = await Categoria.updateOne({
            _id: id, 
            nome: name
        }).catch((error) => {
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

async function updateValidade(id, bool){
    

    if (await existsId(id)){

        const result = await Categoria.findOneAndUpdate(
            {_id: id}, 
            {validado: bool}
        ).catch((error) => {
            throw {
                code: 400,
                message: "Error updating the entry: " + error
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

// async function invalidar(id){
//     

//     if (await existsId(id)){

//         const result = await Categoria.updateOne(
//             {_id: id}, 
//             {validado: false}
//         ).exec().catch((error) => {
//             throw {
//                 code: 400,
//                 message: "Error updating the entry: " + error.name
//             }
//         })

//         if(result){
//             return getById(id)
//         }
//     } else{
//         throw {
//             code: 400,
//             message: "The id entered doesn't exist"
//         }
//     }
// }

async function deleteById(id){
    

    id = String(id)

    if (await existsId(id)){

        const result = await Categoria.deleteOne({
            _id: id
        }).catch((error) => {
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
    createPorValidar,
    addFotografia,
    getAll,
    getById,
    getVerified,
    getNotVerified,
    getByName,
    existsId,
    existsName,
    updateName,
    updateValidade,
    deleteById
    // invalidar,
}