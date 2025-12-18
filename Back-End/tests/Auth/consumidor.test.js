let atlas_access = require('../../db/atlas_access')
const auth_handler = require('../../handlers/AutenticacaoHandler').handler_auth;
const config = require("../config.json")
const Mongoose = require("mongoose");
const UtilizadorGW = require('../../gateway/UtilizadorGat');
const NaoAutenticadoGW = require('../../gateway/NaoAutenticadoGat');
const Consumidor = require("../../models/Consumidor");
const ConsumidorHistorico = require("../../models/ConsumidorHistorico");
const Utilizador = require("../../models/Utilizador");

var consumidor = ""

beforeAll(async () => {
    require("../../conn");
    await atlas_access.connectToDB()
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
    const result = await auth_handler.RegistarNaoAutenticado();
    expect(typeof result).toBe("object");

    const deleted_user = await UtilizadorGW.deleteById(result.toString())
    const deleted_na = await NaoAutenticadoGW.deleteById(result.toString())
    expect(deleted_user).toBe(true);
    expect(deleted_na).toBe(true);
})

test("Registar Consumidor", async () => {
    consumidor = await auth_handler.RegistarConsumidor(config.new_username, config.new_email, config.new_password);

    expect(typeof consumidor.id).toBe("object");
})
    
test("Login Utilizador Válido", async () => {
    const result = await auth_handler.Login(config.new_email, config.new_password);

    expect(typeof result.id).toBe("object");
    expect(result.tipo).toBe("Consumidor");
})

test("Registar Consumidor Password Inválida", async () => {
    const result = await auth_handler.RegistarConsumidor(config.new_username, config.new_email_2, config.invalid_password).catch(
        (err) => {
            expect(err.code).toBe(400);
            expect(err.message).toBe("Password inválida. A password deve ter no mínimo 8 caracteres e conter pelo menos uma letra minúscula, uma maiúscula, um número e um caracter especial.");
        }
    )

    expect(typeof result).not.toBe("object");
})

test("Registar Consumidor Email Inválido", async () => {
    const result = await auth_handler.RegistarConsumidor(config.new_username, config.invalid_email, config.new_password).catch(
        (err) => {
            expect(err.code).toBe(400);
            expect(err.message).toBe("E-mail inválido.");
        }
    )

    expect(typeof result).not.toBe("object");
})

test("Registar Consumidor Email em Uso", async () => {
    const result = await auth_handler.RegistarConsumidor(config.new_username, config.new_email, config.new_password).catch(
        (err) => {
            expect(err.code).toBe(400);
            expect(err.message).toBe("Este email já está em uso. Insira um novo e-mail.");
        }
    )

    expect(typeof result).not.toBe("object");
})

test("Login Utilizador Password Errada", async () => {
    const result = await auth_handler.Login(config.new_email, config.invalid_password).catch(
        (err) => {
            expect(err.code).toBe(400);
            expect(err.message).toBe("O e-mail e a password fornecidas não correspondem");
        }
    )

    expect(typeof result).not.toBe("object");
})

test("Login Utilizador Email Não Existe", async () => {
    const result = await auth_handler.Login("_" + config.new_email, config.invalid_password).catch(
        (err) => {
            expect(err.code).toBe(400);
            expect(err.message).toBe("O e-mail fornecido não está registado na plataforma");
        }
    )

    expect(typeof result).not.toBe("object");
})