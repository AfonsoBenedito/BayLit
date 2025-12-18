const utilizador_handler = require('../../handlers/UtilizadorHandler').handler_utilizador;
let atlas_access = require('../../db/atlas_access')
const config = require("../config.json")
const Mongoose = require("mongoose");
const ConsumidorGW = require('../../gateway/ConsumidorGat');
const auth_handler = require('../../handlers/AutenticacaoHandler').handler_auth;
const Local = require("../../models/Local");
const LocalHistorico = require("../../models/LocalHistorico");
const Consumidor = require("../../models/Consumidor");
const ConsumidorHistorico = require("../../models/ConsumidorHistorico");
const Utilizador = require("../../models/Utilizador");

var consumidor = ""
var local = ""
var local2 = ""

beforeAll(async () => {
    require("../../conn");
    await atlas_access.connectToDB()

    consumidor = await auth_handler.RegistarConsumidor(config.new_username, config.new_email, config.new_password);

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

    const deleted_5 = await Consumidor.deleteOne(
        {_id: consumidor}
    ).exec()

    const deleted_6 = await ConsumidorHistorico.deleteOne(
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
    local = await utilizador_handler.InsertLocal("local_entrega", consumidor.toString(), config.local_morada, config.local_cp, config.local_localidade, config.local_pais)

    expect(typeof local).toBe("object");
    expect(typeof local._id).toBe("object");
    expect(local.tipo).toBe("local_entrega");
    expect(local.pais).toBe(config.local_pais);
})

test("Registar Local Armazem", async () => {
    local2 = await utilizador_handler.InsertLocal("armazem", consumidor.toString(), config.local_morada, config.local_cp, config.local_localidade, config.local_pais)

    expect(typeof local2).toBe("object");
    expect(typeof local2._id).toBe("object");
    expect(local2.tipo).toBe("armazem");
    expect(local2.pais).toBe(config.local_pais);
})

test("Get Local de Entrega", async () => {
    const result = await utilizador_handler.GetLocalByID(local._id.toString())
    
    expect(typeof result).toBe("object");
    expect(typeof result._id).toBe("object");
    expect(result.tipo).toBe("local_entrega");
    expect(result.pais).toBe(config.local_pais);
})

test("Get Armazem", async () => {
    const result = await utilizador_handler.GetLocalByID(local2._id.toString())
    
    expect(typeof result).toBe("object");
    expect(typeof result._id).toBe("object");
    expect(result.tipo).toBe("armazem");
    expect(result.pais).toBe(config.local_pais);
})