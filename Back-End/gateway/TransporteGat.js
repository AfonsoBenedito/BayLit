const Transporte = require("../models/Transporte");
const Item = require("../gateway/ItemGat")
const Recurso = require("../gateway/RecursoGat")
const Poluicao = require("../gateway/PoluicaoGat")

async function create(transportador, meio_transporte, rota, data_inicio) {
    

    const result = await Transporte.create({
        transportador: transportador,
        meio_transporte: meio_transporte,
        rota: rota,
        data_inicio: data_inicio,
        estado: "Disponivel",
        consumo: 0,
        emissao: 0,
        classificacao: 0
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    return result
}

async function getById(id) {
    

    id = String(id)

    if (await existsId(id)){

        const result = await Transporte.findOne({
            _id: id
        })

        return result
    }

    return false
}

async function getByItemId(item) {
    

    item = String(item)
    if (await existsItem(item)){
        const result = await Transporte.findOne({
            "mercadoria.item": item
        })

        return result
    }

    return false
}

async function getByTransportador(transportador) {
    
    transportador = String(transportador)
    if (await existsTransportador(transportador)){

        const result = await Transporte.find({
            transportador: transportador
        })

        return result
    }

    return false
}

async function getByTransportadorEEstado(transportador, estado) {
    
    transportador = String(transportador)
    if (await existsTransportador(transportador)){

        const result = await Transporte.find({
            transportador: transportador,
            estado: estado
        })

        return result
    }

    return false
}

async function getByTransportadorBetweenDates(transportador, data_inicio_s, data_fim) {
    

    transportador = String(transportador)
    if (await existsTransportador(transportador)){

        const result = await Transporte.find({
            transportador: transportador,
            estado: "Terminado",
            data_inicio: {
                $gte: data_inicio_s,
                $lt: data_fim
            }
        })

        return result
    }

    return false
}

async function getByMeioAndDate(meio, date) {
    

    if (await existsMeio(meio)){

        const result = await Transporte.find({
            meio_transporte: meio,
            data_inicio: date
        }).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error querying: " + error.name
            }
        })

        if (result) {
            return result
        }
    }

    return false
}

async function getAllDisponiveis() {
    

    const result = await Transporte.find({
        estado: "Disponivel"
    }).exec().catch((error) => {
        throw {
            code: 400,
            message: "Error querying: " + error.name
        }
    })

    return result
}

async function getDisponiveisByMeio(meio) {
    

    if (await existsMeio(meio)){

        const result = await Transporte.find({
            meio_transporte: meio,
            estado: "Disponivel"
        }).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error querying: " + error.name
            }
        })

        if (result) {
            return result
        }
    }

    return false
}

async function existsId(id) {

    id = String(id)

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const transporteExists = await Transporte.exists({
            _id: id
        })
    
        return transporteExists ? true : false
    }
    
    return false
}

async function existsTransportador(transportador) {
    if (transportador.match(/^[0-9a-fA-F]{24}$/)) {
        

        const transporteExists = await Transporte.exists({
            transportador: transportador
        })
    
        return transporteExists ? true : false
    }
    
    return false
}

async function existsItem(item) {
    if (item.match(/^[0-9a-fA-F]{24}$/)) {
        

        console.log("aqui")
        const transporteExists = await Transporte.exists({
            "mercadoria.item": item
        })
    
        return transporteExists ? true : false
    }
    
    return false
}

async function existsMeio(meio) {
    if (String(meio).match(/^[0-9a-fA-F]{24}$/)) {
        

        const transporteExists = await Transporte.exists({
            meio_transporte: meio
        })
    
        return transporteExists ? true : false
    }
    
    return false
}

