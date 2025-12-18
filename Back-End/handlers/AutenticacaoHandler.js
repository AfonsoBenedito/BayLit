const ConsumidorGW = require("../gateway/ConsumidorGat")
const FornecedorGW = require("../gateway/FornecedorGat")
const TransportadorGW = require("../gateway/TransportadorGat")
const ConsumidorPorConfirmarGW = require("../gateway/ConsumidorPorConfirmarGat")
const FornecedorPorConfirmarGW = require("../gateway/FornecedorPorConfirmarGat")
const TransportadorPorConfirmarGW = require("../gateway/TransportadorPorConfirmarGat")
const UtilizadorPorConfirmarGW = require("../gateway/UtilizadorPorConfirmarGat")
const UtilizadorGW = require("../gateway/UtilizadorGat")
const AdministradorGW = require("../gateway/AdministradorGat")
const { isObjectIdOrHexString } = require("mongoose")
const bcrypt = require("bcrypt")
const email_validator = require("email-validator");

const CarrinhoGW = require("../gateway/CarrinhoGat")
const NaoAutenticadoGW = require("../gateway/NaoAutenticadoGat")

const utils = require("../utils");

const nodemailer = require('nodemailer');


class HandlerAutenticacao {

    async RegistarConsumidorNaoVerificado(nome, email, password){
        
        var isValid = false;
        if (email_validator.validate(email)) {
            let consumidor_exists = await ConsumidorGW.existsEmail(email)
            let fornecedor_exists = await FornecedorGW.existsEmail(email)
            let transportador_exists = await TransportadorGW.existsEmail(email)
            if (!consumidor_exists && !fornecedor_exists && !transportador_exists) {
                let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
                if (strongPassword.test(password)) {
                    isValid = true;
                } else {
                    throw {
                        code: 400,
                        message: "Password inválida. A password deve ter no mínimo 8 caracteres e conter pelo menos uma letra minúscula, uma maiúscula, um número e um caracter especial.",
                        field: "passE"
                    }
                }
            } else {
                throw {
                    code: 400,
                    message: "Este email já está em uso. Insira um novo e-mail.",
                    field: "mailUsedE"
                }
            }
        } else {
            throw {
                code: 400,
                message: "E-mail inválido.",
                field: "mailE"
            }
        }

        if (isValid) {
            try {
                // encrypt password
                var password = bcrypt.hashSync(password, 10);

                // falta resolver aqui o async / await
                const created = await ConsumidorPorConfirmarGW.create(nome, email, password)

                await CarrinhoGW.create(created._id)
                
                return created

            } catch (err) {
                throw {
                    code: 400,
                    message: "Não foi possível registar o novo utilizador. Tente novamente",
                    field: "errorE"
                }
            }   
        }
    }

    async RegistarConsumidor(nome, email, password){
        
        var isValid = false;
        if (email_validator.validate(email)) {
            let consumidor_exists = await ConsumidorGW.existsEmail(email)
            let fornecedor_exists = await FornecedorGW.existsEmail(email)
            let transportador_exists = await TransportadorGW.existsEmail(email)
            if (!consumidor_exists && !fornecedor_exists && !transportador_exists) {
                let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
                if (strongPassword.test(password)) {
                    isValid = true;
                } else {
                    throw {
                        code: 400,
                        message: "Password inválida. A password deve ter no mínimo 8 caracteres e conter pelo menos uma letra minúscula, uma maiúscula, um número e um caracter especial.",
                        field: "passE"
                    }
                }
            } else {
                throw {
                    code: 400,
                    message: "Este email já está em uso. Insira um novo e-mail.",
                    field: "mailUsedE"
                }
            }
        } else {
            throw {
                code: 400,
                message: "E-mail inválido.",
                field: "mailE"
            }
        }

        if (isValid) {
            try {
                // encrypt password
                var password = bcrypt.hashSync(password, 10);

                // falta resolver aqui o async / await
                const created = await ConsumidorGW.create(nome, email, password)
                
                await CarrinhoGW.create(created._id)
                
                return created._id

            } catch (err) {
                throw {
                    code: 400,
                    message: "Não foi possível registar o novo utilizador. Tente novamente",
                    field: "errorE"
                }
            }   
        }
    }

