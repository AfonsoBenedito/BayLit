const Armazem = require("../models/Armazem");
const ArmazemHistorico = require("../models/ArmazemHistorico");
const Fornecedor = require("../gateway/FornecedorGat");
const Funcionario = require("../gateway/FuncionarioGat");
const ProdutoEspecifico = require("../gateway/ProdutoEspecificoGat");


async function create(fornecedor, localizacao, tamanho, gasto_diario) {
    
    const result = await Armazem.create({
        fornecedor: fornecedor,
        localizacao: localizacao,
        tamanho: tamanho,
        gasto_diario: gasto_diario,
        inventario: []
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    await ArmazemHistorico.create({
        _id: result._id,
        fornecedor: fornecedor,
        localizacao: localizacao,
        tamanho: tamanho,
        gasto_diario: gasto_diario,
        inventario: []
    })

    return result;
}

async function getById(id) {
        

        if (await existsId(id)){

            const result = await Armazem.findOne({
                _id: id
            })  
            
            return result
        }

    return false
}

async function getByFornecedor(fornecedor) {
        

    if (await existsFornecedor(fornecedor)){

        const result = await Armazem.find({
            fornecedor: fornecedor
        })

        return result
    }
        
    return false
}

async function getByLocalizacao(localizacao) {
    

    localizacao = String(localizacao)
    const result = await Armazem.findOne({
        localizacao: localizacao
    })

    return result

}

async function getWithProdutoEmInventario(produto_especifico) {
    

    produto_especifico = String(produto_especifico)
    const result = await Armazem.find({
        inventario: {$elemMatch:{produto: produto_especifico}}
    })
    return result
}

async function getWithItemEmInventario(item) {
    

    item = String(item)
    const result = await Armazem.findOne({
        "inventario.itens" : item
    })
    return result
}

async function removeItemFromInventario(armazem, item) {
    

    armazem = String(armazem)
    item = String(item)
    const result = await Armazem.updateOne(
        { _id: armazem },
        { $pull: { "inventario.itens" : item }}
    )

    return result
}

async function getStock(produto_especifico) {

    produto_especifico = String(produto_especifico)
    const stock = await Armazem.find({inventario: {$elemMatch:{produto: produto_especifico, quantidade:{ $gt: 0 }}}})
    return stock
} 

async function existsId(id) {

    id = String(id)

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const doesArmazemExists = await Armazem.exists({
            _id: id
        })
    
        return doesArmazemExists ? true : false
    }
    
    return false
}

async function existsFornecedor(fornecedor) {
    if (fornecedor.match(/^[0-9a-fA-F]{24}$/)) {
        

        const doesArmazemExists = await Armazem.exists({
            fornecedor: fornecedor
        })
    
        return doesArmazemExists ? true : false
    }
    
    return false
}

async function updateGastoDiario(id, gasto_diario){
    

    if (await existsId(id)){

        const result = await Armazem.updateOne(
            {_id: id}, 
            {gasto_diario: gasto_diario}
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

async function updateInventario(id, inventario){
    

    id = String(id)
    if (await existsId(id)){

        const result = await Armazem.updateOne(
            {_id: id}, 
            {inventario: inventario}
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

async function addFuncionario(id, funcionario){
    

    if (await existsId(id) && await Funcionario.existsId(funcionario)){
        const result = await Armazem.updateMany(
            {_id: id},
            {$push: {
                funcionarios: funcionario
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

async function addToInventario(id, itens){
    

    id = String(id)

    if (await existsId(id)){

        const result = await Armazem.updateMany(
            {_id: id},
            {$push: {
                inventario: itens
            }}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error adding the entry: " + error.name
            }
        })

        if(result){
            return true
        } else {
            return false
        }
    } else{
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }
}

async function addProdutosToInventario(id, produtos){
    

    id = String(id)

    if (await existsId(id)){

        const result = await Armazem.updateMany(
            {_id: id},
            {$addToSet: {
                produtos: produtos
            }}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error adding the entry: " + error.name
            }
        })

        if(result){
            return true
        } else {
            return false
        }
    } else{
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }
}

async function removeFromInventario(id, produto){
    

    if (await existsId(id) && ProdutoEspecifico.existsId(produto)){
        const result = await Armazem.updateMany(
            {_id: id},
            {$pull: {
                inventario: {
                    produto_especifico: produto
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

async function removeFuncionario(id, funcionario){
    

    if (await existsId(id) && await Funcionario.existsId(funcionario)){
        const result = await Armazem.updateMany(
            {_id: id},
            {$pull: {
                funcionarios: funcionario
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

        const result = await Armazem.deleteOne(
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
    getById,
    getByFornecedor,
    getByLocalizacao,
    getWithProdutoEmInventario,
    getWithItemEmInventario,
    removeItemFromInventario,
    getStock,
    existsId,
    existsFornecedor,
    deleteById,
    updateGastoDiario,
    updateInventario,
    addFuncionario,
    removeFuncionario,
    addToInventario,
    addProdutosToInventario,
    removeFromInventario
}