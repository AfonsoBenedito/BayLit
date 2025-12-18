const ItemGW = require("../../gateway/ItemGat")
const ProdutoEspecificoGW = require("../../gateway/ProdutoEspecificoGat")
const ProdutoGW = require("../../gateway/ProdutoGat")
const NotificacaoGW = require("../../gateway/NotificacaoGat")
const ArmazenamentoGW = require("../../gateway/ArmazenamentoGat")
const ArmazemGW = require("../../gateway/ArmazemGat")
const FornecedorGW = require("../../gateway/FornecedorGat")
require("../../conn");

async function checkValidade() {

    try {
        let items = await ItemGW.getWithPrazoValidade()

        let informar = {
            'yesterday': {},
            'week': {},
            'two_week': {},
            'month': {}
        }
        for (let item of items) {
            let today = new Date()

            let yesterday = new Date()
            yesterday.setDate(today.getDate() - 1)

            let week = new Date()
            week.setDate(today.getDate() + 7)

            let two_week = new Date()
            two_week.setDate(two_week.getDate() + 15)

            let month = new Date()
            month.setDate(month.getDate() + 30)

            if (item.prazo_validade.getFullYear() == yesterday.getFullYear()
             && item.prazo_validade.getMonth() == yesterday.getMonth()
             && item.prazo_validade.getDate() == yesterday.getDate()) {

                let produto_especifico = await ProdutoEspecificoGW.getById(item.produto_especifico)
                // terminar o armazenamento
                await ArmazenamentoGW.terminateByItem(item._id)
                // registar desperdicio
                await ItemGW.updateDesperdicio(item._id)
                let armazem = await ArmazemGW.getWithItemEmInventario(item._id)
                if (armazem) {
                    let produto_armazenado_index = armazem.inventario.findIndex(p => p.itens.includes(item._id));
                    if (produto_armazenado_index != -1) {
                        const index_item = armazem.inventario[produto_armazenado_index].itens.indexOf(item._id);
                        if (index_item > -1) {
                            armazem.inventario[produto_armazenado_index].itens.splice(index_item, 1);
                            armazem.inventario[produto_armazenado_index].quantidade = armazem.inventario[produto_armazenado_index].quantidade - 1
                        }
                        // retirar de inventário
                        await ArmazemGW.updateInventario(armazem._id, armazem.inventario)
                    }
                }

                if (informar.yesterday[produto_especifico.produto]) {
                    informar.yesterday[produto_especifico.produto] = informar.yesterday[produto_especifico.produto] + 1
                } else {
                    informar.yesterday[produto_especifico.produto] = 1
                }
            
            } else if (item.prazo_validade.getFullYear() == week.getFullYear()
             && item.prazo_validade.getMonth() == week.getMonth()
             && item.prazo_validade.getDate() == week.getDate()) {

                let produto_especifico = await ProdutoEspecificoGW.getById(item.produto_especifico)

                if (informar.week[produto_especifico.produto]) {
                    informar.week[produto_especifico.produto] = informar.week[produto_especifico.produto] + 1
                } else {
                    informar.week[produto_especifico.produto] = 1
                }

            } else if (item.prazo_validade.getFullYear() == two_week.getFullYear()
                        && item.prazo_validade.getMonth() == two_week.getMonth()
                        && item.prazo_validade.getDate() == two_week.getDate()) {

                let produto_especifico = await ProdutoEspecificoGW.getById(item.produto_especifico)

                if (informar.two_week[produto_especifico.produto]) {
                    informar.two_week[produto_especifico.produto] = informar.two_week[produto_especifico.produto] + 1
                } else {
                    informar.two_week[produto_especifico.produto] = 1
                }

            } else if (item.prazo_validade.getFullYear() == month.getFullYear()
                        && item.prazo_validade.getMonth() == month.getMonth()
                        && item.prazo_validade.getDate() == month.getDate()) {

                let produto_especifico = await ProdutoEspecificoGW.getById(item.produto_especifico)

                if (informar.month[produto_especifico.produto]) {
                    informar.month[produto_especifico.produto] = informar.month[produto_especifico.produto] + 1
                } else {
                    informar.month[produto_especifico.produto] = 1
                }

            }
        }

        for (let produto in informar.yesterday) {
            await notifyExpiration(produto, informar.yesterday[produto])
        }

        for (let produto in informar.week) {
            await notifyWeekExpiration(produto, informar.week[produto])
        }

        for (let produto in informar.two_week) {
            await notifyTwoWeekExpiration(produto, informar.two_week[produto])
        }

        for (let produto in informar.month) {
            await notifyMonthExpiration(produto, informar.month[produto])
        }

        return "Prazos de validade verificados e notificados com sucesso"
    } catch (err) {
        console.log("ERROR! Não foi verificar as validades – "+err)
    }
}

