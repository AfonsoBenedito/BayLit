const auth_handler = require('../../../handlers/AutenticacaoHandler').handler_auth;
const config = require("../config.json")
const Mongoose = require("mongoose");
const UtilizadorGW = require('../../../gateway/UtilizadorGat');
const NaoAutenticadoGW = require('../../../gateway/NaoAutenticadoGat');
const Consumidor = require("../../../models/Consumidor");
const ConsumidorHistorico = require("../../../models/ConsumidorHistorico");
const Utilizador = require("../../../models/Utilizador");
const axios = require('axios');

var consumidor = ""

beforeAll(async () => {
    require("../../../conn");
})

afterAll(async () =>{
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

test("Registar Não Autenticado", async () => {
    let response = await axios.post(`${config.link}/auth/register/nao_autenticado`)

    const deleted_user = await UtilizadorGW.deleteById(response.data.data.user.id)
    const deleted_na = await NaoAutenticadoGW.deleteById(response.data.data.user.id)

    expect(response.data.code).toBe(201);
    expect(response.data.message).toBe("Success");
    expect(typeof response.data.data.auth_token).toBe("string");
    expect(deleted_user).toBe(true);
    expect(deleted_na).toBe(true);
})

test("Registar Consumidor", async () => {
    const result = await auth_handler.RegistarConsumidor(config.new_username, config.new_email, config.new_password);

    expect(typeof result.id).toBe("object");
})
    
test("Login Utilizador Válido", async () => {
    const data = {
        "email": config.new_email,
        "password": config.new_password
    }
    let response = await axios.post(`${config.link}/auth/login`, data)

    consumidor = response.data.data.user.id

    expect(response.data.code).toBe(200);
    expect(response.data.message).toBe("Success");
    expect(typeof response.data.data.auth_token).toBe("string");
})

test("Registar Consumidor Password Inválida", async () => {
    const data = {
        "nome": config.new_username,
        "email": config.new_email_2,
        "password": config.invalid_password,
        "morada": config.new_morada,
        "nif": config.new_nif,
        "telemovel": config.new_telemovel
    }

    let response = await axios.post(`${config.link}/auth/register/consumidor`, data)

    expect(response.data.code).toBe(400);
    expect(response.data.message).toBe("Password inválida. A password deve ter no mínimo 8 caracteres e conter pelo menos uma letra minúscula, uma maiúscula, um número e um caracter especial.");
})

test("Registar Consumidor Email Inválido", async () => {
    const data = {
        "nome": config.new_username,
        "email": config.invalid_email,
        "password": config.new_password,
        "morada": config.new_morada,
        "nif": config.new_nif,
        "telemovel": config.new_telemovel
    }
    let response = await axios.post(`${config.link}/auth/register/consumidor`, data)

    expect(response.data.code).toBe(400);
    expect(response.data.message).toBe("E-mail inválido.");
})

test("Registar Consumidor Email em Uso", async () => {
    const data = {
        "nome": config.new_username,
        "email": config.new_email,
        "password": config.new_password,
        "morada": config.new_morada,
        "nif": config.new_nif,
        "telemovel": config.new_telemovel
    }
    let response = await axios.post(`${config.link}/auth/register/consumidor`, data)

    expect(response.data.code).toBe(400);
    expect(response.data.message).toBe("Este email já está em uso. Insira um novo e-mail.");
})

test("Login Utilizador Password Errada", async () => {
    const data = {
        "email": config.new_email,
        "password": config.invalid_password
    }
    let response = await axios.post(`${config.link}/auth/login`, data)

    expect(response.data.code).toBe(400);
    expect(response.data.message).toBe("O e-mail e a password fornecidas não correspondem");
})

test("Login Utilizador Email Não Existe", async () => {
    const data = {
        "email": "_" + config.new_email,
        "password": config.invalid_password
    }
    let response = await axios.post(`${config.link}/auth/login`, data)

    expect(response.data.code).toBe(400);
    expect(response.data.message).toBe("O e-mail fornecido não está registado na plataforma");
})