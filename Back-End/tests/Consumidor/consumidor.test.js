let atlas_access = require('../../db/atlas_access')
const config = require("../config.json")
const Mongoose = require("mongoose");
const consumidor_handler = require('../../handlers/ConsumidorHandler').handler_consumidor;
const auth_handler = require('../../handlers/AutenticacaoHandler').handler_auth;
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

test("Get Consumidores", async () => {
    const result = await consumidor_handler.GetAllConsumidores();
    expect(typeof result).toBe("object");
})

test("Update Nome Consumidor", async () => {
    const result = await consumidor_handler.UpdateConsumidor(consumidor.toString(), config.update_username, null, null, null, null, null, null);
    
    expect(typeof result).toBe("object");
    expect(result.nome).toBe(config.update_username);
    expect(result.email).toBe(config.new_email);
})

test("Update Password Consumidor", async () => {
    const result = await consumidor_handler.UpdateConsumidor(consumidor.toString(), null, null, config.new_password, config.update_password, null, null, null);
    
    expect(typeof result).toBe("object");
    expect(result.nome).toBe(config.update_username);
    expect(result.email).toBe(config.new_email);
})

test("Update NIF Consumidor", async () => {
    const result = await consumidor_handler.UpdateConsumidor(consumidor.toString(), null, null, null, null, null, config.update_nif, null);
    
    expect(typeof result).toBe("object");
    expect(result.nome).toBe(config.update_username);
    expect(result.email).toBe(config.new_email);
    expect(result.nif).toBe(config.update_nif);
})

test("Update Telemovel Consumidor", async () => {
    const result = await consumidor_handler.UpdateConsumidor(consumidor.toString(), null, null, null, null, null, null, config.update_telemovel);
    
    expect(typeof result).toBe("object");
    expect(result.nome).toBe(config.update_username);
    expect(result.email).toBe(config.new_email);
    expect(result.telemovel).toBe(config.update_telemovel);
})