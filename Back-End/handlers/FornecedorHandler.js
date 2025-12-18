const ConsumidorGW = require("../gateway/ConsumidorGat")
const utils = require("../utils");
const email_validator = require("email-validator");
const FornecedorGW = require("../gateway/FornecedorGat")
const TransportadorGW = require("../gateway/TransportadorGat")
const VendaGW = require("../gateway/VendaGat")
const ArmazemGW = require("../gateway/ArmazemGat")
const ProdutoEspecificoGW = require("../gateway/ProdutoEspecificoGat")
const ProdutoGW = require("../gateway/ProdutoGat")
const ProducaoGW = require("../gateway/ProducaoGat")
const ItemGW = require("../gateway/ItemGat")
const LocalGW = require("../gateway/LocalGat")
const TransporteArmazemGW = require("../gateway/TransporteArmazemGat")
const ArmazenamentoGW = require("../gateway/ArmazenamentoGat")
const EncomendaGW = require("../gateway/EncomendaGat")
const FuncionarioGW = require("../gateway/FuncionarioGat")
const AtributoGW = require("../gateway/AtributoGat")
const CadeiaHandler = require("./CadeiaHandler").handler_cadeia;
const bcrypt = require("bcrypt")

const vehicle_emissions_json = require("./vehicle_emission.json");
const GeoHandler = require("./GeoHandler").geo_handler;


class FornecedorHandler {

    async GetFornecedorByID(id) {

        let fornecedor = await FornecedorGW.getById(id)

        if (fornecedor != false) {

            return fornecedor

        } else {

            throw {
                code: 400,
                message: "Não existe Fornecedor com esse ID"
            }
        }
    }

    async GetFornecedorByEmail(email) {

        let fornecedor = await FornecedorGW.getByEmail(email)

        if (fornecedor != false) {

            return fornecedor

        } else {

            throw {
                code: 400,
                message: "Não existe Fornecedor com esse Email"
            }
        }
    }

    async GetAllFornecedores() {

        let fornecedores = await FornecedorGW.getAll()

        if (fornecedores != false) {

            return fornecedores

        } else {

            throw {
                code: 400,
                message: "Não existem Fornecedores"
            }
        }
    }

