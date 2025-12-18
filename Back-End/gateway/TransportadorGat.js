const Mongoose = require("mongoose");
const Transportador = require("../models/Transportador");
const TransportadorHistorico = require("../models/TransportadorHistorico");
const Utilizador = require("../gateway/UtilizadorGat");
const Encomenda = require("../gateway/EncomendaGat");
const MeioTransporte = require("../gateway/MeioTransporteGat");
const Condutor = require("../gateway/CondutorGat");
const Produto = require("../gateway/ProdutoGat");
const MetodoPagamento = require("../gateway/MetodoPagamentoGat");

async function create(nome, email, password, morada, nif, telemovel, portes_encomenda) {
    

    const result = await Transportador.create({
        nome: nome,
        email: email,
        password: password,
        morada: morada,
        nif: nif,
        telemovel: telemovel,
        portes_encomenda: portes_encomenda
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    await TransportadorHistorico.create({
        _id: result._id,
        nome: nome,
        email: email,
        password: password,
        morada: morada,
        nif: nif,
        telemovel: telemovel,
        portes_encomenda: portes_encomenda
    })

    return result
}

async function createV(id, nome, email, password, morada, nif, telemovel, portes_encomenda) {
    
    const result = await Transportador.create({
        _id: id,
        nome: nome,
        email: email,
        password: password,
        morada: morada,
        nif: nif,
        telemovel: telemovel,
        portes_encomenda: portes_encomenda
    }).catch((error) => {
        throw {
            code: 400,
            message: "Error creating the entry: " + error.name
        }
    })

    await TransportadorHistorico.create({
        _id: result._id,
        nome: nome,
        email: email,
        password: password,
        morada: morada,
        nif: nif,
        telemovel: telemovel,
        portes_encomenda: portes_encomenda
    })

    return result
}

async function getAll() {
    
    
    const result = await Transportador.find()

    return result
}

async function getById(id) {
    

    id = String(id)

    if (await existsId(id)){

        const result = await Transportador.findOne({
            _id: id
        })

        return result
    }

    return false
}

async function getHistoricoById(id) {

    id = String(id)

    const result = await TransportadorHistorico.findOne({
        _id: id
    })

    return result
    
}

async function getByEmail(email) {
    

    if (await existsEmail(email)){
        const result = await Transportador.findOne({
            email: email
        })

        return result
    }

    return false
}

async function getBySede(sede) {
    

    if (await existsSede(sede)){

        const result = await Transportador.find({
            sede: sede
        })

        return result
    }

    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const userExists = await Transportador.exists({
            _id: id
        })
    
        return userExists ? true : false
    }
    
    return false
}

async function existsEmail(email) {
    
  
    const userExists = await Transportador.exists({
        email: email
    })
    
    return userExists ? true : false
}

async function existsSede(sede) {
    
  
    const userExists = await Transportador.exists({
        sede: sede
    })

    return userExists ? true : false
}

async function updateEmail(id, email){
    

    if (await existsId(id)){

        const result = await Transportador.updateOne(
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

        const result = await Transportador.updateOne(
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

        const result = await Transportador.updateOne(
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

        const result = await Transportador.updateOne(
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

async function updateNif(id, nif){
    

    if (await existsId(id)){

        const result = await Transportador.updateOne(
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

async function updateTelemovel(id, telemovel){
    

    if (await existsId(id)){

        const result = await Transportador.updateOne(
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

async function updateSede(id, sede){
    

    if (await existsId(id)){

        const result = await Transportador.updateOne(
            {_id: id}, 
            {sede: sede}
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

async function updateRaioDeAcao(id, raioDeAcao){
    

    if (await existsId(id)){

        const result = await Transportador.updateOne(
            {_id: id}, 
            {raio_acao: raioDeAcao}
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

async function updatePrecoKm(id, precoKm){
    

    if (await existsId(id)){

        const result = await Transportador.updateOne(
            {_id: id}, 
            {preco_km: precoKm}
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

async function updatePortesEncomenda(id, portes_encomenda){
    

    if (await existsId(id)){

        const result = await Transportador.updateOne(
            {_id: id}, 
            {portes_encomenda: portes_encomenda}
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

async function addEncomenda(id, encomenda){
    

    if (await existsId(id) && await Encomenda.existsId(encomenda)){

        const result = await Transportador.updateMany(
            {_id: id},
            {$push: {
                encomendas: encomenda
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

async function removeEncomenda(id, encomenda){
    

    if (await existsId(id) && await Encomenda.existsId(encomenda)){

        const result = await Transportador.updateMany(
            {_id: id},
            {$pull: {
                encomendas: encomenda
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

async function addMeioDeTransporte(id, meioDeTransporte){
    

    if (await existsId(id) && await MeioTransporte.existsId(meioDeTransporte)){

        const result = await Transportador.updateMany(
            {_id: id},
            {$push: {
                meios_transporte: meioDeTransporte
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

async function removeMeioDeTransporte(id, meioDeTransporte){
    

    if (await existsId(id) && await MeioTransporte.existsId(meioDeTransporte)){

        const result = await Transportador.updateMany(
            {_id: id},
            {$pull: {
                meios_transporte: meioDeTransporte
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

async function addCondutor(id, condutor){
    

    if (await existsId(id) && Condutor.existsId(condutor)){

        const result = await Transportador.updateMany(
            {_id: id},
            {$push: {
                condutores: condutor
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

async function removeCondutor(id, condutor){
    

    if (await existsId(id) && Condutor.existsId(condutor)){

        const result = await Transportador.updateMany(
            {_id: id},
            {$pull: {
                condutores: condutor
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

async function addUtilizadorFavorito(id, utilizadorFavorito){
    

    if (await existsId(id) && Utilizador.existsId(utilizadorFavorito)){

        const result = await Transportador.updateMany(
            {_id: id},
            {$push: {
                utilizadores_favoritos: utilizadorFavorito
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

async function removeUtilizadorFavorito(id, utilizadorFavorito){
    

    if (await existsId(id) && Utilizador.existsId(utilizadorFavorito)){

        const result = await Transportador.updateMany(
            {_id: id},
            {$pull: {
                utilizadores_favoritos: utilizadorFavorito
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

async function addProdutoFavorito(id, produtoFavorito){
    

    if (await existsId(id) && Produto.existsId(produtoFavorito)){

        const result = await Transportador.updateMany(
            {_id: id},
            {$push: {
                produtos_favoritos: produtoFavorito
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

async function removeProdutoFavorito(id, produtoFavorito){
    

    if (await existsId(id) && Produto.existsId(produtoFavorito)){

        const result = await Transportador.updateMany(
            {_id: id},
            {$pull: {
                produtos_favoritos: produtoFavorito
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

async function addMetodoDePagamento(id, method, isFavorite){
    

    if (await existsId(id) && MetodoPagamento.existsId(method)){
        
        const result = await Transportador.updateMany(
            {_id: id},
            {$push: {
                metodos_pagamento: {
                    metodo: method,
                    favorito: isFavorite
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

async function removeMetodoDePagamento(id, method){
    
    
    if (await existsId(id) && MetodoPagamento.existsId(method)){
        
        const result = await Transportador.updateMany(
            {_id: id},
            {$pull: {metodos_pagamento: {
                metodo: method
            }}}
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

        const result = await Transportador.deleteOne({
            _id: id
        }).exec().catch((error) => {
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

module.exports = {
    create,
    createV,
    getAll,
    getById,
    getHistoricoById,
    getByEmail,
    getBySede,
    existsEmail,
    existsId,
    existsSede,
    deleteById,
    updateEmail,
    updateName,
    updatePassword,
    updateMorada,
    updateNif,
    updateTelemovel,
    updateSede,
    updateRaioDeAcao,
    updatePrecoKm,
    updatePortesEncomenda,
    addEncomenda,
    removeEncomenda,
    addMeioDeTransporte,
    removeMeioDeTransporte,
    addCondutor,
    removeCondutor,
    addUtilizadorFavorito,
    removeUtilizadorFavorito,
    addProdutoFavorito,
    removeProdutoFavorito,
    addMetodoDePagamento,
    removeMetodoDePagamento
}