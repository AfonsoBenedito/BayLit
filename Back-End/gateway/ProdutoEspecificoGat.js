const ProdutoEspecifico = require("../models/ProdutoEspecifico");
const ProdutoEspecificoHistorico = require("../models/ProdutoEspecificoHistorico");

async function create(fornecedor, produto, preco, caracteristicas) {
    

    const result = await ProdutoEspecifico.create({
        fornecedor: fornecedor,
        produto: produto,
        preco: preco,
        especificidade: caracteristicas
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    await ProdutoEspecificoHistorico.create({
        _id: result._id,
        fornecedor: fornecedor,
        produto: produto,
        preco: preco,
        especificidade: caracteristicas
    })

    return result
}

async function getAll() {
    
    
    const result = await ProdutoEspecifico.find()

    return result
}

async function getById(id) {
    

    id = String(id)
    
    if (await existsId(id)){
        
        const result = await ProdutoEspecifico.findOne({
            _id: id
        })

        return result
    }

    return false
}

async function getHistoricoById(id) {
    

    id = String(id)
    
    let result = await ProdutoEspecificoHistorico.findOne({
        _id: id
    })

    if (result == null){
        result = false
    }

    return result
    
}

async function getByProduto(produto) {
    
    
    const result = await ProdutoEspecifico.find({
        produto: produto
    })

    return result
    
}

async function getWithDesconto() {
    
    const result = await ProdutoEspecifico.find({
        desconto: { $exists: true }
    })

    return result
    
}

async function getByAtributo(atributo) {
    
    
    const result = await ProdutoEspecifico.find({
        "especificidade.atributo": atributo
    })

    if (result) {
        return result
    } else {return false}
    
}

async function getByValor(valor) {   
    
    const result = await ProdutoEspecifico.find({
        "especificidade.valor": valor
    })

    if (result) {
        return result
    } else {return false}
    
    
}

async function getByPreco(precoMin, precoMax) {
    

    const result = await ProdutoEspecifico.find({
        preco: {'$gt':precoMin,'$lt':precoMax}
    })

    return result
}

async function getByProdutoPreco(produto, precoMin, precoMax){
    
    
    const result = await ProdutoEspecifico.find({
        produto: produto,
        preco: {'$gt':precoMin,'$lt':precoMax}
    })

    return result

}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const produtoEspecificoExists = await ProdutoEspecifico.exists({
            _id: id
        })
    
        return produtoEspecificoExists ? true : false
    }
    
    return false
}

async function existsProduto(produto) {
    produto = String(produto)

    if (produto.match(/^[0-9a-fA-F]{24}$/)) {
        

        const produtoEspecificoExists = await ProdutoEspecifico.exists({
            produto: produto
        })
    
        return produtoEspecificoExists ? true : false
    }
    
    return false
}

async function existsPreco(preco) {

    const produtoEspecificoExists = await ProdutoEspecifico.exists({
        preco: preco
    })

    return produtoEspecificoExists ? true : false
}

async function updatePreco(id, preco){
    

    if (await existsId(id)){

        const result = await ProdutoEspecifico.updateOne(
            {_id: id}, 
            {preco: preco}
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

async function updateDesconto(id, desconto, data_fim){
    
    id = String(id)
    if (await existsId(id)){

        const result = await ProdutoEspecifico.updateOne(
            {_id: id}, 
            {desconto: desconto,
            data_desconto: data_fim}
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

async function removeDesconto(id){
    
    id = String(id)
    if (await existsId(id)){

        const result = await ProdutoEspecifico.updateOne(
            {_id: id}, 
           { $unset: { desconto: "", data_desconto: "" } }
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

async function addFotografias(id, fotografia){
    

    id = String(id)
    if (await existsId(id)){

        const result = await ProdutoEspecifico.updateMany(
            {_id: id},
            {$push: {fotografia: fotografia}}
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

async function addEspecifidade(id, atributo, valor){
    

    if (await existsId(id)){

        const result = await ProdutoEspecifico.updateMany(
            {_id: id},
            {$push: {
                especificidade: {
                    atributo: atributo,
                    valor: valor
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

async function removeEspecifidade(id, atributo, valor){
    

    if (await existsId(id)){
        
        const result = await ProdutoEspecifico.updateMany(
            {_id: id},
            {$pull: {
                especificidade: {
                    atributo: atributo,
                    valor: valor
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

        const result = await ProdutoEspecifico.deleteOne({
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

/*
async function run(){
    const teste = await getAll()
    console.log(teste)
}
run()
*/

module.exports = {
    create,
    getAll,
    getById,
    getHistoricoById,
    getByProduto,
    getByPreco,
    getByAtributo,
    getByValor,
    getWithDesconto,
    existsId,
    existsProduto,
    existsPreco,
    deleteById,
    updatePreco,
    updateDesconto,
    removeDesconto,
    addEspecifidade,
    addFotografias,
    removeEspecifidade,
    getByProdutoPreco
}