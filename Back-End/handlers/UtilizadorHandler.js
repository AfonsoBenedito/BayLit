const UtilizadorGW = require("../gateway/UtilizadorGat")
const ConsumidorGW = require("../gateway/ConsumidorGat")
const FornecedorGW = require("../gateway/FornecedorGat")
const TransportadorGW = require("../gateway/TransportadorGat")
const LocalGW = require("../gateway/LocalGat")
const ProducaoGW = require("../gateway/ProducaoGat")
const ProdutoGW = require("../gateway/ProdutoGat")
const ProdutoEspecificoGW = require("../gateway/ProdutoEspecificoGat")
const CategoriaGW = require("../gateway/CategoriaGat")
const VendaGW = require("../gateway/VendaGat")
const NotificacaoGW = require("../gateway/NotificacaoGat")
const htmlspecialchars = require("htmlspecialchars")
const HandlerCadeia = require("../handlers/CadeiaHandler").handler_cadeia
const GeoHandler = require("./GeoHandler").geo_handler
const bcrypt = require("bcrypt")


class UtilizadorHandler {

    async GetUtilizadorByID(id) {

        let utilizador = await UtilizadorGW.getById(id)

        if (utilizador != false) {

            return utilizador

        } else {

            throw {
                code: 400,
                message: "Não existe Utilizador com esse ID"
            }
        }
    }

    async GetUtilizadorByEmail(email) {

        let utilizador = await UtilizadorGW.getByEmail(email)

        if (utilizador != false) {

            return utilizador

        } else {

            throw {
                code: 400,
                message: "Não existe Utilizador com esse Email"
            }
        }
    }

    async GetAllUtilizadores() {

        let utilizadores = await UtilizadorGW.getAll()

        if (utilizadores != false) {

            return utilizadores

        } else {

            throw {
                code: 400,
                message: "Não existem Utilizadores"
            }
        }
    }

    async DeleteUtilizador(id, password) {

        let user = await UtilizadorGW.getById(id)

        if (user) {
            let gateway
            if (user.tipo == "Consumidor") {
                gateway = ConsumidorGW
            } else if (user.tipo == "Fornecedor") {
                gateway = FornecedorGW
            } else if (user.tipo == "Transportador") {
                gateway = TransportadorGW
            }

            let specific_user = await gateway.getByEmail(user.email)

            if (bcrypt.compareSync(password, specific_user.password)){
                await UtilizadorGW.deleteById(id)
            } else {
                throw {
                    code: 400,
                    message: "A password fornecida não está correcta"
                }
            }
        } else {
            throw {
                code: 400,
                message: "O utilizador não existe"
            }
        }
    }

    async GetLocalByID(local_id) {
        let local = await LocalGW.getById(local_id)

        if (local != false) {

            return local

        } else {

            throw {
                code: 400,
                message: "Não existe local com esse ID"
            }
        }
    }

    async GetLocaisByUtilizador(utilizador) {
        let locais = await LocalGW.getByUtilizador(utilizador)

        if (locais != false) {

            return locais

        } else {

            throw {
                code: 400,
                message: "Não existem locais associados a este utilizador"
            }
        }
    }

    async InsertLocal(tipo, id_utilizador, morada, codigo_postal, localidade, pais) {

        if (tipo == "local_entrega" || tipo == "armazem" || tipo == "sede" || tipo == "local_producao") {
            let coordinates = await GeoHandler.GetCoordinates(morada, codigo_postal, localidade)

            let lon = coordinates[0]
            let lat = coordinates[1]

            let utilizador = await UtilizadorGW.getById(id_utilizador)

            if (utilizador != false) {

                return await LocalGW.create(tipo, id_utilizador, morada, codigo_postal, localidade, pais, lon, lat)

            } else {

                throw {
                    code: 400,
                    message: "Não existe Utilizador com esse ID"
                }
            }
        } else {

            throw {
                code: 400,
                message: "Tipo de local inválido. Deve ser local_entrega, armazem ou sede."
            }
        }
        
    }
    

    async DeleteLocal(local) {
        await LocalGW.deleteById(local)
    }

    async GetNotificacoesUtilizador(id_utilizador) {

        let utilizador = await UtilizadorGW.getById(id_utilizador)

        if (utilizador != false){

            return await NotificacaoGW.getByUtilizador(id_utilizador)

        } else {

            throw {
                code: 400,
                message: "Não existe Utilizador com esse ID"
            }
        }

    }

    async ViewNotificacoesUtilizador(id_utilizador, notificacoes) {

        let utilizador = await UtilizadorGW.getById(id_utilizador)

        if (utilizador != false){

            for (let notificacao of notificacoes) {
                notificacao = htmlspecialchars(notificacao)
                let notificacao_model = await NotificacaoGW.getById(notificacao)
                if (notificacao_model) {
                    
                    await NotificacaoGW.updateVista(notificacao)

                } else {
                    throw {
                        code: 400,
                        message: "Não existe notificação com esse ID"
                    }
                }
                
            }
            
            return true
        } else {

            throw {
                code: 400,
                message: "Não existe Utilizador com esse ID"
            }
        }

    }

