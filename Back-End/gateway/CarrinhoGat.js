const Carrinho = require("../models/Carrinho");
const ProdutoEspecifico = require("../gateway/ProdutoEspecificoGat");

async function create(utilizador) {
    

    const result = await Carrinho.create({
        utilizador: utilizador,
        valor: 0
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

        const result = await Carrinho.findOne({
            _id: id
        })

        return result
    }

    return false
}

async function getByUtilizador(utilizador) {
    

    utilizador = String(utilizador)

    if (await existsUtilizador(utilizador)){

        const result = await Carrinho.findOne({
            utilizador: utilizador
        })

        return result
    }

    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const carrinhoExists = await Carrinho.exists({
            _id: id
        })
    
        return carrinhoExists ? true : false
    }
    
    return false
}

async function existsUtilizador(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const carrinhoExists = await Carrinho.exists({
            utilizador: id
        })
    
        return carrinhoExists ? true : false
    }
    
    return false
}

async function addProduto(utilizador, produto, quantidade){
    

    if (await existsUtilizador(utilizador) && ProdutoEspecifico.existsId(produto)){

        const result = await Carrinho.updateMany(
            {utilizador: utilizador},
            {$push: {
                produtos: {
                    produto: produto,
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
            return getByUtilizador(utilizador)
        }
    } else{
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }
}

async function addProdutoFormated(utilizador, produto){
    
    utilizador = String(utilizador)
    if (await existsUtilizador(utilizador)){

        const result = await Carrinho.updateMany(
            {utilizador: utilizador},
            {$push: {
                produtos: {
                    produto: produto.produto,
                    quantidade: produto.quantidade
                }
            }}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error adding the entry: " + error.name
            }
        })

        if(result){
            return getByUtilizador(utilizador)
        }
    } else{
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }
}

async function updateProduto(utilizador, produto, quantidade){

    if (await existsUtilizador(utilizador)){

        const result = await Carrinho.updateMany(
            {utilizador: utilizador},
            {$pull: {
                produtos: {
                    produto: produto
                }
            }}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error adding the entry: " + error.name
            }
        })

        await addProduto(utilizador,produto, quantidade)

        if(result){
            return getByUtilizador(utilizador)
        }
    } else{
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }

}

async function updateValor(id){
    

    id = String(id)
    if (await existsId(id)){

        let carrinho_atual = await getById(id)

        let total = 0
        let sem_desconto = 0
        let desconto_total = 0
        for (let produto of carrinho_atual.produtos) {
            let prod_especifico = await ProdutoEspecifico.getById(produto.produto);
            if (prod_especifico == false) {
                throw {
                    code: 400,
                    message: "Um dos produtos no seu carrinho já não está disponivel."
                }
            } 
            let preco = parseFloat(prod_especifico.preco) 
            let desconto = parseFloat(prod_especifico.desconto)
            let quantidade = parseFloat(produto.quantidade)
            if (!desconto) {
                desconto = 0
            } 
            total += (preco - (preco * (desconto / 100))) * quantidade
            sem_desconto += preco * quantidade
            desconto_total += (preco * (desconto / 100)) * quantidade
        }



        let valor = {
            total: total,
            sem_desconto: sem_desconto,
            desconto: desconto_total
        }

        const result = await Carrinho.updateOne(
            {_id: id}, 
            {valor: valor}
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

async function updateProdutos(id, produtos){
    

    id = String(id)
    if (await existsId(id)){

        const result = await Carrinho.updateOne(
            {_id: id}, 
            {produtos: produtos}
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


async function removeProduto(utilizador, produto){
    

    if (await existsUtilizador(utilizador) && ProdutoEspecifico.existsId(produto)){

        const result = await Carrinho.updateMany(
            {utilizador: utilizador},
            {$pull: {
                produtos: {
                    produto: produto
                }
            }}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error adding the entry: " + error.name
            }
        })

        if(result){
            return getByUtilizador(utilizador)
        }
    } else{
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }
}

async function cleanProdutos(id){
    

    id = String(id)

    if (await existsId(id)){

        const result = await Carrinho.updateMany(
            {_id: id},
            {produtos: []}
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

async function deleteById(id){
    

    if (await existsId(id)){
        
        const result = await Carrinho.deleteOne({
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
    getByUtilizador,
    existsUtilizador,
    addProduto,
    addProdutoFormated,
    updateProduto,
    updateValor,
    updateProdutos,
    removeProduto,
    cleanProdutos,
    deleteById
}