    async GetNaoVerificado(verificacao){
        
        try {        
            let utilizador_por_confirmar = await UtilizadorPorConfirmarGW.getByConfirmation(verificacao)

            if (utilizador_por_confirmar) {
                return utilizador_por_confirmar
            } else {
                throw {
                    code: 400,
                    message: "Pedido inválido"
                }
            }
        } catch (err) {
            throw {
                code: 400,
                message: "Não foi possível registar o novo utilizador. Tente novamente",
                field: "errorE"
            }
        }   
    }

    async RegistarVerificacaoConsumidor(utilizador_nao_verificado){
        
        try {        
            let consumidor_por_confirmar = await ConsumidorPorConfirmarGW.getByConfirmation(utilizador_nao_verificado.confirmation)

            if (consumidor_por_confirmar) {

                let consumidor = await ConsumidorGW.createV(consumidor_por_confirmar._id, consumidor_por_confirmar.nome, consumidor_por_confirmar.email, consumidor_por_confirmar.password)
                return consumidor._id
            } else {
                throw {
                    code: 400,
                    message: "Pedido inválido"
                }
            }
        } catch (err) {
            throw {
                code: 400,
                message: "Não foi possível registar o novo utilizador. Tente novamente",
                field: "errorE"
            }
        }   
    }

    async RegistarVerificacaoFornecedor(utilizador_nao_verificado){
        
        try {        
            let fornecedor_por_confirmar = await FornecedorPorConfirmarGW.getByConfirmation(utilizador_nao_verificado.confirmation)

            if (fornecedor_por_confirmar) {

                let fornecedor = await FornecedorGW.createV(fornecedor_por_confirmar._id, fornecedor_por_confirmar.nome, fornecedor_por_confirmar.email, fornecedor_por_confirmar.password,
                                                    fornecedor_por_confirmar.morada, fornecedor_por_confirmar.nif, fornecedor_por_confirmar.telemovel)
                return fornecedor._id
            } else {
                throw {
                    code: 400,
                    message: "Pedido inválido"
                }
            }
        } catch (err) {
            throw {
                code: 400,
                message: "Não foi possível registar o novo utilizador. Tente novamente",
                field: "errorE"
            }
        }   
    }

    async RegistarVerificacaoTransportador(utilizador_nao_verificado){
        
        try {        
            let transportador_por_confirmar = await TransportadorPorConfirmarGW.getByConfirmation(utilizador_nao_verificado.confirmation)

            if (transportador_por_confirmar) {

                let transportador = await TransportadorGW.createV(transportador_por_confirmar._id, transportador_por_confirmar.nome, transportador_por_confirmar.email, transportador_por_confirmar.password,
                                                transportador_por_confirmar.morada, transportador_por_confirmar.nif, transportador_por_confirmar.telemovel,
                                                transportador_por_confirmar.portes_encomenda)
                return transportador._id
            } else {
                throw {
                    code: 400,
                    message: "Pedido inválido"
                }
            }
        } catch (err) {
            throw {
                code: 400,
                message: "Não foi possível registar o novo utilizador. Tente novamente",
                field: "errorE"
            }
        }   
    }

    async RegistarConsumidorGoogle(nome, email){
        try {
            const created = await ConsumidorGW.createGoogle(nome, email)
            
            await CarrinhoGW.create(created._id)
            
            return created._id

        } catch (err) {
            throw {
                code: 400,
                message: "Não foi possível registar o novo utilizador. Tente novamente",
                field: "errorE"
            }
        }   
    }

