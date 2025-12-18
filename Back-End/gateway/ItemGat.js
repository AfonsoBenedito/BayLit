const Item = require("../models/Item");

async function create(produto_especifico) {
    

    const result = await Item.create({
        produto_especifico: produto_especifico,
        desperdicio: false
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    return result
}

async function createWithValidade(produto_especifico, prazo_validade) {
    

    const result = await Item.create({
        produto_especifico: produto_especifico,
        prazo_validade: prazo_validade,
        desperdicio: false
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

        const result = await Item.findOne({
            _id: id
        })

        return result
    }
    
    return false
}

async function getWithPrazoValidade() {
    

    const result = await Item.find({
        prazo_validade: { $exists: true }
    })

    return result
}

async function getByProdutoEspecifico(produto_especifico) {
    
    
    if (await existsProdutoEspecifico(produto_especifico)){
        const result = await Item.find({
            produto_especifico: produto_especifico
        })
        return result
    }

    return false
}

async function getByPrazoDeValidade(prazo_validade) {
    

    if (await existsPrazoDeValidade(prazo_validade)){

        const result = await Item.find({
            prazo_validade: prazo_validade
        })

        return result
    }
    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const itemExists = await Item.exists({
            _id: id
        })
    
        return itemExists ? true : false
    }
    
    return false
}

async function existsProdutoEspecifico(produto_especifico) {

    produto_especifico = String(produto_especifico)

    if (produto_especifico.match(/^[0-9a-fA-F]{24}$/)) {
        

        const produtoEspecificoExists = await Item.exists({
            produto_especifico: produto_especifico
        })
    
        return produtoEspecificoExists ? true : false
    }
    
    return false
}

async function existsPrazoDeValidade(prazo_validade) {
  
    const itemExists = await Item.exists({
        prazo_validade: prazo_validade
    })

    return itemExists ? true : false
}

async function updatePrazoDeValidade(id, prazo_validade){
    

    if (await existsId(id)){

        const result = await Item.updateOne(
            {_id: id}, 
            {prazo_validade: prazo_validade}
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

async function updateDesperdicio(id){
    
    id = String(id)
    if (await existsId(id)){

        const result = await Item.updateOne(
            {_id: id}, 
            {desperdicio: true}
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

async function addToCadeiaLogistica(id, etapa){
    

    if (await existsId(id)){

        const result = await Item.updateMany(
            {_id: id},
            {$push: {
                cadeia_logistica: etapa
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

async function removeFromCadeiaLogistica(id, etapa){
    

    if (await existsId(id)){

        const result = await Item.updateMany(
            {_id: id},
            {$pull: {
                cadeia_logistica: etapa
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

        const result = await Item.deleteOne(
            {_id: id}
        ).exec().catch((error) => {
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
    createWithValidade,
    getById,
    getByProdutoEspecifico,
    getWithPrazoValidade,
    existsId,
    existsProdutoEspecifico,
    getByPrazoDeValidade,
    existsPrazoDeValidade,
    deleteById,
    updatePrazoDeValidade,
    updateDesperdicio,
    addToCadeiaLogistica,
    removeFromCadeiaLogistica
}