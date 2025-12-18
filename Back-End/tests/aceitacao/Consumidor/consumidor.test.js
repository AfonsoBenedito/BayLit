const config = require("../config.json")
const Mongoose = require("mongoose");
const auth_handler = require('../../../handlers/AutenticacaoHandler').handler_auth;
const axios = require('axios');
const Consumidor = require("../../../models/Consumidor");
const ConsumidorHistorico = require("../../../models/ConsumidorHistorico");
const Utilizador = require("../../../models/Utilizador");

var consumidor = ""
var adminToken = ""

beforeAll(async () => {
    require("../../../conn");

    consumidor = await auth_handler.RegistarConsumidor(config.new_username, config.new_email, config.new_password);

    const data = {
        "nome": config.admin_username,
        "password": config.admin_password
    }

    let response = await axios.post(`${config.link}/auth/login/administrador`, data)
    adminToken = response.data.data.auth_token

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
    let response = await axios.get(`${config.link}/utilizador/consumidor`)

    expect(response.data["code"]).toBe(200);
    expect(response.data["message"]).toBe("Success");
})

test("Update Nome Consumidor", async () => {
    const conf = {
        headers:{"Authorization":  `Bearer ${adminToken}`}
    };

    const url = `${config.link}/utilizador/consumidor`;
    
    const data ={
        "id": consumidor,
        "nome": config.update_username
    }

    let response =  await axios.put(url, data, conf)

    expect(response.data["code"]).toBe(200);
    expect(response.data["message"]).toBe("Consumidor atualizado com sucesso");
})

test("Update Password Consumidor", async () => {
    const conf = {
        headers:{"Authorization":  `Bearer ${adminToken}`}
    };

    const url = `${config.link}/utilizador/consumidor`;
    
    const data ={
        "id": consumidor,
        "password_antiga": config.new_password,
        "password_nova": config.update_password
    }

    let response =  await axios.put(url, data, conf)

    expect(response.data["code"]).toBe(200);
    expect(response.data["message"]).toBe("Consumidor atualizado com sucesso");
})

test("Update NIF Consumidor", async () => {
    const conf = {
        headers:{"Authorization":  `Bearer ${adminToken}`}
    };

    const url = `${config.link}/utilizador/consumidor`;
    
    const data ={
        "id": consumidor,
        "nif": config.update_nif
    }

    let response =  await axios.put(url, data, conf)

    expect(response.data["code"]).toBe(200);
    expect(response.data["message"]).toBe("Consumidor atualizado com sucesso");
})

test("Update Telemovel Consumidor", async () => {
    const conf = {
        headers:{"Authorization":  `Bearer ${adminToken}`}
    };

    const url = `${config.link}/utilizador/consumidor`;
    
    const data ={
        "id": consumidor,
        "telemovel": config.update_telemovel
    }

    let response =  await axios.put(url, data, conf)

    expect(response.data["code"]).toBe(200);
    expect(response.data["message"]).toBe("Consumidor atualizado com sucesso");
})