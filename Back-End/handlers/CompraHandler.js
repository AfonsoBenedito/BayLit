const CarrinhoGW = require("../gateway/CarrinhoGat")
const ConsumidorGW = require("../gateway/ConsumidorGat")
const FornecedorGW = require("../gateway/FornecedorGat")
const LocalGW = require("../gateway/LocalGat")
const ArmazemGW = require("../gateway/ArmazemGat")
const ArmazenamentoGW = require("../gateway/ArmazenamentoGat")
const UtilizadorGW = require("../gateway/UtilizadorGat")
const TransporteGW = require("../gateway/TransporteGat")
const TransportadorGW = require("../gateway/TransportadorGat")
const ProdutoEspecificoGW = require("../gateway/ProdutoEspecificoGat")
const ProdutoGW = require("../gateway/ProdutoGat")
const ProducaoGW = require("../gateway/ProducaoGat")
const EncomendaGW = require("../gateway/EncomendaGat")
const PagoGW = require("../gateway/PagoGat")
const VendaGW = require("../gateway/VendaGat")
const NotificacaoGW = require("../gateway/NotificacaoGat")
const SubCategoriaGW = require("../gateway/SubCategoriaGat")
const GeoHandler = require("./GeoHandler").geo_handler
const CadeiaHandler = require("./CadeiaHandler").handler_cadeia

const utils = require("../utils");
//const Armazem = require("../models/Armazem")
//const { notify } = require("../api/routes/compra")



class CompraHandler {

    async GetCarrinhoByUtilizador(id_utilizador) {

        let utilizador = await UtilizadorGW.getById(id_utilizador)

        if (utilizador != false) {

            let carrinho = await CarrinhoGW.getByUtilizador(id_utilizador)

            if (carrinho != false) {

                return carrinho

            } else {

                throw {
                    code: 400,
                    message: "Não existe Carrinho desse Utilizador"
                }
            }

        } else {

            throw {
                code: 400,
                message: "Não existe Utilizador com esse ID"
            }
        }
    }

    async GetCadeiaCarrinhoByUtilizador(id_utilizador) {

        let utilizador = await UtilizadorGW.getById(id_utilizador)

        if (utilizador != false) {

            let carrinho = await CarrinhoGW.getByUtilizador(id_utilizador)

            if (carrinho != false) {

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
                    classificacao: 0
                }

                let total_itens = 0
                for (let produto_carrinho of carrinho.produtos) {

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

                cadeia_carrinho.classificacao = Math.round((cadeia_carrinho.producao.classificacao +
                                                 cadeia_carrinho.transporte_armazem.classificacao +
                                                 cadeia_carrinho.armazenamento.classificacao) / 3)

                return cadeia_carrinho

            } else {

                throw {
                    code: 400,
                    message: "Não existe Carrinho desse Utilizador"
                }
            }

        } else {

            throw {
                code: 400,
                message: "Não existe Utilizador com esse ID"
            }
        }
    }

    async GetSumarioCadeiaCarrinhoByUtilizador(id_utilizador) {
        
        let utilizador = await UtilizadorGW.getById(id_utilizador)

        if (utilizador != false) {

            let carrinho = await CarrinhoGW.getByUtilizador(id_utilizador)

            if (carrinho != false) {

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
                    classificacao: 0
                }

                let total_itens = 0
                for (let produto_carrinho of carrinho.produtos) {

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

                cadeia_carrinho.classificacao = Math.round((cadeia_carrinho.producao.classificacao +
                    cadeia_carrinho.transporte_armazem.classificacao +
                    cadeia_carrinho.armazenamento.classificacao) / 3)
                    
                return cadeia_carrinho

            } else {

                throw {
                    code: 400,
                    message: "Não existe Carrinho desse Utilizador"
                }
            }

        } else {

            throw {
                code: 400,
                message: "Não existe Utilizador com esse ID"
            }
        }
    }

    async EsvaziaCarrinho(id_utilizador) {

        let utilizador = await UtilizadorGW.getById(id_utilizador)

        if (utilizador != false) {
            let carrinho = await CarrinhoGW.getByUtilizador(id_utilizador)

            if (carrinho != false) {

                await CarrinhoGW.cleanProdutos(carrinho._id)
                return await CarrinhoGW.updateValor(carrinho._id)

            } else {
    
                throw {
                    code: 400,
                    message: "Não existe Carrinho desse Utilizador"
                }
            }
        } else {

            throw {
                code: 400,
                message: "Não existe Utilizador com esse ID"
            }
        }
        
    }

