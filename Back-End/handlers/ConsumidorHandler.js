const ConsumidorGW = require("../gateway/ConsumidorGat")
const utils = require("../utils");
const email_validator = require("email-validator");
const FornecedorGW = require("../gateway/FornecedorGat")
const TransportadorGW = require("../gateway/TransportadorGat")
const EncomendaGW = require("../gateway/EncomendaGat")
const VendaGW = require("../gateway/VendaGat")
const LocalGW = require("../gateway/LocalGat")
const TransporteGW = require("../gateway/TransporteGat")
const ArmazemGW = require("../gateway/ArmazemGat");
const ArmazenamentoGW = require("../gateway/ArmazenamentoGat");
const NotificacaoGW = require("../gateway/NotificacaoGat");
const ProdutoEspecificoGW = require("../gateway/ProdutoEspecificoGat");
const ProdutoGW = require("../gateway/ProdutoGat");
const ProducaoGW = require("../gateway/ProducaoGat");
const AtributoGW = require("../gateway/AtributoGat");
const GeoHandler = require("./GeoHandler");
const bcrypt = require("bcrypt");
const Local = require("../models/Local");

class ConsumidorHandler {

    async GetConsumidorByID(id) {

        let consumidor = await ConsumidorGW.getById(id)

        if (consumidor != false) {

            return consumidor

        } else {

            throw {
                code: 400,
                message: "Não existe Consumidor com esse ID"
            }
        }
    }

    async GetConsumidorByEmail(email) {

        let consumidor = await ConsumidorGW.getByEmail(email)

        if (consumidor != false) {

            return consumidor

        } else {

            throw {
                code: 400,
                message: "Não existe Consumidor com esse Email"
            }
        }
    }

    async GetAllConsumidores() {

        let consumidores = await ConsumidorGW.getAll()

        if (consumidores != false) {

            return consumidores

        } else {

            throw {
                code: 400,
                message: "Não existem Consumidores"
            }
        }
    }

