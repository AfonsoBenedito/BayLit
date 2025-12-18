const ProdutoGW = require("../gateway/ProdutoGat")
const ItemGW = require("../gateway/ItemGat")
const ArmazenamentoGW = require("../gateway/ArmazenamentoGat")
const TransporteGW = require("../gateway/TransporteGat")
const ProducaoGW = require("../gateway/ProducaoGat")
const TransporteArmazemGW = require("../gateway/TransporteArmazemGat")
const LocalGW = require("../gateway/LocalGat")
const ProdutoEspecificoGW = require("../gateway/ProdutoEspecificoGat")
const TransportadorGW = require("../gateway/TransportadorGat")
const ConsumidorGW = require("../gateway/ConsumidorGat")
const FornecedorGW = require("../gateway/FornecedorGat")
const NotificacaoGW = require("../gateway/NotificacaoGat")

const resources_json = require("./resources.json")
const pollution_json = require("./pollution.json")


class CadeiaHandler {

    async GetArmazenamentosByItemID(id_item) {
        
        let item = await ItemGW.getById(id_item)

        if (item != false) {

            return await ArmazenamentoGW.GetByItemId(id_item)

        } else {

            throw {
                code: 400,
                message: "Não existe Item com esse ID"
            }
        }
    }

    async GetArmazenamentoByProduto(produto_id) {

        let produto = await ProdutoGW.getById(produto_id)

        if (produto != false) {

            let armazenamento = produto.armazenamento
            return armazenamento

        } else {

            throw {
                code: 400,
                message: "O produto que procura não existe"
            }
        }
    }

    async GetTransporteArmazemByProduto(produto_id) {

        let produto = await ProdutoGW.getById(produto_id)

        if (produto != false) {

            let transporte_armazem = produto.transporte_armazem
            return transporte_armazem

        } else {

            throw {
                code: 400,
                message: "O produto que procura não existe"
            }
        }
    }

    async GetTransporteByID(id) {

        let transporte = await TransporteGW.getById(id)

        if (transporte != false) {

            return transporte

        } else {

            throw {
                code: 400,
                message: "Não existe Transporte com esse ID"
            }
        }

    }

    async GetTransporteByTransportador(transportador_id) {

        let transportes = await TransporteGW.getByTransportador(transportador_id)
        if (transportes != false) {

            return transportes

        } else {

            throw {
                code: 400,
                message: "Não existem transportes associados a este transportador"
            }
        }

    }

    async GetTransporteByTransportadorEEstado(transportador_id, estado) {

        let transportes = await TransporteGW.getByTransportadorEEstado(transportador_id, estado)
        if (transportes != false) {

            return transportes

        } else {

            throw {
                code: 400,
                message: "Não existem transportes associados a este transportador"
            }
        }

    }

    async GetTransportesByItemID(id_item) {

        let item = await ItemGW.getById(id_item)

        if (item != false) {

            return await TransporteGW.GetByItemId(id_item)

        } else {

            throw {
                code: 400,
                message: "Não existe Item com esse ID"
            }
        }

    }

    async StartTransporte(id) {

       
        let transporte = await TransporteGW.getById(id)
        if (transporte != false) {
            if (transporte.estado == 'Por iniciar') {
                let estado_transporte = []

                let start = true
                for (let local of transporte.rota) {
                    let estado_local
                    if (start) {
                        estado_local = {
                            local: local,
                            estado: 'Concluido'
                        }
                        start = false
                    } else {
                        estado_local = {
                            local: local,
                            estado: 'Por passar'
                        }
                    }
                    estado_transporte.push(estado_local)
                }

                await this.notifyTransportadorInicio(transporte)
                console.log("aqui")
                return await TransporteGW.startTransporte(id, estado_transporte)

            } else {
                throw {
                    code: 400,
                    message: "Não pode iniciar este transporte sem o mesmo ser confirmado."
                }
            }
        } else {
            throw {
                code: 400,
                message: "Não existe Transporte com esse ID"
            }
        }
        
    }

