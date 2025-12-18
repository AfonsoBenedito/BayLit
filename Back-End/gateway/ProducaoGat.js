const Producao = require("../models/Producao");
const Recurso = require("../gateway/RecursoGat");
const Poluicao = require("../gateway/PoluicaoGat");

async function create(produto, local, tipo, recursos, poluicao, classificacao) {
    

    const result = await Producao.create({
        produto: produto,
        local: local,
        tipo: tipo,
        recursos: recursos,
        poluicao: poluicao,
        classificacao: classificacao
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

            const result = await Producao.findOne({
                _id: id
            })

            return result
        }

    return false
}

async function getAll() {
    

    const result = await Producao.find()

    return result
    
}

async function getByProduto(produto) {
    

    produto = String(produto)

    if (await existsProduto(produto)){
        
        const result = await Producao.findOne({
            produto: produto
        })

        return result
    }

    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const poluicaoExists = await Producao.exists({
            _id: id
        })
    
        return poluicaoExists ? true : false
    }
    
    return false
}

async function existsProduto(produto) {
    if (produto.match(/^[0-9a-fA-F]{24}$/)) {
        

        const poluicaoExists = await Producao.exists({
            produto: produto
        })
    
        return poluicaoExists ? true : false
    }
    
    return false
}

async function updateLocal(id, local){
    

    if (await existsId(id)){

        const result = await Producao.updateOne(
            {_id: id}, 
            {local: local}
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

async function updateProduto(id, produto){
    

    if (await existsId(id)){

        const result = await Producao.updateOne(
            {_id: id}, 
            {produto: produto}
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

async function addRecurso(id, recurso, quantidade){
    

    if (await existsId(id) && await Recurso.existsId(recurso)){

        const result = await Producao.updateMany(
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
    

    if (await existsId(id) && await Poluicao.existsId(poluicao)){

        const result = await Producao.updateMany(
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

async function removeRecurso(id, recurso, quantidade){
    

    if (await existsId(id) && await Recurso.existsId(recurso)){

        const result = await Producao.updateMany(
            {_id: id},
            {$pull: {
                recursos: {
                    recurso: recurso,
                    quantidade: quantidade
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

async function removePoluicao(id, poluicao, quantidade){
    

    if (await existsId(id) && await Poluicao.existsId(poluicao)){

        const result = await Producao.updateMany(
            {_id: id},
            {$pull: {
                poluicao: {
                    poluicao: poluicao,
                    quantidade: quantidade
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
    

    id = String(id)
    if (await existsId(id)){

        const result = await Producao.deleteOne({
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

async function deleteByProduto(produto){
    

    produto = String(produto)
    const result = await Producao.deleteOne({
        produto: produto
    }).exec().catch((error) => {
        throw {
            code: 400,
            message: "Error deleting the entry: " + error.name
        }
    })

    if(result){
        return true
    } else {
        throw {
            code: 400,
            message: "Algo correu mal."
        }
    }
}

module.exports = {
    create,
    getById,
    getAll,
    getByProduto,
    existsId,
    existsProduto,
    updateLocal,
    updateProduto,
    addRecurso,
    addPoluicao,
    removeRecurso,
    removePoluicao,
    deleteById,
    deleteByProduto
}