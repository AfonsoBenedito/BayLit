const Review = require("../models/Review");

async function create(produto, comprador, timestamp, classificacao, descricao) {
    

    const result = await Review.create({
        produto: produto,
        comprador: comprador,
        timestamp: timestamp,
        classificacao: classificacao,
        descricao: descricao
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

        const result = await Review.findOne({
            _id: id
        })

        return result
    }

    return false
}

async function getByProduto(produtoId) {
    

    if (await existsProduto(produtoId)){

        const result = await Review.find({
            produto: produtoId
        })

        return result
    }

    return false
}

async function getByComprador(compradorId) {
    
    
    if (await existsComprador(compradorId)){
        
        const result = await Review.find({
            comprador: compradorId
        })

        return result
    }

    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const reviewExists = await Review.exists({
            _id: id
        })
    
        return reviewExists ? true : false
    }
    
    return false
}

async function existsProduto(produtoId) {
    if (produtoId.match(/^[0-9a-fA-F]{24}$/)) {
        

        const reviewExists = await Review.exists({
            produto: produtoId
        })
    
        return reviewExists ? true : false
    }
    
    return false
}

async function existsComprador(compradorId) {
    if (compradorId.match(/^[0-9a-fA-F]{24}$/)) {
        

        const reviewExists = await Review.exists({
            comprador: compradorId
        })
    
        return reviewExists ? true : false
    }
    
    return false
}

async function addFotografia(id, fotografia){
    

    if (await existsId(id)){

        const result = await Review.updateMany(
            {_id: id},
            {$push: {fotografias: fotografia}}
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

async function removeFotografia(id, fotografia){
    
    
    if (await existsId(id)){

        const result = await Review.updateMany(
            {_id: id},
            {$pull: {fotografias: fotografia}}
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

        const result = await Review.deleteOne({
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
    getByProduto,
    getByComprador,
    existsProduto,
    existsComprador,
    existsId,
    deleteById,
    addFotografia,
    removeFotografia
}