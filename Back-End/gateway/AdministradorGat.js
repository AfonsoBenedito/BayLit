const Administrador = require("../models/Administrador");
const Utilizador = require("../gateway/UtilizadorGat");

async function create(nome, password) {
    
  
    const result = await Administrador.create({
        nome: nome,
        password: password
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

        const result = await Administrador.findOne({
            _id: id
        })

        return result
    }

    return false
}

async function getByName(name) {
    

    if (await existsName(name)){

        const result = await Administrador.findOne({
            nome: name
        })

        return result
    }

    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const doesAdminExists = await Administrador.exists({
            _id: id
        })
    
        return doesAdminExists ? true : false
    }
    
    return false
}

async function existsName(nome) {
    
  
    const doesAdminExists = await Administrador.exists({
        nome: nome
    })

    return doesAdminExists ? true : false
}

async function updatePassword(id, newPassword) {
    

    if (await existsId(id)){

        const result = await Administrador.updateOne(
            {_id: id}, 
            {password: newPassword}
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

async function updateName(id, newName) {
    

    if (await existsId(id)){
        const result = await Administrador.updateOne(
            {_id: id}, 
            {nome: newName}
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

async function congelar(id, idUtilizador, minutos, motivo){
    

    if (await existsId(id) && await Utilizador.existsId(idUtilizador)){
        const inicio = new Date();
        const fim = new Date();
        fim.setMinutes(inicio.getMinutes() + minutos)

        const result = await Administrador.updateMany(
            {_id: id},
            {$push: {
                congelamentos: {
                    utilizador: idUtilizador,
                    inicio: inicio,
                    fim: fim,
                    motivo: motivo
                }
            }}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error \"congelando\" the entry: " + error.name
            }
        })

        if(result){
            Utilizador.congelar(idUtilizador);
            return true
        }
    } else{
        throw {
            code: 400,
            message: "The id entered doesn't exist"
        }
    }
}

async function descongelar(id, idUtilizador){
    

    if (await existsId(id) && await Utilizador.existsId(idUtilizador)){

        const result = await Administrador.updateMany(
            {_id: id},
            {$pull: {
                congelamentos: {
                    utilizador: idUtilizador
                }
            }}
        ).exec().catch((error) => {
            throw {
                code: 400,
                message: "Error \"descongelando\" the entry: " + error.name
            }
        })

        if(result){
            Utilizador.descongelar(idUtilizador);
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
        const result = await Administrador.deleteOne(
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

/*
async function run(){
    const teste = await deleteById("626179efb8698611d0c0ef02").catch((error) => {
        return error
    })
    console.log(teste)
}
run()
*/

module.exports = {
    create,
    getById,
    getByName,
    existsId,
    existsName,
    updatePassword,
    updateName,
    deleteById,
    congelar,
    descongelar
};