    async RegistarFornecedor(nome, email, password, morada, nif, telemovel){
        
        var isValid = false;
        if (email_validator.validate(email)) {
            let consumidor_exists = await ConsumidorGW.existsEmail(email)
            let fornecedor_exists = await FornecedorGW.existsEmail(email)
            let transportador_exists = await TransportadorGW.existsEmail(email)
            if (!consumidor_exists && !fornecedor_exists && !transportador_exists) {
                let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
                if (strongPassword.test(password)) {
                    if (utils.isInt(nif) && nif.toString().length == 9) {
                        if (utils.isInt(nif) && telemovel.toString().length == 9) {
                            isValid = true;
                        } else {
                            throw {
                                code: 400,
                                message: "Número de telemóvel inválido."
                            }
                        }
                    } else {
                        throw {
                            code: 400,
                            message: "NIF inválido."
                        }
                    }
                } else {
                    throw {
                        code: 400,
                        message: "Password inválida. A password deve ter no mínimo 8 caracteres e conter pelo menos uma letra minúscula, uma maiúscula, um número e um caracter especial."
                    }
                }
            } else {
                throw {
                    code: 400,
                    message: "Este email já está em uso. Insira um novo e-mail."
                }
            }
        } else {
            throw {
                code: 400,
                message: "E-mail inválido."
            }
        }
        

        if (isValid) {
            try {
                // encrypt password
                var password = bcrypt.hashSync(password, 10);

                // falta resolver aqui o async / await
                const created = await FornecedorGW.create(nome, email, password, morada, nif, telemovel)
                return created._id

            } catch (err) {
                throw {
                    code: 400,
                    message: "Não foi possível registar o novo utilizador."
                }
            }   
        }

    }

    async RegistarFornecedorNaoVerificado(nome, email, password, morada, nif, telemovel){
        
        var isValid = false;
        if (email_validator.validate(email)) {
            let consumidor_exists = await ConsumidorGW.existsEmail(email)
            let fornecedor_exists = await FornecedorGW.existsEmail(email)
            let transportador_exists = await TransportadorGW.existsEmail(email)
            if (!consumidor_exists && !fornecedor_exists && !transportador_exists) {
                let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
                if (strongPassword.test(password)) {
                    if (utils.isInt(nif) && nif.toString().length == 9) {
                        if (utils.isInt(nif) && telemovel.toString().length == 9) {
                            isValid = true;
                        } else {
                            throw {
                                code: 400,
                                message: "Número de telemóvel inválido."
                            }
                        }
                    } else {
                        throw {
                            code: 400,
                            message: "NIF inválido."
                        }
                    }
                } else {
                    throw {
                        code: 400,
                        message: "Password inválida. A password deve ter no mínimo 8 caracteres e conter pelo menos uma letra minúscula, uma maiúscula, um número e um caracter especial."
                    }
                }
            } else {
                throw {
                    code: 400,
                    message: "Este email já está em uso. Insira um novo e-mail."
                }
            }
        } else {
            throw {
                code: 400,
                message: "E-mail inválido."
            }
        }
        

        if (isValid) {
            try {
                // encrypt password
                var password = bcrypt.hashSync(password, 10);

                console.log("aqui")
                // falta resolver aqui o async / await
                const created = await FornecedorPorConfirmarGW.create(nome, email, password, morada, nif, telemovel)
                return created

            } catch (err) {
                throw {
                    code: 400,
                    message: "Não foi possível registar o novo utilizador."
                }
            }   
        }

    }

    async RegistarTransportador(nome, email, password, morada, nif, telemovel, portes_encomenda){
        
        var isValid = false;
        if (email_validator.validate(email)) {
            let consumidor_exists = await ConsumidorGW.existsEmail(email)
            let fornecedor_exists = await FornecedorGW.existsEmail(email)
            let transportador_exists = await TransportadorGW.existsEmail(email)
            if (!consumidor_exists && !fornecedor_exists && !transportador_exists) {
                let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
                if (strongPassword.test(password)) {
                    if (utils.isInt(nif) && nif.toString().length == 9) {
                        if (utils.isInt(nif) && telemovel.toString().length == 9) {
                            if (utils.isNumber(portes_encomenda)) {
                                isValid = true;
                            } else {
                                throw {
                                    code: 400,
                                    message: "Portes inválidos."
                                }
                            }
                                
                        } else {
                            throw {
                                code: 400,
                                message: "Número de telemóvel inválido."
                            }
                        }
                    } else {
                        throw {
                            code: 400,
                            message: "NIF inválido."
                        }
                    }
                } else {
                    throw {
                        code: 400,
                        message: "Password inválida. A password deve ter no mínimo 8 caracteres e conter pelo menos uma letra minúscula, uma maiúscula, um número e um caracter especial."
                    }
                }
            } else {
                throw {
                    code: 400,
                    message: "Este email já está em uso. Insira um novo e-mail."
                }
            }
        } else {
            throw {
                code: 400,
                message: "E-mail inválido."
            }
        }

        if (isValid) {
            try {
                // encrypt password
                var password = bcrypt.hashSync(password, 10);

                // falta resolver aqui o async / await
                const created = await TransportadorGW.create(nome, email, password, morada, nif, telemovel, portes_encomenda)
                return created._id

            } catch (err) {
                throw {
                    code: 400,
                    message: "Não foi possível registar o novo utilizador."
                }
            }   
        }

    }

