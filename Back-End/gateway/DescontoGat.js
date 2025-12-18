const Mongoose = require("mongoose");
const Desconto = require("../models/Desconto");

async function create(produto, percentagem) {
    

    const result = await Desconto.create({
        produto: produto,
        percentagem: percentagem
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

        const result = await Desconto.findOne({
            _id: id
        })

        return result
    }
    
    return false
}

async function getByProduto(produtoId) {
    

    if (await existsProdutoId(produtoId)){

        const result = await Desconto.find({
            produto: produtoId
        })

        return result
    }
    
    return false
}

async function getByEstado(estado) {
    

    if (await existsEstado(estado)){

        const result = await Desconto.find({
            estado: estado
        })

        return result
    }
    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const descontoExists = await Desconto.exists({
            _id: id
        })
    
        return descontoExists ? true : false
    }
    
    return false
}

async function existsProduto(produtoId) {
    if (produtoId.match(/^[0-9a-fA-F]{24}$/)) {
        

        const descontoExists = await Desconto.exists({
            produto: produtoId
        })
    
        return descontoExists ? true : false
    }
    
    return false
}

async function existsEstado(estado) {
    
  
    const descontoExists = await Desconto.exists({
        estado: estado
    })

    return descontoExists ? true : false
}

async function updateDataDeInicio(id, dataDeInicio){
    

    if (await existsId(id)){

        const result = await Desconto.updateOne(
            {_id: id}, 
            {data_inicio: dataDeInicio}
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

async function updateDataDeFim(id, dataDeFim){
    

    if (await existsId(id)){

        const result = await Desconto.updateOne(
            {_id: id}, 
            {data_fim: dataDeFim}
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

async function updateEstado(id, estado){
    

    if (await existsId(id)){

        const result = await Desconto.updateOne(
            {_id: id}, 
            {estado: estado}
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

        const result = await Desconto.deleteOne({
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
    getByProduto,
    existsProduto,
    getByEstado,
    existsEstado,
    updateDataDeFim,
    updateDataDeInicio,
    updateEstado,
    deleteById
}