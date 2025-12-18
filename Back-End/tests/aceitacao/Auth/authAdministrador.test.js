const config = require("../config.json")
const Mongoose = require("mongoose");
const AdministradorGW = require("../../../gateway/AdministradorGat")
const axios = require('axios');

var adminToken = ""

beforeAll(async () => {
    require("../../../conn");
})

afterAll(async () => {
    Mongoose.connection.close()
})

test("Login Administrador", async () => {
    const data = {
        "nome": config.admin_username,
        "password": config.admin_password
    }

    let response = await axios.post(`${config.link}/auth/login/administrador`, data)
    adminToken = response.data.data.auth_token

    expect(response.data.code).toBe(200);
    expect(response.data.message).toBe("Success");
    expect(typeof adminToken).toBe("string");
})

test("Registar Administrador", async () => {
    const bearer = {
        headers:{"Authorization":  `Bearer ${adminToken}`}
    };

    const data ={
    "nome": config.new_admin_username,
    "password": config.new_admin_password
    }

    let response =  await axios.post(`${config.link}/auth/register/administrador`, data, bearer)

    expect(response.data.code).toBe(201);
    expect(response.data.message).toBe("Success");

    const deleted = await AdministradorGW.deleteById(response.data.data.user.id)
    expect(deleted).toBe(true);
})

test("Registar Administrador Password Inválida", async () => {
    const bearer = {
        headers:{"Authorization":  `Bearer ${adminToken}`}
    };

    const data ={
    "nome": config.new_admin_username,
    "password": config.invalid_password
    }

    let response =  await axios.post(`${config.link}/auth/register/administrador`, data, bearer)

    expect(response.data.code).toBe(400);
    expect(response.data.message).toBe("Password inválida. A password deve ter no mínimo 8 caracteres e conter pelo menos uma letra minúscula, uma maiúscula, um número e um caracter especial.");
})

test("Registar Administrador Nome em Uso", async () => {
    const bearer = {
        headers:{"Authorization":  `Bearer ${adminToken}`}
    };

    const data ={
        "nome": config.admin_username, 
        "password": config.admin_password
    }

    let response =  await axios.post(`${config.link}/auth/register/administrador`, data, bearer)

    expect(response.data.code).toBe(400);
    expect(response.data.message).toBe("Este nome já está em uso. Insira um novo nome.");
})

test("Login Administrador Password Errada", async () => {
    const data = {
        "nome": config.admin_username,
        "password": config.new_admin_password
    }

    let response = await axios.post(`${config.link}/auth/login/administrador`, data)

    expect(response.data.code).toBe(400);
    expect(response.data.message).toBe("O nome e a password fornecidas não correspondem");
})

test("Login Administrador Username Não Existe", async () => {
    const data = {
        "nome": config.new_admin_username,
        "password": config.new_admin_password
    }

    let response = await axios.post(`${config.link}/auth/login/administrador`, data)

    expect(response.data.code).toBe(400);
    expect(response.data.message).toBe("O nome fornecido não está registado na plataforma");
})