    async RegistarTransportadorNaoVerificado(nome, email, password, morada, nif, telemovel, portes_encomenda){
        
        var isValid = false;
        if (email_validator.validate(email)) {
            let consumidor_exists = await ConsumidorGW.existsEmail(email)
            let fornecedor_exists = await FornecedorGW.existsEmail(email)
            let transportador_exists = await TransportadorGW.existsEmail(email)
            if (!consumidor_exists && !fornecedor_exists && !transportador_exists) {
                let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
                if (strongPassword.test(password)) {
                    if (utils.isInt(nif) && nif.toString().length == 9) {
                        if (utils.isInt(nif) && telemovel.toString().length == 9) {
                            if (utils.isNumber(portes_encomenda)) {
                                isValid = true;
                            } else {
                                throw {
                                    code: 400,
                                    message: "Portes inválidos."
                                }
                            }
                                
                        } else {
                            throw {
                                code: 400,
                                message: "Número de telemóvel inválido."
                            }
                        }
                    } else {
                        throw {
                            code: 400,
                            message: "NIF inválido."
                        }
                    }
                } else {
                    throw {
                        code: 400,
                        message: "Password inválida. A password deve ter no mínimo 8 caracteres e conter pelo menos uma letra minúscula, uma maiúscula, um número e um caracter especial."
                    }
                }
            } else {
                throw {
                    code: 400,
                    message: "Este email já está em uso. Insira um novo e-mail."
                }
            }
        } else {
            throw {
                code: 400,
                message: "E-mail inválido."
            }
        }

        if (isValid) {
            try {
                // encrypt password
                var password = bcrypt.hashSync(password, 10);

                // falta resolver aqui o async / await
                const created = await TransportadorPorConfirmarGW.create(nome, email, password, morada, nif, telemovel, portes_encomenda)
                return created

            } catch (err) {
                throw {
                    code: 400,
                    message: "Não foi possível registar o novo utilizador."
                }
            }   
        }

    }

    // falta verificar forca da password – check-password-strength
    async RegistarAdministrador(nome, password){

        var isValid = false;
        let administrador_exists = await AdministradorGW.existsName(nome)
        if (!administrador_exists) {
            let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
            if (strongPassword.test(password)) {
                isValid = true;
            } else {
                throw {
                    code: 400,
                    message: "Password inválida. A password deve ter no mínimo 8 caracteres e conter pelo menos uma letra minúscula, uma maiúscula, um número e um caracter especial."
                }
            }
        } else {
            throw {
                code: 400,
                message: "Este nome já está em uso. Insira um novo nome."
            }
        }

        if (isValid) {
            try {
                // encrypt password
                var password = bcrypt.hashSync(password, 10);

                // falta resolver aqui o async / await
                const created = await AdministradorGW.create(nome, password)
                return created._id

            } catch (err) {
                throw {
                    code: 400,
                    message: "Não foi possível registar o novo administrador."
                }
            }   
        }
    }

    async RegistarNaoAutenticado() {

        const created = await NaoAutenticadoGW.create()
        await CarrinhoGW.create(created._id)
        return created._id

    }

    async AutenticaCarrinho(id, id_nao_autenticado) {

        let carrinhoConsumidor = await CarrinhoGW.getByUtilizador(id)

        let carrinhoNaoAutenticado = await CarrinhoGW.getByUtilizador(id_nao_autenticado)

        if (carrinhoConsumidor != false) {

            if (carrinhoNaoAutenticado != false) {

                for (let i = 0; i < carrinhoNaoAutenticado.produtos.length; i++){

                    await CarrinhoGW.addProdutoFormated(id,carrinhoNaoAutenticado.produtos[i])

                }

            } else {

                throw {
                    code: 400,
                    message: "Não existe Utilizador desse Utilizador Não Autenticado"
                }
            }
        } else {

            throw {
                code: 400,
                message: "Não existe Carrinho desse Consumidor"
            }
        }
    }

