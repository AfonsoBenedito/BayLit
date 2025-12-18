const auth_handler = require('../../../handlers/AutenticacaoHandler').handler_auth;
const config = require("../config.json")
const Mongoose = require("mongoose");
const axios = require('axios');
const Consumidor = require("../../../models/Consumidor");
const ConsumidorHistorico = require("../../../models/ConsumidorHistorico");
const Utilizador = require("../../../models/Utilizador");

var consumidor = ""

beforeAll(async () => {
    require("../../../conn");

    consumidor = await auth_handler.RegistarConsumidor(config.new_username, config.new_email, config.new_password);

    expect(typeof consumidor).toBe("object");
})

afterAll(async () => {
    const deleted = await Consumidor.deleteOne(
        {_id: consumidor}
    ).exec()

    const deleted_2 = await ConsumidorHistorico.deleteOne(
        {_id: consumidor}
    ).exec()

    const deleted_3 = await Utilizador.deleteOne(
        {_id: consumidor}
    ).exec()
    if(deleted && deleted_2 && deleted_3){
        Mongoose.connection.close()
    }
})

test("Get Utilizadores", async () => {
    let response = await axios.get(`${config.link}/utilizador`)

    expect(response.data["code"]).toBe(200);
    expect(response.data["message"]).toBe("Success");
})

test("Get Utilizador por Id", async () => {
    let response = await axios.get(`${config.link}/utilizador`, consumidor.toString())

    expect(response.data["code"]).toBe(200);
    expect(response.data["message"]).toBe("Success");
})

test("Get Utilizador por Email", async () => {
    let response = await axios.get(`${config.link}/utilizador`, config.new_email)

    expect(response.data["code"]).toBe(200);
    expect(response.data["message"]).toBe("Success");
})