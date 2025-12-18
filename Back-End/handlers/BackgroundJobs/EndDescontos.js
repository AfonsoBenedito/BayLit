const ProdutoEspecificoGW = require("../../gateway/ProdutoEspecificoGat")
require("../../conn");

async function EndDescontos() {

    try {
        let produtos_especificos = await ProdutoEspecificoGW.getWithDesconto()

        let now = new Date();
        for (let produto_especifico of produtos_especificos) {
            if (produto_especifico.data_desconto) {
                if (produto_especifico.data_desconto < now) {
                    await ProdutoEspecificoGW.removeDesconto(produto_especifico._id)
                }
            }
        }

        return "Atualização de descontos completa"
    } catch (err) {
        console.log("ERROR! Não foi possivel atualizar descontos – "+err)
    }
    
}

EndDescontos().then((result) => console.log(result))