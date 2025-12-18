const Venda = require("../models/Venda");

async function create(fornecedor, comprador, produto, quantidade, itens, data, valor) {
    

    const result = await Venda.create({
        fornecedor: fornecedor,
        comprador: comprador,
        produto: produto,
        quantidade: quantidade,
        itens: itens,
        data: data,
        valor: valor,
        estado: "Confirmada"
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

        const result = await Venda.findOne({
            _id: id
        })

        return result
    }

    return false
}

async function getAll() {
    


    const result = await Venda.find()

    return result
}

async function getByFornecedor(fornecedor) {
    

    if (await existsFornecedor(fornecedor)){

        const result = await Venda.find({
            fornecedor: fornecedor
        })

        return result
    }

    return false
}

async function getByFornecedorBetweenDates(fornecedor, data_inicio, data_fim) {
    

    if (await existsFornecedor(fornecedor)){

        const result = await Venda.find({
            fornecedor: fornecedor,
            estado: "Confirmada",
            data: {
                $gte: data_inicio,
                $lt: data_fim
            }
        })

        return result
    }

    return false
}

async function getByItems(itens) {
    

    const result = await Venda.findOne({
        itens: itens
    })

    return result
    
}

async function getByItem(item) {
    

    item = String(item)
    const result = await Venda.findOne({
        itens: item
    })

    return result
    
}

async function getByComprador(comprador) {
    

    if (await existsComprador(comprador)){

        const result = await Venda.find({
            comprador: comprador
        })

        return result
    }

    return false
}

async function getByMetodoDePagamento(metodoDePagamento) {
    

    const result = await Venda.find({
        metodoDePagamento: metodoDePagamento
    })

    return result
}

async function updateEstado(id, estado){
    

    id = String(id)
    if (await existsId(id)){

        const result = Venda.updateOne(
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

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const vendaExists = await Venda.exists({
            _id: id
        })
    
        return vendaExists ? true : false
    }
    
    return false
}

async function existsFornecedor(fornecedor) {
    if (fornecedor.match(/^[0-9a-fA-F]{24}$/)) {
        

        const vendaExists = await Venda.exists({
            fornecedor: fornecedor
        })
    
        return vendaExists ? true : false
    }
    
    return false
}

async function existsComprador(comprador) {
    if (comprador.match(/^[0-9a-fA-F]{24}$/)) {
        

        const vendaExists = await Venda.exists({
            comprador: comprador
        })
    
        return vendaExists ? true : false
    }
    
    return false
}

async function deleteById(id){
    

    if (await existsId(id)){
        
        const result = await Venda.deleteOne({
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
    getByFornecedor,
    getByFornecedorBetweenDates,
    getByComprador,
    getByItems,
    getByItem,
    getByMetodoDePagamento,
    updateEstado,
    existsId,
    existsFornecedor,
    deleteById
}