    async UpdateConsumidor(id, nome, email, password_antiga, password_nova, morada, nif, telemovel) {

        let consumidor = await ConsumidorGW.getById(id)

        if (consumidor != false) {

            let atualizar = []

            if (password_antiga != null){

                if (bcrypt.compareSync(password_antiga, consumidor.password)){
                    
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

                local_morada = await LocalGW.getById(morada)

                if (local_morada != false) {
                    if (local_morada.utilizador == id) {
                        atualizar.push('Morada')
                    } else {
                        throw {
                            code: 400,
                            message: "O local que inseriu como nova morada não está registado"
                        }
                    }
                } else {
                    throw {
                        code: 400,
                        message: "O local que inseriu como nova morada não está registado"
                    }
                }

                
                
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

            if (email != null) {

                if (email_validator.validate(email)){

                    if (email != consumidor.email){
                        
                        if (await !ConsumidorGW.getByEmail(email) && await !FornecedorGW.getByEmail(email) && await !TransportadorGW.getByEmail(email)){

                            atualizar.push('Email')
    
                        } else {
    
                            throw {
                                code: 400,
                                message: "Email já está em uso"
                            }
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

                await ConsumidorGW.updateName(id, nome)

            }

            if (atualizar.includes('Email')){

                await ConsumidorGW.updateEmail(id, email)
                
            }

            if (atualizar.includes('Password')){

                let hashed_pw = bcrypt.hashSync(password_nova, 10);
                await ConsumidorGW.updatePassword(id, hashed_pw)
                
            }

            if (atualizar.includes('Morada')){

                await ConsumidorGW.updateAddress(id, morada)
                
            }

            if (atualizar.includes('Nif')){

                await ConsumidorGW.updateNif(id, nif)
                
            }

            if (atualizar.includes('Telemovel')){

                await ConsumidorGW.updatePhone(id, telemovel)
                
            }

            return await ConsumidorGW.getById(id);

        } else {

            throw {
                code: 400,
                message: "Não existe Consumidor com esse ID"
            }
        }
    }

    async GetEncomendasConsumidor(id_consumidor) {

        let consumidor = await ConsumidorGW.getById(id_consumidor)

        if (consumidor != false) {

            let encomendas = await EncomendaGW.getByComprador(id_consumidor)

            let encomendas_finais = []
            for (let encomenda of encomendas) {

                let encomenda_final = JSON.parse(JSON.stringify(encomenda));

                let comprador = await ConsumidorGW.getHistoricoById(encomenda.comprador)
                encomenda_final.comprador = {
                    "_id": comprador._id,
                    "nome": comprador.nome 
                }

                let transportador = await TransportadorGW.getHistoricoById(encomenda.transportador)
                encomenda_final.transportador = {
                    "_id": transportador._id,
                    "nome": transportador.nome 
                }

                let transporte = await TransporteGW.getById(encomenda.transporte)
                encomenda_final.transporte = {
                    "_id": transporte._id,
                    "distancia": Math.round(transporte.distancia * 100) / 100,
                    "consumo": Math.round(transporte.consumo * 100) / 100,
                    "emissao": Math.round(transporte.emissao * 100) / 100,
                    "classificacao": Math.round(transporte.classificacao * 100) / 100
                }

                let local_entrega = await LocalGW.getHistoricoById(encomenda.local_entrega)
                encomenda_final.local_entrega = {
                    "_id": local_entrega._id,
                    "morada": local_entrega.morada
                }

                encomenda_final.data_encomenda = encomenda.data_encomenda.toLocaleString('pt-PT', { timeZone: 'UTC' });
                encomenda_final.data_entrega = encomenda.data_entrega.toLocaleString('pt-PT', { timeZone: 'UTC' });
                encomenda_final.prazo_cancelamento = encomenda.prazo_cancelamento.toLocaleString('pt-PT', { timeZone: 'UTC' });
             
                encomendas_finais.push(encomenda_final)
            }

            return encomendas_finais

        } else {

            throw {
                code: 400,
                message: "Não existe Consumidor com esse ID"
            }
        }

    }

    async GetEncomendaConsumidor(id_consumidor, id_encomenda) {

        let consumidor = await ConsumidorGW.getById(id_consumidor)

        if (consumidor != false) {

            let encomenda = await EncomendaGW.getById(id_encomenda)

            if (encomenda != false) {

                if (encomenda.comprador == id_consumidor) {

                    let encomenda_final = JSON.parse(JSON.stringify(encomenda));

                    let comprador = await ConsumidorGW.getHistoricoById(encomenda.comprador)
                    encomenda_final.comprador = {
                        "_id": comprador._id,
                        "nome": comprador.nome 
                    }

                    let transportador = await TransportadorGW.getHistoricoById(encomenda.transportador)
                    encomenda_final.transportador = {
                        "_id": transportador._id,
                        "nome": transportador.nome 
                    }

                    let transporte = await TransporteGW.getById(encomenda.transporte)
                    encomenda_final.transporte = {
                        "_id": transporte._id,
                        "distancia": Math.round(transporte.distancia * 100) / 100,
                        "consumo": Math.round(transporte.consumo * 100) / 100,
                        "emissao": Math.round(transporte.emissao * 100) / 100,
                        "classificacao": Math.round(transporte.classificacao * 100) / 100
                    }

                    let local_entrega = await LocalGW.getHistoricoById(encomenda.local_entrega)
                    encomenda_final.local_entrega = {
                        "_id": local_entrega.id,
                        "morada": local_entrega.morada
                    }

                    encomenda_final.data_encomenda = encomenda.data_encomenda.toLocaleString('pt-PT', { timeZone: 'UTC' });
                    encomenda_final.data_entrega = encomenda.data_entrega.toLocaleString('pt-PT', { timeZone: 'UTC' });
                    encomenda_final.prazo_cancelamento = encomenda.prazo_cancelamento.toLocaleString('pt-PT', { timeZone: 'UTC' });

                    return encomenda_final

                } else {

                    throw {
                        code: 400,
                        message: "Não tem permissão para aceder a essa Encomenda"
                    }
                }

            } else {

                throw {
                    code: 400,
                    message: "Não existe Encomenda com esse ID"
                }
            }
        } else {

            throw {
                code: 400,
                message: "Não existe Consumidor com esse ID"
            }
        }

    }

    async GetEncomendasConsumidorJSON(id_consumidor) {
        let encomendas = await this.GetEncomendasConsumidor(id_consumidor)
        let encomendas_json = []
        for (let encomenda of encomendas) {
            let cadeia = await this.GetCadeiaEncomenda(encomenda)

            let encomenda_json = JSON.parse(JSON.stringify(encomenda))

            encomenda_json.comprador = encomenda.comprador.nome
            encomenda_json.transportador = encomenda.transportador.nome
            encomenda_json.local_entrega = encomenda.local_entrega.morada

            let produtos_json = []
            for (let produto_encomenda of encomenda.produtos) {

                let produto_especifico = await ProdutoEspecificoGW.getHistoricoById(produto_encomenda._id)

                let produto_json
                if (produto_especifico != false) {
                    let produto = await ProdutoGW.getHistoricoById(produto_especifico._id)
    
                    let caracteristicas = {}
                    for (let especificidade of produto_especifico.especificidade) {
                        let atributo = await AtributoGW.getById(especificidade.atributo)
                        caracteristicas[atributo.nome] = especificidade.valor
                    }
                    
                    produto_json = {
                        produto: produto.nome,
                        caracteristicas: caracteristicas,
                        quantidade: produto_encomenda.quantidade
                    }
                } else {
                    produto_json = {
                        produto: "Not available",
                        caracteristicas: {},
                        quantidade: produto_encomenda.quantidade
                    }
    
                }
                
                produtos_json.push(produto_json)
            }

            encomenda_json.produtos = produtos_json

            encomenda_json.producao = cadeia.producao
            encomenda_json.armazenamento = cadeia.armazenamento
            encomenda_json.transporte_armazem = cadeia.transporte_armazem
            encomenda_json.transporte = cadeia.transporte
            encomenda_json.classificacao = cadeia.classificacao

            delete encomenda_json.__v

            encomendas_json.push(encomenda_json)
        }

        return encomendas_json
    }

    async GetEncomendasConsumidorCSV(id_consumidor) {

        let encomendas = await this.GetEncomendasConsumidorJSON(id_consumidor)
        console.log(encomendas)
        let csv_encomendas = utils.convertToCSV(encomendas)
        console.log(csv_encomendas)

        return csv_encomendas
    }

    async GetCadeiaEncomenda(encomenda) {

        let cadeia_carrinho = {
            producao: {
                recursos: [],
                poluicao: [],
                tipo: {
                    "Biologica": 0, 
                    "Organica": 0, 
                    "Intensiva": 0
                },
                classificacao: []
            },
            armazenamento: {
                duracao: 0,
                consumo: 0,
                classificacao: []
            },
            transporte_armazem: {
                distancia: 0,
                consumo: 0,
                emissao: 0,
                classificacao: []
            },
            transporte: {
                distancia: 0,
                consumo: 0,
                emissao: 0,
                classificacao: 0,
            },
            classificacao: 0
        }

        let total_itens = 0
        for (let produto_carrinho of encomenda.produtos) {

            total_itens += produto_carrinho.quantidade

            let produto_especifico = await ProdutoEspecificoGW.getById(produto_carrinho.produto)
            let produto = await ProdutoGW.getById(produto_especifico.produto)

            if (produto != false) {

                let producao = await ProducaoGW.getByProduto(produto._id)
                let armazenamento = produto.armazenamento
                let transporte_armazem = produto.transporte_armazem

                for (let recurso of producao.recursos) {
                    let indexRecurso = cadeia_carrinho.producao.recursos.findIndex(element => element.nome == recurso.nome);
                    if (indexRecurso == -1) {
                        let recurso_novo = {
                            "nome": recurso.nome,
                            "quantidade": produto_carrinho.quantidade * recurso.quantidade,
                            "unidade_medida": recurso.unidade_medida
                        }

                        cadeia_carrinho.producao.recursos.push(recurso_novo)
                    } else {
                        cadeia_carrinho.producao.recursos[indexRecurso].quantidade = cadeia_carrinho.producao.recursos[indexRecurso].quantidade + (produto_carrinho.quantidade * recurso.quantidade)
                    }
                }

                for (let poluicao of producao.poluicao) {
                    let indexPoluicao = cadeia_carrinho.producao.poluicao.findIndex(element => element.nome == poluicao.nome);
                    if (indexPoluicao == -1) {
                        let poluicao_nova = {
                            "nome": poluicao.nome,
                            "quantidade": [poluicao.quantidade]
                        }

                        cadeia_carrinho.producao.poluicao.push(poluicao_nova)
                    } else {
                        cadeia_carrinho.producao.poluicao[indexPoluicao].quantidade.push(poluicao.quantidade)
                    }
                }

                if (producao.tipo == "Biologica") {
                    cadeia_carrinho.producao.tipo["Biologica"] += produto_carrinho.quantidade
                } else if (producao.tipo == "Organica") {
                    cadeia_carrinho.producao.tipo["Organica"] += produto_carrinho.quantidade
                } else if (producao.tipo == "Intensiva") {
                    cadeia_carrinho.producao.tipo["Intensiva"] += produto_carrinho.quantidade
                }

                for (let p = 0; p < produto_carrinho.quantidade; p++) {
                    cadeia_carrinho.producao.classificacao.push(producao.classificacao)
                    
                    cadeia_carrinho.armazenamento.classificacao.push(armazenamento.classificacao)
                    cadeia_carrinho.armazenamento.duracao += armazenamento.duracao
                    cadeia_carrinho.armazenamento.consumo += armazenamento.consumo

                    cadeia_carrinho.transporte_armazem.classificacao.push(transporte_armazem.classificacao)
                    cadeia_carrinho.transporte_armazem.distancia += transporte_armazem.distancia
                    cadeia_carrinho.transporte_armazem.consumo += transporte_armazem.consumo
                    cadeia_carrinho.transporte_armazem.emissao += transporte_armazem.emissao
                }

            } else {

                throw {
                    code: 400,
                    message: "Não existe Produto com esse ID"
                }
            }
        }

        let index_poluicao = 0
        for (let poluicao of cadeia_carrinho.producao.poluicao) {
            let classif = []
            for (let quantidade of poluicao.quantidade) {
                if (quantidade == "Residual") {
                    classif.push(1)
                } else if (quantidade == "Marginal") {
                    classif.push(2)
                } else if (quantidade == "Moderada") {
                    classif.push(3)
                } else if (quantidade == "Severa") {
                    classif.push(4)
                } else if (quantidade == "Critica") {
                    classif.push(5)
                }
            }

            let total = 0
            for (let c of classif) {
                total += c
            }

            let classificacao_media = Math.round(total / classif.length)
            let quantidade_final 
            if (classificacao_media <= 1) {
                quantidade_final = "Residual"
            } else if (classificacao_media == 2) {
                quantidade_final = "Marginal"
            } else if (classificacao_media == 3) {
                quantidade_final = "Moderada"
            } else if (classificacao_media == 4) {
                quantidade_final = "Severa"
            } else if (classificacao_media == 5) {
                quantidade_final = "Critica"
            }

            cadeia_carrinho.producao.poluicao[index_poluicao].quantidade = quantidade_final
            index_poluicao++
        }

        let total_classificacao_producao = 0
        for (let classificacao_producao of cadeia_carrinho.producao.classificacao) {
            total_classificacao_producao += classificacao_producao
        }
        cadeia_carrinho.producao.classificacao = Math.round((total_classificacao_producao / total_itens) * 100) / 100
        
        let total_classificacao_armazenamento = 0
        for (let classificacao_armazenamento of cadeia_carrinho.armazenamento.classificacao) {
            total_classificacao_armazenamento += classificacao_armazenamento
        }
        cadeia_carrinho.armazenamento.classificacao = Math.round((total_classificacao_armazenamento / total_itens) * 100) / 100

        let total_classificacao_transporte_armazem = 0
        for (let classificacao_transporte_armazem of cadeia_carrinho.transporte_armazem.classificacao) {
            total_classificacao_transporte_armazem += classificacao_transporte_armazem
        }
        cadeia_carrinho.transporte_armazem.classificacao = Math.round((total_classificacao_transporte_armazem / total_itens) * 100) / 100

        cadeia_carrinho.armazenamento.duracao = Math.round((cadeia_carrinho.armazenamento.duracao) * 100) / 100
        cadeia_carrinho.armazenamento.consumo = Math.round((cadeia_carrinho.armazenamento.consumo) * 100) / 100

        cadeia_carrinho.transporte_armazem.consumo = Math.round((cadeia_carrinho.transporte_armazem.consumo) * 100) / 100
        cadeia_carrinho.transporte_armazem.distancia = Math.round((cadeia_carrinho.transporte_armazem.distancia) * 100) / 100
        cadeia_carrinho.transporte_armazem.emissao = Math.round((cadeia_carrinho.transporte_armazem.emissao) * 100) / 100

        cadeia_carrinho.producao.tipo.Biologica = Math.round((cadeia_carrinho.producao.tipo.Biologica / total_itens) * 10000) / 100
        cadeia_carrinho.producao.tipo.Intensiva = Math.round((cadeia_carrinho.producao.tipo.Intensiva / total_itens) * 10000) / 100
        cadeia_carrinho.producao.tipo.Organica = Math.round((cadeia_carrinho.producao.tipo.Organica / total_itens) * 10000) / 100

        let transporte = await TransporteGW.getById(encomenda.transporte)

        if (transporte != false) {

            let itens_transporte = transporte.mercadoria.length
            let percentagem_itens = total_itens / itens_transporte

            cadeia_carrinho.transporte.distancia = Math.round((transporte.distancia) * 10000) / 100 
            cadeia_carrinho.transporte.consumo = Math.round((transporte.consumo * percentagem_itens) * 10000) / 100 
            cadeia_carrinho.transporte.emissao = Math.round((transporte.emissao * percentagem_itens) * 10000) / 100
            cadeia_carrinho.transporte.classificacao = Math.round((transporte.classificacao) * 10000) / 100
        } else {
            cadeia_carrinho.transporte.distancia = 0
            cadeia_carrinho.transporte.consumo = 0
            cadeia_carrinho.transporte.emissao = 0
            cadeia_carrinho.transporte.classificacao = 1
        }

        cadeia_carrinho.classificacao = Math.round((cadeia_carrinho.producao.classificacao +
            cadeia_carrinho.transporte_armazem.classificacao +
            cadeia_carrinho.armazenamento.classificacao +
            cadeia_carrinho.transporte.classificacao) / 4)

        return cadeia_carrinho
        
    }

    async GetSumarioCadeiaEncomenda(encomenda) {
        
        let cadeia_carrinho = {
            producao: {
                tipo: {
                    "Biologica": 0, 
                    "Organica": 0, 
                    "Intensiva": 0
                },
                classificacao: []
            },
            armazenamento: {
                duracao: 0,
                classificacao: []
            },
            transporte_armazem: {
                distancia: 0,
                classificacao: []
            },
            transporte: {
                distancia: 0,
                classificacao: 0,
            },
            classificacao: 0
        }

        let total_itens = 0
        for (let produto_carrinho of encomenda.produtos) {

            total_itens += produto_carrinho.quantidade

            let produto_especifico = await ProdutoEspecificoGW.getById(produto_carrinho.produto)
            let produto = await ProdutoGW.getById(produto_especifico.produto)

            if (produto != false) {

                let producao = await ProducaoGW.getByProduto(produto._id)
                let armazenamento = produto.armazenamento
                let transporte_armazem = produto.transporte_armazem

                if (producao.tipo == "Biologica") {
                    cadeia_carrinho.producao.tipo["Biologica"] += produto_carrinho.quantidade
                } else if (producao.tipo == "Organica") {
                    cadeia_carrinho.producao.tipo["Organica"] += produto_carrinho.quantidade
                } else if (producao.tipo == "Intensiva") {
                    cadeia_carrinho.producao.tipo["Intensiva"] += produto_carrinho.quantidade
                }

                for (let p = 0; p < produto_carrinho.quantidade; p++) {
                    cadeia_carrinho.producao.classificacao.push(producao.classificacao)
                    
                    cadeia_carrinho.armazenamento.classificacao.push(armazenamento.classificacao)
                    cadeia_carrinho.armazenamento.duracao += armazenamento.duracao

                    cadeia_carrinho.transporte_armazem.classificacao.push(transporte_armazem.classificacao)
                    cadeia_carrinho.transporte_armazem.distancia += transporte_armazem.distancia
                }

            } else {

                throw {
                    code: 400,
                    message: "Não existe Produto com esse ID"
                }
            }
        }

        let total_classificacao_producao = 0
        for (let classificacao_producao of cadeia_carrinho.producao.classificacao) {
            total_classificacao_producao += classificacao_producao
        }
        cadeia_carrinho.producao.classificacao = Math.round((total_classificacao_producao / total_itens) * 100) / 100
        
        let total_classificacao_armazenamento = 0
        for (let classificacao_armazenamento of cadeia_carrinho.armazenamento.classificacao) {
            total_classificacao_armazenamento += classificacao_armazenamento
        }
        cadeia_carrinho.armazenamento.classificacao = Math.round((total_classificacao_armazenamento / total_itens) * 100) / 100

        let total_classificacao_transporte_armazem = 0
        for (let classificacao_transporte_armazem of cadeia_carrinho.transporte_armazem.classificacao) {
            total_classificacao_transporte_armazem += classificacao_transporte_armazem
        }
        cadeia_carrinho.transporte_armazem.classificacao = Math.round((total_classificacao_transporte_armazem / total_itens) * 100) / 100

        cadeia_carrinho.armazenamento.duracao = Math.round((cadeia_carrinho.armazenamento.duracao) * 100) / 100
        
        cadeia_carrinho.transporte_armazem.distancia = Math.round((cadeia_carrinho.transporte_armazem.distancia) * 100) / 100
        
        cadeia_carrinho.producao.tipo.Biologica = Math.round((cadeia_carrinho.producao.tipo.Biologica / total_itens) * 10000) / 100
        cadeia_carrinho.producao.tipo.Intensiva = Math.round((cadeia_carrinho.producao.tipo.Intensiva / total_itens) * 10000) / 100
        cadeia_carrinho.producao.tipo.Organica = Math.round((cadeia_carrinho.producao.tipo.Organica / total_itens) * 10000) / 100

        let transporte = await TransporteGW.getById(encomenda.transporte)

        if (transporte != false) {
            cadeia_carrinho.transporte.distancia = Math.round((transporte.distancia) * 10000) / 100
            cadeia_carrinho.transporte.classificacao = Math.round((transporte.classificacao) * 10000) / 100
        } else {
            cadeia_carrinho.transporte.distancia = 0
            cadeia_carrinho.transporte.classificacao = 0
        }

        cadeia_carrinho.classificacao = Math.round((cadeia_carrinho.producao.classificacao +
            cadeia_carrinho.transporte_armazem.classificacao +
            cadeia_carrinho.armazenamento.classificacao +
            cadeia_carrinho.transporte.classificacao) / 4)

        return cadeia_carrinho
    }

    async CancelEncomenda(id_consumidor, id_encomenda) {

        let consumidor = await ConsumidorGW.getById(id_consumidor)

        if (consumidor != false) {

            let encomenda = await EncomendaGW.getById(id_encomenda)

            if (encomenda != false) {

                if (encomenda.estado == "Confirmada") {
                    let now = new Date()

                    if (encomenda.prazo_cancelamento > now) {

                        for (let produto of encomenda.produtos) {
                            let venda = await VendaGW.getByItems(produto.itens)
                            await VendaGW.updateEstado(venda._id, "Cancelada")

                            await this.notifyFornecedorVendaCancelada(venda)
                        }
        
                        let transporte = await TransporteGW.getById(encomenda.transporte)
                    
                        for (let produto_encomenda of encomenda.produtos) {

                            for (let item_encomenda of produto_encomenda.itens) {
                                await ArmazenamentoGW.restartByItem(item_encomenda)

                                const index_item = transporte.mercadoria.findIndex(produto => String(produto.item) == String(item_encomenda));

                                let armazem = await ArmazemGW.getByLocalizacao(transporte.mercadoria[index_item].local_recolha)
                                const index_item_inventario = armazem.inventario.findIndex(produto => String(produto.produto) == String(produto_encomenda.produto));
                                armazem.inventario[index_item_inventario].itens.push(item_encomenda)
                                armazem.inventario[index_item_inventario].quantidade++

                                transporte.mercadoria.splice(index_item, 1);

                                await ArmazemGW.updateInventario(armazem._id, armazem.inventario)
                            }
                            
                        }
        
                        await TransporteGW.updateMercadoria(transporte._id, transporte.mercadoria)
        
                        let prev_locais_transporte = []
        
                        let sede_local = await LocalGW.getById(transporte.rota[0])
                        let sede_local_geo = {
                            id: transporte.rota[0],
                            lon: sede_local.lon,
                            lat: sede_local.lat,
                            pickup: [],
                            entregar: []
                        }
                        prev_locais_transporte.push(sede_local_geo)
        
                        let locais = []
                        for (let mercado of transporte.mercadoria) {
                            if (locais.includes(String(mercado.local_entrega))) {
                                for (let local_transporte of prev_locais_transporte) {
                                    if (String(local_transporte.id) == String(mercado.local_entrega)) {
                                        local_transporte.entregar.push(mercado.item)
                                    }
                                }
                            } else {
                                let transporte_local = await LocalGW.getById(mercado.local_entrega)
                                let transporte_local_geo = {
                                    id: mercado.local_entrega,
                                    lon: transporte_local.lon,
                                    lat: transporte_local.lat,
                                    pickup: [],
                                    entregar: [mercado.item]
                                }
                                prev_locais_transporte.push(transporte_local_geo)
                                locais.push(String(mercado.local_entrega))
                            }
        
                            if (locais.includes(String(mercado.local_recolha))) {
                                for (let local_transporte of prev_locais_transporte) {
                                    if (String(local_transporte.id) == String(mercado.local_recolha)) {
                                        local_transporte.pickup.push(mercado.item)
                                    }
                                }
                            } else {
                                let transporte_local = await LocalGW.getById(mercado.local_recolha)
                                let transporte_local_geo = {
                                    id: mercado.local_recolha,
                                    lon: transporte_local.lon,
                                    lat: transporte_local.lat,
                                    pickup: [mercado.item],
                                    entregar: []
                                }
                                prev_locais_transporte.push(transporte_local_geo)
                                locais.push(String(mercado.local_recolha))
                            }
                        }
        
                        if (prev_locais_transporte.length > 1) {
                            await GeoHandler.geo_handler.CalculateTransporte(transporte, prev_locais_transporte)
                        } else {
                            await TransporteGW.updateCadeia(transporte._id, 0, 0, 0)
                            await TransporteGW.updateRota(transporte._id, [transporte.rota[0], transporte.rota[0]])
                        }
                        
                        this.notifyTransportadorTransporteAtualizado(encomenda)
        
                        await EncomendaGW.updateEstado(id_encomenda, "Cancelada")

                    } else {
                        throw {
                            code: 400,
                            message: "O prazo de cancelamento da encomenda foi ultrapassado"
                        }
                    }
                } else {
                    throw {
                        code: 400,
                        message: "Esta encomenda não pode ser cancelada"
                    }
                }
                
            }

        } else {
            throw {
                code: 400,
                message: "Não existe Consumidor com esse ID"
            }
        }

    }

    async GetFavoritosConsumidor(id_consumidor){

        let consumidor = await ConsumidorGW.getById(id_consumidor)

        if (consumidor != false) {

            let result = {
                utilizadores: consumidor.utilizadores_favoritos,
                produtos: consumidor.produtos_favoritos
            }

            return result

        } else {

            throw {
                code: 400,
                message: "Não existe Consumidor com esse ID"
            }
        }
    }

    async GetUtilizadoresFavoritosConsumidor(id_consumidor){

        let consumidor = await ConsumidorGW.getById(id_consumidor)

        if (consumidor != false) {

            return consumidor.utilizadores_favoritos

        } else {

            throw {
                code: 400,
                message: "Não existe Consumidor com esse ID"
            }
        }
    }

    async GetProdutosFavoritosConsumidor(id_consumidor){

        let consumidor = await ConsumidorGW.getById(id_consumidor)

        if (consumidor != false) {

            return consumidor.produtos_favoritos

        } else {

            throw {
                code: 400,
                message: "Não existe Consumidor com esse ID"
            }
        }
    }

    async AddUtilizadorFavorito(id_consumidor, id_favorito) {

        let consumidor = await ConsumidorGW.getById(id_consumidor)

        if (consumidor != false) {

            await ConsumidorGW.addFavoriteUser(id_consumidor,id_favorito)

        } else {

            throw {
                code: 400,
                message: "Não existe Consumidor com esse ID"
            }
        }
    }

    async AddProdutoFavorito(id_consumidor, id_favorito) {

        let consumidor = await ConsumidorGW.getById(id_consumidor)

        if (consumidor != false) {

            await ConsumidorGW.addFavoriteProduct(id_consumidor,id_favorito)

        } else {

            throw {
                code: 400,
                message: "Não existe Consumidor com esse ID"
            }
        }
    }

    async RemoveUtilizadorFavorito(id_consumidor, id_favorito) {

        let consumidor = await ConsumidorGW.getById(id_consumidor)

        if (consumidor != false) {

            await ConsumidorGW.RemoveUtilizadorFavorito(id_consumidor,id_favorito)

        } else {

            throw {
                code: 400,
                message: "Não existe Consumidor com esse ID"
            }
        }
    }

    async RemoveProdutoFavorito(id_consumidor, id_favorito) {

        let consumidor = await ConsumidorGW.getById(id_consumidor)

        if (consumidor != false) {

            await ConsumidorGW.removeFavoriteProduct(id_consumidor,id_favorito)

        } else {

            throw {
                code: 400,
                message: "Não existe Consumidor com esse ID"
            }
        }
    }

    async notifyFornecedorVendaCancelada(venda) {

        let fornecedor = await FornecedorGW.getById(venda.fornecedor)
        let mensagem = "A sua venda "+venda._id+" no valor de "+venda.valor+"€ foi cancelada pelo comprador."
        await NotificacaoGW.create(venda.fornecedor, "fornecedorVendaCancelada", mensagem, "https://www.baylit.store/Dashboard/Orders")

        var AWS = require('aws-sdk');
        AWS.config.update({
            accessKeyId: process.env.EC2_ACCESS_KEY,
            secretAccessKey: process.env.EC2_SECRET_KEY,
            region: 'eu-west-3',
          })

        let default_email = require('./MailGenerator/default')
        let mail_title = "A sua venda foi cancelada pelo comprador"
        let mensagem_principal = "A sua venda foi cancelada pelo comprador"
        let texto = "Lamentamos, mas o comprador cancelou a sua encomenda no valor de "+venda.valor+"€."
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
            Data: 'A sua venda '+venda._id+' no valor de '+venda.valor+'€ foi cancelada pelo comprador'
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

    async notifyTransportadorTransporteAtualizado(encomenda) {

        let consumidor = await ConsumidorGW.getById(encomenda.comprador)
        let transportador = await TransportadorGW.getById(encomenda.transportador)
        let transporte = await TransporteGW.getById(encomenda.transporte) 
        let transporte_consumo_item = Math.round((transporte.consumo / transporte.mercadoria.length) * 100) / 100
        let transporte_emissao_item = Math.round((transporte.emissao / transporte.mercadoria.length) * 100) / 100
        let mensagem = "Foi cancelado um pedido num dos seus transportes!"
        await NotificacaoGW.create(encomenda.transportador, "transportadorTransporteAtualizado", mensagem, "https://www.baylit.store/Dashboard/Servicos")

        var AWS = require('aws-sdk');
        AWS.config.update({
            accessKeyId: process.env.EC2_ACCESS_KEY,
            secretAccessKey: process.env.EC2_SECRET_KEY,
            region: 'eu-west-3',
          })

        let default_email = require('./MailGenerator/default')
        let mail_title = "Foi cancelado um pedido num dos seus transportes."
        let mensagem_principal = "Foi cancelado um pedido num dos seus transportes."
        let texto = "O utilizador +"+ consumidor.nome +" cancelou a sua encomenda que iria ser transportada pelo seu transporte "+transporte._id+"."
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
            Data: 'Foi cancelado um pedido num dos seus transportes'
            }
        },
        Source: 'orders@baylit.store'
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
    handler_consumidor: new ConsumidorHandler()
}