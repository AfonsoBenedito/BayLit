const Condutor = require("../models/Condutor");

async function create(transportador, nome, idade) {
    

    const result = await Condutor.create({
        transportador: transportador,
        nome: nome,
        idade: idade
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

        const result = await Condutor.findOne({
            _id: id
        })

        return result
    }

    return false
}

async function getByTransportador(transportador) {
    

    if (await existsTransportador(transportador)){

        const result = await Condutor.find({
            transportador: transportador
        })

        return result
    }

    return false
}

async function getByTransportadorENome(transportador, nome) {
    

    if (await existsTransportador(transportador)){

        const result = await Condutor.find({
            transportador: transportador,
            nome: nome
        })

        return result
    }

    return false
}

async function getByName(name) {
    

    if (await existsName(name)){

        const result = await Condutor.find({
            nome: name
        })

        return result
    }
    return false
}

async function getByEstado(estado) {
    

    if (await existsEstado(estado)){

        const result = await Condutor.find({
            estado: estado
        })

        return result
    }
    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const condutorExists = await Condutor.exists({
            _id: id
        })
    
        return condutorExists ? true : false
    }
    
    return false
}

async function existsTransportador(transportador) {
    if (transportador.match(/^[0-9a-fA-F]{24}$/)) {
        
        
        const condutorExists = await Condutor.exists({
            transportador: transportador
        })
    
        return condutorExists ? true : false
    }
    
    return false
}

async function existsName(name) {
    
  
    const condutorExists = await Condutor.exists({
        nome: name
    })

    return condutorExists ? true : false
}

async function existsEstado(estado) {
    
  
    const condutorExists = await Condutor.exists({
        estado: estado
    })

    return condutorExists ? true : false
}

async function updateName(id, name){
    

    if (await existsId(id)){

        const result = await Condutor.updateOne(
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

async function updateTransportador(id, transportador){
    
    
    if (await existsId(id)){

        const result = await Condutor.updateOne(
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

async function updateIdade(id, idade){
    

    if (await existsId(id)){

        const result = await Condutor.updateOne(
            {_id: id}, 
            {idade: idade}
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

async function updateSalario(id, salario){
    

    if (await existsId(id)){

        const result = await Condutor.updateOne(
            {_id: id}, 
            {salario: salario}
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

        const result = await Condutor.updateOne(
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

async function addHorario(id, dia, hora_entrada, hora_saida){
    

    if (await existsId(id)){

        const result = await Condutor.updateMany(
            {_id: id},
            {$push: {
                horario: {
                    dia: dia,
                    hora_entrada: hora_entrada,
                    hora_saida: hora_saida
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

async function removeHorario(id, dia, hora_entrada, hora_saida){
    

    if (await existsId(id)){

        const result = await Condutor.updateMany(
            {_id: id},
            {$pull: {
                horario: {
                    dia: dia,
                    hora_entrada: hora_entrada,
                    hora_saida: hora_saida
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

        const result = await Condutor.deleteOne({
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
    getByTransportador,
    getByTransportadorENome,
    getByName,
    getByEstado,
    existsId,
    existsName,
    existsTransportador,
    existsEstado,
    deleteById,
    updateName,
    updateTransportador,
    updateIdade,
    updateSalario,
    updateEstado,
    addHorario,
    removeHorario
}