async function notifyExpiration(produto_id, quantidade) {

    let produto = await ProdutoGW.getById(produto_id)
    let fornecedor = await FornecedorGW.getById(produto.fornecedor)

    let mensagem
    if (quantidade == 1) {
        mensagem = "1 item do seu produto " + produto.nome + " ultrapassou a validade."
    } else {
        mensagem = quantidade +" items do seu produto " + produto.nome + " ultrapassaram a validade."
    }
    await NotificacaoGW.create(produto.fornecedor, "fornecedorProdExpirado", mensagem, "https://www.baylit.store/Dashboard/SpecificProductPage/"+produto_id)

        var AWS = require('aws-sdk');
        AWS.config.update({
            accessKeyId: process.env.EC2_ACCESS_KEY,
            secretAccessKey: process.env.EC2_SECRET_KEY,
            region: 'eu-west-3',
          })

        let default_email = require('../MailGenerator/default')
        let mail_title = "Os seus itens ultrapassaram a validade."
        let mensagem_principal = "Os seus itens ultrapassaram a validade."
        let texto
        if (quantidade == 1) {
            texto = "1 item do seu produto " + produto.nome + " ultrapassou a validade.<br>"
            texto += "O desperdicio acontece! Mas cuidado com os excessos, o planeta é de todos."
        } else {
            texto = quantidade +" items do seu produto " + produto.nome + " ultrapassaram a validade.<br>"
            texto += "O desperdicio acontece! Mas cuidado com os excessos, o planeta é de todos."
        }
        let nome = fornecedor.nome
        let link = "https://www.baylit.store/Dashboard/SpecificProductPage/"+produto_id
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
            Data: mensagem
            }
        },
        Source: 'expiration@baylit.store'
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

async function notifyWeekExpiration(produto_id, quantidade) {

    let produto = await ProdutoGW.getById(produto_id)
    let fornecedor = await FornecedorGW.getById(produto.fornecedor)

    let mensagem
    if (quantidade == 1) {
        mensagem = "1 item do seu produto " + produto.nome + " está a uma semana de passar de validade."
    } else {
        mensagem = quantidade +" items do seu produto " + produto.nome + " estão a uma semana de passar de validade."
    }
    await NotificacaoGW.create(produto.fornecedor, "fornecedorProdExpirado1s", mensagem, "https://www.baylit.store/Dashboard/SpecificProductPage/"+produto_id)
    console.log("aqui2")
        var AWS = require('aws-sdk');
        AWS.config.update({
            accessKeyId: process.env.EC2_ACCESS_KEY,
            secretAccessKey: process.env.EC2_SECRET_KEY,
            region: 'eu-west-3',
          })

        let default_email = require('../MailGenerator/default')
        let mail_title = "Tem itens a passar de validade."
        let mensagem_principal = "Tem itens a passar de validade."
        let texto
        if (quantidade == 1) {
            texto = "1 item do seu produto " + produto.nome + " está a uma semana de passar de validade.<br>"
            texto += "Poderá considerar iniciar uma promoção de forma a acelerar a venda deste item e evitar o seu desperdicio."
        } else {
            texto = quantidade +" itens do seu produto " + produto.nome + " estão a uma semana de passar de validade.<br>"
            texto += "Poderá considerar iniciar uma promoção de forma a acelerar a venda destes items e evitar o seu desperdicio."
        }
        let nome = fornecedor.nome
        let link = "https://www.baylit.store/Dashboard/SpecificProductPage/"+produto_id
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
            Data: mensagem
            }
        },
        Source: 'expiration@baylit.store'
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