    async TerminateTransporte(id) {

        let transporte = await TransporteGW.getById(id)
        if (transporte != false) {
            if (transporte.estado == 'Em movimento') {
                let finish = transporte.estado_transporte.length - 1
                transporte.estado_transporte[finish].estado = 'Concluido'
                for (let estado_trans of transporte.estado_transporte) {
                    if (estado_trans.estado != 'Concluido') {
                        throw {
                            code: 400,
                            message: "Para dar um transporte por terminado deve primeiro concluir a passagem por todos os locais."
                        }
                    }
                }

                await this.notifyTransportadorFim(transporte)

                return await TransporteGW.terminateTransporte(id, transporte.estado_transporte)
            } else {
                throw {
                    code: 400,
                    message: "Não pode finalizar este transporte sem o mesmo estar em movimento."
                }
            }

        } else {

            throw {
                code: 400,
                message: "Não existe Transporte com esse ID"
            }
        }
        
    }

    async UpdateEstadoLocal(id, local, novo_estado_local) {


        let transporte = await TransporteGW.getById(id)
        if (transporte != false) {
            if (transporte.estado == 'Em movimento') {
                let index_local = transporte.estado_transporte.findIndex(element => element.local == local)
                let transporte_atualizado
                if (transporte.estado_transporte[index_local].estado == "Por passar" && (novo_estado_local == "A chegar" || novo_estado_local == "Concluido")) {
                    transporte.estado_transporte[index_local].estado = novo_estado_local
                } else if (transporte.estado_transporte[index_local].estado == "A chegar" && novo_estado_local == "Concluido") {
                    transporte.estado_transporte[index_local].estado = novo_estado_local
                } else {
                    throw {
                        code: 400,
                        message: "Não é possivel retroceder um transporte."
                    }
                }

                if (novo_estado_local == "A chegar") {
                    await this.notifyUtilizadorChegada(transporte, local)
                } else if (novo_estado_local == "Concluido") {
                    await this.notifyUtilizadorConcluido(transporte, local)
                }

                transporte_atualizado = await TransporteGW.updateEstadoTransporte(id, transporte.estado_transporte)
                return transporte_atualizado
            } else {
                throw {
                    code: 400,
                    message: "Não pode atualizar este transporte sem o mesmo estar em movimento."
                }
            }

        } else {

            throw {
                code: 400,
                message: "Não existe Transporte com esse ID"
            }
        }
        
    }

    async GetTransportesArmazemByItemID(id_item) {

        let item = await ItemGW.getById(id_item)

        if (item != false) {

            return await TransporteArmazemGW.GetByItemId(id_item)

        } else {

            throw {
                code: 400,
                message: "Não existe Item com esse ID"
            }
        }

    }

    async GetProducaoByProdutoID(id_produto) {

        let produto = await ProdutoGW.getById(id_produto)

        if (produto != false) {

            return await ProducaoGW.GetByProdutoId(id_produto)

        } else {

            throw {
                code: 400,
                message: "Não existe Produto com esse ID"
            }
        }
    }

