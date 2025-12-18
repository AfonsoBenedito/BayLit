let atlas_access = require('../../db/atlas_access')
const auth_handler = require('../../handlers/AutenticacaoHandler').handler_auth;
const config = require("../config.json")
const Mongoose = require("mongoose");
const Transportador = require("../../models/Transportador");
const TransportadorHistorico = require("../../models/TransportadorHistorico");
const Utilizador = require("../../models/Utilizador");

var transportador = ""

beforeAll(async () => {
    require("../../conn");
    await atlas_access.connectToDB()
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
    transportador = await auth_handler.RegistarTransportador(config.new_username, config.new_email, config.new_password, config.new_morada, config.new_nif, config.new_telemovel, config.new_portes);

    expect(typeof transportador).toBe("object");
})

test("Login Transportador Válido", async () => {
    const result = await auth_handler.Login(config.new_email, config.new_password);

    expect(typeof result.id).toBe("object");
    expect(result.tipo).toBe("Transportador");
})

test("Registar Fornecedor Password Inválida", async () => {
    const result = await auth_handler.RegistarTransportador(config.new_username, config.new_email_2, config.invalid_password, config.new_morada, config.new_nif, config.new_telemovel, config.new_portes).catch(
        (err) => {
            expect(err.code).toBe(400);
            expect(err.message).toBe("Password inválida. A password deve ter no mínimo 8 caracteres e conter pelo menos uma letra minúscula, uma maiúscula, um número e um caracter especial.");
        }
    )

    expect(typeof result).not.toBe("object");
})

test("Registar Transportador Telemóvel Inválido", async () => {
    const result = await auth_handler.RegistarTransportador(config.new_username, config.new_email_2, config.new_password, config.new_morada, config.new_nif, config.invalid_telemovel, config.new_portes).catch(
        (err) => {
            expect(err.code).toBe(400);
            expect(err.message).toBe("Número de telemóvel inválido.");
        }
    )

    expect(typeof result).not.toBe("object");
})

test("Registar Transportador Email Inválido", async () => {
    const result = await auth_handler.RegistarTransportador(config.new_username, config.invalid_email, config.new_password, config.new_morada, config.new_nif, config.new_telemovel, config.new_portes).catch(
        (err) => {
            expect(err.code).toBe(400);
            expect(err.message).toBe("E-mail inválido.");
        }
    )

    expect(typeof result).not.toBe("object");
})