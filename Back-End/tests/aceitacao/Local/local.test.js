const config = require("../config.json")
const Mongoose = require("mongoose");
const auth_handler = require('../../../handlers/AutenticacaoHandler').handler_auth;
const Local = require("../../../models/Local");
const LocalHistorico = require("../../../models/LocalHistorico");
const Consumidor = require("../../../models/Consumidor");
const Utilizador = require("../../../models/Utilizador");
const ConsumidorHistorico = require("../../../models/ConsumidorHistorico");
const axios = require('axios');

var consumidor = ""
var consumidorToken = ""
var local = ""
var local2 = ""

beforeAll(async () => {
    require("../../../conn");

    consumidor = await auth_handler.RegistarConsumidor(config.new_username, config.new_email, config.new_password);

    const data = {
        "email": config.new_email,
        "password": config.new_password
    }
    let response = await axios.post(`${config.link}/auth/login`, data)

    consumidorToken = response.data.data.auth_token

    expect(typeof consumidor).toBe("object");
})

afterAll(async () => {
    const deleted = await Local.deleteOne(
        {_id: local._id}
    ).exec()

    const deleted_2 = await LocalHistorico.deleteOne(
        {_id: local._id}
    ).exec()

    const deleted_3 = await Local.deleteOne(
        {_id: local2._id}
    ).exec()

    const deleted_4 = await LocalHistorico.deleteOne(
        {_id: local2._id}
    ).exec()

    const deleted_5 = await ConsumidorHistorico.deleteOne(
        {_id: consumidor}
    ).exec()

    const deleted_6 = await Consumidor.deleteOne(
        {_id: consumidor}
    ).exec()

    const deleted_7 = await Utilizador.deleteOne(
        {_id: consumidor}
    ).exec()

    if(deleted && deleted_2 && deleted_3 && deleted_4 && deleted_5 && deleted_6 && deleted_7){
        Mongoose.connection.close()
    }
})

test("Registar Local", async () => {
    const conf = {
        headers:{"Authorization": `Bearer ${consumidorToken}`}
    };
    
    const data ={
        "tipo": "local_entrega",
        "utilizador": consumidor.toString(),
        "morada": config.local_morada,
        "codigo_postal": config.local_cp,
        "localidade": config.local_localidade,
        "pais": config.local_pais
    }

    let response =  await axios.post(`${config.link}/utilizador/local`, data, conf)
    local = response.data.data

    expect(response.data["code"]).toBe(200);
    expect(response.data["message"]).toBe("Success");
})

test("Registar Local Armazem", async () => {
    const conf = {
        headers:{"Authorization": `Bearer ${consumidorToken}`}
    };
    
    const data ={
        "tipo": "armazem",
        "utilizador": consumidor.toString(),
        "morada": config.local_morada,
        "codigo_postal": config.local_cp,
        "localidade": config.local_localidade,
        "pais": config.local_pais
    }

    let response =  await axios.post(`${config.link}/utilizador/local`, data, conf)
    local2 = response.data.data

    expect(response.data["code"]).toBe(200);
    expect(response.data["message"]).toBe("Success");
})

test("Get Local de Entrega", async () => {
    const conf = {
        "utilizador": consumidor,
        "local": local._id
    }

    let response = await axios.get(`${config.link}/utilizador/local?utilizador=${conf.utilizador}`, {
        headers:{"Authorization": 'Bearer '+ consumidorToken},
        data: conf
    })

    expect(response.data["code"]).toBe(200);
    expect(response.data["message"]).toBe("Success")
})

test("Get Armazem", async () => {
    const conf = {
        "utilizador": consumidor,
        "local": local2._id
    }

    let response = await axios.get(`${config.link}/utilizador/local?utilizador=${conf.utilizador}`, {
        headers:{"Authorization": 'Bearer '+ consumidorToken},
        data: conf
    })

    expect(response.data["code"]).toBe(200);
    expect(response.data["message"]).toBe("Success")
})