    async InsertProducao(produto_id, local_id, tipo, recursos, poluicao_list) {

        let produto = await ProdutoGW.getById(produto_id)
        let local = await LocalGW.getById(local_id)

        if (produto != false) {

            if (local != false) {

                let classificacao_poluicao = 0
                let recursos_stored = []
                let poluicoes_stored = []
                if (tipo != "Biologica" || tipo != "Organica" || tipo != "Intensiva") {    

                    
                    for (let recurso of recursos) {
                        if (recurso.categoria && recurso.nome && recurso.quantidade) {
                            let categoria = recurso.categoria
                            let nome = recurso.nome

                            if (resources_json[categoria][nome]) {
                                let recurso_stored = {
                                    "nome": recurso.nome,
                                    "quantidade": recurso.quantidade,
                                    "unidade_medida": resources_json[categoria][nome]
                                }
                                recursos_stored.push(recurso_stored)
                            } else {
                                throw {
                                    code: 400,
                                    message: "Pedido inválido"
                                }
                            }
                        } else {
                            throw {
                                code: 400,
                                message: "Pedido inválido"
                            }
                        }
                    }

                    for (let poluicao of poluicao_list) {

                        console.log(poluicao_list)

                        if (poluicao.nome && poluicao.quantidade) {
                            let nome = poluicao.nome

                            if (poluicao.quantidade == "Residual" || poluicao.quantidade == "Marginal" || poluicao.quantidade == "Moderada"
                                || poluicao.quantidade == "Severa"|| poluicao.quantidade == "Critica") {

                                    switch(poluicao.quantidade) {
                                        case "Residual":
                                            classificacao_poluicao += 1
                                            break;
                                        case "Marginal":
                                            classificacao_poluicao += 2
                                            break;
                                        case "Moderada":
                                            classificacao_poluicao += 3
                                            break;
                                        case "Severa":
                                            classificacao_poluicao += 4
                                            break;
                                        case "Critica":
                                            classificacao_poluicao += 5
                                            break;
                                    } 

                                    console.log(nome)
                                    console.log(pollution_json.includes(nome))
                                    if (pollution_json.includes(nome)) {
                                        let poluicao_stored = {
                                            "nome": poluicao.nome,
                                            "quantidade": poluicao.quantidade,
                                        }
                                        poluicoes_stored.push(poluicao_stored)
                                        console.log(poluicoes_stored)
                                    } else {
                                        throw {
                                            code: 400,
                                            message: "Pedido inválido"
                                        }
                                    }

                            } else { 
                                throw {
                                    code: 400,
                                    message: "Pedido inválido"
                                }
                            }
                            
                        } else {
                            throw {
                                code: 400,
                                message: "Pedido inválido"
                            }
                        }
                    }

                    console.log(poluicoes_stored)
                } else {
                    throw {
                        code: 400,
                        message: "Pedido inválido"
                    }
                }

                let classificacao = 5 - (classificacao_poluicao / poluicao_list.length)

                console.log(classificacao)

                switch(tipo) {
                    case "Biologica":
                        classificacao += 1
                        break;
                    case "Intensiva":
                        classificacao -= 1
                        break;
                } 

                if (classificacao < 0.5) {
                    classificacao = 0.5
                }

                

                return await ProducaoGW.create(produto_id, local_id, tipo, recursos_stored, poluicoes_stored, classificacao)
            } else {
                throw {
                    code: 400,
                    message: "Não existe Local com esse ID"
                }
            }
        } else {
            throw {
                code: 400,
                message: "Não existe Produto com esse ID"
            }
        }

    }

    async GetCadeiaByItemId(id_item) {

        let item = await ItemGW.getById(id_item)
        let produto_especifico = await ProdutoEspecificoGW.getById(item.produto_especifico)

        if (item != false) {

            let producao = await ProducaoGW.getByProduto(produto_especifico.produto)
            let armazenamento = await ArmazenamentoGW.getByItemId(id_item)
            let transporte = await TransporteGW.getByItemId(id_item)
            let transporte_armazem = await TransporteArmazemGW.getByItem(id_item)

            let cadeia = {
                producao: producao,
                armazenamento: armazenamento,
                transporte: transporte,
                transporte_armazem: transporte_armazem
            }

            return cadeia

        } else {

            throw {
                code: 400,
                message: "Não existe Item com esse ID"
            }
        }
    }