    async RemoveProdutoCarrinho(id_utilizador, produto_especifico) {

        let utilizador = await UtilizadorGW.getById(id_utilizador)

        if (utilizador != false) {
            let carrinho = await CarrinhoGW.getByUtilizador(id_utilizador)

            if (carrinho != false) {

                let produto = await ProdutoEspecificoGW.getById(produto_especifico)
                if (produto != false) {

                    let produto_carrinho_index = carrinho.produtos.findIndex(p => String(p.produto) == String(produto._id));
                    if (produto_carrinho_index != -1) {
                        carrinho.produtos.splice(produto_carrinho_index, 1); 
                        carrinho = await CarrinhoGW.updateProdutos(carrinho._id, carrinho.produtos) 
                        return await CarrinhoGW.updateValor(carrinho._id)
                    }  else {
                        throw {
                            code: 400,
                            message: "O produto não está no carrinho"
                        }
                    }
                } else {
                    throw {
                        code: 400,
                        message: "O produto não existe"
                    }
                }
            } else {
                throw {
                    code: 400,
                    message: "Não existe Carrinho desse Utilizador"
                }
            }
        } else {

            throw {
                code: 400,
                message: "Não existe Utilizador com esse ID"
            }
        }
        
    }

    async InsertProdutoCarrinho(id_utilizador, produto_especifico, quantidade) {

        let utilizador = await UtilizadorGW.getById(id_utilizador)

        if (utilizador != false) {

            let carrinho = await CarrinhoGW.getByUtilizador(id_utilizador)
            if (carrinho != false) {

                let produto = await ProdutoEspecificoGW.getById(produto_especifico)
                if (produto != false) {

                    if (utils.isInt(quantidade) && quantidade > 0) {

                        let produto_carrinho = carrinho.produtos.find(p => String(p.produto) == String(produto._id));
                        if (produto_carrinho) {
                            let nova_quantidade = parseInt(produto_carrinho.quantidade) + parseInt(quantidade)
                            carrinho = await CarrinhoGW.updateProduto(id_utilizador, produto_especifico, nova_quantidade) 
                        } else {
                            carrinho = await CarrinhoGW.addProduto(id_utilizador, produto_especifico, quantidade) 
                        }
                        
                        return await CarrinhoGW.updateValor(carrinho._id)

                    } else {

                        throw {
                            code: 400,
                            message: "Pedido inválido"
                        }
                    }


                } else {

                    throw {
                        code: 400,
                        message: "Não existe Produto Especifico com esse ID"
                    }
                }
    
            } else {
    
                throw {
                    code: 400,
                    message: "Não existe Carrinho desse Utilizador"
                }
            }
        } else {

            throw {
                code: 400,
                message: "Não existe Utilizador com esse ID"
            }
        }
    }

