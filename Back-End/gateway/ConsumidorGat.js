const Consumidor = require("../models/Consumidor");
const ConsumidorHistorico = require("../models/ConsumidorHistorico");
const Encomenda = require("../gateway/EncomendaGat");
const MetodoPagamento = require("../gateway/MetodoPagamentoGat");
const Produto = require("../gateway/ProdutoGat");
const Utilizador = require("../gateway/UtilizadorGat");

async function create(nome, email, password) {
    

    const result = await Consumidor.create({
        nome: nome,
        email: email,
        password: password
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    await ConsumidorHistorico.create({
        _id: result._id,
        nome: nome,
        email: email,
        password: password
    })

    return result
}

async function createV(id, nome, email, password) {
    

    const result = await Consumidor.create({
        _id: id,
        nome: nome,
        email: email,
        password: password
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    await ConsumidorHistorico.create({
        _id: result._id,
        nome: nome,
        email: email,
        password: password
    })

    return result
}

async function createGoogle(nome, email) {
    

    const result = await Consumidor.create({
        nome: nome,
        email: email
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    return result
}

async function getAll() {
    
    
    const result = await Consumidor.find()

    return result
}

async function getHistoricoById(id) {
    
    id = String(id)
    const result = await ConsumidorHistorico.findOne({
        _id: id
    })

    return result
    
}

async function getById(id) {
    

    id = String(id)

    if (await existsId(id)){

        const result = await Consumidor.findOne({
            _id: id
        })

        return result
    }

    return false
}

async function getByEmail(email) {
    

    if (await existsEmail(email)){

        const result = await Consumidor.findOne({
            email: email
        })

        return result
    }
    return false
}

async function getByName(name) {
    

    if (await existsName(name)){

        const result = await Consumidor.find({
            nome: name
        })

        return result
    }
    return false
}

async function getByAddress(address) {
    

    if (await existsAddress(address)){

        const result = await Consumidor.find({
            morada: address
        })

        return result
    }
    return false
}

async function getByNif(nif) {
    

    if (await existsNif(nif)){

        const result = await Consumidor.findOne({
            nif: nif
        })

        return result
    }
    return false
}

async function getByPhone(phone) {
    

    if (await existsPhone(phone)){

        const result = await Consumidor.findOne({
            telemovel: phone
        })

        return result
    }
    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const consumerExists = await Consumidor.exists({
            _id: id
        })
    
        return consumerExists ? true : false
    }
    
    return false
}

async function existsEmail(email) {
    
  
    const consumerExists = await Consumidor.exists({
        email: email
    })

    return consumerExists ? true : false
}

async function existsName(name) {
    
  
    const consumerExists = await Consumidor.exists({
        nome: name
    })

    return consumerExists ? true : false
}

async function existsAddress(address) {
    
  
    const consumerExists = await Consumidor.exists({
        morada: address
    })

    return consumerExists ? true : false
}

async function existsNif(nif) {
    
  
    const consumerExists = await Consumidor.exists({
        nif: nif
    })

    return consumerExists ? true : false
}

async function existsPhone(phone) {
    
  
    const consumerExists = await Consumidor.exists({
        telemovel: phone
    })

    return consumerExists ? true : false
}

async function updateEmail(id, email){
    

    if (await existsId(id)){

        const result = await Consumidor.updateOne(
            {_id: id}, 
            {email: email}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error updating the entry: " + error.name
            }
        })

        if(result){
            Utilizador.updateEmail(id, email)
            return getById(id)
        }
    } else{
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }
}

async function updateName(id, name){
    

    if (await existsId(id)){

        const result = await Consumidor.updateOne(
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

async function updatePassword(id, password){
    

    if (await existsId(id)){
        
        const result = await Consumidor.updateOne(
            {_id: id}, 
            {password: password}
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

async function updateAddress(id, address){
    

    if (await existsId(id)){

        const result = await Consumidor.updateOne(
            {_id: id}, 
            {morada: address}
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

async function updateNif(id, nif){
    

    if (await existsId(id)){

        const result = await Consumidor.updateOne(
            {_id: id}, 
            {nif: nif}
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

async function updatePhone(id, phone){
    

    if (await existsId(id)){
        
        const result = await Consumidor.updateOne(
            {_id: id}, 
            {telemovel: phone}
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

async function addEncomenda(id, encomenda){
    

    if (await existsId(id) && await Encomenda.existsId(encomenda)){

        const result = await Consumidor.updateMany(
            {_id: id},
            {$push: {
                encomendas: encomenda
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

async function addFavoriteUser(id, favoriteUser){
    

    if (await existsId(id) && await Utilizador.existsId(favoriteUser)){

        const result = await Consumidor.updateMany(
            {_id: id},
            {$push: {
                utilizadores_favoritos: favoriteUser
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

async function addFavoriteProduct(id, favoriteProduct){
    if (favoriteProduct.match(/^[0-9a-fA-F]{24}$/)) {
        
        if (await existsId(id) && await Produto.existsId(favoriteProduct)){
            const result = await Consumidor.updateMany(
                {_id: id},
                {$push: {
                    produtos_favoritos: favoriteProduct
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
        }
    } else{
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }
}

async function addPaymentMethod(id, method, isFavorite){
    
    
    if (await existsId(id) && MetodoPagamento.existsId(method)){

        const result = await Consumidor.updateMany(
            {_id: id},
            {$push: {
                metodos_pagamento: {
                    metodo: method,
                    favorito: isFavorite
                }
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

async function removeParcel(id, encomenda){
        

        if (await existsId(id) && await Encomenda.existsId(encomenda)){

            const result = await Consumidor.updateMany(
                {_id: id},
                {$pull: {
                    encomendas: encomenda
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

async function removeFavoriteUser(id, favoriteUser){
    

    if (await existsId(id) && await Utilizador.existsId(favoriteUser)){

        const result = await Consumidor.updateMany(
            {_id: id},
            {$pull: {
                utilizadores_favoritos: favoriteUser
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

async function removeFavoriteProduct(id, favoriteProduct){
    if (favoriteProduct.match(/^[0-9a-fA-F]{24}$/)) {
        
        if (await existsId(id) && await Produto.existsId(favoriteProduct)){

            const result = await Consumidor.updateMany(
                {_id: id},
                {$pull: {
                    produtos_favoritos: favoriteProduct
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
        }
    } else{
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }
}

async function removePaymentMethod(id, method){
    

    if (await existsId(id) && MetodoPagamento.existsId(method)){

        const result = await Consumidor.updateMany(
            {_id: id},
            {$pull: {
                metodos_pagamento: {metodo: method}
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
        const result = await Consumidor.deleteOne({
            _id: id
        }).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error deleting the entry: " + error.name
            }
        })

        if(result){
            await Utilizador.deleteById(id)
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
    createV,
    createGoogle,
    getAll,
    getById,
    getHistoricoById,
    getByEmail,
    getByName,
    getByAddress,
    getByNif,
    getByPhone,
    existsId,
    existsEmail,
    existsName,
    existsAddress,
    existsNif,
    existsPhone,
    deleteById,
    updateEmail,
    updateName,
    updatePassword,
    updateAddress,
    updateNif,
    updatePhone,
    addEncomenda,
    addFavoriteUser,
    addFavoriteProduct,
    addPaymentMethod,
    removeParcel,
    removeFavoriteUser,
    removeFavoriteProduct,
    removePaymentMethod
}