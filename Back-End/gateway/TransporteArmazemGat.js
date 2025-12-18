const TransporteArmazem = require("../models/TransporteArmazem");

async function create(item, distancia, consumo, emissao, classificacao, desperdicio) {
    

    const result = await TransporteArmazem.create({
        item: item,
        distancia: distancia,
        consumo: consumo,
        emissao: emissao,
        classificacao: classificacao,
        desperdicio: desperdicio
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

            const result = await TransporteArmazem.findOne({
                _id: id
            })

            return result
        }

    return false
}

async function getByItem(item) {
    

    item = String(item)
    if (await existsItem(item)){
        
        const result = await TransporteArmazem.find({
            item: item
        })

        return result
    }

    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const transporteArmazemExists = await TransporteArmazem.exists({
            _id: id
        })
    
        return transporteArmazemExists ? true : false
    }
    
    return false
}

async function existsItem(item) {

    item = String(item)

    if (item.match(/^[0-9a-fA-F]{24}$/)) {
        

        const transporteArmazemExists = await TransporteArmazem.exists({
            item: item
        })
    
        return transporteArmazemExists ? true : false
    }
    
    return false
}

async function updateDistancia(id, distancia){
    

    if (await existsId(id)){

        const result = await TransporteArmazem.updateOne(
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

async function updateItem(id, item){
    

    if (await existsId(id)){

        const result = await TransporteArmazem.updateOne(
            {_id: id}, 
            {item: item}
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

        const result = await TransporteArmazem.updateMany(
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

        const result = await TransporteArmazem.updateMany(
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

        const result = await TransporteArmazem.updateMany(
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

        const result = await TransporteArmazem.updateMany(
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
    

    if (await existsId(id)){

        const result = await TransporteArmazem.deleteOne({
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
    getByItem,
    existsId,
    existsItem,
    updateDistancia,
    updateItem,
    addRecurso,
    addPoluicao,
    removeRecurso,
    removePoluicao,
    deleteById
}