    async AlterarQuantidadeProdutoCarrinho(id_utilizador, produto_especifico, quantidade) {

        let utilizador = await UtilizadorGW.getById(id_utilizador)

        if (utilizador != false) {
            let carrinho = await CarrinhoGW.getByUtilizador(id_utilizador)

            if (carrinho != false) {

                let produto = await ProdutoEspecificoGW.getById(produto_especifico)

                if (produto != false) {

                    if (utils.isInt(quantidade) && quantidade > 0) {

                        for (let i = 0; i < carrinho.produtos.length; i++) {
                            if (carrinho.produtos[i].produto == produto_especifico) {
                                let carrinho = await CarrinhoGW.updateProduto(id_utilizador, produto_especifico, quantidade) 
                                return await CarrinhoGW.updateValor(carrinho._id)
                            }
                        }

                        throw {
                            code: 400,
                            message: "Esse Produto não existe no Carrinho"
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
                        message: "Não existe Produto Especifico com esse ID"
                    }
                }
    
            } else {
    
                throw {
                    code: 400,
                    message: "Não existe Carrinho desse Utilizador"
                }
            }
        } else {

            throw {
                code: 400,
                message: "Não existe Utilizador com esse ID"
            }
        }
    }

    async GetTransportesPossiveis(id_consumidor, local_entrega_id) {

        let carrinho = await CarrinhoGW.getByUtilizador(id_consumidor)
        let local_entrega = await LocalGW.getById(local_entrega_id)

        if (carrinho != false && carrinho.produtos.length > 0) {
            if (local_entrega != false) {
                if (local_entrega.utilizador == id_consumidor && local_entrega.tipo == "local_entrega") {
                    let produtos = carrinho.produtos
                    
                    let stops_fornecedores = []

                    for (let produto of produtos) {
                        let armazens = await ArmazemGW.getWithProdutoEmInventario(produto.produto)

                        let closest
                        if (armazens.length == 0) {
                            let produto_especifico_em_falta = await ProdutoEspecificoGW.getById(produto.produto)
                            let produto_em_falta = await ProdutoGW.getById(produto_especifico_em_falta.produto)
                            throw {
                                code: 400,
                                message: "O produto " + produto_em_falta.nome + " não tem stock disponivel"
                            }
                        } else if (armazens.length == 1) {
                            let produto_armazenado = armazens[0].inventario.find(p => String(p.produto) == String(produto.produto));
                            if (produto_armazenado.quantidade >= produto.quantidade) {
                                closest = armazens[0]
                            } else {
                                let produto_especifico_em_falta = await ProdutoEspecificoGW.getById(produto.produto)
                                let produto_em_falta = await ProdutoGW.getById(produto_especifico_em_falta.produto)
                                throw {
                                    code: 400,
                                    message: "O produto " + produto_em_falta.nome + " não tem stock disponivel"
                                }
                            }
                        } else {
                            let closest_picked = false
                            let ind = 0

                            closest = await GeoHandler.GetClosestItem(local_entrega, armazens)
                            
                            while (closest_picked != true) {
                                if (closest.length == ind) {
                                    let produto_especifico_em_falta = await ProdutoEspecificoGW.getById(produto.produto)
                                    let produto_em_falta = await ProdutoGW.getById(produto_especifico_em_falta.produto)
                                    throw {
                                        code: 400,
                                        message: "O produto " + produto_em_falta.nome + " não tem stock disponivel"
                                    }
                                }
                                let produto_armazenado = closest[ind].inventario.find(p => String(p.produto) == String(produto.produto));
                                if (produto_armazenado.quantidade >= produto.quantidade) {
                                    closest = closest[ind]
                                    closest_picked = true
                                } 
                                ind++
                            }
                        }
        
                        // [produto, armazem]
                        stops_fornecedores.push([produto, closest])
                    }
        
                    try {
                        let possible = await GeoHandler.GeneratePossibleTransportations(stops_fornecedores, local_entrega)

                        return possible
                    } catch (err) {
                        if (!err.message) {
                            throw {
                                code: 400,
                                message: "Algo correu mal."
                            }
                        }
                    }
                    
                } else {
                    throw {
                        code: 400,
                        message: "O local de entrega não é válido"
                    }
                }
            } else {
                throw {
                    code: 400,
                    message: "O local de entrega não é válido"
                }
            }
        } else {
            throw {
                code: 400,
                message: "O utilizador não é válido"
            }
        }
     
    }

    async RegisterCompra(id_consumidor, id_transporte, id_local_entrega) {

        let carrinho = await CarrinhoGW.getByUtilizador(id_consumidor)
        let transporte = await TransporteGW.getById(id_transporte)
        let local_entrega = await LocalGW.getById(id_local_entrega)

        if (carrinho != false) {
            if (carrinho.produtos.length > 0) {
                if (local_entrega != false) {
                    if (transporte != false && transporte.estado == "Disponivel") {
                        if (local_entrega.utilizador == id_consumidor && local_entrega.tipo == "local_entrega") {
                            
                            let valor_compra = carrinho.valor
                            
                            let transportador = await TransportadorGW.getById(transporte.transportador)
                            let portes = transportador.portes_encomenda
                            let preco_total = portes + valor_compra.total
    
                            let now = new Date()
                            let data_encomenda = now.setHours(now.getHours() + 1);
                            let data_entrega = transporte.data_inicio
                            data_entrega.setDate(data_entrega.getDate()+1);
                            let prazo_cancelamento = transporte.data_inicio;
                            prazo_cancelamento.setDate(prazo_cancelamento.getDate()-1);

                            let encomenda = {
                                comprador: id_consumidor,
                                transportador: transporte.transportador,
                                valor: {
                                    total: preco_total,
                                    compra: valor_compra.total,
                                    portes: portes,
                                    desconto: valor_compra.desconto
                                },
                                transporte: transporte._id,
                                prazo_cancelamento: prazo_cancelamento,
                                data_encomenda: data_encomenda,
                                data_entrega: data_entrega,
                                local_entrega: local_entrega._id,
                                estado: "Por confirmar", // Por confirmar, Confirmada, Cancelada, Em transporte, Entregue
                                produtos: carrinho.produtos
                            }
    
                            let encomenda_nova = await EncomendaGW.create(encomenda.comprador, encomenda.transportador, encomenda.valor, encomenda.transporte,
                                 encomenda.prazo_cancelamento, encomenda.data_encomenda, encomenda.data_entrega, encomenda.local_entrega, encomenda.estado, encomenda.produtos)
    
                            return encomenda_nova
    
                        } else {
                            throw {
                                code: 400,
                                message: "O local de entrega não é válido"
                            }
                        }
                    } else {
                        throw {
                            code: 400,
                            message: "O transporte não é válido"
                        }
                    }
                } else {
                    throw {
                        code: 400,
                        message: "O local de entrega não é válido"
                    }
                }
            } else {
                throw {
                    code: 400,
                    message: "Não tem produtos no carrinho para efectuar uma compra"
                }
            } 
        } else {
            throw {
                code: 400,
                message: "O utilizador não é válido"
            }
        }
     
    }

    async ConfirmarCompra(id_consumidor, id_encomenda) {
        
        let consumidor = await ConsumidorGW.getById(id_consumidor)
        let encomenda = await EncomendaGW.getById(id_encomenda)

        let encomenda_paga = await PagoGW.getByEncomenda(encomenda._id)
        if (!encomenda_paga) {
            throw {
                code: 400,
                message: "Para confirmar uma encomenda precisa de primeiro efectuar o seu pagamento."
            }
        }
        if (encomenda != false && consumidor != false) {
            if (String(encomenda.comprador) == String(consumidor._id)) {
                if (encomenda.estado == "Por confirmar") {
                    let stops_fornecedores = []
        
                    let produtos_encomenda = []
                    for (let produto of encomenda.produtos) {

                        let armazens = await ArmazemGW.getWithProdutoEmInventario(produto.produto)

                        let closest
                        if (armazens.length == 0) {
                            let produto_especifico_em_falta = await ProdutoEspecificoGW.getById(produto.produto)
                            let produto_em_falta = await ProdutoGW.getById(produto_especifico_em_falta.produto)
                            throw {
                                code: 400,
                                message: "O produto " + produto_em_falta.nome + " não tem stock disponivel"
                            }
                        } else if (armazens.length == 1) {
                            let produto_armazenado = armazens[0].inventario.find(p => String(p.produto) == String(produto.produto));
                            if (produto_armazenado.quantidade >= produto.quantidade) {
                                closest = armazens[0]
                            } else {
                                let produto_especifico_em_falta = await ProdutoEspecificoGW.getById(produto.produto)
                                let produto_em_falta = await ProdutoGW.getById(produto_especifico_em_falta.produto)
                                throw {
                                    code: 400,
                                    message: "O produto " + produto_em_falta.nome + " não tem stock disponivel"
                                }
                            }
                        } else {
                            let closest_picked = false
                            let ind = 0

                            closest = await GeoHandler.GetClosestItem(local_entrega, armazens)
                            
                            while (closest_picked != true) {
                                if (closest.length == ind) {
                                    let produto_especifico_em_falta = await ProdutoEspecificoGW.getById(produto.produto)
                                    let produto_em_falta = await ProdutoGW.getById(produto_especifico_em_falta.produto)
                                    throw {
                                        code: 400,
                                        message: "O produto " + produto_em_falta.nome + " não tem stock disponivel"
                                    }
                                }
                                let produto_armazenado = closest[ind].inventario.find(p => String(p.produto) == String(produto.produto));
                                if (produto_armazenado.quantidade >= produto.quantidade) {
                                    closest = closest[ind]
                                    closest_picked = true
                                } 
                                ind++
                            }
                        }
        
                        let items = []

                        let produto_armazenado = closest.inventario.find(p => String(p.produto) == String(produto.produto));
                        let produto_armazenado_index = closest.inventario.findIndex(p => String(p.produto) == String(produto.produto));
                        if (produto_armazenado.quantidade >= produto.quantidade) {
                            for (let x = 0; x < produto.quantidade; x++) {
                                let item_removed = closest.inventario[produto_armazenado_index].itens.shift()
                                closest.inventario[produto_armazenado_index].quantidade --
                                await ArmazenamentoGW.terminateByItem(item_removed)
                                items.push(item_removed)
                            }
                            await ArmazemGW.updateInventario(closest._id, closest.inventario)
                        } else {
                            let produto_especifico_em_falta = await ProdutoEspecificoGW.getById(produto.produto)
                            let produto_em_falta = await ProdutoGW.getById(produto_especifico_em_falta.produto)
                            throw {
                                code: 400,
                                message: "O produto " + produto_em_falta.nome + " não tem stock disponivel"
                            }
                        }

                        let produto_encomenda = {
                            produto: produto.produto,
                            quantidade: items.length,
                            itens: items
                        }

                        produtos_encomenda.push(produto_encomenda)
                        
                        // [produto, armazem]
                        stops_fornecedores.push([produto.produto, items, closest])
                    }
                    
                    let local_entrega = await LocalGW.getById(encomenda.local_entrega)
                    let transporte = await TransporteGW.getById(encomenda.transporte)
                    
                    await EncomendaGW.updateProdutos(encomenda._id, produtos_encomenda)
                    await GeoHandler.AddLocaisToTransporte(transporte, stops_fornecedores, local_entrega)
                    
                    let encomenda_final = await EncomendaGW.updateEstado(encomenda._id, "Confirmada")

                    let fornecedores_vendas = []
                    let vendas = []
                    for (let produto_venda of produtos_encomenda) {
                        let produto_venda_bd = await ProdutoEspecificoGW.getById(produto_venda.produto)
                        let fornecedor_venda = String(produto_venda_bd.fornecedor)
                        let valor = produto_venda_bd.preco * produto_venda.quantidade

                        let ind = fornecedores_vendas.indexOf(fornecedor_venda)
                        if (ind == -1) {
                            let venda = {
                                fornecedor: produto_venda_bd.fornecedor,
                                comprador: consumidor._id,
                                produto: produto_venda.produto,
                                quantidade: produto_venda.quantidade,
                                itens: produto_venda.itens,
                                data: new Date(),
                                produtos: produto_venda,
                                valor: valor
                            }
                            vendas.push(venda)
                        } else {
                            vendas[ind].produtos.push(produto_venda)
                            
                            let soma_valor = vendas[ind].valor + valor
                            vendas[ind].valor = soma_valor
                        }
                    }

                    let carrinho = await CarrinhoGW.getByUtilizador(consumidor._id)
                    await CarrinhoGW.cleanProdutos(carrinho._id)
                    await CarrinhoGW.updateValor(carrinho._id)

                    for (let vendar of vendas) {
                        let venda = await VendaGW.create(vendar.fornecedor, vendar.comprador, vendar.produto, vendar.quantidade, vendar.itens, vendar.data, vendar.valor)
                        await this.NotifyFornecedorVenda(venda);
                    }

                    await this.NotifyConsumidorCompra(encomenda_final);
                    await this.NotifyTransportadorTransporte(encomenda_final);

                    return encomenda_final
                    
                } else {
                    throw {
                        code: 400,
                        message: "Pedido inválido"
                    }
                }
            } else {
                throw {
                    code: 403,
                    message: "Não tem autorização para efetuar este pedido"
                }
            }
        } else {
            throw {
                code: 400,
                message: "Pedido inválido"
            }
        }

    }

    async NotifyConsumidorCompra(encomenda) {

        let consumidor = await ConsumidorGW.getById(encomenda.comprador)
        let transportador = await TransportadorGW.getById(encomenda.transportador)
        let transporte = await TransporteGW.getById(encomenda.transporte) // Falta adicionar uma classificação ao transporte !!!!
        let transporte_consumo_item = Math.round((transporte.consumo / transporte.mercadoria.length) * 100) / 100
        let transporte_emissao_item = Math.round((transporte.emissao / transporte.mercadoria.length) * 100) / 100
        let mensagem = "A sua encomenda "+String(encomenda._id)+" foi confirmada!"
        await NotificacaoGW.create(encomenda.comprador, "consumidorCompra", mensagem, "https://www.baylit.store/Perfil")
        let local = await LocalGW.getById(encomenda.local_entrega)

        let nome_consumidor = consumidor.nome 
        let link = "https://www.baylit.store/Perfil"
        let id_encomenda = encomenda._id
        let data_encomenda = encomenda.data_encomenda.toLocaleDateString("pt-PT")
        let data_entrega = encomenda.data_entrega.toLocaleDateString("pt-PT")
        let prazo_cancelamento = encomenda.prazo_cancelamento.toLocaleDateString("pt-PT")
        let localidade = local.localidade
        let pais = local.pais
        let morada = local.morada
        let nome_transportador = transportador.nome
        let distancia_transporte = transporte.distancia
        let consumo_item_transporte = transporte_consumo_item
        let emissao_item_transporte = transporte_emissao_item
        let classificacao_transporte = transporte.classificacao
        
        // produto = {fotografia, nome, nome_subcategoria, atributos, rating, quantidade, preco_total}
        let produtos = []
        for (let produto_encomenda of encomenda.produtos) {
            let produto_mail = {
                fotografia: null,
                nome: null,
                nome_subcategoria: null,
                atributos: null,
                rating: null,
                quantidade: null,
                preco_total: null
            }

            let produto_especifico = await ProdutoEspecificoGW.getById(produto_encomenda.produto)
            let produto = await ProdutoGW.getById(produto_especifico.produto)
            let subcategoria = await SubCategoriaGW.getById(produto.subcategoria)

            produto_mail.fotografia = produto.fotografia[0]
            produto_mail.nome = produto.nome
            produto_mail.nome_subcategoria = subcategoria.nome

            let caracteristicas = produto_especifico.especificidade
            let atributos_mail = []
            for (let caracteristica of caracteristicas) {
                atributos_mail.push(caracteristica.valor)
            }
            produto_mail.atributos = atributos_mail

            let cadeia = await CadeiaHandler.GetSumarioCadeiaByProdutoId(produto._id)
            produto_mail.rating = cadeia.rating

            produto_mail.quantidade = parseInt(produto_encomenda.quantidade)

            let venda_produto
            if (!produto_especifico.desconto) {
                venda_produto = parseFloat(produto_especifico.preco) * parseInt(produto_encomenda.quantidade)
            } else {
                let preco_prodesp = parseFloat(produto_especifico.preco)
                let desconto_prodesp = parseFloat(produto_especifico.desconto)
                let quantidade_prodesp = parseInt(produto_encomenda.quantidade)
                venda_produto = (preco_prodesp - (preco_prodesp * (desconto_prodesp / 100))) * quantidade_prodesp
            }
            
            let venda_produto_round = Math.round(venda_produto * 100) / 100
            produto_mail.preco_total = venda_produto_round

            produtos.push(produto_mail)
        }

        let encomenda_email = require('./MailGenerator/encomenda')
        let mail_body = await encomenda_email.generate_default(nome_consumidor, link, id_encomenda, data_encomenda, data_entrega, prazo_cancelamento,
            localidade, pais, morada, nome_transportador, distancia_transporte, consumo_item_transporte, emissao_item_transporte,
           classificacao_transporte, produtos)
        
        const emailService = require('../utils/emailService');

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
            Data: 'Confirmação de encomenda'
            }
        },
        Source: 'orders@baylit.store'
        };

        try {
            const result = await emailService.sendEmail(params);
            console.log('Order confirmation email sent (mock):', result.MessageId);
        } catch (err) {
            console.error('Error sending order confirmation email:', err);
        }
        
    }

    async NotifyFornecedorVenda(venda) {

        let vendedor = await FornecedorGW.getById(venda.fornecedor)
        let consumidor = await ConsumidorGW.getById(venda.comprador)
        let mensagem = "O utilizador "+consumidor.nome+" acabou de comprar "+ venda.valor +"€ em produtos na sua loja. Parabéns!"
        await NotificacaoGW.create(venda.fornecedor, "fornecedorVendaEfetuada", mensagem, "https://www.baylit.store/Dashboard/Orders")

        let nome_vendedor = vendedor.nome
        let link = "https://www.baylit.store/Dashboard/Orders"
        let nome_consumidor = consumidor.nome
        let valor_compra = venda.valor
        
        let produto_especifico = await ProdutoEspecificoGW.getById(venda.produto)
        let produto = await ProdutoGW.getById(produto_especifico.produto)
        let subcategoria = await SubCategoriaGW.getById(produto.subcategoria)

        let fotografia = produto.fotografia[0]
        
        let nome_produto = produto.nome
        let nome_subcategoria = subcategoria.nome
        let atributos = []
        for (let caracteristica of produto_especifico.especificidade) {
            atributos.push(caracteristica.valor)
        }

        let cadeia = await CadeiaHandler.GetSumarioCadeiaByProdutoId(produto._id)
        let rating = cadeia.rating

        let quantidade = venda.quantidade
        let preco = venda.valor

        let venda_email = require('./MailGenerator/venda')
        let mail_body = await venda_email.generate_default(nome_vendedor, link, nome_consumidor, valor_compra, nome_produto,
            nome_subcategoria, atributos, rating, quantidade, preco, fotografia)

        var AWS = require('aws-sdk');
        AWS.config.update({
            accessKeyId: process.env.EC2_ACCESS_KEY,
            secretAccessKey: process.env.EC2_SECRET_KEY,
            region: 'eu-west-3',
          })

        // Create sendEmail params 
        var params = {
        Destination: { 
            ToAddresses: [
                vendedor.email,
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
            Data: 'Nova venda de '+venda.valor+'€. Parabéns!'
            }
        },
        Source: 'sales@baylit.store'
        };

        // Create the promise and SES service object
        var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

        // Handle promise's fulfilled/rejected states
        sendPromise.then(
        function(data) {
            console.log(data)
            console.log(data.MessageId);
        }).catch(
            function(err) {
            console.error(err, err.stack);
        });
        
    }

    async NotifyTransportadorTransporte(encomenda) {

        let consumidor = await ConsumidorGW.getById(encomenda.comprador)
        let transportador = await TransportadorGW.getById(encomenda.transportador)
        let transporte = await TransporteGW.getById(encomenda.transporte) 
        let transporte_consumo_item = Math.round((transporte.consumo / transporte.mercadoria.length) * 100) / 100
        let transporte_emissao_item = Math.round((transporte.emissao / transporte.mercadoria.length) * 100) / 100
        let mensagem = "Foi adicionado um novo pedido a um dos seus transportes!"
        await NotificacaoGW.create(encomenda.transportador, "transportadorItensAdicionadosAoTransporte", mensagem, "https://www.baylit.store/Dashboard/Servicos")

        let total_itens = 0
        for (let produto of encomenda.produtos) {
            total_itens += produto.quantidade
        }

        var AWS = require('aws-sdk');
        AWS.config.update({
            accessKeyId: process.env.EC2_ACCESS_KEY,
            secretAccessKey: process.env.EC2_SECRET_KEY,
            region: 'eu-west-3',
          })

        let nome = transportador.nome
        let link = "https://www.baylit.store/Dashboard/Servicos"
        let nome_consumidor = consumidor.nome
        let quantidade = total_itens
        let data = transporte.data_inicio.toLocaleDateString("pt-PT")
        let distancia = transporte.distancia.toFixed(2)
        let consumo = transporte_consumo_item
        let emissao = transporte_emissao_item
        let classificacao = transporte.classificacao

        let transporte_email = require('./MailGenerator/transporte')
        let mail_body = await transporte_email.generate_default(nome, link, nome_consumidor, quantidade, data, distancia, consumo, emissao, classificacao)
        console.log(mail_body)

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
            Data: 'Foi adicionado um novo pedido a um dos seus transportes'
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
    handler_compra: new CompraHandler()
}