    async Login(email, password){

        let utilizador_exists = await UtilizadorGW.getByEmail(email)
        if (utilizador_exists) {
            if (utilizador_exists.isCongelado) {
                throw {
                    code: 400,
                    message: "Este utilizador tem a sua conta congelada"
                }
            }

            let user = await UtilizadorGW.getByEmail(email)

            let gateway
            if (user.tipo == "Consumidor") {
                gateway = ConsumidorGW
            } else if (user.tipo == "Fornecedor") {
                gateway = FornecedorGW
            } else if (user.tipo == "Transportador") {
                gateway = TransportadorGW
            }

            let specific_user = await gateway.getByEmail(email)
            
            if (specific_user != false) {
                if (bcrypt.compareSync(password, specific_user.password)){
                    return {
                        tipo: user.tipo,
                        id: user._id
                    }
                } else {
                    throw {
                        code: 400,
                        message: "O e-mail e a password fornecidas não correspondem"
                    }
                }
            } else {
                throw {
                    code: 400,
                    message: "O e-mail fornecido não está registado na aplicação"
                }
            }
            
        } else {
            throw {
                code: 400,
                message: "O e-mail fornecido não está registado na plataforma"
            }
        }

    }

    async LoginAdministrador(nome, password){

        let administrador_exists = await AdministradorGW.existsName(nome)
        if (administrador_exists) {
            let admin = await AdministradorGW.getByName(nome)

            if (bcrypt.compareSync(password, admin.password)){
                return {
                    tipo: "Administrador",
                    id: admin._id
                }
            } else {
                throw {
                    code: 400,
                    message: "O nome e a password fornecidas não correspondem"
                }
            }
        } else {
            throw {
                code: 400,
                message: "O nome fornecido não está registado na plataforma"
            }
        }

    }

    async sendEmailVerification(user) {
        const emailService = require('../utils/emailService');

        let default_email = require('./MailGenerator/verification')
        let mail_title = "Validação de conta BayLit"
        let mensagem_principal = "Bem-vindo(a) à BayLit "+user.nome+"!"
        let texto = "Para confirmares o teu registo e poderes começar a tomar as melhores decisões sustentáveis,"
        texto += " basta apensas seguires o link: <br>"
        texto += "<a href='http://localhost:3000/confirm?code="+user.confirmation+"'>http://localhost:3000/confirm?code="+user.confirmation+"<\/a> "
        let nome = user.nome
        let link = "http://localhost:3000"
        let mail_body = await default_email.generate_default(mail_title, mensagem_principal, texto, nome, link)

        // Create sendEmail params 
        var params = {
        Destination: { 
            ToAddresses: [
                "tiagogteodoro@gmail.com",
                "afonsotelles.silva@gmail.com",
                user.email
            ]
        },
        Message: { 
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: mail_body
                }
            },
            Subject: {
            Charset: 'UTF-8',
            Data: 'Confirme o seu registo em baylit.store'
            }
        },
        Source: 'confirmation@baylit.store'
        };

        // Use mock email service
        try {
            const result = await emailService.sendEmail(params);
            console.log('Verification email sent (mock):', result.MessageId);
        } catch (err) {
            console.error('Error sending verification email:', err);
        }
    }

    encryptPassword(pw) {

        const saltRounds = 10
        bcrypt.genSaltSync(saltRounds, function(err, salt) {
            if (err) {
                throw {
                    code: 400,
                    message: "Erro a gerar password hash."
                }
            }
            bcrypt.hashSync(pw, salt, function(err, hash) {
                if (err) {
                    throw {
                        code: 400,
                        message: "Erro a gerar password hash."
                    }
                }
                return hash;
            });    
        });
    }
}

//let h = new HandlerAutenticacao()
//h.sendVerificationEmail("Tiago", "tiagogteodoro@gmail.com")

module.exports = {
    handler_auth: new HandlerAutenticacao()
}
