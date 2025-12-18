let atlas_access = require('../../db/atlas_access')
const auth_handler = require('../../handlers/AutenticacaoHandler').handler_auth;
const config = require("../config.json")
const Mongoose = require("mongoose");
const AdministradorGW = require("../../gateway/AdministradorGat")

beforeAll(async () => {
    require("../../conn");
    await atlas_access.connectToDB()
})

afterAll(async () => {
    Mongoose.connection.close()
})

test("Login Administrador", async () => {
    const result = await auth_handler.LoginAdministrador(config.admin_username, config.admin_password);
    
    expect(typeof result.id).toBe("object");
    expect(result.tipo).toBe("Administrador");
})

test("Registar Administrador", async () => {
    const result = await auth_handler.RegistarAdministrador(config.new_admin_username, config.new_admin_password);

    expect(typeof result).toBe("object");

    const deleted = await AdministradorGW.deleteById(result.toString())
    expect(deleted).toBe(true);
})

test("Registar Administrador Password Inválida", async () => {
    const result = await auth_handler.RegistarAdministrador(config.new_admin_username, config.invalid_password).catch(
        (err) => {
            expect(err.code).toBe(400);
            expect(err.message).toBe("Password inválida. A password deve ter no mínimo 8 caracteres e conter pelo menos uma letra minúscula, uma maiúscula, um número e um caracter especial.");
        }
    )

    expect(typeof result).not.toBe("object");
})

test("Registar Administrador Nome em Uso", async () => {
    const result = await auth_handler.RegistarAdministrador(config.admin_username, config.admin_password).catch(
        (err) => {
            expect(err.code).toBe(400);
            expect(err.message).toBe("Este nome já está em uso. Insira um novo nome.");
        }
    )

    expect(typeof result).not.toBe("object");
})

test("Login Administrador Password Errada", async () => {
    const result = await auth_handler.LoginAdministrador(config.admin_username, config.admin_password + "_").catch(
        (err) => {
            expect(err.code).toBe(400);
            expect(err.message).toBe("O nome e a password fornecidas não correspondem");
        }
    )

    expect(typeof result).not.toBe("object");
})

test("Login Administrador Username Não Existe", async () => {
    const result = await auth_handler.LoginAdministrador(config.admin_username + "_", config.admin_password).catch(
        (err) => {
            expect(err.code).toBe(400);
            expect(err.message).toBe("O nome fornecido não está registado na plataforma");
        }
    )

    expect(typeof result).not.toBe("object");
})