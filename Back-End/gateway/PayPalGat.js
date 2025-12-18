const PayPal = require("../models/PayPal");

async function create(email) {
    

    const result = await PayPal.create({
        email: email
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

            const result = await PayPal.findOne({
                _id: id
            })

            return result
        }
    return false
}

async function existsId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        

        const payPalExists = await PayPal.exists({
            _id: id
        })
    
        return payPalExists ? true : false
    }
    
    return false
}

async function updateEmail(id, email){
    

    if (await existsId(id)){

        const result = await PayPal.updateOne(
            {_id: id}, 
            {email: email}
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

async function deleteById(id){
    

    if (await existsId(id)){

        const result = await PayPal.deleteOne(
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

module.exports = {
    create,
    getById,
    existsId,
    deleteById,
    updateEmail
}