async function updateCondutor(id, condutor){
    

    if (await existsId(id)){

        const result = await Transporte.updateOne(
            {_id: id}, 
            {condutor: condutor}
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

async function updateDistancia(id, distancia){
    

    id = String(id)

    if (await existsId(id)){

        const result = await Transporte.updateOne(
            {_id: id}, 
            {distancia: distancia}
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

async function updateCusto(id, custo){
    

    if (await existsId(id)){

        const result = await Transporte.updateOne(
            {_id: id}, 
            {custo: custo}
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

async function updateLocaisDeEntrega(id, locaisDeEntrega){
    

    if (await existsId(id)){

        const result = await Transporte.updateOne(
            {_id: id}, 
            {locais_entrega: locaisDeEntrega}
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

async function updateDataDeInicio(id, dataDeInicio){
    

    if (await existsId(id)){

        const result = await Transporte.updateOne(
            {_id: id}, 
            {data_inicio: dataDeInicio}
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

async function updateDataDeFim(id, dataDeFim){
    

    if (await existsId(id)){

        const result = await Transporte.updateOne(
            {_id: id}, 
            {data_fim: dataDeFim}
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
    

    if (await existsId(id)){
        
        const result = await Transporte.updateOne(
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

async function startTransporte(id, estado_transporte){
    

    id = String(id)
    if (await existsId(id)){
        
        const result = await Transporte.updateOne(
            {_id: id}, 
            {estado: 'Em movimento',
            estado_transporte: estado_transporte}
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

async function terminateTransporte(id, estado_transporte){
    

    id = String(id)
    if (await existsId(id)){
        
        const result = await Transporte.updateOne(
            {_id: id}, 
            {estado: 'Terminado',
            estado_transporte: estado_transporte}
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

async function updateEstadoTransporte(id, estado_transporte){
    

    id = String(id)
    if (await existsId(id)){
        
        const result = await Transporte.updateOne(
            {_id: id}, 
            {estado_transporte: estado_transporte}
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

async function updateRota(id, rota){
    

    id = String(id)

    if (await existsId(id)){
        
        const result = await Transporte.updateOne(
            {_id: id}, 
            {rota: rota}
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

async function updateMercadoria(id, mercadoria){
    

    id = String(id)

    if (await existsId(id)){
        
        const result = await Transporte.updateOne(
            {_id: id}, 
            {mercadoria: mercadoria}
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

async function updateCadeia(id, consumo, emissao, classificacao){
    

    id = String(id)

    if (await existsId(id)){
        
        const result = await Transporte.updateOne(
            {_id: id}, 
            {consumo: consumo,
            emissao: emissao,
            classificacao: classificacao}
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

        const result = await Transporte.updateMany(
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

async function removeRecurso(id, recurso, quantidade){
    

    if (await existsId(id) && await Recurso.existsId(recurso)){

        const result = await Transporte.updateMany(
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

async function addPoluicao(id, poluicao, quantidade){
    

    if (await existsId(id) && await Poluicao.existsId(poluicao)){

        const result = await Transporte.updateMany(
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

async function removePoluicao(id, poluicao, quantidade){
    

    if (await existsId(id) && await Poluicao.existsId(poluicao)){

        const result = await Transporte.updateMany(
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

async function addMercadoria(id, mercadoria){
    

    id = String(id)

    if (await existsId(id)){

        const result = await Transporte.updateMany(
            {_id: id},
            {$push: { mercadoria: mercadoria }
        }).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error adding the entry: " + error.name
            }
        })

        return result

    } else{
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }
}

async function removeMercadoria(id, item){
    

    if (await existsId(id) && await Item.existsId(item)){

        const result = await Transporte.updateMany(
            {_id: id},
            {$pull: {
                mercadoria: {
                    item: item
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

async function addPedido(id, item, local_entrega){
    

    if (await existsId(id) && await Item.existsId(item)){

        const result = await Transporte.updateMany(
            {_id: id},
            {$push: {
                pedidos: {
                    poluicao: poluicao,
                    local_entrega: local_entrega
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

async function removePedido(id, item){
    

    if (await existsId(id) && await Item.existsId(item)){

        const result = await Transporte.updateMany(
            {_id: id},
            {$pull: {
                pedidos: {
                    item: item
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

        const result = await Transporte.deleteOne({
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
    getByItemId,
    getByTransportadorBetweenDates,
    getByTransportador,
    getByTransportadorEEstado,
    getByMeioAndDate,
    getDisponiveisByMeio,
    getAllDisponiveis,
    existsId,
    existsItem,
    deleteById,
    updateCondutor,
    updateCusto,
    updateDistancia,
    updateLocaisDeEntrega,
    updateDataDeInicio,
    updateDataDeFim,
    updateEstado,
    startTransporte,
    terminateTransporte,
    updateEstadoTransporte,
    updateRota,
    updateMercadoria,
    updateCadeia,
    addMercadoria,
    removeMercadoria,
    addRecurso,
    removeRecurso,
    addPoluicao,
    removePoluicao,
    addPedido,
    removePedido
}