const Atributo = require("../models/Atributo");

async function create(nome, descricao, valores) {
    

    const result = await Atributo.create({
        nome: nome,
        descricao: descricao,
        valido: true,
        valores: valores
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    return result
}

async function createPorValidar(nome, descricao, valores) {
    

    const result = await Atributo.create({
        nome: nome,
        descricao: descricao,
        valido: false,
        valores: valores
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    return result
}

async function getById(id) {
    

    id = String(id)
    if (await existsId(id)){

        const result = await Atributo.findOne({
            _id: id
        })

        return result
    }
    
    return false
}

async function getByName(name) {
    

    if (name.match(/^[0-9a-fA-F]{24}$/)) {
        
        
        const atributoExists = await Atributo.exists({
            nome: nome
        })
        
        if (atributoExists){
            return await Atributo.findOne({
                nome:nome
            })
        }
    }

    
    return false
}

async function getBySubcategoria(subcategoria) {
    

    if (await existsSubCategoria(subcategoria)){

        const result = await Atributo.findOne({
            subcategoria: subcategoria
        })

        return result
    }
    
    return false
}

async function getByNameInSubcategoria(nome, subcategoria) {
    

    if (await existsSubCategoria(subcategoria) && await existsName(nome)){

        const result = await Atributo.findOne({
            nome: nome,
            subcategoria: subcategoria
        })

        return result
    }
    
    return false
}

async function existsId(id) {  
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        
        
        const cartaoExists = await Atributo.exists({
            _id: id
        })
    
        return cartaoExists ? true : false
    }
    
    return false
}

async function existsSubCategoria(subcategoria) {  
    if (subcategoria.match(/^[0-9a-fA-F]{24}$/)) {
        
        
        const cartaoExists = await Atributo.exists({
            subcategoria: subcategoria
        })
    
        return cartaoExists ? true : false
    }
    
    return false
}

async function existsValorPorValidar(valor) {
    
    
    const cartaoExists = await Atributo.exists({
        valoresPorValidar: valor
    })

    return cartaoExists ? true : false
}

async function existsName(name) {
    
    
    const cartaoExists = await Atributo.exists({
        nome: name
    })

    return cartaoExists ? true : false
}

async function updateDescricao(id, descricao){
    

    if (await existsId(id)){

        const result = await Atributo.updateOne(
            {_id: id}, 
            {descricao: descricao}
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

async function updateSubCategoria(id, SubCategoria){
    

    if (await existsId(id)){

        const result = await Atributo.updateOne(
            {_id: id}, 
            {SubCategoria: SubCategoria}
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

async function validarValor(id, valor){
    

    if (await existsId(id) && await existsValorPorValidar(valor)){

        const result = await Atributo.updateMany(
            {_id: id},
            {$push: {
                valores: valor
            }}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error adding the entry: " + error.name
            }
        })

        if(result){
            removeValoresPorValidar(id, valor)
            return true
        }
    } else{
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }
}

async function addValores(id, valores){
    

    if (await existsId(id)){

        const result = await Atributo.updateMany(
            {_id: id},
            {$push: {
                valores: valores
            }}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error adding the entry: " + error.name
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

async function addValoresPorValidar(id, valoresPorValidar){
    

    if (await existsId(id)){

        const result = await Atributo.updateMany(
            {_id: id},
            {$push: {
                valoresPorValidar: valoresPorValidar
            }}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error adding the entry: " + error.name
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

async function removeValoresPorValidar(id, valoresPorValidar){
    

    if (await existsId(id)){

        const result = await Atributo.updateMany(
            {_id: id},
            {$pull: {
                valoresPorValidar: valoresPorValidar
            }}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error removing the entry: " + error.name
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

async function invalidarValor(id, valores){
    

    if (await existsId(id)){

        const result = await Atributo.updateMany(
            {_id: id},
            {$pull: {
                valores: valores
            }}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error removing the entry: " + error.name
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

        const result = await Atributo.deleteOne({
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

async function updateValidade(id, bool){
    

    if (await existsId(id)){

        const result = await Atributo.findOneAndUpdate(
            {_id: id}, 
            {valido: bool}
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

module.exports = {
    create,
    createPorValidar,
    getById,
    getByName,
    //getBySubcategoria,
    //getByNameInSubcategoria,
    existsId,
    //existsSubCategoria,
    updateDescricao,
    //updateSubCategoria,
    addValoresPorValidar,
    addValores,
    validarValor,
    removeValoresPorValidar,
    invalidarValor,
    deleteById,
    updateValidade
}