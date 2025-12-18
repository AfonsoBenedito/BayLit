let atlas_access = require('../../db/atlas_access')
const utilizador_handler = require('../../handlers/UtilizadorHandler').handler_utilizador;
const auth_handler = require('../../handlers/AutenticacaoHandler').handler_auth;
const config = require("../config.json")
const Mongoose = require("mongoose");
const Consumidor = require("../../models/Consumidor");
const ConsumidorHistorico = require("../../models/ConsumidorHistorico");
const Utilizador = require("../../models/Utilizador");

var consumidor = ""

beforeAll(async () => {
    require("../../conn");
    await atlas_access.connectToDB()

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
    const result = await utilizador_handler.GetAllUtilizadores();
    expect(typeof result).toBe("object");
})

test("Get Utilizador por Id", async () => {
    const result = await utilizador_handler.GetUtilizadorByID(consumidor.toString());
    
    expect(typeof result).toBe("object");
    expect(result._id).toStrictEqual(consumidor);
    expect(result.tipo).toBe('Consumidor');
})

test("Get Utilizador por Email", async () => {
    const result = await utilizador_handler.GetUtilizadorByEmail(config.new_email);

    expect(typeof result).toBe("object");
    expect(result._id).toStrictEqual(consumidor);
    expect(result.tipo).toBe('Consumidor');
})