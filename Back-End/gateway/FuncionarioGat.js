const Funcionario = require("../models/FuncionarioArmazem");
const Fornecedor = require("../gateway/FornecedorGat");

async function create(fornecedorId, armazemId, nome, idade) {
    
  
    const result = await Funcionario.create({
        fornecedor: fornecedorId,
        armazem: armazemId,
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

        const result = await Funcionario.findOne({
            _id: id
        })

        return result
    }

    return false
}

async function getByFornecedor(fornecedor) {
    

    if (await existsFornecedor(fornecedor)){

        const result = await Funcionario.find({
            fornecedor: fornecedor
        })

        return result
    }
    
    return false
}

async function getByFornecedorENome(fornecedor, nome) {
    

    if (await existsFornecedor(fornecedor)){

        const result = await Funcionario.find({
            fornecedor: fornecedor,
            nome: nome
        })

        return result
    }
    
    return false
}

async function getByArmazem(armazem) {
        

        if (await existsArmazem(armazem)){

            const result = await Funcionario.find({
                armazem: armazem
            })

            return result
        }

    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const funcionarioExists = await Funcionario.exists({
            _id: id
        })
    
        return funcionarioExists ? true : false
    }
    
    return false
}

async function existsFornecedor(fornecedor) {
    if (fornecedor.match(/^[0-9a-fA-F]{24}$/)) {
        
        const funcionarioExists = await Funcionario.exists({
            fornecedor: fornecedor
        })
        
        return funcionarioExists ? true : false
    }
    return false
}

async function existsArmazem(armazem) {
    if (armazem.match(/^[0-9a-fA-F]{24}$/)) {
        

        const funcionarioExists = await Funcionario.exists({
            armazem: armazem
        })

        return funcionarioExists ? true : false
    }
    return false
}

async function updateIdade(id, idade){
    

    if (await existsId(id)){

        const result = await Funcionario.updateOne(
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

        const result = await Funcionario.updateOne(
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

        const result = await Funcionario.updateOne(
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

        const result = await Funcionario.updateMany(
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

        const result = await Funcionario.updateMany(
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

        const result = await Funcionario.deleteOne({
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
    getByFornecedor,
    getByFornecedorENome,
    getByArmazem,
    existsId,
    existsFornecedor,
    existsArmazem,
    deleteById,
    updateIdade,
    updateSalario,
    updateEstado,
    addHorario,
    removeHorario
};