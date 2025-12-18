const Mongoose = require("mongoose");

const ItemModel = require("./models/Item")

async function test(){

    await require("./conn");

    await ItemModel.deleteMany({
        produto_especifico: "62b4a2a57517d16932f01b31"
    })

    Mongoose.connection.close()
}

test()