    async GetRelatorioAdministrador() {

        let relatorio = {
            "tipo_producao": {
                "Biologica": 0,
                "Organica": 0,
                "Intensiva": 0
            },
            "produtos_categoria": {},
            "vendas_categoria": {},
            "classificacao_producao_categoria": {},
            "classificacao_transporte_armazem_categoria": {},
            "classificacao_armazenamento_categoria": {},
            "classificacao_categoria": {}
        }

        let producoes = await ProducaoGW.getAll();
        for (let producao of producoes) {
            if (producao.tipo == "Biologica") {
                relatorio["tipo_producao"]["Biologica"] ++
            } else if (producao.tipo == "Organica") {
                relatorio["tipo_producao"]["Organica"] ++
            } else if (producao.tipo == "Intensiva") {
                relatorio["tipo_producao"]["Intensiva"] ++
            }
        }

        let categorias = await CategoriaGW.getAll()
        for (let categoria of categorias) {
            let nome_categoria = categoria.nome
            relatorio["produtos_categoria"][nome_categoria] = 0
            relatorio["vendas_categoria"][nome_categoria] = 0
            relatorio["classificacao_producao_categoria"][nome_categoria] = []
            relatorio["classificacao_transporte_armazem_categoria"][nome_categoria] = []
            relatorio["classificacao_armazenamento_categoria"][nome_categoria] = []
            relatorio["classificacao_categoria"][nome_categoria] = []
        }

        let produtos = await ProdutoGW.getAll()
        for (let produto of produtos) {
            let categoria = await CategoriaGW.getById(produto.categoria)
            let nome_categoria = categoria.nome
            
            if (relatorio["produtos_categoria"][nome_categoria] != null) {
                relatorio["produtos_categoria"][nome_categoria] ++
            }

            let cadeia = await HandlerCadeia.GetSumarioCadeiaByProdutoId(produto._id)

            //console.log(relatorio["classificacao_producao_categoria"])
            if (relatorio["classificacao_producao_categoria"][nome_categoria]) {
                if (cadeia.producao.classificacao != null) {
                    relatorio["classificacao_producao_categoria"][nome_categoria].push(cadeia.producao.classificacao)
                }
                relatorio["classificacao_transporte_armazem_categoria"][nome_categoria].push(cadeia.transporte_armazem.classificacao)
                relatorio["classificacao_armazenamento_categoria"][nome_categoria].push(cadeia.armazenamento.classificacao)
                relatorio["classificacao_categoria"][nome_categoria].push(cadeia.rating)
            }

        }

        let vendas = await VendaGW.getAll()
        for (let venda of vendas) {
            let produto_especifico = await ProdutoEspecificoGW.getById(venda.produto)
            let produto = await ProdutoGW.getById(produto_especifico.produto)
            let categoria = await CategoriaGW.getById(produto.categoria)
            let nome_categoria = categoria.nome

            if (relatorio["vendas_categoria"][nome_categoria] != null) {
                relatorio["vendas_categoria"][nome_categoria] ++
            }
        }

        for (let categoria of categorias) {
            let nome_categoria = categoria.nome
            
            let total_prod = 0
            console.log(relatorio["classificacao_producao_categoria"][nome_categoria])
            for (let categoria_producao of relatorio["classificacao_producao_categoria"][nome_categoria]) {
                total_prod += categoria_producao
            }
            let media_prod = Math.round((total_prod / relatorio["classificacao_producao_categoria"][nome_categoria].length) * 100) / 100
            if (media_prod) {
                relatorio["classificacao_producao_categoria"][nome_categoria] = media_prod
            } else {
                relatorio["classificacao_producao_categoria"][nome_categoria] = 0
            }
            

            let total_tra = 0
            for (let categoria_transporte_armazem of relatorio["classificacao_transporte_armazem_categoria"][nome_categoria]) {
                total_tra += categoria_transporte_armazem
            }
            let media_tra = Math.round((total_tra / relatorio["classificacao_transporte_armazem_categoria"][nome_categoria].length) * 100) / 100
            if (media_tra) {
                relatorio["classificacao_transporte_armazem_categoria"][nome_categoria] = media_tra
            } else {
                relatorio["classificacao_transporte_armazem_categoria"][nome_categoria] = 0
            }

            let total_arm = 0
            for (let categoria_armazenamento of relatorio["classificacao_armazenamento_categoria"][nome_categoria]) {
                total_arm += categoria_armazenamento
            }
            let media_arm = Math.round((total_arm / relatorio["classificacao_armazenamento_categoria"][nome_categoria].length) * 100) / 100
            if (media_arm) {
                relatorio["classificacao_armazenamento_categoria"][nome_categoria] = media_arm
            } else {
                relatorio["classificacao_armazenamento_categoria"][nome_categoria] = 0
            }

            let total_rat = 0
            for (let categoria_rating of relatorio["classificacao_categoria"][nome_categoria]) {
                total_rat += categoria_rating
            }
            let media_rat = Math.round((total_rat / relatorio["classificacao_categoria"][nome_categoria].length) * 100) / 100
            if (media_rat) {
                relatorio["classificacao_categoria"][nome_categoria] = media_rat
            } else {
                relatorio["classificacao_categoria"][nome_categoria] = 0
            }
        }

        return relatorio
        
    }   

    async CongelarUtilizador(id) {

        try {
            return await UtilizadorGW.congelar(id)
        } catch {
            throw (err)
        }
        

    }

    async DescongelarUtilizador(id) {

        try {
            return await UtilizadorGW.descongelar(id)
        } catch {
            throw (err)
        }
        

    }
}

//let hand = new UtilizadorHandler()
//console.log(hand.InsertLocal(1234, "Rua D. Manuel I, nº 20", "7400-300", "Ponte de Sôr"))
//console.log(hand.GetCoordinates("Rua D. Manuel I, nº 20", "7400-300", "Ponte de Sôr"))

module.exports = {
    handler_utilizador: new UtilizadorHandler()
}