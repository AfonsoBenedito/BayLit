let atlas_access = require('../../db/atlas_access')
const auth_handler = require('../../handlers/AutenticacaoHandler').handler_auth;
const fornecedor_handler = require('../../handlers/FornecedorHandler').handler_fornecedor;
const utilizador_handler = require('../../handlers/UtilizadorHandler').handler_utilizador;
const config = require("../config.json")
const Mongoose = require("mongoose");
const Fornecedor = require("../../models/Fornecedor");
const Local = require("../../models/Local");
const LocalHistorico = require("../../models/LocalHistorico");
const Armazem = require("../../models/Armazem");
const ArmazemHistorico = require("../../models/ArmazemHistorico");
const FornecedorHistorico = require("../../models/FornecedorHistorico");
const Utilizador = require("../../models/Utilizador");

var fornecedor = ""
var local = ""
var armazem = ""

beforeAll(async () => {
    require("../../conn");
    await atlas_access.connectToDB()

    fornecedor = await auth_handler.RegistarFornecedor(config.new_username, config.new_email, config.new_password, config.new_morada, config.new_nif, config.new_telemovel);

    local = await utilizador_handler.InsertLocal("armazem", fornecedor._id.toString(), config.local_morada, config.local_cp, config.local_localidade, config.local_pais)
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
        {_id: armazem._id}
    ).exec()

    const deleted_7 = await ArmazemHistorico.deleteOne(
        {_id: armazem._id}
    ).exec()

    if(deleted && deleted_2 && deleted_3 && deleted_4 && deleted_5 && deleted_6 && deleted_7){
        Mongoose.connection.close()
    }
})

test("Registar Armazem", async () => {
    armazem = await fornecedor_handler.InsertArmazem(fornecedor._id.toString(), local._id.toString(), config.armazem_tamanho, config.armazem_gasto_diario)

    expect(typeof armazem).toBe("object");
    expect(typeof armazem._id).toBe("object");
    expect(armazem.fornecedor).toStrictEqual(fornecedor._id);
    expect(armazem.tamanho).toBe(config.armazem_tamanho);
    expect(armazem.gasto_diario).toBe(config.armazem_gasto_diario);
})