const Promocao = require("../models/Promocao");

async function create(produtos, compre, pague) {
    

    const result = await Promocao.create({
        produtos: produtos,
        compre: compre,
        pague: pague
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

            const result = await Promocao.findOne({
                _id: id
            })

            return result
        }

    return false
}

async function getByProduto(produto) {
        

        if (await existsProduto(produto)){

            const result = await Promocao.find({
                produtos: produto
            })

            return result
        }

    return false
}

async function getByEstado(estado) {

    if (await existsEstado(estado)){

        const result = await Promocao.find({
            estado: estado
        })

        return result
    }

    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const promocaoExists = await Promocao.exists({
            _id: id
        })
    
        return promocaoExists ? true : false
    }
    
    return false
}

async function existsProduto(produto) {
    if (produto.match(/^[0-9a-fA-F]{24}$/)) {
        

        const promocaoExists = await Promocao.exists({
            produtos: produto
        })
    
        return promocaoExists ? true : false
    }
    
    return false
}

async function existsEstado(estado) {
  
    const promocaoExists = await Promocao.exists({
        estado: estado
    })

    return promocaoExists ? true : false
}

async function updateDataDeInicio(id, data_inicio){
    

    if (await existsId(id)){

        const result = await Promocao.updateOne(
            {_id: id}, 
            {data_inicio: data_inicio}
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

async function updateDataDeFim(id, data_fim){
    

    if (await existsId(id)){

        const result = await Promocao.updateOne(
            {_id: id}, 
            {data_fim: data_fim}
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
        
        const result = await Promocao.updateOne(
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
        
        const result = await Promocao.deleteOne({
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
    getByEstado,
    existsId,
    existsProduto,
    existsEstado,
    deleteById,
    updateDataDeInicio,
    updateDataDeFim,
    updateEstado
}