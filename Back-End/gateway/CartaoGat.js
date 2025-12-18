const Cartao = require("../models/Cartao");

async function create(n_cartao, data_expiracao, codigo, nome) {
    

    const result = await Cartao.create({
        n_cartao: n_cartao,
        data_expiracao: data_expiracao,
        codigo: codigo,
        nome: nome
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

        const result = await Cartao.findOne({
            _id: id
        })

        return result
    }
    
    return false
}

async function getByName(name) {
    

    if (await existsName(name)){

        const result = await Cartao.find({
            nome: name
        })

        return result
    }

    return false
}

async function getByNumero(n_cartao) {
    

    if (await existsNumero(n_cartao)){

        const result = await Cartao.findOne({
            n_cartao: n_cartao
        })

        return result
    }

    return false
}

async function getByCode(codigo) {
    

    if (await existsCode(codigo)){

        const result = await Cartao.findOne({
            codigo: codigo
        })

        return result
    }

    return false
}

async function existsId(id) {  
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        
        
        const cartaoExists = await Cartao.exists({
            _id: id
        })
    
        return cartaoExists ? true : false
    }
    
    return false
}

async function existsName(name) {
    
  
    const cartaoExists = await Cartao.exists({
        nome: name
    })

    return cartaoExists ? true : false
}

async function existsNumero(n_cartao) {
    
  
    const cartaoExists = await Cartao.exists({
        n_cartao: n_cartao
    })

    return cartaoExists ? true : false
}

async function existsCode(codigo) {
    
  
    const cartaoExists = await Cartao.exists({
        codigo: codigo
    })

    return cartaoExists ? true : false
}

module.exports = {
    create,
    getById,
    existsId,
    getByName,
    existsName,
    getByNumero,
    existsNumero,
    getByCode,
    existsCode
}