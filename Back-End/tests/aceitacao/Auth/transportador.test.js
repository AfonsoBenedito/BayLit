const auth_handler = require('../../../handlers/AutenticacaoHandler').handler_auth;
const config = require("../config.json")
const Mongoose = require("mongoose");
const Transportador = require("../../../models/Transportador");
const TransportadorHistorico = require("../../../models/TransportadorHistorico");
const Utilizador = require("../../../models/Utilizador");
const axios = require('axios');

var transportador = ""

beforeAll(async () => {
    require("../../../conn");
})

afterAll(async () =>{
    const deleted = await Transportador.deleteOne(
        {_id: transportador}
    ).exec()

    const deleted_2 = await TransportadorHistorico.deleteOne(
        {_id: transportador}
    ).exec()

    const deleted_3 = await Utilizador.deleteOne(
        {_id: transportador}
    ).exec()
    if(deleted && deleted_2 && deleted_3){
        Mongoose.connection.close()
    }
})

test("Registar Transportador", async () => {
    const result = await auth_handler.RegistarTransportador(config.new_username, config.new_email, config.new_password, config.new_morada, config.new_nif, config.new_telemovel, config.new_portes);

    expect(typeof result.id).toBe("object");
})

test("Login Transportador Válido", async () => {
    const data = {
        "email": config.new_email,
        "password": config.new_password
    }
    let response = await axios.post(`${config.link}/auth/login`, data)

    transportador = response.data.data.user.id

    expect(response.data.code).toBe(200);
    expect(response.data.message).toBe("Success");
    expect(typeof response.data.data.auth_token).toBe("string");
})

test("Registar Fornecedor Password Inválida", async () => {
    const data = {
        "nome": config.new_username,
        "email": config.new_email_2,
        "password": config.invalid_password,
        "morada": config.new_morada,
        "nif": config.new_nif,
        "telemovel": config.new_telemovel,
        "portes_encomenda": config.new_portes
    }

    let response = await axios.post(`${config.link}/auth/register/transportador`, data)

    expect(response.data.code).toBe(400);
    expect(response.data.message).toBe("Password inválida. A password deve ter no mínimo 8 caracteres e conter pelo menos uma letra minúscula, uma maiúscula, um número e um caracter especial.");
})

test("Registar Transportador Telemóvel Inválido", async () => {
    const data = {
        "nome": config.new_username,
        "email": config.new_email_2,
        "password": config.new_password,
        "morada": config.new_morada,
        "nif": config.new_nif,
        "telemovel": config.invalid_telemovel,
        "portes_encomenda": config.new_portes
    }

    let response = await axios.post(`${config.link}/auth/register/transportador`, data)

    expect(response.data.code).toBe(400);
    expect(response.data.message).toBe("Número de telemóvel inválido.");
})

test("Registar Transportador Email Inválido", async () => {
    const data = {
        "nome": config.new_username,
        "email": config.invalid_email,
        "password": config.new_password,
        "morada": config.new_morada,
        "nif": config.new_nif,
        "telemovel": config.new_telemovel,
        "portes_encomenda": config.new_portes
    }

    let response = await axios.post(`${config.link}/auth/register/transportador`, data)

    expect(response.data.code).toBe(400);
    expect(response.data.message).toBe("E-mail inválido.");
})