    async UpdateFornecedor(id, nome, email, password_antiga, password_nova, morada, nif, telemovel) {

        let fornecedor = await FornecedorGW.getById(id)

        if (fornecedor != false) {

            let atualizar = []

            if (password_antiga != null){

                if (bcrypt.compareSync(password_antiga, fornecedor.password)){
                    
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

            if (email != null) {

                if (email_validator.validate(email)){

                    if (await !FornecedorGW.getByEmail(email) && await !ConsumidorGW.getByEmail(email) && await !TransportadorGW.getByEmail(email)){

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

                await FornecedorGW.updateName(id, nome)

            }

            if (atualizar.includes('Email')){

                await FornecedorGW.updateEmail(id, email)
                
            }

            if (atualizar.includes('Password')){

                let hashed_pw = bcrypt.hashSync(password_nova, 10);
                await FornecedorGW.updatePassword(id, hashed_pw)
                
            }

            if (atualizar.includes('Morada')){

                await FornecedorGW.updateMorada(id, morada)
                
            }

            if (atualizar.includes('Nif')){

                await FornecedorGW.updateNif(id, nif)
                
            }

            if (atualizar.includes('Telemovel')){

                await FornecedorGW.updateTelemovel(id, telemovel)
                
            }

            return await FornecedorGW.getById(id);

        } else {

            throw {
                code: 400,
                message: "Não existe Fornecedor com esse ID"
            }
        }
    }

    async GetRelatorioFornecedorByID(id, espaco_temporal) {

        let fornecedor = await FornecedorGW.getById(id)

        if (fornecedor != false) {

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
            let vendas = await VendaGW.getByFornecedorBetweenDates(id, data_inicio, data_fim)
            let produtos = await ProdutoGW.getByFornecedor(id)

            let relatorio = {
                "vendas/dia": [],
                "consumo_armazenamento/produto": [],
                "duracao_armazenamento/produto": [],
                "classificacao_armazenamento/produto": [],
                "vendas/cliente": []
            }

            if (vendas == false){
                vendas = []
            }

            for (let venda of vendas) {
                let data_venda = venda.data.toLocaleString('pt-PT', { timeZone: 'UTC' })
                data_venda = data_venda.split(",")
                data_venda = data_venda[0]
                let indexData = relatorio["vendas/dia"].findIndex(element => element.dia == data_venda)
                if (indexData == -1) {
                    let vendadia = {
                        dia: data_venda,
                        num_vendas: 1
                    }
                    relatorio["vendas/dia"].push(vendadia)
                } else {
                    relatorio["vendas/dia"][indexData].num_vendas ++
                }

                let indexCliente = relatorio["vendas/cliente"].findIndex(element => element.cliente._id == String(venda.comprador))
                if (indexCliente == -1) {
                    let comp = await ConsumidorGW.getById(venda.comprador)
                    let vendacliente = {
                        cliente: {
                            _id: String(venda.comprador),
                            nome: comp.nome
                        },
                        num_vendas: 1
                    }
                    relatorio["vendas/cliente"].push(vendacliente)
                } else {
                    relatorio["vendas/cliente"][indexCliente].num_vendas ++
                }
            }

            if (!produtos) {
                produtos = []
            }
            for (let produto of produtos) {

                let cadeia_produto = await CadeiaHandler.GetCadeiaByProdutoId(produto._id)

                let classificacao = Math.round(cadeia_produto.armazenamento.classificacao * 100) / 100
                if (!classificacao) {
                    classificacao = 0
                }
                let armazenamento_produto = {
                    produto: {
                        _id: String(produto._id),
                        nome: produto.nome
                    },
                    classificacao_armazenamento: classificacao
                }
                relatorio["classificacao_armazenamento/produto"].push(armazenamento_produto)

                let consumo = Math.round(cadeia_produto.armazenamento.consumo * 100) / 100
                if (!consumo) {
                    consumo = 0
                }
                let consumo_armazenamento_produto = {
                    produto: {
                        _id: String(produto._id),
                        nome: produto.nome
                    },
                    consumo_armazenamento: consumo
                }
                relatorio["consumo_armazenamento/produto"].push(consumo_armazenamento_produto)

                let duracao_armazenamento = Math.round(cadeia_produto.armazenamento.duracao * 100) / 100
                if (!duracao_armazenamento) {
                    duracao_armazenamento = 0
                }
                let duracao_armazenamento_produto = {
                    produto: {
                        _id: String(produto._id),
                        nome: produto.nome
                    },
                    duracao_armazenamento: duracao_armazenamento
                }
                relatorio["duracao_armazenamento/produto"].push(duracao_armazenamento_produto)
                
            }

            return relatorio

        } else {

            throw {
                code: 400,
                message: "Não existe Fornecedor com esse ID"
            }
        }
    }

    async GetVendasFornecedor(id_fornecedor) {

        let fornecedor = await FornecedorGW.getById(id_fornecedor)

        if (fornecedor != false) {

            let vendas = await VendaGW.getByFornecedor(id_fornecedor)

            let vendas_finais = []
            for (let venda of vendas) {
                let venda_final = JSON.parse(JSON.stringify(venda));

                let comprador = await ConsumidorGW.getHistoricoById(venda.comprador)
                venda_final.comprador = {
                    "_id": comprador._id,
                    "nome": comprador.nome 
                }

                let fornecedor = await FornecedorGW.getHistoricoById(venda.fornecedor)
                venda_final.fornecedor = {
                    "_id": fornecedor._id,
                    "nome": fornecedor.nome 
                }

                venda_final.data = venda.data.toLocaleString('pt-PT', { timeZone: 'UTC' });

                vendas_finais.push(venda_final) 
            }

            return vendas_finais

        } else {

            throw {
                code: 400,
                message: "Não existe Fornecedor com esse ID"
            }
        }

    }

    async GetVendasFornecedorJSON(id_fornecedor) {

        let vendas = await this.GetVendasFornecedor(id_fornecedor)

        let vendas_json = []
        for (let venda of vendas) {
            let venda_json = JSON.parse(JSON.stringify(venda))

            venda_json.comprador = venda.comprador.nome
            venda_json.fornecedor = venda.fornecedor.nome

            let produto_especifico = await ProdutoEspecificoGW.getHistoricoById(venda.produto)

            if (produto_especifico != false) {
                let produto = await ProdutoGW.getHistoricoById(produto_especifico.produto)

                venda_json.produto = produto.nome

                let caracteristicas = {}
                for (let especificidade of produto_especifico.especificidade) {
                    let atributo = await AtributoGW.getById(especificidade.atributo)
                    caracteristicas[atributo.nome] = especificidade.valor
                }
                venda_json.caracteristicas_produto = caracteristicas
            } else {
                venda_json.produto = "Not available"
                venda_json.caracteristicas_produto = {}
            }
            
            delete venda_json.__v

            vendas_json.push(venda_json)
        }

        return vendas_json

    }

    async GetVendasFornecedorCSV(id_fornecedor) {

        let vendas = await this.GetVendasFornecedorJSON(id_fornecedor)
        let csv_vendas = utils.convertToCSV(vendas)

        return csv_vendas

    }

    async GetVendaFornecedor(id_fornecedor, id_venda) {

        let fornecedor = await FornecedorGW.getById(id_fornecedor)

        if (fornecedor != false) {

            let venda = await VendaGW.getById(id_venda)

            if (venda != false) {

                if (venda.fornecedor == id_fornecedor) {

                    let venda_final = JSON.parse(JSON.stringify(venda));

                    let comprador = await ConsumidorGW.getHistoricoById(venda.comprador)
                    venda_final.comprador = {
                        "_id": comprador._id,
                        "nome": comprador.nome 
                    }

                    let fornecedor = await FornecedorGW.getHistoricoById(venda.fornecedor)
                    venda_final.fornecedor = {
                        "_id": fornecedor._id,
                        "nome": fornecedor.nome 
                    }

                    venda_final.data = venda.data.toLocaleString('pt-PT', { timeZone: 'UTC' });

                    return venda_final

                } else {

                    throw {
                        code: 400,
                        message: "Não tem permissão para aceder a essa Venda"
                    }
                }

            } else {

                throw {
                    code: 400,
                    message: "Não existe Venda com esse ID"
                }
            }
        } else {

            throw {
                code: 400,
                message: "Não existe Fornecedor com esse ID"
            }
        }

    }

    async GetArmazemByID(id) {

        let armazem = await ArmazemGW.getById(id)

        if (armazem != false) {

            return armazem

        } else {

            throw {
                code: 400,
                message: "Não existe Armazem com esse ID"
            }
        }
    }

    async GetArmazemByFornecedor(id) {

        let armazem = await ArmazemGW.getByFornecedor(id)

        if (armazem != false) {

            return armazem

        } else {

            throw {
                code: 400,
                message: "Não existe Armazem com esse ID"
            }
        }
    }

    async InsertArmazem(fornecedor, local, tamanho, gasto_diario) {

        let fornecedorExists = await FornecedorGW.existsId(fornecedor)
        let local_armazem = await LocalGW.getById(local)

        if (fornecedorExists != false){

            if (local_armazem != false){

                if (local_armazem.tipo == 'armazem' && local_armazem.utilizador == fornecedor) {

                    return await ArmazemGW.create(fornecedor, local, tamanho, gasto_diario)

                } else {
                    throw {
                        code: 400,
                        message: "O local fornecido não é válido"
                    }
                }

            } else {

                throw {
                    code: 400,
                    message: "Não existe Local com esse ID"
                }
            }

        } else {

            throw {
                code: 400,
                message: "Não existe Fornecedor com esse ID"
            }
        }
    }

    async UpdateGastoDiarioArmazem(armazem_id, gasto_diario) {

        let armazem = await ArmazemGW.getById(armazem_id);

        if (armazem != false) {
            await ArmazemGW.updateGastoDiario(armazem_id, gasto_diario)

            return await ArmazemGW.getById(armazem_id)
        } else {
            throw {
                code: 400,
                message: "Não existe Armazem com esse ID"
            }
        }
    }

    async GetFornecedorArmazem(id) {

        let armazem = await ArmazemGW.getById(id)

        if (armazem != false) {

            return armazem.fornecedor

        } else {

            throw {
                code: 400,
                message: "Não existe Armazem com esse ID"
            }
        }
    }

    async DeleteArmazem(id) {

        let armazem = await ArmazemGW.getById(id)
        if (armazem.inventario.length == 0) {
            return await ArmazemGW.deleteById(id)
        } else {
            throw {
                code: 400,
                message: "Não pode eliminar armazéns com produtos em inventário"
            }
        }
        
    }

    async ProdutoStock(produto_especifico_id) {

        let stock = await ArmazemGW.getStock(produto_especifico_id)

        let total_stock = 0
        for (let armazem of stock) {
            let produto_inventario = armazem.inventario.find(element => String(element.produto) == String(produto_especifico_id))
            total_stock += produto_inventario.quantidade
        }

        return total_stock

    }

    async ProdutoTeveStock(produto_especifico_id) {

        let had = await ItemGW.existsProdutoEspecifico(produto_especifico_id)
        return had

    }

    async InsertProdutosInventario(armazem_id, produtos, meio_transporte, desperdicio) {

        let desperdicio_transporte = parseInt(desperdicio)
        if (desperdicio_transporte < 0) {
            throw {
                code: 400,
                message: "Desperdicio inválido."
            }
        } 

        if (meio_transporte.marca && meio_transporte.modelo && meio_transporte.tipo) {
            let marca = meio_transporte.marca
            let modelo = meio_transporte.modelo
            let tipo = meio_transporte.tipo

            if (vehicle_emissions_json[marca][modelo][tipo]) {
                let consumo = + parseFloat(vehicle_emissions_json[marca][modelo][tipo].consumo).toFixed(2)
                let emissao = + parseFloat(vehicle_emissions_json[marca][modelo][tipo].emissao).toFixed(2)

                let armazem = await ArmazemGW.getById(armazem_id)
                let local_armazem = await LocalGW.getById(armazem.localizacao)
                let coordinates_armazem = {lon: local_armazem.lon, lat: local_armazem.lat}

                let total_itens = 0
                let locais_producao = []
                locais_producao.push(coordinates_armazem)
                let produto_especifico_items = {}
                let produtos_inventario = []
                for (let produto_api of produtos) {
                    if (produto_api.produto_especifico && produto_api.quantidade) {
                        let prod_esp = await ProdutoEspecificoGW.getById(produto_api.produto_especifico)
                        let producao = await ProducaoGW.getByProduto(prod_esp.produto)

                        if (producao != false) {
                            if (!prod_esp) {
                                throw {
                                    code: 400,
                                    message: "O produto especifico que está a tentar inserir em inventário não existe"
                                }
                            }
                            let local_producao = await LocalGW.getById(producao.local)
                            let coordinates_producao = {lon: local_producao.lon, lat: local_producao.lat}

                            produto_especifico_items[produto_api.produto_especifico] = []

                            let produto_inventario = ({
                                produto: produto_api.produto_especifico,
                                quantidade: produto_api.quantidade,
                                itens: []
                            })

                            if (!locais_producao.includes(coordinates_producao)) {
                                locais_producao.push(coordinates_producao)
                            }

                            for (let i = 0; i < produto_api.quantidade; i++) {
                                let item
                                if (produto_api.prazo_validade) {
                                    let prazo_list = produto_api.prazo_validade.split("/");
                                    let prazo_dia = parseInt(prazo_list[0])
                                    let prazo_mes = parseInt(prazo_list[1]) - 1
                                    let prazo_ano = parseInt(prazo_list[2])
                                    let prazo = new Date(prazo_ano, prazo_mes, prazo_dia, 1, 0, 0, 0)
                                    let now = new Date()
                                    let week = new Date()
                                    week.setDate(now.getDate() + 7)
                                    if (prazo > week) {
                                        item = await ItemGW.createWithValidade(prod_esp, prazo)
                                    } else {
                                        throw {
                                            code: 400,
                                            message: "O produto deve ter uma validade de pelo menos 7 dias."
                                        }
                                    }
                                    
                                } else {
                                    item = await ItemGW.create(prod_esp)
                                }
                                produto_especifico_items[produto_api.produto_especifico].push(item._id)
                                produto_inventario.itens.push(item._id)
                            }

                            produtos_inventario.push(produto_inventario)

                            total_itens += produto_api.quantidade
                        } else {
                            throw {
                                code: 400,
                                message: "Um produto tem de ter registada uma produção para ser registado em armazém"
                            }
                        }
                    } else {
                        throw {
                            code: 400,
                            message: "Pedido inválido"
                        }
                    }
                }

                let matriz_locais = await GeoHandler.GetDrivingMatrix(locais_producao)

                // console.log(matriz_locais)
                let distance_travelled = await GeoHandler.ShortestDistanceArmazens(matriz_locais.data.distances)

                let km_travelled = distance_travelled / 1000 
                let consumo_total = consumo / 100 * km_travelled
                let emissao_total = emissao * km_travelled

                let consumo_item = consumo_total / total_itens
                let emissao_item = emissao_total / total_itens

                // tier 1: 50 km, 11 l/100km, 300 gco2/km, >20 itens – TOTAL 50*(11+300) / 20 = 778
                // tier 2: 100 km, 19 l/100km, 504 gco2/km, 20 itens – TOTAL 100*(19+504) / 20 = 2615
                // tier 3: 200 km, 26 l/100km, 708 gco2/km, 10 itens – TOTAL 200*(26+708) / 10 = 14680
                // tier 4: 500 km, 34 l/100km, 912 gco2/km, 5 itens – TOTAL 500*(34+912) / 5 = 94600
                // tier 5: >500 km, >34 l/100km, >912 gco2/km, <5 itens
                let rating = (km_travelled * (consumo + emissao)) / total_itens 

                let classificacao
                if (rating < 778) {
                    classificacao = 5
                } else if (rating < 2615) {
                    classificacao = 4
                } else if (rating < 14680) {
                    classificacao = 3
                } else if (rating < 94600) {
                    classificacao = 2
                } else if (rating >= 94600) {
                    classificacao = 1
                }

                
                let data_inicio = new Date();
                let items_ids = []
                let produtos_especificos_ids = []
                for (let produto_especifico in produto_especifico_items) {
                    produtos_especificos_ids.push(produto_especifico)
                    let produto_especifico_model = await ProdutoEspecificoGW.getById(produto_especifico)
                    let produto_model = await ProdutoGW.getById(produto_especifico_model.produto)

                    for (let item_t of produto_especifico_items[produto_especifico]) {
                        items_ids.push(item_t._id)
                        await TransporteArmazemGW.create(item_t._id, km_travelled, consumo_item, emissao_item, classificacao, desperdicio_transporte)
                        await ArmazenamentoGW.create(armazem_id, produto_especifico_model.produto, item_t._id, data_inicio)
                    }

                    let n_itens_adicionar = produto_especifico_items[produto_especifico].length

                    let atual_distancia = produto_model.transporte_armazem.distancia
                    let atual_consumo = produto_model.transporte_armazem.consumo
                    let atual_emissao = produto_model.transporte_armazem.emissao
                    let atual_classificacao = produto_model.transporte_armazem.classificacao
                    let atual_n_itens = produto_model.transporte_armazem.n_itens
                    let atual_desperdicio = produto_model.transporte_armazem.desperdicio

                    if (atual_distancia == undefined) {
                        atual_distancia = 0
                    }
                    if (atual_consumo == undefined) {
                        atual_consumo = 0
                    }
                    if (atual_emissao == undefined) {
                        atual_emissao = 0
                    }
                    if (atual_classificacao == undefined) {
                        atual_classificacao = 0
                    }
                    if (atual_n_itens == undefined) {
                        atual_n_itens = 0
                    }
                    if (atual_desperdicio == undefined) {
                        atual_desperdicio = 0
                    }

                    let novo_n_itens = atual_n_itens + n_itens_adicionar
                    let nova_distancia = ((atual_distancia * atual_n_itens) + (km_travelled * n_itens_adicionar)) / novo_n_itens
                    let novo_consumo = ((atual_consumo * atual_n_itens) + (consumo_item * n_itens_adicionar)) / novo_n_itens
                    let nova_emissao = ((atual_emissao * atual_n_itens) + (emissao_item * n_itens_adicionar)) / novo_n_itens
                    let nova_classificacao = ((atual_classificacao * atual_n_itens) + (classificacao * n_itens_adicionar)) / novo_n_itens
                    let novo_desperdicio = ((atual_desperdicio * atual_n_itens) + (desperdicio_transporte * n_itens_adicionar)) / novo_n_itens

                    let transporte_armazem_produto = {
                        "distancia": nova_distancia,
                        "consumo": novo_consumo,
                        "emissao": nova_emissao,
                        "classificacao": nova_classificacao,
                        "n_itens": novo_n_itens,
                        "desperdicio": novo_desperdicio
                    }

                    await ProdutoGW.updateTransporteArmazem(produto_especifico_model.produto, transporte_armazem_produto)

                    let armazenamento_produto_bd = {
                        "duracao": 1,
                        "consumo": 0,
                        "classificacao": 5
                    }
        
                    await ProdutoGW.updateArmazenamento(produto_especifico_model.produto, armazenamento_produto_bd)
                }

                for (let produto_inv of produtos_inventario) {
                    let already_exists = false
                    for (let produto_inv_ant of armazem.inventario) {
                        if (String(produto_inv_ant.produto) == String(produto_inv.produto)) {
                            produto_inv_ant.quantidade += produto_inv.quantidade
                            produto_inv_ant.itens = produto_inv_ant.itens.concat(produto_inv.itens)
                            already_exists = true
                        }
                    }

                    if (!already_exists) {
                        armazem.inventario.push(produto_inv)
                    }
                }
                
                await ArmazemGW.updateInventario(armazem_id, armazem.inventario)
                
                let armazem_final = await ArmazemGW.getById(armazem_id)
                return armazem_final

            } else {
                throw {
                    code: 400,
                    message: "Meio de Transporte inválido"
                }
            }
        } else {
            throw {
                code: 400,
                message: "Pedido inválido"
            }
        }

    }

    async CancelEncomendasNaoConfirmadas() {

        let encomendas = await EncomendaGW.getAllNaoConfirmadas()

        let now = new Date();
        for (let encomenda of encomendas) {
            var Difference_In_Time = now.getTime() - encomenda.data_encomenda.getTime();
            var Difference_In_Hours = Difference_In_Time / (60* 60 * 1000);

            if (Difference_In_Hours > 1) {
                await EncomendaGW.updateEstado(encomenda._id, "Cancelada")
            }
        }

        return "Atualização de encomendas canceladas completa"

    }

    async InsertFuncionario(fornecedor, armazem_id, nome, idade) {

        let fornecedorExists = await FornecedorGW.existsId(fornecedor)
        let armazem = await ArmazemGW.getById(armazem_id)

        if (fornecedorExists != false){
            if (armazem != false) {
                if (armazem.fornecedor == fornecedor) {
                    if (utils.isInt(idade)) {
                        return await FuncionarioGW.create(fornecedor, armazem_id, nome, idade)
                    } else {
                        throw {
                            code: 400,
                            message: "Pedido inválido"
                        }
                    }
                } throw {
                    code: 400,
                    message: "Pedido inválido"
                }
            } throw {
                code: 400,
                message: "Não existe Armazém com esse ID"
            }
        } else {
            throw {
                code: 400,
                message: "Não existe Fornecedor com esse ID"
            }
        }
    }

    async GetFuncionariosByArmazem(armazem_id) {
        
        let funcionario = await FuncionarioGW.getByArmazem(armazem_id)

        if (funcionario != false) {

            return funcionario

        } else {

            throw {
                code: 400,
                message: "Não existem Funcionarios associados a este armazem"
            }
        }
    }

    async GetFuncionarioByFornecedorENome(fornecedor_id, nome) {
        
        let funcionario = await FuncionarioGW.getByFornecedorENome(fornecedor_id, nome)

        if (funcionario != false) {

            return funcionario

        } else {

            throw {
                code: 400,
                message: "Não existe Funcionario com este nome"
            }
        }
    }

    async GetFuncionariosByFornecedor(fornecedor_id) {
        
        let funcionario = await FuncionarioGW.getByFornecedor(fornecedor_id)

        if (funcionario != false) {

            return funcionario

        } else {

            throw {
                code: 400,
                message: "Não existem Funcionarios associados a este fornecedor"
            }
        }
    }
    
    async GetFuncionarioByID(id) {
        
        let funcionario = await FuncionarioGW.getById(id)

        if (funcionario != false) {

            return funcionario

        } else {

            throw {
                code: 400,
                message: "Não existe Funcionario com este id"
            }
        }
    }

    async DeleteFuncionario(id) {

        return FuncionarioGW.deleteById(id)
    }
}

module.exports = {
    handler_fornecedor: new FornecedorHandler()
}