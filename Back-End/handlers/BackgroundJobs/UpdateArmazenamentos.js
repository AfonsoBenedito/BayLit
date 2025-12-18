const ArmazenamentoGW = require("../../gateway/ArmazenamentoGat")
const ArmazemGW = require("../../gateway/ArmazemGat")
const ProdutoGW = require("../../gateway/ProdutoGat")
require("../../conn");

async function updateArmazenamentos() {
    try {
        let armazenamentos = await ArmazenamentoGW.getAllNonFinished();
    
        let armazens = []
        let consumo_armazens = []
    
        let armazenamento_consumo = []
    
        for (let armazenamento of armazenamentos) {
    
            await ArmazenamentoGW.updateUpdated(armazenamento._id)

            let armazem = await ArmazemGW.getById(armazenamento.armazem)
            let numero_itens = 0
            if (armazem.inventario) {
                for (let produto_inventario of armazem.inventario) {
                    numero_itens += produto_inventario.quantidade
                }
            }

            let consumo_armazem
            if (!armazens.includes(armazenamento.armazem)) {    
                let gasto_armazem = + parseFloat(armazem.gasto_diario).toFixed(2)

                consumo_armazem = gasto_armazem / numero_itens

                armazens.push(armazem._id)
                consumo_armazens.push(consumo_armazem)
            
            } else {
                let ind = armazens.indexOf(armazenamento.armazem)
                consumo_armazem = consumo_armazens[ind]
            }

            let consumo_atual
            if (armazenamento.consumo_total) {
                consumo_atual = armazenamento.consumo_total
            } else {
                consumo_atual = 0
            }
            let novo_consumo = consumo_atual + consumo_armazem

            armazenamento_consumo.push([armazenamento._id, novo_consumo, armazem])
            
            if (!novo_consumo) {
                novo_consumo = 0
            }
            await ArmazenamentoGW.updateConsumoTotal(armazenamento._id, novo_consumo)
        }
    
        for (let armc of armazenamento_consumo) {
            
            let consumo_area_item = (((armc[1] / Math.round(armc[2].tamanho)) * 100))
            if (!consumo_area_item) {
                consumo_area_item = 11
            }
            let classificacao
            if (consumo_area_item < 0.5) {
                classificacao = 5
            } else if (consumo_area_item < 1.5) {
                classificacao = 4
            } else if (consumo_area_item < 4) {
                classificacao = 3
            } else if (consumo_area_item < 10) {
                classificacao = 2
            } else {
                classificacao = 1
            }
            await ArmazenamentoGW.updateClassificacao(armc[0], classificacao)
            
        }
    
        let produtos = await ProdutoGW.getAll();
        for (let produto of produtos) {
            let armazenamentos_produto = await ArmazenamentoGW.getByProduto(produto._id)
    
            let total_consumo_produto = 0
            let total_classificacao_produto = 0
            let total_duracao_produto = 0
            let total_armazenamentos_produto = armazenamentos_produto.length
    
            if (armazenamentos_produto.length > 0) {
                for (let armazenamento_produto of armazenamentos_produto) {

                    if (armazenamento_produto.consumo_total) {
                        total_consumo_produto += armazenamento_produto.consumo_total
                    }
                    if (armazenamento_produto.classificacao) {
                        total_classificacao_produto += armazenamento_produto.classificacao
                    }
                    
                    let data_inicio = armazenamento_produto.data_inicio
                    let data_fim
                    if (armazenamento_produto.data_fim == undefined) {
                        data_fim = new Date()                    
                    } else {
                        data_fim = armazenamento_produto.data_fim
                    }
                    let Difference_In_Time = data_fim.getTime() - data_inicio.getTime();
                    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    
                    total_duracao_produto += Difference_In_Days
                }
    
                let media_duracao_produto = total_duracao_produto / total_armazenamentos_produto
                let media_consumo_produto = total_consumo_produto / total_armazenamentos_produto
                let media_classificacao_produto = total_classificacao_produto / total_armazenamentos_produto

                if (!media_duracao_produto) {
                    media_duracao_produto = 1
                }
                if (!media_consumo_produto) {
                    media_consumo_produto = 0
                }
                if (!media_classificacao_produto) {
                    media_classificacao_produto = 1
                }

                let armazenamento_produto_bd = {
                    "duracao": Math.round(media_duracao_produto),
                    "consumo": media_consumo_produto,
                    "classificacao": media_classificacao_produto
                }
                
                //console.log(armazenamento_produto_bd)
                await ProdutoGW.updateArmazenamento(produto._id, armazenamento_produto_bd)

            }
        } 
    
        return "Atualização de armazenamentos diária completa"
    } catch (err) {
        console.log(err)
        console.log("ERROR! Não foi possivel atualizar os armazenamentos – "+err)
    }
}

updateArmazenamentos().then((result) => console.log(result))