    async GetCadeiaByProdutoId(id_produto) {

        let produto = await ProdutoGW.getById(id_produto)

        if (produto != false) {

            let producao = await ProducaoGW.getByProduto(produto._id)
            let armazenamento = produto.armazenamento || {}
            let transporte_armazem = produto.transporte_armazem || {}

            // Ensure producao has required fields
            if (!producao) {
                producao = {
                    tipo: "Organica",
                    classificacao: 3.5,
                    recursos: [],
                    poluicao: []
                }
            }
            
            // Ensure armazenamento has required fields
            if (!armazenamento.classificacao) {
                armazenamento.classificacao = armazenamento.classificacao || 3.5
            }
            if (!armazenamento.duracao) {
                armazenamento.duracao = armazenamento.duracao || 30
            }
            if (!armazenamento.consumo) {
                armazenamento.consumo = armazenamento.consumo || 1.2
            }

            // Ensure transporte_armazem has required fields
            if (!transporte_armazem.classificacao) {
                transporte_armazem.classificacao = transporte_armazem.classificacao || 3.5
            }
            if (!transporte_armazem.distancia) {
                transporte_armazem.distancia = transporte_armazem.distancia || 50
            }
            if (!transporte_armazem.consumo) {
                transporte_armazem.consumo = transporte_armazem.consumo || 2.5
            }
            if (!transporte_armazem.emissao) {
                transporte_armazem.emissao = transporte_armazem.emissao || 12.5
            }

            let total_classificacao = 0
            let n_classificacoes = 0

            if (producao && producao.classificacao) {
                total_classificacao += producao.classificacao
                n_classificacoes ++
            }
            if (armazenamento && armazenamento.classificacao) {
                total_classificacao += armazenamento.classificacao
                n_classificacoes ++
            }
            if (transporte_armazem && transporte_armazem.classificacao) {
                total_classificacao += transporte_armazem.classificacao
                n_classificacoes ++
            }
            let rating = n_classificacoes > 0 ? Math.round((total_classificacao / n_classificacoes) * 100) / 100 : 3.5

            let cadeia = {
                producao: producao,
                armazenamento: armazenamento,
                transporte_armazem: transporte_armazem,
                rating: rating
            }

            return cadeia

        } else {

            throw {
                code: 400,
                message: "Não existe Produto com esse ID"
            }
        }
    }

    async GetSumarioCadeiaByProdutoId(id_produto) {

        let produto = await ProdutoGW.getById(id_produto)

        if (produto != false) {

            let producao = await ProducaoGW.getByProduto(produto._id)
            let producao_resumo = {
                tipo: producao.tipo,
                classificacao: producao.classificacao
            }

            let armazenamento = produto.armazenamento
            let armazenamento_resumo = {
                duracao: armazenamento.duracao,
                classificacao: armazenamento.classificacao
            }

            let transporte_armazem = produto.transporte_armazem
            let transporte_armazem_resumo = {
                distancia: transporte_armazem.distancia,
                classificacao: transporte_armazem.classificacao
            }

            let total_classificacao = 0
            let n_classificacoes = 0

            if (producao.classificacao) {
                total_classificacao += producao.classificacao
                n_classificacoes ++
            }
            if (armazenamento.classificacao) {
                total_classificacao += armazenamento.classificacao
                n_classificacoes ++
            }
            if (transporte_armazem.classificacao) {
                total_classificacao += transporte_armazem.classificacao
                n_classificacoes ++
            }
            let rating = Math.round((total_classificacao / n_classificacoes) * 100) / 100 

            let cadeia = {
                producao: producao_resumo,
                armazenamento: armazenamento_resumo,
                transporte_armazem: transporte_armazem_resumo,
                rating: rating
            }

            return cadeia

        } else {

            throw {
                code: 400,
                message: "Não existe Produto com esse ID"
            }
        }
    }

