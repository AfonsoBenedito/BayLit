const Produto = require("../models/Produto");
const ProdutoHistorico = require("../models/ProdutoHistorico");
const Desconto = require("../gateway/DescontoGat");
const Review = require("../gateway/ReviewGat");

async function create(fornecedor, nome, categoria, subcategoria, informacao_adicional) {
    

    const result = await Produto.create({
        nome: nome,
        fornecedor: fornecedor,
        categoria: categoria,
        subcategoria: subcategoria,
        informacao_adicional: informacao_adicional,
        transporte_armazem: {
            distancia: 0,
            consumo: 0,
            emissao: 0,
            classificacao: 1,
            n_itens: 0,
            desperdicio: 0
        },
        armazenamento: {
            duracao: 0,
            consumo: 0,
            classificacao: 1
        },
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error
        }
    })

    await ProdutoHistorico.create({
        _id: result._id,
        nome: nome,
        fornecedor: fornecedor,
        categoria: categoria,
        subcategoria: subcategoria,
        informacao_adicional: informacao_adicional,
        transporte_armazem: {
            distancia: 0,
            consumo: 0,
            emissao: 0,
            classificacao: 1,
            n_itens: 0,
            desperdicio: 0
        },
        armazenamento: {
            duracao: 0,
            consumo: 0,
            classificacao: 1
        },
    })

    return result
}

async function getAll() {

    const result = await Produto.find()

    return result
}

async function getById(id) {
    

    id = String(id)
    if (await existsId(id)){

        const produto = await Produto.findOne({
            _id: id
        })

        return produto
    }
    
    return false
}

async function getHistoricoById(id) {
    
    id = String(id)
    
    const produto = await ProdutoHistorico.findOne({
        _id: id
    })

    return produto
    
}

async function getByName(name) {
    

    if (await existsName(name)){

        const produto = await Produto.find({
            nome: name
        })

        return produto
    }

    return false
}

async function getByFornecedor(fornecedor) {
    

    if (await existsFornecedor(fornecedor)){

        const produto = await Produto.find({
            fornecedor: fornecedor
        })

        return produto
    }

    return false
}

async function getByCategoria(categoriaId) {
    

    if (await existsCategoria(categoriaId)){

        const produto = await Produto.find({
            categoria: categoriaId
        })

        return produto
    }

    return false
}

async function getBySubCategoria(subCategoriaId) {
    

    if (await existsSubCategoria(subCategoriaId)){

        const produto = await Produto.find({
            subcategoria: subCategoriaId
        })

        return produto
    }

    return false
}

async function getByCategoriaAndNome(categoriaId, nome){
    

    const regex = new RegExp(nome, 'i')
    if (await existsCategoria(categoriaId)){

        const produto = await Produto.find({
            nome: {$regex: regex},
            categoria: categoriaId
        })

        return produto
    }

    return false
}

async function getBySubCategoriaAndNome(subCategoriaId, nome){
    

    const regex = new RegExp(nome, 'i')
    if (await existsSubCategoria(subCategoriaId)){

        const produto = await Produto.find({
            nome: {$regex: regex},
            subcategoria: subCategoriaId
        })

        return produto
    }

    return false
}

async function getByLikeName(nome){
    

    const regex = new RegExp(nome, 'i')
    const produto = await Produto.find({
        nome: {$regex: regex}
    })

    return produto
}

async function existsId(id) {

    if (String(id).match(/^[0-9a-fA-F]{24}$/)) {
        

        const produtoExists = await Produto.exists({
            _id: id
        })
    
        return produtoExists ? true : false
    }
    
    return false
}

async function existsName(name) {
    
  
    const produtoExists = await Produto.exists({
        nome: name
    })

    return produtoExists ? true : false
}

async function existsFornecedor(fornecedor) {
    if (fornecedor.match(/^[0-9a-fA-F]{24}$/)) {
        

        const produtoExists = await Produto.exists({
            fornecedor: fornecedor
        })
    
        return produtoExists ? true : false
    }
    
    return false
}

async function existsCategoria(categoriaId) {
    if (categoriaId.match(/^[0-9a-fA-F]{24}$/)) {
        

        const produtoExists = await Produto.exists({
            categoria: categoriaId
        })
    
        return produtoExists ? true : false
    }
    
    return false
}

async function existsSubCategoria(subCategoriaId) {
    if (subCategoriaId.match(/^[0-9a-fA-F]{24}$/)) {
        

        const produtoExists = await Produto.exists({
            subcategoria: subCategoriaId
        })
    
        return produtoExists ? true : false
    }
    
    return false
}

async function updateNome(id, nome){
    

    if (await existsId(id)){

        const result = await Produto.updateOne(
            {_id: id}, 
            {nome: nome}
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

async function updateCategoria(id, categoria){
    

    if (await existsId(id)){

        const result = await Produto.updateOne(
            {_id: id}, 
            {categoria: categoria}
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

async function updateFornecedor(id, fornecedor){
    

    if (await existsId(id)){

        const result = await Produto.updateOne(
            {_id: id}, 
            {fornecedor: fornecedor}
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

async function updateInformacaoAdicional(id, informacaoAdicional){
    

    if (await existsId(id)){

        const result = await Produto.updateOne(
            {_id: id}, 
            {informacao_adicional: informacaoAdicional}
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

async function updateDesconto(id, desconto){
    

    if (await existsId(id) && await Desconto.existsId(desconto)){

        const result = await Produto.updateOne(
            {_id: id}, 
            {desconto: desconto}
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

async function updateTransporteArmazem(id, transporte_armazem){
    

    id = String(id)

    if (await existsId(id)){
        const result = await Produto.updateOne(
            {_id: id}, 
            {transporte_armazem: transporte_armazem}
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

async function updateArmazenamento(id, armazenamento){
    

    id = String(id)

    if (await existsId(id)){

        const result = await Produto.updateOne(
            {_id: id}, 
            {armazenamento: armazenamento}
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

async function updateFotografias(id, fotografias){
    
    id = String(id)
    if (await existsId(id)){
        const result = await Produto.updateOne(
            {_id: id}, 
            {fotografia: fotografias}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error updating the entry: " + error.name
            }
        })

        if(result){
            return result
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

        const result = await Produto.updateMany(
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

async function addReview(id, review){
    

    if (await existsId(id) && await Review.existsId(review)){

        const result = await Produto.updateMany(
            {_id: id},
            {$push: {reviews: review}}
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

        const result = await Produto.updateMany(
            {_id: id},
            {$pull: {fotografia: fotografia}}
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

async function removeReview(id, review){
    

    if (await existsId(id) && await Review.existsId(review)){

        const result = await Produto.updateMany(
            {_id: id},
            {$pull: {reviews: review}}
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

        const result = await Produto.deleteOne({
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
    getAll,
    getById,
    getHistoricoById,
    getByName,
    existsId,
    existsName,
    getByFornecedor,
    existsFornecedor,
    getByCategoria,
    existsCategoria,
    getBySubCategoria,
    existsSubCategoria,
    deleteById,
    updateNome,
    updateCategoria,
    updateFornecedor,
    updateInformacaoAdicional,
    updateDesconto,
    updateTransporteArmazem,
    updateArmazenamento,
    updateFotografias,
    addFotografias,
    addReview,
    removeFotografia,
    removeReview,
    getByCategoriaAndNome,
    getBySubCategoriaAndNome,
    getByLikeName
}