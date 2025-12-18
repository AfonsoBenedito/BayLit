const auth_handler = require('../../../handlers/AutenticacaoHandler').handler_auth;
const config = require("../config.json")
const Mongoose = require("mongoose");
const Fornecedor = require("../../../models/Fornecedor");
const FornecedorHistorico = require("../../../models/FornecedorHistorico");
const Utilizador = require("../../../models/Utilizador");
const axios = require('axios');

var fornecedor = ""

beforeAll(async () => {
    require("../../../conn");
})

afterAll(async () => {
    const deleted = await Fornecedor.deleteOne(
        {_id: fornecedor}
    ).exec()

    const deleted_2 = await FornecedorHistorico.deleteOne(
        {_id: fornecedor}
    ).exec()

    const deleted_3 = await Utilizador.deleteOne(
        {_id: fornecedor}
    ).exec()
    if(deleted && deleted_2 && deleted_3){
        Mongoose.connection.close()
    }
})

test("Registar Fornecedor", async () => {
    const result = await auth_handler.RegistarFornecedor(config.new_username, config.new_email, config.new_password, config.new_morada, config.new_nif, config.new_telemovel);

    expect(typeof result.id).toBe("object");
})

test("Login Fornecedor Válido", async () => {
    const data = {
        "email": config.new_email,
        "password": config.new_password
    }
    let response = await axios.post(`${config.link}/auth/login`, data)

    fornecedor = response.data.data.user.id

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
        "telemovel": config.new_telemovel
    }

    let response = await axios.post(`${config.link}/auth/register/fornecedor`, data)

    expect(response.data.code).toBe(400);
    expect(response.data.message).toBe("Password inválida. A password deve ter no mínimo 8 caracteres e conter pelo menos uma letra minúscula, uma maiúscula, um número e um caracter especial.");
})

test("Registar Fornecedor Telemóvel Inválido", async () => {
    const data = {
        "nome": config.new_username,
        "email": config.new_email_2,
        "password": config.new_password,
        "morada": config.new_morada,
        "nif": config.new_nif,
        "telemovel": config.invalid_telemovel
    }

    let response = await axios.post(`${config.link}/auth/register/fornecedor`, data)

    expect(response.data.code).toBe(400);
    expect(response.data.message).toBe("Número de telemóvel inválido.");
})

test("Registar Fornecedor NIF Inválido", async () => {
    const data = {
        "nome": config.new_username,
        "email": config.new_email_2,
        "password": config.new_password,
        "morada": config.new_morada,
        "nif": config.invalid_nif,
        "telemovel": config.new_telemovel
    }

    let response = await axios.post(`${config.link}/auth/register/fornecedor`, data)

    expect(response.data.code).toBe(400);
    expect(response.data.message).toBe("NIF inválido.");
})

test("Registar Fornecedor Email Inválido", async () => {
    const data = {
        "nome": config.new_username,
        "email": config.invalid_email,
        "password": config.new_password,
        "morada": config.new_morada,
        "nif": config.new_nif,
        "telemovel": config.new_telemovel
    }

    let response = await axios.post(`${config.link}/auth/register/fornecedor`, data)

    expect(response.data.code).toBe(400);
    expect(response.data.message).toBe("E-mail inválido.");
})