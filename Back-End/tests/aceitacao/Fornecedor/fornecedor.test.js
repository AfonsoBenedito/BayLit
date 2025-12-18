const auth_handler = require('../../../handlers/AutenticacaoHandler').handler_auth;
const utilizador_handler = require('../../../handlers/UtilizadorHandler').handler_utilizador;
const config = require("../config.json")
const Mongoose = require("mongoose");
const Fornecedor = require("../../../models/Fornecedor");
const Local = require("../../../models/Local");
const LocalHistorico = require("../../../models/LocalHistorico");
const Armazem = require("../../../models/Armazem");
const ArmazemHistorico = require("../../../models/ArmazemHistorico");
const FornecedorHistorico = require("../../../models/FornecedorHistorico");
const Utilizador = require("../../../models/Utilizador");
const axios = require('axios');

var fornecedor = ""
var fornecedorToken = ""
var local = ""
var armazem = ""

beforeAll(async () => {
    require("../../../conn");

    fornecedor = await auth_handler.RegistarFornecedor(config.new_username, config.new_email, config.new_password, config.new_morada, config.new_nif, config.new_telemovel);

    local = await utilizador_handler.InsertLocal("armazem", fornecedor._id.toString(), config.local_morada, config.local_cp, config.local_localidade, config.local_pais)

    const data = {
        "email": config.new_email,
        "password": config.new_password
    }

    let response = await axios.post(`${config.link}/auth/login`, data)
    fornecedorToken = response.data.data.auth_token
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

    const deleted_4 = await Local.deleteOne(
        {_id: local._id}
    ).exec()

    const deleted_5 = await LocalHistorico.deleteOne(
        {_id: local._id}
    ).exec()

    const deleted_6 = await Armazem.deleteOne(
        {_id: armazem}
    ).exec()

    const deleted_7 = await ArmazemHistorico.deleteOne(
        {_id: armazem}
    ).exec()

    if(deleted && deleted_2 && deleted_3 && deleted_4 && deleted_5 && deleted_6 && deleted_7){
        Mongoose.connection.close()
    }
})

test("Registar Armazem", async () => {
    const conf = {
        headers:{"Authorization":  `Bearer ${fornecedorToken}`}
    };
    
    const data ={
        "fornecedor": fornecedor._id.toString(),
        "local": local._id.toString(),
        "tamanho": config.armazem_tamanho,
        "gasto_diario": config.armazem_gasto_diario
    }

    let response =  await axios.post(`${config.link}/utilizador/fornecedor/armazem`, data, conf)
    armazem = response.data.data._id

    expect(response.data["code"]).toBe(200);
    expect(response.data["message"]).toBe("Success");
})