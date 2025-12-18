const ConsumidorGW = require("../gateway/ConsumidorGat")
const utils = require("../utils");
const email_validator = require("email-validator");
const FornecedorGW = require("../gateway/FornecedorGat")
const TransportadorGW = require("../gateway/TransportadorGat")
const MeioTransporteGW = require("../gateway/MeioTransporteGat")
const TransporteGW = require("../gateway/TransporteGat")
const LocalGW = require("../gateway/LocalGat")
const EncomendaGW = require("../gateway/EncomendaGat")
const VendaGW = require("../gateway/VendaGat")
const ArmazemGW = require("../gateway/ArmazemGat")
const NotificacaoGW = require("../gateway/NotificacaoGat")
const CondutorGW = require("../gateway/CondutorGat")
const bcrypt = require("bcrypt")

const vehicle_emissions_json = require("./vehicle_emission.json");
const { json } = require("body-parser");


class TransportadorHandler {

    async GetTransportadorByID(id) {

        let transportador = await TransportadorGW.getById(id)

        if (transportador != false) {

            return transportador

        } else {

            throw {
                code: 400,
                message: "Não existe Transportador com esse ID"
            }
        }
    }

    async GetTransportadorByEmail(email) {

        let transportador = await TransportadorGW.getByEmail(email)

        if (transportador != false) {

            return transportador

        } else {

            throw {
                code: 400,
                message: "Não existe Transportador com esse Email"
            }
        }
    }

    async GetRelatorioTransportadorByID(id, espaco_temporal) {

        let transportador = await TransportadorGW.getById(id)

        if (transportador != false) {

            let data_fim = new Date()

            const now = new Date();
            let data_inicio
            if (espaco_temporal == "semana") {
                data_inicio = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            } else if (espaco_temporal == "mes") {
                data_inicio = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000)
            } else if (espaco_temporal == "ano") {
                data_inicio = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
            } else if (espaco_temporal == "5 anos") {
                data_inicio = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000)
            }

            let transportes = await TransporteGW.getByTransportadorBetweenDates(id, data_inicio, data_fim)

            if (transportes == false){
                transportes = []
            }

            let relatorio = {
                "transportes/dia": [],
                "consumo/dia": [],
                "emissao/dia": [],
                "classificacao/veiculo": []
            }

            for (let transporte of transportes) {
                let data_transporte = transporte.data_inicio.toLocaleString('pt-PT', { timeZone: 'UTC' })
                data_transporte = data_transporte.split(",")
                data_transporte = data_transporte[0]
                let indexData = relatorio["transportes/dia"].findIndex(element => element.dia == data_transporte)
                if (indexData == -1) {
                    let transportedia = {
                        dia: data_transporte,
                        num_transportes: 1
                    }
                    relatorio["transportes/dia"].push(transportedia)
                    
                    let consumodia = {
                        dia: data_transporte,
                        consumo_media: [transporte.consumo]
                    }
                    relatorio["consumo/dia"].push(consumodia)

                    let emissaodia = {
                        dia: data_transporte,
                        emissao_media: [transporte.emissao]
                    }
                    relatorio["emissao/dia"].push(emissaodia)
                } else {
                    relatorio["transportes/dia"][indexData].num_transportes ++
                    relatorio["consumo/dia"][indexData].consumo_media.push(transporte.consumo)
                    relatorio["emissao/dia"][indexData].emissao_media.push(transporte.emissao)
                }

                let indexVeiculo = relatorio["classificacao/veiculo"].findIndex(element => element.veiculo._id == String(transporte.meio_transporte))
                if (indexVeiculo == -1) {
                    let veiculo = await MeioTransporteGW.getById(transporte.meio_transporte)
                    let classificacaoveiculo = {
                        veiculo: {
                            _id: String(transporte.meio_transporte),
                            nome: veiculo.marca + " " + veiculo.modelo + " " + veiculo.tipo
                        },
                        classificacao: [transporte.classificacao]
                    }
                    relatorio["classificacao/veiculo"].push(classificacaoveiculo)
                } else {
                    relatorio["classificacao/veiculo"][indexVeiculo].classificacao.push(transporte.classificacao)
                }
            }

