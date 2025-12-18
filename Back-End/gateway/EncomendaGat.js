const Encomenda = require("../models/Encomenda");
const Produto = require("../gateway/ProdutoEspecificoGat")
const Item = require("../gateway/ItemGat")
const Transporte = require("../gateway/TransporteGat")

async function create(comprador, transportador, valor, transporte, prazo_cancelamento, data_encomenda, data_entrega, local_entrega, estado, produtos) {
    

    const result = await Encomenda.create({
        comprador: comprador,
        transportador: transportador,
        valor: valor,
        transporte: transporte,
        prazo_cancelamento: prazo_cancelamento,
        data_encomenda: data_encomenda,
        data_entrega: data_entrega,
        local_entrega: local_entrega,
        estado: estado,
        produtos: produtos
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    return result
}

async function getAll() {
    

    const result = await Encomenda.find({}).catch((error) => {
        throw {
            code: 400,
            message: "Error querying: " + error.name
        }
    })

    return result
}

async function getAllNaoConfirmadas() {
    

    const result = await Encomenda.find({
        estado: "Por confirmar"
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error querying: " + error.name
        }
    })

    return result
}

async function getById(id) {
    

    if (await existsId(id)){

        const result = await Encomenda.findOne({
            _id: id
        })

        return result
    }
    
    return false
}

async function getByComprador(comprador) {
    

    if (await existsComprador(comprador)){

        const result = await Encomenda.find({
            comprador: comprador
        })

        return result
    }
    
    return false
}

async function getByItem(item) {
    

    item = String(item)
    const result = await Encomenda.findOne({
        "produtos.itens": item
    })
    
    return result
}

async function getByTransportador(transportador) {
    

    if (await existsTransportador(transportador)){

        const result = await Encomenda.find({
            comprador: transportador
        })

        return result
    }
    
    return false
}

async function getByDataDeEncomenda(data_encomenda) {
    

    if (await existsDataEncomenda(data_encomenda)){

        const result = await Encomenda.find({
            data_encomenda: data_encomenda
        })

        return result
    }
    return false
}

async function getByEstado(estado) {
    

    if (await existsEstado(estado)){

        const result = await Encomenda.find({
            estado: estado
        })

        return result
    }
    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const encomendaExists = await Encomenda.exists({
            _id: id
        })
    
        return encomendaExists ? true : false
    }
    
    return false
}

async function existsComprador(compradorId) {
    if (compradorId.match(/^[0-9a-fA-F]{24}$/)) {
        

        const encomendaExists = await Encomenda.exists({
            comprador: compradorId
        })
    
        return encomendaExists ? true : false
    }
    
    return false
}

async function existsTransportador(transportadorId) {
    if (transportadorId.match(/^[0-9a-fA-F]{24}$/)) {
        

        const encomendaExists = await Encomenda.exists({
            transportador: transportadorId
        })
    
        return encomendaExists ? true : false
    }
    
    return false
}

async function existsDataEncomenda(dataEncomenda) {
    
  
    const encomendaExists = await Encomenda.exists({
        data_encomenda: dataEncomenda
    })

    return encomendaExists ? true : false    
}

async function existsEstado(estado) {
    
  
    const encomendaExists = await Encomenda.exists({
        estado: estado
    })

    return encomendaExists ? true : false    
}

async function updateComprador(id, comprador){
    

    if (await existsId(id)){

        const result = Encomenda.updateOne(
            {_id: id}, 
            {comprador: comprador}
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

async function updateTransportador(id, transportador){
    

    if (await existsId(id)){

        const result = Encomenda.updateOne(
            {_id: id}, 
            {transportador: transportador}
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

async function updateValor(id, valor){
    

    if (await existsId(id)){

        const result = Encomenda.updateOne(
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

async function updatePrazoCancelamento(id, cancelamento){
    

    if (await existsId(id)){
        const result = Encomenda.updateOne(
            {_id: id}, 
            {prazo_cancelamento: cancelamento}
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

async function updateDataEncomenda(id, dataEncomenda){
    

    if (await existsId(id)){

        const result = Encomenda.updateOne(
            {_id: id}, 
            {data_encomenda: dataEncomenda}
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

async function updateDataEntrega(id, dataEntrega){
    

    if (await existsId(id)){

        const result = Encomenda.updateOne(
            {_id: id}, 
            {data_entrega: dataEntrega}
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
    

    id = String(id)
    if (await existsId(id)){

        const result = Encomenda.updateOne(
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

async function updatePagamento(id, pagamento){
    

    if (await existsId(id)){
        Encomenda.updateOne(
            {_id: id}, 
            {pagamento: pagamento}
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
        const result = Encomenda.updateOne(
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

async function addProduto(id, produtoEspecifico, quantidade, itens){
    

    if (await existsId(id) && await Produto.existsId(produtoEspecifico)){

        const result = await Encomenda.updateMany(
            {_id: id},
            {$push: {
                produtos: {
                    produto_especifico: produtoEspecifico,
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

async function addTransporte(id, item, transporte){
    

    if (await existsId(id) && await Item.existsId(item) && await Transporte.existsId(transporte)){

        const result = await Encomenda.updateMany(
            {_id: id},
            {$push: {
                transportes: {
                    item: item,
                    transporte: transporte
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

async function removeTransporte(id, item, transporte){
    

    if (await existsId(id) && await Item.existsId(item) && await Transporte.existsId(transporte)){

        const result = await Encomenda.updateMany(
            {_id: id},
            {$pull: {
                transportes: {
                    item: item,
                    transporte: transporte
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

async function removeProduto(id, produtoEspecifico, quantidade, itens){
    
    if (await existsId(id) && Produto.existsId(produtoEspecifico)){

        const result = await Encomenda.updateMany(
            {_id: id},
            {$pull: {
                produtos: {
                    produto_especifico: produtoEspecifico,
                    quantidade: quantidade,
                    itens: itens
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

        const result = Encomenda.deleteOne({
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
    getAllNaoConfirmadas,
    getById,
    existsId,
    getByComprador,
    getByItem,
    existsComprador,
    getByTransportador,
    existsTransportador,
    getByDataDeEncomenda,
    existsDataEncomenda,
    getByEstado,
    existsEstado,
    deleteById,
    updateComprador,
    updateTransportador,
    updateValor,
    updatePrazoCancelamento,
    updateDataEncomenda,
    updateDataEntrega,
    updateEstado,
    updatePagamento,
    updateProdutos,
    addProduto,
    addTransporte,
    removeTransporte,
    removeProduto
}