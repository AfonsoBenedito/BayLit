const Fornecedor = require("../models/Fornecedor");
const FornecedorHistorico = require("../models/FornecedorHistorico");
const Utilizador = require("../gateway/UtilizadorGat");
const Produto = require("../gateway/ProdutoGat");
const Armazem = require("../gateway/ArmazemGat");
const Funcionario = require("../gateway/FuncionarioGat");
const MetodoPagamento = require("../gateway/MetodoPagamentoGat");


async function create(nome, email, password, morada, nif, telemovel) {
  
    const fornecedor = await Fornecedor.create({
        nome: nome,
        email: email,
        password: password,
        morada: morada,
        nif: nif,
        telemovel: telemovel
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    await FornecedorHistorico.create({
        _id: fornecedor._id,
        nome: nome,
        email: email,
        password: password,
        morada: morada,
        nif: nif,
        telemovel: telemovel
    })
    
    return fornecedor
}

async function createV(id,nome, email, password, morada, nif, telemovel) {
  
    const fornecedor = await Fornecedor.create({
        _id: id,
        nome: nome,
        email: email,
        password: password,
        morada: morada,
        nif: nif,
        telemovel: telemovel
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    await FornecedorHistorico.create({
        _id: fornecedor._id,
        nome: nome,
        email: email,
        password: password,
        morada: morada,
        nif: nif,
        telemovel: telemovel
    })
    
    return fornecedor
}

async function getAll() {
    
    
    const result = await Fornecedor.find()

    return result
}

async function getById(id) {
    

    id = String(id)
    if (await existsId(id)){
        const result = await Fornecedor.findOne({
            _id: id
        })

        return result
    }

    return false
}

async function getHistoricoById(id) {
    

    id = String(id)

    const result = await FornecedorHistorico.findOne({
        _id: id
    })

    return result

}

async function getByEmail(email) {
    

    if (await existsEmail(email)){

        const result = await Fornecedor.findOne({
            email: email
        })

        return result
    }

    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const userExists = await Fornecedor.exists({
            _id: id
        })
    
        return userExists ? true : false
    }
    
    return false
}

async function existsEmail(email) {
    
  
    const userExists = await Fornecedor.exists({
        email: email
    })

    return userExists ? true : false
}

async function updateEmail(id, email){
    

    if (await existsId(id)){

        const result = await Fornecedor.updateOne(
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

        const result = await Fornecedor.updateOne(
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
        
        const result = await Fornecedor.updateOne(
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

async function updateMorada(id, morada){
    

    if (await existsId(id)){

        const result = await Fornecedor.updateOne(
            {_id: id}, 
            {morada: morada}
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

async function updateNif(id, novoNif){
    
    nif = parseInt(novoNif)
    
    if (await existsId(id)){

        const result = await Fornecedor.updateOne(
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

async function updateTelemovel(id, novoTelemovel){
    
    telemovel = parseInt(novoTelemovel)
    

    if (await existsId(id)){
        const result = await Fornecedor.updateOne(
            {_id: id}, 
            {telemovel: telemovel}
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

async function addToCatalog(id, produto){
    

    if (await existsId(id) && await Produto.existsId(produto)){

        const result = await Fornecedor.updateMany(
            {_id: id},
            {$push: {
                catalogo: produto
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

async function addArmazem(id, armazem){
    

    if (await existsId(id) && await Armazem.existsId(armazem)){

        const result = await Fornecedor.updateMany(
            {_id: id},
            {$push: {
                armazens: armazem
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

async function addFuncionario(id, funcionario){
    
    
    if (await existsId(id) && await Funcionario.existsId(funcionario)){

        const result = await Fornecedor.updateMany(
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

async function addUserFavorito(id, user){
    

    if (await existsId(id) && await Utilizador.existsId(user)){

        const result = await Fornecedor.updateMany(
            {_id: id},
            {$push: {
                utilizadores_favoritos: user
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

async function addProdutosFavorito(id, produto){
    

    if (await existsId(id) && await Produto.existsId(produto)){

        const result = await Fornecedor.updateMany(
            {_id: id},
            {$push: {
                produtos_favoritos: produto
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

async function addMetodosDePagamento(id, metodoDePagamento, favorito){
    

    if (await existsId(id) && await MetodoPagamento.existsId(metodoDePagamento)){

        const result = await Fornecedor.updateMany(
            {_id: id},
            {$push: {
                metodos_pagamento: {
                    metodo: metodoDePagamento,
                    favorito: favorito
                }
            }}
        ).exec()

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

async function removeCatalog(id, produto){
    
    if (await existsId(id) && await Produto.existsId(produto)){
        
        const result = await Fornecedor.updateMany(
            {_id: id},
            {$pull: {
                catalogo: produto
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

async function removeArmazem(id, armazem){
    

    if (await existsId(id) && await Armazem.existsId(armazem)){
        
        const result = await Fornecedor.updateMany(
            {_id: id},
            {$pull: {
                armazens: armazem
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

        const result = await Fornecedor.updateMany(
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

async function removeUserFavorito(id, user){
    

    if (await existsId(id) && await Utilizador.existsId(user)){

        const result = await Fornecedor.updateMany(
            {_id: id},
            {$pull: {
                utilizadores_favoritos: user
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


async function removeProdutosFavorito(id, produto){
    

    if (await existsId(id) && await Produto.existsId(produto)){

        const result = await Fornecedor.updateMany(
            {_id: id},
            {$pull: {
                produtos_favoritos: produto
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

async function removeMetodosDePagamento(id, metodoDePagamento){
    
    
    if (await existsId(id) && await MetodoPagamento.existsId(metodoDePagamento)){
        const result = await Fornecedor.updateMany(
            {_id: id},
            {$pull: {
                metodos_pagamento: {metodo: metodoDePagamento}
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
        
        const result = await Fornecedor.deleteOne(
            {_id: id}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error deleting the entry: " + error.name
            }
        })

        if(result){
            Utilizador.deleteById(id)
            return true
        }
    } else{
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }
}

async function addCatalog(id, produto){
    

    if (await existsId(id)){

        const result = await Fornecedor.updateMany(
            {_id: id},
            {$push: {catalogo: produto}}
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

module.exports = {
    create,
    createV,
    getAll,
    getById,
    getHistoricoById,
    getByEmail,
    existsId,
    existsEmail,
    deleteById,
    updateEmail,
    updateName,
    updatePassword,
    updateMorada,
    updateNif,
    updateTelemovel,
    addToCatalog,
    addArmazem,
    addFuncionario,
    addProdutosFavorito,
    addUserFavorito,
    addMetodosDePagamento,
    removeCatalog,
    removeArmazem,
    removeFuncionario,
    removeUserFavorito,
    removeProdutosFavorito,
    removeMetodosDePagamento,
    addCatalog
};