            let index_consumo = 0
            for (let dia_consumo of relatorio["consumo/dia"]) {
                let total_consumo = 0
                for (let consumo of dia_consumo.consumo_media) {
                    total_consumo += consumo
                }
                relatorio["consumo/dia"][index_consumo].consumo_media = Math.round(total_consumo / dia_consumo.consumo_media.length * 100) / 100
                index_consumo ++
            }

            let index_emissao = 0
            for (let dia_emissao of relatorio["emissao/dia"]) {
                let total_emissao = 0
                for (let emissao of dia_emissao.emissao_media) {
                    total_emissao += emissao
                }
                relatorio["emissao/dia"][index_emissao].emissao_media = Math.round(total_emissao / dia_emissao.emissao_media.length * 100) / 100
                index_emissao ++
            }

            let index_classificacao = 0
            for (let veiculo_classificacao of relatorio["classificacao/veiculo"]) {
                let total_classificacao = 0
                for (let classificacao of veiculo_classificacao.classificacao) {
                    total_classificacao += classificacao
                }
                relatorio["classificacao/veiculo"][index_classificacao].classificacao = Math.round(total_classificacao / veiculo_classificacao.classificacao.length * 100) / 100
                index_classificacao ++
            }

            return relatorio

        } else {

            throw {
                code: 400,
                message: "Não existe Transportador com esse ID"
            }
        }
    }

    async GetAllTransportadores() {

        let transportadores = await TransportadorGW.getAll()

        if (transportadores != false) {

            return transportadores

        } else {

            throw {
                code: 400,
                message: "Não existem Transportadores"
            }
        }
    }

    async UpdateTransportador(id, nome, email, password_antiga, password_nova, morada, nif, telemovel, portes_encomenda) {

        let transportador = await TransportadorGW.getById(id)

        if (transportador != false) {

            let atualizar = []

            if (password_antiga != null){

                if (bcrypt.compareSync(password_antiga, transportador.password)){
                    
                    let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')

                    if (strongPassword.test(password_nova)){

                        atualizar.push('Password')

                    } else {

                        throw {
                            code: 400,
                            message: "Password inválida. A password deve ter no mínimo 8 caracteres e conter pelo menos uma letra minúscula, uma maiúscula, um número e um caracter especial."
                        }
                    }

                } else {
                    throw {
                        code: 400,
                        message: "A password fornecida não é válida"
                    }
                }
            }

            if (nome != null) {

                atualizar.push('Nome')

            }

            if (morada != null) {

                atualizar.push('Morada')
                
            }

            if (nif != null) {

                if (utils.isInt(nif) && nif.toString().length == 9){

                    atualizar.push('Nif')

                } else {

                    throw {
                        code: 400,
                        message: "Nif inválido. Tem de ser Integer de 9 digitos"
                    }
                }
            }

            if (telemovel != null) {

                if (utils.isInt(telemovel) && telemovel.toString().length == 9){

                    atualizar.push('Telemovel')

                } else {

                    throw {
                        code: 400,
                        message: "Telemóvel inválido. Tem de ser Integer de 9 digitos"
                    }
                }
            }

            if (portes_encomenda != null) {

                if (utils.isNumber(portes_encomenda)){

                    atualizar.push('PortesEncomenda')

                } else {

                    throw {
                        code: 400,
                        message: "Portes de encomenda inválidos."
                    }
                }
            }

            if (email != null) {

                if (email_validator.validate(email)){

                    if (await !TransportadorGW.getByEmail(email) && await !ConsumidorGW.getByEmail(email) && await !FornecedorGW.getByEmail(email)){

                        atualizar.push('Email')

                    } else {

                        throw {
                            code: 400,
                            message: "Email já está em uso"
                        }
                    }

                } else {

                    throw {
                        code: 400,
                        message: "Email inválido"
                    }
                }
            }

            if (atualizar.includes('Nome')){

                await TransportadorGW.updateName(id, nome)

            }

            if (atualizar.includes('Email')){

                await TransportadorGW.updateEmail(id, email)
                
            }

            if (atualizar.includes('Password')){

                let hashed_pw = bcrypt.hashSync(password_nova, 10);
                await TransportadorGW.updatePassword(id, hashed_pw)
                
            }

            if (atualizar.includes('Morada')){

                await TransportadorGW.updateMorada(id, morada)
                
            }

            if (atualizar.includes('Nif')){

                await TransportadorGW.updateNif(id, nif)
                
            }

            if (atualizar.includes('Telemovel')){

                await TransportadorGW.updateTelemovel(id, telemovel)
                
            }

            if (atualizar.includes('PortesEncomenda')){

                await TransportadorGW.updatePortesEncomenda(id, portes_encomenda)
                
            }

            return await TransportadorGW.getById(id);

        } else {

            throw {
                code: 400,
                message: "Não existe Transportador com esse ID"
            }
        }
    }

    async GetMeioTransporteByID(id) {
        
        let meio_transporte = await MeioTransporteGW.getById(id)

        if (meio_transporte != false) {

            return meio_transporte

        } else {

            throw {
                code: 400,
                message: "Não existe Meio de Transporte com esse ID"
            }
        }
    }

    async GetMeioTransporteByTransportador(transportador) {
        
        let meios_transporte = await MeioTransporteGW.getByTransportador(transportador)

        if (meios_transporte != false) {

            return meios_transporte

        } else {

            throw {
                code: 400,
                message: "Não existem Meios de Transporte associados a este transportador"
            }
        }
    }

    async GetMeioTransporteBySede(sede) {
        
        let meios_transporte = await MeioTransporteGW.getBySede(sede)

        if (meios_transporte != false) {

            return meios_transporte

        } else {

            throw {
                code: 400,
                message: "Não existem Meios de Transporte associados a esta sede"
            }
        }
    }

    async InsertMeioTransporte(transportador, sede, marca, modelo, tipo) {

        let transportadorExists = await TransportadorGW.existsId(transportador)
        let local_sede = await LocalGW.getById(sede)

        if (transportadorExists != false){

            if (local_sede != false){

                if (local_sede.tipo == 'sede' && local_sede.utilizador == transportador) {

                    if (vehicle_emissions_json[marca] == undefined || vehicle_emissions_json[marca][modelo] == undefined || vehicle_emissions_json[marca][modelo][tipo] == undefined) {
                        throw {
                            code: 400,
                            message: "O veículo inserido não está disponivel na plataforma"
                        }
                    }
                    
                    let consumo = vehicle_emissions_json[marca][modelo][tipo].consumo
                    let emissao = vehicle_emissions_json[marca][modelo][tipo].emissao

                    return await MeioTransporteGW.create(transportador, sede, tipo, marca, modelo, consumo, emissao)

                } else {
                    throw {
                        code: 400,
                        message: "A sede fornecida não é válida"
                    }
                }

            } else {

                throw {
                    code: 400,
                    message: "Não existe Sede com esse ID"
                }
            }

        } else {

            throw {
                code: 400,
                message: "Não existe Transportador com esse ID"
            }
        }
    }

    async UpdateSedeMeioTransporte(meio_transporte_id, sede_id) {

        let sede = await LocalGW.getById(sede_id);

        if (sede != false) {
            await MeioTransporteGW.updateSede(meio_transporte_id, sede)

            return await MeioTransporteGW.getById(meio_transporte_id)
        } else {
            throw {
                code: 400,
                message: "Não existe Sede com esse ID"
            }
        }
    }

    async DeleteMeioTransporte(meio_transporte_id) {

        return MeioTransporteGW.deleteById(meio_transporte_id)
    }

    async InsertCondutor(transportador, nome, idade) {

        let transportadorExists = await TransportadorGW.existsId(transportador)

        if (transportadorExists != false){
            
            if (utils.isInt(idade)) {
                return await CondutorGW.create(transportador, nome, idade)
            } else {
                throw {
                    code: 400,
                    message: "Pedido inválido"
                }
            }

        } else {
            throw {
                code: 400,
                message: "Não existe Transportador com esse ID"
            }
        }
    }

    async GetCondutorByTransportadorENome(transportador_id, nome) {
        
        let condutor = await CondutorGW.getByTransportadorENome(transportador_id, nome)

        if (condutor != false) {

            return condutor

        } else {

            throw {
                code: 400,
                message: "Não existe Condutor com este nome"
            }
        }
    }

    async GetCondutorByTransportador(transportador_id) {
        
        let condutor = await CondutorGW.getByTransportador(transportador_id)

        if (condutor != false) {

            return condutor

        } else {

            throw {
                code: 400,
                message: "Não existem Condutores associados a este transportador"
            }
        }
    }
    
    async GetCondutorByID(id) {
        
        let condutor = await CondutorGW.getById(id)

        if (condutor != false) {

            return condutor

        } else {

            throw {
                code: 400,
                message: "Não existem Condutores com este id"
            }
        }
    }

    async DeleteCondutor(id) {

        return CondutorGW.deleteById(id)
    }

    async CancelTransporte(transporte_id) {

        const transporte = await TransporteGW.getById(transporte_id);
        
        if (transporte.estado == "Disponivel") {
            
            let encomendas_canceladas = []
            let vendas_canceladas = []
            let encomendas_canceladas_id = []
            let vendas_canceladas_id = []
            for (let produto_mercadoria of transporte.mercadoria) {

                let encomenda_cancelada = await EncomendaGW.getByItem(produto_mercadoria.item)
                let venda_cancelada = await VendaGW.getByItem(produto_mercadoria.item)

                if (!encomendas_canceladas_id.includes(String(encomenda_cancelada._id))) {
                    encomendas_canceladas.push(encomenda_cancelada)
                    encomendas_canceladas_id.push(String(encomenda_cancelada._id))
                }

                if (!vendas_canceladas_id.includes(String(venda_cancelada._id))) {
                    vendas_canceladas.push(venda_cancelada)
                    vendas_canceladas_id.push(String(venda_cancelada._id))
                }

                let armazem = await ArmazemGW.getByLocalizacao(produto_mercadoria.local_recolha)
                const index_item_inventario = armazem.inventario.findIndex(produto => String(produto.produto) == String(produto_mercadoria.produto_especifico));
                armazem.inventario[index_item_inventario].itens.push(produto_mercadoria.item)
                armazem.inventario[index_item_inventario].quantidade++

                await ArmazemGW.updateInventario(armazem._id, armazem.inventario)
            }

            for (let encomenda of encomendas_canceladas) {
                await EncomendaGW.updateEstado(encomenda._id, "Cancelada")
                
                this.notifyConsumidorEncomendaCancelada(encomenda)
            }

            for (let venda of vendas_canceladas) {
                await VendaGW.updateEstado(venda._id, "Cancelada")

                this.notifyFornecedorVendaCancelada(venda)
            }

            await TransporteGW.updateEstado(transporte._id, "Cancelado")

        } else {
            throw {
                code: 400,
                message: "Não pode cancelar este transporte"
            }
        }

    }

    /*
    async GenerateNewTransports() {

        const meios_transporte = await MeioTransporteGW.getAll();

        const today = new Date();
        const day = today.getDate(); 
        const month = today.getMonth();
        const year = today.getFullYear();

        for (let meio of meios_transporte) {
            let tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            tomorrow.setHours(10, 0, 0, 0)
            
            let tomorrow_transport = await TransporteGW.getByMeioAndDate(meio._id, tomorrow)

            if (tomorrow_transport == false) {
                await TransporteGW.create(meio.transportador, meio._id, [meio.sede, meio.sede], tomorrow)
            }

            let day_after_tomorrow = new Date(today);
            day_after_tomorrow.setDate(today.getDate() + 2);
            day_after_tomorrow.setHours(10, 0, 0, 0)

            let day_after_tomorrow_transport = await TransporteGW.getByMeioAndDate(meio._id, day_after_tomorrow)
            if (day_after_tomorrow_transport == false) {
                await TransporteGW.create(meio.transportador, meio._id, [meio.sede, meio.sede], day_after_tomorrow)
            }

            let days_after_tomorrow = new Date(today);
            days_after_tomorrow.setDate(today.getDate() + 3);
            days_after_tomorrow.setHours(10, 0, 0, 0)

            let days_after_tomorrow_transport = await TransporteGW.getByMeioAndDate(meio._id, days_after_tomorrow)

            if (days_after_tomorrow_transport == false) {
                await TransporteGW.create(meio.transportador, meio._id, [meio.sede, meio.sede], days_after_tomorrow)
            }
        }

        const transportes = await TransporteGW.getAllDisponiveis();

        for (let transporte of transportes) {
            var diff = Math.abs(transporte.data_inicio.getTime() - today.getTime()) / 3600000;

            if (diff < 36) {
                if (transporte.mercadoria.length == 0) {
                    await TransporteGW.updateEstado(transporte._id, "Cancelado")
                } else {
                    await TransporteGW.updateEstado(transporte._id, "Por iniciar")
                }
            }
        }
        

        return ("Transportes do dia "+day+"/"+month+"/"+year+" definidos.")

    }
    */

    
    async notifyConsumidorEncomendaCancelada(encomenda) {

        let consumidor = await ConsumidorGW.getById(encomenda.comprador)
        let mensagem = "A sua encomenda "+encomenda._id+" no valor de "+encomenda.valor.total+"€ foi cancelada pelo transportador."
        await NotificacaoGW.create(encomenda.comprador, "consumidorTransportadorCancelou", mensagem, "https://www.baylit.store/Perfil/Arquivados")

        var AWS = require('aws-sdk');
        AWS.config.update({
            accessKeyId: process.env.EC2_ACCESS_KEY,
            secretAccessKey: process.env.EC2_SECRET_KEY,
            region: 'eu-west-3',
          })

        let default_email = require('./MailGenerator/default')
        let mail_title = "A sua encomenda foi cancelada."
        let mensagem_principal = "A sua encomenda foi cancelada."
        let texto = "Lamentamos, mas o transportador cancelou a sua encomenda no valor de "+encomenda.valor.total+"€."
        let nome = consumidor.nome
        let link = "https://www.baylit.store/Perfil/Arquivados"
        let mail_body = await default_email.generate_default(mail_title, mensagem_principal, texto, nome, link)

        // Create sendEmail params 
        var params = {
        Destination: { 
            ToAddresses: [
                consumidor.email,
                "tiagogteodoro@gmail.com",
                "afonsotelles.silva@gmail.com"
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
            Data: 'A sua encomenda foi cancelada pelo transportador.'
            }
        },
        Source: 'sales@baylit.store'
        };

        // Create the promise and SES service object
        var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

        // Handle promise's fulfilled/rejected states
        sendPromise.then(
        function(data) {
            console.log(data.MessageId);
        }).catch(
            function(err) {
            console.error(err, err.stack);
        });
        
    }

    async notifyFornecedorVendaCancelada(venda) {

        let fornecedor = await FornecedorGW.getById(venda.fornecedor)
        let mensagem = "A sua venda "+venda._id+" no valor de "+venda.valor+"€ foi cancelada pelo transportador."
        await NotificacaoGW.create(venda.fornecedor, "fornecedorVendaCanceladaTransportador", mensagem, "https://www.baylit.store/Dashboard/Orders")

        var AWS = require('aws-sdk');
        AWS.config.update({
            accessKeyId: process.env.EC2_ACCESS_KEY,
            secretAccessKey: process.env.EC2_SECRET_KEY,
            region: 'eu-west-3',
          })

        let default_email = require('./MailGenerator/default')
        let mail_title = "A sua venda foi cancelada."
        let mensagem_principal = "A sua venda foi cancelada."
        let texto = "Lamentamos, mas o transportador cancelou a sua venda no valor de "+venda.valor+"€."
        let nome = fornecedor.nome
        let link = "https://www.baylit.store/Dashboard/Orders"
        let mail_body = await default_email.generate_default(mail_title, mensagem_principal, texto, nome, link)

        // Create sendEmail params 
        var params = {
        Destination: { 
            ToAddresses: [
                fornecedor.email,
                "tiagogteodoro@gmail.com",
                "afonsotelles.silva@gmail.com"
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
            Data: 'A sua venda foi cancelada pelo transportador'
            }
        },
        Source: 'sales@baylit.store'
        };

        // Create the promise and SES service object
        var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

        // Handle promise's fulfilled/rejected states
        sendPromise.then(
        function(data) {
            console.log(data.MessageId);
        }).catch(
            function(err) {
            console.error(err, err.stack);
        });
        
    }
}

//let th = new TransportadorHandler()

// primeiro cálculo
//th.GenerateNewTransports().then((result) => console.log(result))

// refaz o cálculo todos os dias
//setInterval(() => th.GenerateNewTransports().then((result) => console.log(result)), 86400000);


module.exports = {
    handler_transportador: new TransportadorHandler()
}