const Armazenamento = require("../models/Armazenamento");
const ProdutoEspecifico = require("../gateway/ProdutoEspecificoGat");
const Recurso = require("../gateway/RecursoGat");
const Poluicao = require("../gateway/PoluicaoGat");

async function create(armazem, produto, item, data_inicio) {
    

    const result = await Armazenamento.create({
        armazem: armazem,
        produto: produto,
        item: item,
        data_inicio: data_inicio,
        updated: new Date()
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

        const result = await Armazenamento.findOne({
            _id: id
        })

        return result
    }

    return false
}

async function getAll() {
    

    const result = await Armazenamento.find()

    return result
}

async function getAllNonFinished() {
    

    
    const result = await Armazenamento.find({
        data_fim: undefined
    })

    return result
}

async function getByItemId(item) {
    

    item = String(item)
    if (await existsItemId(item)){
        const result = await Armazenamento.findOne({
            item: item
        })
        return result
    }
    return false
}

async function getByArmazem(armazem) {
    

    if (await existsArmazem(armazem)){

        const result = await Armazenamento.find({
            armazem: armazem
        })

        return result
    }

    return false
}

async function getByProduto(produto) {
    

    produto = String(produto)
    if (await existsProduto(produto)){

        const result = await Armazenamento.find({
            produto: produto
        })

        return result
    }

    return []
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const armazenamentoExists = await Armazenamento.exists({
            _id: id
        })
    
        return armazenamentoExists ? true : false
    }
    
    return false
}

async function existsItemId(item) {
    if (item.match(/^[0-9a-fA-F]{24}$/)) {
        

        const armazenamentoExists = await Armazenamento.exists({
            item: item
        })
        return armazenamentoExists ? true : false
    }
    
    return false
}

async function existsArmazem(armazem) {
    if (armazem.match(/^[0-9a-fA-F]{24}$/)) {
        

        const armazenamentoExists = await Armazenamento.exists({
            armazem: armazem
        })
    
        return armazenamentoExists ? true : false
    }
    
    return false
}

async function existsProduto(produto) {
    if (produto.match(/^[0-9a-fA-F]{24}$/)) {
        

        const armazenamentoExists = await Armazenamento.exists({
            produto: produto
        })
    
        return armazenamentoExists ? true : false
    }
    
    return false
}

async function updateDataInicio(id, data_inicio){
    

    if (await existsId(id)){

        const result = await Armazenamento.updateOne(
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

async function updateDataFim(id, data_fim){
    

    id = String(id)

    if (await existsId(id)){

        const result = await Armazenamento.updateOne(
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

async function terminateByItem(item){
    

    item = String(item)

    let now = new Date()
    const result = await Armazenamento.updateOne(
        {item: item}, 
        {data_fim: now}
    ).exec().catch((error) => {
        throw {
            code: 400,
            message: "Error updating the entry: " + error.name
        }
    })

    if(result){
        return true
    } else {
        return false
    }
}

async function restartByItem(item){
    

    item = String(item)

    const result = await Armazenamento.updateOne(
        {item: item}, 
        {$unset: {data_fim: ""}}
    ).exec().catch((error) => {
        throw {
            code: 400,
            message: "Error updating the entry: " + error.name
        }
    })

    if(result){
        return true
    } else {
        return false
    }
}



async function updateConsumoTotal(id, novo_consumo){
    

    id = String(id)

    if (await existsId(id)){

        const result = await Armazenamento.updateOne(
            {_id: id}, 
            {consumo_total: novo_consumo}
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

async function updateClassificacao(id, classificacao){
    

    id = String(id)

    if (await existsId(id)){

        const result = await Armazenamento.updateOne(
            {_id: id}, 
            {classificacao: classificacao}
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

async function updateUpdated(id){
    

    id = String(id)

    if (await existsId(id)){

        const result = await Armazenamento.updateOne(
            {_id: id}, 
            {updated: new Date()}
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

async function addProduto(id, produto_especifico, quantidade, itens){
    

    if (await existsId(id) && ProdutoEspecifico.existsId(produto_especifico)){

        const result = await Armazenamento.updateMany(
            {_id: id},
            {$push: {
                produtos: {
                    produto_especifico: produto_especifico,
                    quantidade: quantidade,
                    itens: itens
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

async function addRecurso(id, recurso, quantidade){
    

    if (await existsId(id) && await Recurso.existsId(recurso)){

        const result = await Armazenamento.updateMany(
            {_id: id},
            {$push: {
                recursos: {
                    recurso: recurso,
                    quantidade: quantidade
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

async function addPoluicao(id, poluicao, quantidade){
    

    if (await existsId(id) && Poluicao.existsId(poluicao)){

        const result = await Armazenamento.updateMany(
            {_id: id},
            {$push: {
                poluicao: {
                    poluicao: poluicao,
                    quantidade: quantidade
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

async function removePoluicao(id, poluicao){
    

    if (await existsId(id) && Poluicao.existsId(poluicao)){

        const result = await Armazenamento.updateMany(
            {_id: id},
            {$pull: {
                poluicao: {
                    poluicao: poluicao
                }
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

async function removeProduto(id, produto_especifico){
    

    if (await existsId(id) && ProdutoEspecifico.existsId(produto_especifico)){

        const result = await Armazenamento.updateMany(
            {_id: id},
            {$pull: {
                produtos: {
                    produto_especifico: produto_especifico
                }
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

async function removeRecurso(id, recurso){
    

    if (await existsId(id) && await Recurso.existsId(recurso)){

        const result = await Armazenamento.updateMany(
            {_id: id},
            {$pull: {
                recursos: {
                    recurso: recurso
                }
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
        
        const result = await Armazenamento.deleteOne({
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
    getAll,
    getAllNonFinished,
    getByItemId,
    getByArmazem,
    getByProduto,
    existsId,
    existsItemId,
    existsArmazem,
    deleteById,
    updateDataInicio,
    updateDataFim,
    updateConsumoTotal,
    updateUpdated,
    updateClassificacao,
    terminateByItem,
    restartByItem,
    addProduto,
    removeProduto,
    addRecurso,
    removeRecurso,
    addPoluicao,
    removePoluicao
}