    async notifyUtilizadorChegada(transporte, local_id) {

        var AWS = require('aws-sdk');
        AWS.config.update({
            accessKeyId: process.env.EC2_ACCESS_KEY,
            secretAccessKey: process.env.EC2_SECRET_KEY,
            region: 'eu-west-3',
          })

        let local = await LocalGW.getById(local_id)
        if (local.tipo == 'local_entrega') {
            let total_itens = 0
            for (let merc of transporte.mercadoria) {
                if (String(merc.local_entrega) == String(local._id)) {
                    total_itens ++
                }
            }

            let consumidor = await ConsumidorGW.getById(local.utilizador)
            let mensagem = "O transportador está a chegar com os seus items."
            await NotificacaoGW.create(consumidor._id, "consumidorTransportadorAChegar", mensagem, "https://www.baylit.store/Perfil")

            let default_email = require('./MailGenerator/default')
            let mail_title = "O transportador está a chegar com os seus items."
            let mensagem_principal = "O transportador está a chegar com os seus items."
            let texto
            if (total_itens == 1) {
                texto = "O seu item será entregue em breve na sua morada em <span>"+local.morada+"<\/span>"
            } else {
                texto = "Os seus "+total_itens+" itens serão entregues em breve na sua morada em <span>"+local.morada+"<\/span>"
            }
            let nome = consumidor.nome
            let link = "https://www.baylit.store/Perfil"
            let mail_body = await default_email.generate_default(mail_title, mensagem_principal, texto, nome, link)

            // Create sendEmail params 
            var params = {
                Destination: { 
                    ToAddresses: [
                        consumidor.email,
                        "afonsotelles.silva@gmail.com",
                        "tiagogteodoro@gmail.com"
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
                    Data: 'O transportador está a chegar com os seus items.'
                    }
                },
                Source: 'delivery@baylit.store'
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
        } else if (local.tipo == 'armazem') {
            let total_itens = 0
            for (let merc of transporte.mercadoria) {
                if (String(merc.local_recolha) == String(local._id)) {
                    total_itens ++
                }
            }

            let fornecedor = await FornecedorGW.getById(local.utilizador)
            let mensagem = "O transportador está a chegar para recolher os items."
            await NotificacaoGW.create(fornecedor._id, "fornecedorTransportadorAChegar", mensagem, "https://www.baylit.store/Dashboard/Orders")

            let default_email = require('./MailGenerator/default')
            let mail_title = "O transportador está a chegar para recolher os seus items."
            let mensagem_principal = "O transportador está a chegar para recolher os seus items."
            let texto
            if (total_itens == 1) {
                texto = "O seu item será entregue em breve no seu armazém em <span>"+local.morada+"<\/span>"
            } else {
                texto = "Os seus "+total_itens+" itens serão entregues em breve no seu armazém em <span>"+local.morada+"<\/span>"
            }
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
                    Data: 'O transportador está a chegar para recolher os items.'
                    }
                },
                Source: 'delivery@baylit.store'
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

    async notifyUtilizadorConcluido(transporte, local_id) {

        var AWS = require('aws-sdk');
        AWS.config.update({
            accessKeyId: process.env.EC2_ACCESS_KEY,
            secretAccessKey: process.env.EC2_SECRET_KEY,
            region: 'eu-west-3',
          })

        let local = await LocalGW.getById(local_id)
        if (local.tipo == 'local_entrega') {
            let total_itens = 0
            for (let merc of transporte.mercadoria) {
                if (String(merc.local_entrega) == String(local._id)) {
                    total_itens ++
                }
            }

            let consumidor = await ConsumidorGW.getById(local.utilizador)
            let mensagem = "O transportador já entregou os seus items."
            await NotificacaoGW.create(consumidor._id, "consumidorTransportadorEntregou", mensagem, "https://www.baylit.store/Perfil")

            let default_email = require('./MailGenerator/default')
            let mail_title = "O transportador já entregou os seus items."
            let mensagem_principal = "O transportador já entregou os seus items."
            let texto
            if (total_itens == 1) {
                texto = "O seu item foi entregue na sua morada em <span>"+local.morada+"<\/span>"
            } else {
                texto = "Os seus "+total_itens+" itens foram entregues na sua morada em "+local.morada+"<\/span>"
            }
            let nome = consumidor.nome
            let link = "https://www.baylit.store/Perfil"
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
                    Data: 'O transportador já entregou os seus items.'
                    }
                },
                Source: 'delivery@baylit.store'
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
        } else if (local.tipo == 'armazem') {
            let total_itens = 0
            for (let merc of transporte.mercadoria) {
                if (String(merc.local_recolha) == String(local._id)) {
                    total_itens ++
                }
            }

            let fornecedor = await FornecedorGW.getById(local.utilizador)
            let mensagem = "O transportador já recolheu os items."
            await NotificacaoGW.create(fornecedor._id, "fornecedorTransporteEfetuado", mensagem, "https://www.baylit.store/Dashboard/Orders")

            let default_email = require('./MailGenerator/default')
            let mail_title = "O transportador já recolheu os seus items."
            let mensagem_principal = "O transportador já recolheu os seus items."
            let texto
            if (total_itens == 1) {
                texto = "O seu item foi recolhido no seu armazém em <span>"+local.morada+"<\/span>"
            } else {
                texto = "Os seus "+total_itens+" itens foram recolhidos no seu armazém em "+local.morada+"<\/span>"
            }
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
                    Data: 'O transportador já recolheu os items.'
                    }
                },
                Source: 'delivery@baylit.store'
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

    async notifyTransportadorInicio(transporte) {

        let transportador = await TransportadorGW.getById(transporte.transportador)
        let mensagem = "O seu transporte foi iniciado."
        await NotificacaoGW.create(transportador._id, "transportadorTransporteIniciado", mensagem, "https://www.baylit.store/Dashboard/Servicos")

        var AWS = require('aws-sdk');
        AWS.config.update({
            accessKeyId: process.env.EC2_ACCESS_KEY,
            secretAccessKey: process.env.EC2_SECRET_KEY,
            region: 'eu-west-3',
          })

          let default_email = require('./MailGenerator/default')
          let mail_title = "O seu transporte foi iniciado."
          let mensagem_principal = "O seu transporte foi iniciado."
          let texto = "O seu transporte " + transporte._id + " iniciou agora a sua rota. <br> <br>"
          texto += "<span>Dados do transporte:<\/span> <br>"
          texto += "<span>Data:<\/span> "+ transporte.data_inicio.toLocaleDateString("pt-PT") + "<br>"
          texto += "<span>Distância Total:<\/span> "+ transporte.distancia.toFixed(2) +" km<br>"
          texto += "<span>Consumo:<\/span> "+ transporte.consumo.toFixed(2) +" l<br>"
          texto += "<span>Emissão de CO2:<\/span> "+ transporte.emissao.toFixed(2) +" g<br>"
          texto += "<span>Classificação:<\/span> "+ transporte.classificacao 
          let nome = transportador.nome
          let link = "https://www.baylit.store/Dashboard/Servicos"
          let mail_body = await default_email.generate_default(mail_title, mensagem_principal, texto, nome, link)

        // Create sendEmail params 
        var params = {
        Destination: { 
            ToAddresses: [
                transportador.email,
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
            Data: 'O seu transporte foi iniciado.'
            }
        },
        Source: 'delivery@baylit.store'
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
    
    async notifyTransportadorFim(transporte) {

        let transportador = await TransportadorGW.getById(transporte.transportador)
        let mensagem = "O seu transporte foi concluido."
        await NotificacaoGW.create(transportador._id, "transportadorTransporteTerminado", mensagem, "https://www.baylit.store/Dashboard/Servicos")

        var AWS = require('aws-sdk');
        AWS.config.update({
            accessKeyId: process.env.EC2_ACCESS_KEY,
            secretAccessKey: process.env.EC2_SECRET_KEY,
            region: 'eu-west-3',
          })

        let default_email = require('./MailGenerator/default')
        let mail_title = "O seu transporte foi concluido."
        let mensagem_principal = "O seu transporte foi concluido."
        let texto = "O seu transporte " + transporte._id + " regressou agora à sua sede. <br> <br>"
        texto += "<span>Dados do transporte:<\/span> <br>"
        texto += "<span>Data:<\/span> "+ transporte.data_inicio.toLocaleDateString("pt-PT") + "<br>"
        texto += "<span>Distância Total:<\/span> "+ transporte.distancia.toFixed(2) +" km<br>"
        texto += "<span>Consumo:<\/span> "+ transporte.consumo.toFixed(2) +" l<br>"
        texto += "<span>Emissão de CO2:<\/span> "+ transporte.emissao.toFixed(2) +" g<br>"
        texto += "<span>Classificação:<\/span> "+ transporte.classificacao 
        let nome = transportador.nome
        let link = "https://www.baylit.store/Dashboard/Servicos"
        let mail_body = await default_email.generate_default(mail_title, mensagem_principal, texto, nome, link)

        // Create sendEmail params 
        var params = {
        Destination: { 
            ToAddresses: [
                transportador.email,
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
            Data: 'O seu transporte foi concluido.'
            }
        },
        Source: 'delivery@baylit.store'
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

module.exports = {
    handler_cadeia: new CadeiaHandler()
}