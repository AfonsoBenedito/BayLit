const SubCategoria = require("../models/SubCategoria");

// async function create(nome, categoria) {
//     

//     const result = await SubCategoria.create({
//         nome: nome,
//         categoria: categoria,
//         validado: false
//     }).catch((error) => {
//         throw {
//             code: 400,
//             message: "Error creating the entry: " + error.name
//         }
//     })

//     return result
// }

async function createPorValidar(nome, categoria, fotografia) {
    

    const result = await SubCategoria.create({
        nome: nome,
        categoria: categoria,
        fotografia: fotografia,
        validado: false
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    return result
}

async function create(nome, categoria, fotografia) {
    

    const result = await SubCategoria.create({
        nome: nome,
        categoria: categoria,
        fotografia: fotografia,
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

        const result = await SubCategoria.updateMany(
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
    
    
    const result = await SubCategoria.find()

    return result
}

async function getById(id) {
    

    id = String(id)
    if (await existsId(id)){

        const result = await SubCategoria.findOne({
            _id: id
        })

        return result
    }
    
    return false
}

async function getByCategoria(categoria) {
    

    if (await existsCategoria(categoria)){

        const result = await SubCategoria.find({
            categoria: categoria
        })

        return result
    }
    
    return false
}

async function getByNameInCategoria(nome, categoria) {
    

    if (await existsCategoria(categoria)){

        const result = await SubCategoria.findOne({
            nome: nome,
            categoria: categoria
        })

        return result
    }
    
    return false
}

async function getVerified() {
    

    const result = await SubCategoria.find({
        validado: true
    })

    return result
}

async function getNotVerified() {
    

    const result = await SubCategoria.find({
        validado: false
    })

    return result
}

async function getByName(name) {
    

    if (await existsName(name)){

        const result = await SubCategoria.find({
            nome: name
        })

        return result
    }

    return false
}

async function existsId(id) {  
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        
        
        const cartaoExists = await SubCategoria.exists({
            _id: id
        })
    
        return cartaoExists ? true : false
    }
    
    return false
}

async function existsCategoria(categoria) {  
    if (categoria.match(/^[0-9a-fA-F]{24}$/)) {
        
        
        const categoriaExists = await SubCategoria.exists({
            categoria: categoria
        })
    
        return categoriaExists ? true : false
    }
    
    return false
}

async function existsName(name) {
    
  
    const categoriaExists = await SubCategoria.exists({
        nome: name
    })

    return categoriaExists ? true : false
}

async function updateName(id, name){
    

    if (await existsId(id)){

        const result = await SubCategoria.updateOne(
            {_id: id}, 
            {nome: name}
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

async function updateValidade(id, bool){
    

    if (await existsId(id)){

        const result = await SubCategoria.findOneAndUpdate(
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

async function deleteById(id){
    

    id = String(id)
    if (await existsId(id)){

        const result = await SubCategoria.deleteOne({
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

async function addAtributo(id, idAtributo){
    

    if (await existsId(id)){
        const result = await SubCategoria.updateOne(
            {_id: id},
            {$push: {
                atributos: idAtributo
            }}).exec().catch((error) => {
                throw {
                    code: 400,
                    message: "Error adding the entry: " + error.name
                }
            })
        if(result){
            return true
        }
    } else {
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }
}

async function removeAtributo(id, idAtributo){
    
    if (await existsId(id)){
        const result = await SubCategoria.updateOne(
            {_id: id},
            {$pull: {
                atributos: idAtributo
            }}).exec().catch((error) => {
                throw {
                    code: 400,
                    message: "Error adding the entry: " + error.name
                }
            })
        if(result){
            return true
        }
    } else {
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }
}

async function belongsCategory(id, categoria){
    
    if (await existsId(id)){
        const result = await SubCategoria.find(
            {_id: id,
            categoria: categoria})
        if(result){
            return true
        } else {
            return false
        }
    } else {
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }
}

/*
async function run(){
    const teste = await create("asd", "6262dd19d7f457d17ed3989e")
    console.log(teste)
}
run()
*/

module.exports = {
    create,
    createPorValidar,
    addFotografia,
    getAll,
    getById,
    getByCategoria,
    getByNameInCategoria,
    getVerified,
    getNotVerified,
    getByName,
    existsId,
    existsCategoria,
    existsName,
    updateName,
    updateValidade,
    deleteById,
    addAtributo,
    removeAtributo,
    belongsCategory
}