async function notifyTwoWeekExpiration(produto_id, quantidade) {

    let produto = await ProdutoGW.getById(produto_id)
    let fornecedor = await FornecedorGW.getById(produto.fornecedor)

    let mensagem
    if (quantidade == 1) {
        mensagem = "1 item do seu produto " + produto.nome + " está a duas semanas de passar de validade."
    } else {
        mensagem = quantidade +" items do seu produto " + produto.nome + " estão a duas semanas de passar de validade."
    }
    await NotificacaoGW.create(produto.fornecedor, "fornecedorProdExpirado2s", mensagem, "https://www.baylit.store/Dashboard/SpecificProductPage/"+produto_id)

        var AWS = require('aws-sdk');
        AWS.config.update({
            accessKeyId: process.env.EC2_ACCESS_KEY,
            secretAccessKey: process.env.EC2_SECRET_KEY,
            region: 'eu-west-3',
          })

        let default_email = require('../MailGenerator/default')
        let mail_title = "Tem itens a passar de validade."
        let mensagem_principal = "Tem itens a passar de validade."
        let texto
        if (quantidade == 1) {
            texto = "1 item do seu produto " + produto.nome + " está a duas semanas de passar de validade.<br>"
            texto += "Poderá considerar iniciar uma promoção de forma a acelerar a venda deste item e evitar o seu desperdicio."
        } else {
            texto = quantidade +" itens do seu produto " + produto.nome + " estão a duas semanas de passar de validade.<br>"
            texto += "Poderá considerar iniciar uma promoção de forma a acelerar a venda destes items e evitar o seu desperdicio."
        }
        let nome = fornecedor.nome
        let link = "https://www.baylit.store/Dashboard/SpecificProductPage/"+produto_id
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
            Data: mensagem
            }
        },
        Source: 'expiration@baylit.store'
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

async function notifyMonthExpiration(produto_id, quantidade) {
    let produto = await ProdutoGW.getById(produto_id)
    let fornecedor = await FornecedorGW.getById(produto.fornecedor)

    let mensagem
    if (quantidade == 1) {
        mensagem = "1 item do seu produto " + produto.nome + " está a um mês de passar de validade."
    } else {
        mensagem = quantidade +" items do seu produto " + produto.nome + " estão a um mês de passar de validade."
    }
    await NotificacaoGW.create(produto.fornecedor, "fornecedorProdExpirado2s", mensagem, "https://www.baylit.store/Dashboard/SpecificProductPage/"+produto_id)

        var AWS = require('aws-sdk');
        AWS.config.update({
            accessKeyId: process.env.EC2_ACCESS_KEY,
            secretAccessKey: process.env.EC2_SECRET_KEY,
            region: 'eu-west-3',
          })

        let default_email = require('../MailGenerator/default')
        let mail_title = "Tem itens a passar de validade."
        let mensagem_principal = "Tem itens a passar de validade."
        let texto
        if (quantidade == 1) {
            texto = "1 item do seu produto " + produto.nome + " está a um mês de passar de validade.<br>"
            texto += "Poderá considerar iniciar uma promoção de forma a acelerar a venda deste item e evitar o seu desperdicio."
        } else {
            texto = quantidade +" itens do seu produto " + produto.nome + " estão a um mês de passar de validade.<br>"
            texto += "Poderá considerar iniciar uma promoção de forma a acelerar a venda destes items e evitar o seu desperdicio."
        }
        let nome = fornecedor.nome
        let link = "https://www.baylit.store/Dashboard/SpecificProductPage/"+produto_id
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
            Data: mensagem
            }
        },
        Source: 'expiration@baylit.store'
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

checkValidade().then((result) => console.log(result))