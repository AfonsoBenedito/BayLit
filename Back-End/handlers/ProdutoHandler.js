const ProdutoGW = require("../gateway/ProdutoGat")
const ProducaoGW = require("../gateway/ProducaoGat")
const FornecedorGW = require("../gateway/FornecedorGat")
const CategoriaGW = require("../gateway/CategoriaGat")
const SubCategoriaGW = require("../gateway/SubCategoriaGat")
const AtributoGW = require("../gateway/AtributoGat")
const ProdutoEspecificoGW = require("../gateway/ProdutoEspecificoGat")
const ItemGW = require("../gateway/ItemGat")
const ArmazemGW = require("../gateway/ArmazemGat")

const utils = require("../utils");
const Produto = require("../models/Produto")
const FornecedorHandler = require("./FornecedorHandler").handler_fornecedor
// const Produto = require("../models/Produto")

const CadeiaHandler = require("./CadeiaHandler").handler_cadeia

class ProdutoHandler {

    async GetProdutoByID(id){

        let produto = await ProdutoGW.getById(id)

        if (produto != false) {

            return produto

        } else {

            throw {
                code: 400,
                message: "Não existe Produto com esse ID"
            }
        }

    }

    async GetProdutoAndCadeiaById(id){

        let produto = await ProdutoGW.getById(id)

        if (produto != false) {

            let cadeia = await CadeiaHandler.GetCadeiaByProdutoId(id)

            if (cadeia != false){

                let returnProduto = JSON.parse(JSON.stringify(produto))
                returnProduto['cadeia'] = cadeia

                return returnProduto


            } else {

                throw {
                    code: 400,
                    message: "Não existe Cadeia para esse Produto"
                }
            }

        } else {

            throw {
                code: 400,
                message: "Não existe Produto com esse ID"
            }
        }

    }

    async GetProdutoByFornecedor(fornecedor) {

        let fornecedorExists = await FornecedorGW.getById(fornecedor)

        if (fornecedorExists != false){

            let produtos = await ProdutoGW.getByFornecedor(fornecedor)

            if (produtos != false){

                return produtos

            } else {

                throw {
                    code: 400,
                    message: "O Produtor não tem Produtos"
                }
            } 

        } else {

            throw {
                code: 400,
                message: "Não existe Fornecedor com esse ID"
            }
        }

    }

    async GetProdutoAndCadeiaByFornecedor(fornecedor) {

        let fornecedorExists = await FornecedorGW.getById(fornecedor)

        if (fornecedorExists != false){

            let produtos = await ProdutoGW.getByFornecedor(fornecedor)

            if (produtos != false){

                let produtosReturn = JSON.parse(JSON.stringify(produtos))

                for (let i = 0; i < produtos.length; i++){
                    let cadeia = await CadeiaHandler.GetCadeiaByProdutoId(produtos[i]._id)
                    produtosReturn[i].cadeia = cadeia
                }

                return produtosReturn

            } else {

                throw {
                    code: 400,
                    message: "O Produtor não tem Produtos"
                }
            } 

        } else {

            throw {
                code: 400,
                message: "Não existe Fornecedor com esse ID"
            }
        }

    }

    async GetProdutoByCategoria(categoria) {

        let categoriaExists = await ProdutoGW.existsCategoria(categoria)

        if (categoriaExists) {

            let produto_categoria = await ProdutoGW.getByCategoria(categoria)

            if (produto_categoria != false) {

                return produto_categoria

            } else {

                throw {
                    code: 204,
                    message: "Não existem Produtos nesta Categoria"
                }
            }

        } else {

            throw {
                code: 400,
                message: "Não existe Categoria com esse ID"
            }
        }

    }

    async GetProdutoAndCadeiaByCategoria(categoria) {

        let categoriaExists = await ProdutoGW.existsCategoria(categoria)

        if (categoriaExists) {

            let produto_categoria = await ProdutoGW.getByCategoria(categoria)

            if (produto_categoria != false) {

                let produtosReturn = JSON.parse(JSON.stringify(produto_categoria))

                for (let i = 0; i < produto_categoria.length; i++){
                    let cadeia = await CadeiaHandler.GetCadeiaByProdutoId(produto_categoria[i]._id)
                    produtosReturn[i].cadeia = cadeia
                }

                return produtosReturn

            } else {

                throw {
                    code: 204,
                    message: "Não existem Produtos nesta Categoria"
                }
            }

        } else {

            throw {
                code: 400,
                message: "Não existe Categoria com esse ID"
            }
        }

    }

    async GetProdutoBySubCategoria(subcategoria) {

        let subcategoriaExists = await ProdutoGW.existsSubCategoria(subcategoria)

        if (subcategoriaExists) {

            let produto_categoria = await ProdutoGW.getBySubCategoria(subcategoria)

            if (produto_categoria != false) {

                

                return produto_categoria

            } else {

                throw {
                    code: 204,
                    message: "Não existem Produtos nesta SubCategoria"
                }
            }

        } else {

            throw {
                code: 400,
                message: "Não existe SubCategoria com esse ID"
            }
        }

    }

    async GetProdutoAndCadeiaBySubCategoria(subcategoria) {

        let subcategoriaExists = await ProdutoGW.existsSubCategoria(subcategoria)

        if (subcategoriaExists) {

            let produto_categoria = await ProdutoGW.getBySubCategoria(subcategoria)

            if (produto_categoria != false) {

                let produtosReturn = JSON.parse(JSON.stringify(produtos))

                for (let i = 0; i < produto_categoria.length; i++){
                    let cadeia = await CadeiaHandler.GetCadeiaByProdutoId(produto_categoria[i]._id)
                    produtosReturn[i].cadeia = cadeia
                }

                return produtosReturn

            } else {

                throw {
                    code: 204,
                    message: "Não existem Produtos nesta SubCategoria"
                }
            }

        } else {

            throw {
                code: 400,
                message: "Não existe SubCategoria com esse ID"
            }
        }

    }

    async InsertProduct(fornecedor, nome, categoria, subcategoria, informacao_adicional) {

        let fornecedorExists = await FornecedorGW.existsId(fornecedor)
        let categoriaExists = await CategoriaGW.existsId(categoria)
        let subcategoriaExists = await SubCategoriaGW.existsId(subcategoria)

        if (fornecedorExists != false){

            if (categoriaExists != false){

                if (subcategoriaExists != false){

                    if (await SubCategoriaGW.belongsCategory(subcategoria, categoria)){

                        return await ProdutoGW.create(fornecedor, nome, categoria, subcategoria, informacao_adicional)

                    } else {

                        throw {
                            code: 400,
                            message: "Subcategoria não pertence à Categoria fornecida"
                        }
                    }

                } else {

                    throw {
                        code: 400,
                        message: "Não existe Subcategoria com esse ID"
                    }
                }         
            } else {

                throw {
                    code: 400,
                    message: "Não existe Categoria com esse ID"
                }
            }

        } else {

            throw {
                code: 400,
                message: "Não existe Fornecedor com esse ID"
            }
        }

    }

    async InsertProductPictures(id_produto, fotografias) {

        let produto = await ProdutoGW.getById(id_produto)
        if (produto != false) {

            await ProdutoGW.addFotografias(id_produto, fotografias)

            let prod_final = await ProdutoGW.getById(id_produto)
            return prod_final

        } else {

            throw {
                code: 400,
                message: "Não existe Produto com esse ID"
            }
        }
    }

    async InsertCategoriaPicture(id_categoria, fotografia) {

        let categoria = await CategoriaGW.getById(id_categoria)
        if (categoria != false) {

            await CategoriaGW.addFotografia(id_categoria, fotografia)

            let cat_final = await CategoriaGW.getById(id_categoria)
            return cat_final

        } else {

            throw {
                code: 400,
                message: "Não existe Categoria com esse ID"
            }
        }
    }

    async InsertSubCategoriaPicture(id_subcategoria, fotografia) {

        let subcategoria = await SubCategoriaGW.getById(id_subcategoria)
        if (subcategoria != false) {

            await SubCategoriaGW.addFotografia(id_subcategoria, fotografia)

            let subcat_final = await SubCategoriaGW.getById(id_subcategoria)
            return subcat_final

        } else {

            throw {
                code: 400,
                message: "Não existe SubCategoria com esse ID"
            }
        }
    }

    async InsertProdutoEspecificoPictures(id_produto, fotografias) {

        let produto_especifico = await ProdutoEspecificoGW.getById(id_produto)
        if (produto_especifico != false) {

            await ProdutoEspecificoGW.addFotografias(id_produto, fotografias)

            let prod_final = await ProdutoEspecificoGW.getById(id_produto)
            return prod_final

        } else {

            throw {
                code: 400,
                message: "Não existe Produto com esse ID"
            }
        }
    }

    async UpdateProduct(id, nome, informacao_adicional, remover_fotografias){

        if (nome != null){

            await ProdutoGW.updateNome(id, nome)
        }

        if (informacao_adicional != null){

            await ProdutoGW.updateInformacaoAdicional(id, informacao_adicional)
        }

        if (remover_fotografias) {
            let produto = await ProdutoGW.getById(id)

            for (let remover_fotografia of remover_fotografias) {
                let index = produto.fotografia.indexOf(remover_fotografia);
                if (index > -1) {
                    produto.fotografia.splice(index, 1);
                }
            }

            await ProdutoGW.updateFotografias(id, produto.fotografia)
            
        }

        return await ProdutoGW.getById(id)

    }

    async DeleteProduct(id){
        
        let produtos_especificos = await ProdutoEspecificoGW.getByProduto(id)

        if (produtos_especificos.length > 0) {
            for (let produto_especifico of produtos_especificos) {
                let stock = await ArmazemGW.getStock(produto_especifico._id)
                if (stock.length > 0) {
                    throw {
                        code: 400,
                        message: "Não pode eliminar produtos com itens em inventário"
                    }
                }
            }    
        }

        let producao = await ProducaoGW.getByProduto(id)
        if (producao) {
            await ProducaoGW.deleteById(producao._id)
        }
        
        return await ProdutoGW.deleteById(id)
        
    }

    async InsertDescontoProdutoEspecifico(fornecedor_id, produto_especifico_id, desconto, data_fim) {

        let fornecedor = await FornecedorGW.getById(fornecedor_id)
        let produto_especifico = await ProdutoEspecificoGW.getById(produto_especifico_id)
        
        if (String(fornecedor._id) == String(produto_especifico.fornecedor)) {
            if (utils.isNumber(desconto)) {
                if (parseFloat(desconto) <= 90) {

                    let data_list = data_fim.split("/");
                    if (data_list.length != 3) {
                        throw {
                            code: 400,
                            message: "A data inserida não é válida. Deve ser: dd/mm/aaaa"
                        }
                    }
                    let data_dia = parseInt(data_list[0])
                    let data_mes = parseInt(data_list[1]) - 1
                    let data_ano = parseInt(data_list[2])
                    let prazo = new Date(data_ano, data_mes, data_dia, 1, 0, 0, 0)
                    let now = new Date()
                    let day = new Date()
                    day.setDate(now.getDate() + 1)
                    if (prazo < day) {
                        throw {
                            code: 400,
                            message: "O desconto deve ter uma duração minima de 24 horas."
                        }
                    } 

                    produto_especifico = await ProdutoEspecificoGW.updateDesconto(produto_especifico_id, desconto, prazo)
                    return produto_especifico

                } else {
                    throw {
                        code: 400,
                        message: "Desconto não deve ser superior a 90%."
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

    async GetCategoriaByID(id) {

        let categoria = await CategoriaGW.getById(id)

        if (categoria != false) {

            return categoria

        } else {

            throw {
                code: 400,
                message: "Não existe Categoria com esse ID"
            }
        }

    }

    async GetAllCategorias(){

        let categorias = await CategoriaGW.getVerified()

        if (categorias != false) {
            return categorias
        } else {

            throw {
                code: 204,
                message: "Não existem Categorias"
            }
        }
    }

    async GetAllAdministradorCategorias(){

        let categorias = await CategoriaGW.getAll()

        if (categorias != false) {
            return categorias
        } else {

            throw {
                code: 204,
                message: "Não existem Categorias"
            }
        }
    }

    async FornecedorInsertNovaCategoria(nome) {

        let categoria = await CategoriaGW.getByName(nome)

        if (categoria == false) {
            return await CategoriaGW.createPorValidar(nome)
        } else {

            throw {
                code: 400,
                message: "Já existe uma Categoria com esse Nome"
            }
        }
    }

    async AdministradorInsertNovaCategoria(nome){

        let categoria = await CategoriaGW.getByName(nome)

        if (categoria == false) {
            return await CategoriaGW.create(nome)
        } else {

            throw {
                code: 400,
                message: "Já existe uma Categoria com esse Nome"
            }
        }
    }

    async UpdateEstadoCategoria(id_categoria, novo_estado) {
        let isTrueSet = (novo_estado === 'true')
        let isFalseSet = (novo_estado === 'false')
        let bool

        if (isTrueSet || isFalseSet){
            if (isTrueSet) {
                bool = true
            }
            if (isFalseSet){
                bool = false
            }
        } else {

            throw {
                code: 400,
                message: "Estado tem de ser um Boolean"
            }
        }
        
        let categoria = await CategoriaGW.getById(id_categoria)

        if (categoria != false) {

            return await CategoriaGW.updateValidade(id_categoria, bool)

        } else {

            throw {
                code: 400,
                message: "Não existe Categoria com esse ID"
            }
        }
    }

    async DeleteCategoria(id){

        let produtos = await ProdutoGW.getByCategoria(id)
        if (produtos == false) {
            return await CategoriaGW.deleteById(id)
        } else {
            throw {
                code: 400,
                message: "Não pode apagar uma categoria que tenha produtos registados"
            }
        }
        
    }

    async GetSubcategoriaByID(id) {

        let subCategoria = await SubCategoriaGW.getById(id)

        if (subCategoria != false) {

            return subCategoria

        } else {

            throw {
                code: 400,
                message: "Não existe SubCategoria com esse ID"
            }
        }

    }

    async GetSubcategoriasByCategoriaID(idCategoria) {

        let categoria = await CategoriaGW.getById(idCategoria)
        
        if (categoria != false){

            let subCategorias = await SubCategoriaGW.getByCategoria(idCategoria)

            if (subCategorias != false) {
                
                return subCategorias

            } else {
                return []
            }

        } else {

            throw {
                code: 400,
                message: "Não existe Categoria com esse ID"
            }
        }

    }

    async GetAllSubcategorias(){

        let subCategorias = await SubCategoriaGW.getVerified()

        if (subCategorias != false){

            return subCategorias

        } else {

            throw {
                code: 204,
                message: "Não existem Subcategorias"
            }
        }
    }

    async GetAllAdministradorSubcategorias(){

        let subCategorias = await SubCategoriaGW.getAll()

        if (subCategorias != false){

            return subCategorias

        } else {

            throw {
                code: 204,
                message: "Não existem Subcategorias"
            }
        }
    }

    async FornecedorInsertNovaSubcategoria(nome, categoria_id){

        let categoria = await CategoriaGW.getById(categoria_id)

        if (categoria != false){

            let subCategoria = await SubCategoriaGW.getByNameInCategoria(nome, categoria_id)

            if (subCategoria == false) {
                
                return await SubCategoriaGW.createPorValidar(nome, categoria_id)

            } else {
                throw {
                    code: 400,
                    message: "Já existe uma Subcategoria com esse Nome"
                }
            }

        } else {

            throw {
                code: 400,
                message: "Não existe Categoria com esse ID"
            }
        }

    }

    async AdministradorInsertNovaSubcategoria(nome, categoria_id){

        let categoria = await CategoriaGW.getById(categoria_id)

        if (categoria != false){

            let subCategoria = await SubCategoriaGW.getByNameInCategoria(nome, categoria_id)

            if (subCategoria == false) {
                
                return await SubCategoriaGW.create(nome, categoria_id)

            } else {
                throw {
                    code: 400,
                    message: "Já existe uma Subcategoria com esse Nome"
                }
            }

        } else {

            throw {
                code: 400,
                message: "Não existe Categoria com esse ID"
            }
        }

    }

    async UpdateEstadoSubcategoria(id_subcategoria, novo_estado) {
        let isTrueSet = (novo_estado === 'true')
        let isFalseSet = (novo_estado === 'false')
        let bool

        if (isTrueSet || isFalseSet){
            if (isTrueSet) {
                bool = true
            }
            if (isFalseSet){
                bool = false
            }
        } else {

            throw {
                code: 400,
                message: "Estado tem de ser um Boolean"
            }
        }
        

        let subCategoria = await SubCategoriaGW.getById(id_subcategoria)

        if (subCategoria != false) {

            return await SubCategoriaGW.updateValidade(id_subcategoria, bool)

        } else {

            throw {
                code: 400,
                message: "Não existe SubCategoria com esse ID"
            }
        }
    }

    async DeleteSubcategoria(id){

        let produtos = await ProdutoGW.getBySubCategoria(id)

        if (produtos == false) {
            return await SubCategoriaGW.deleteById(id)
        } else {
            throw {
                code: 400,
                message: "Não pode apagar uma subcategoria que tenha produtos registados"
            }
        }
        

    }

    async GetAtributoByID(id) {

        let atributo = await AtributoGW.getById(id)

        if (atributo!= false) {

            delete atributo['valoresPorValidar']

            return atributo

        } else {

            throw {
                code: 400,
                message: "Não existe Atributo com esse ID"
            }
        }

    }

    async GetAtributoByIDAdministrador(id) {

        let atributo = await AtributoGW.getById(id)

        if (atributo!= false) {

            return atributo

        } else {

            throw {
                code: 400,
                message: "Não existe Atributo com esse ID"
            }
        }

    }

    async GetAtributosBySubcategoriaID(subcategoria_id) {

        let subcategoria = await SubCategoriaGW.getById(subcategoria_id)

        if (subcategoria != false){
            
            var result = [];

            for (var atributoId in subcategoria.atributos){
                let atributo = await AtributoGW.getById(atributoId);
                if (atributo.valido){
                    //Remover o valoresPorValidar do json de resposta
                    result.push(atributo)
                }
            }

            return result;

        } else {

            throw {
                code: 400,
                message: "Não existe Subcategoria com esse ID"
            }
        }
    }

    async GetAtributosBySubcategoriaIDAdministrador(subcategoria_id) {

        let subcategoria = await SubCategoriaGW.getById(subcategoria_id)

        if (subcategoria != false){
            
            var result = [];

            for (var atributoId in subcategoria.atributos){
                result.push(await AtributoGW.getById(atributoId));
            }

            return result;

        } else {

            throw {
                code: 400,
                message: "Não existe Subcategoria com esse ID"
            }
        }
    }

    //Alterado
    async FornecedorInsertNovoAtributo(nome_atributo, descricao_atributo, valores_atributo) {
            
        let atributos = await AtributoGW.getByName(nome_atributo)

        if (atributos == false){

            return await AtributoGW.createPorValidar(nome_atributo, descricao_atributo, valores_atributo)

        } else {

            throw {
                code: 400,
                message: "Já existe um atributo com esse Nome"
            }
        }

        
    }

    async AdministradorInsertNovoAtributo(subcategoria_id, nome_atributo, descricao_atributo, valores_atributo) {

        let atributos = await AtributoGW.getByName(nome_atributo)

        if (atributos == false){

            return await AtributoGW.create(nome_atributo, descricao_atributo, valores_atributo)

        } else {

            throw {
                code: 400,
                message: "Já existe um atributo com esse Nome"
            }
        }

    }

    async UpdateEstadoAtributo(id_atributo, novo_estado) {

        let isTrueSet = (novo_estado === 'true')
        let isFalseSet = (novo_estado === 'false')
        let bool

        if (isTrueSet || isFalseSet){
            if (isTrueSet) {
                bool = true
            }
            if (isFalseSet){
                bool = false
            }
        } else {

            throw {
                code: 400,
                message: "Estado tem de ser um Boolean"
            }
        }

        let atributo = await AtributoGW.getById(id_atributo)

        if (atributo!= false) {

            return await AtributoGW.updateValidade(id_atributo, bool)

        } else {

            throw {
                code: 400,
                message: "Não existe Atributo com esse ID"
            }
        }
    }

    async FornecedorInsertNovoValorAtributo(id_atributo, valor) {

        let atributo = await AtributoGW.getById(id_atributo)

        if (atributo != false) {

            return await AtributoGW.addValoresPorValidar(id_atributo, valor)

        } else {

            throw {
                code: 400,
                message: "Não existe Atributo com esse ID"
            }
        }
    }

    async AdministradorInsertNovoValorAtributo(id_atributo, valor) {

        let atributo = await AtributoGW.getById(id_atributo)

        if (atributo != false) {

            return await AtributoGW.addValores(id_atributo, valor)

        } else {

            throw {
                code: 400,
                message: "Não existe Atributo com esse ID"
            }
        }
    }

    async existsValor(id_atributo, valor) {

        let atributo = await AtributoGW.getById(id_atributo)

        if (atributo != false) {

            if (atributo.valores.includes(valor)){
                return true
            }
            if (atributo.valoresPorValidar.includes(valor)){
                return true
            }

            throw {
                code: 400,
                message: "Não existe Valor nesse Atributo"
            }

        } else {

            throw {
                code: 400,
                message: "Não existe Atributo com esse ID"
            }
        }

    }

    async UpdateEstadoValor(id_atributo, valor, novo_estado) {

        let isTrueSet = (novo_estado === 'true')
        let isFalseSet = (novo_estado === 'false')
        let bool

        if (isTrueSet || isFalseSet){
            if (isTrueSet) {
                bool = true
            }
            if (isFalseSet){
                bool = false
            }
        } else {

            throw {
                code: 400,
                message: "Estado tem de ser um Boolean"
            }
        }

        let atributo = await AtributoGW.getById(id_atributo)

        if (atributo!= false) {

            if (atributo.valores.includes('valor')){
                if (bool == false){

                    return await AtributoGW.InvalidarValor(id_atributo, valor)

                } else {

                    throw {
                        code: 200,
                        message: "Ok"
                    }
                }
            } else if (atributo.valoresPorValidar.includes('valor')) {

                if (bool == true) {

                    return await AtributoGW.ValidarValor(id_atributo, valor)

                } else {

                    throw {
                        code: 200,
                        message: "Ok"
                    }
                }
                
            } else {

                throw {
                    code: 400,
                    message: "Não existe valor com esse Nome"
                }
            }

        } else {

            throw {
                code: 400,
                message: "Não existe Atributo com esse ID"
            }
        }
    }

    async DeleteAtributo(id){

        let produtos_especificos = await ProdutoEspecificoGW.getByAtributo(id)
        if (!produtos_especificos) {
            await AtributoGW.deleteById(id)
        } else {
            throw {
                code: 400,
                message: "Não pode apagar um atributo que esteja associado a um produto especifico registado."
            }
        } 

    }

    async DeleteValor(id, valor){

        let atributo = await AtributoGW.getById(id_atributo)

        if (atributo!= false) {

            let produtos_especificos = await ProdutoEspecificoGW.getByValor(valor)
            if (!produtos_especificos) {
                await AtributoGW.deleteValor(id, valor)
            } else {
                throw {
                    code: 400,
                    message: "Não pode apagar um valor que esteja associado a um produto especifico registado."
                }
            } 

        } else {

            throw {
                code: 400,
                message: "Não existe Atributo com esse ID"
            }
        }

    }

    async GetProdutoEspecificoByID(id){

        let produtoEspecifico = await ProdutoEspecificoGW.getById(id)

        if (produtoEspecifico != false) {

            return produtoEspecifico

        } else {

            throw {
                code: 400,
                message: "Não existe ProdutoEspecifico com esse ID"
            }
        }

    }

    async GetEspecificosByProdutoID(produto_id) {

        let produto = await ProdutoGW.getById(produto_id)

        if (produto != false){

            let produtosEspecificos = await ProdutoEspecificoGW.getByProduto(produto_id)

            if (produtosEspecificos != false) {

                return produtosEspecificos

            } else {

                throw {
                    code: 204,
                    message: "Não existem ProdutosEspecificos para esse Produto"
                }
            }

        } else {

            throw {
                code: 400,
                message: "Não existe Produto com esse ID"
            }
        }

    }

    async GetAllEspecificos() {

        let produtosEspecificos = await ProdutoEspecificoGW.getAll()

        if (produtosEspecificos != false) {

            return produtosEspecificos

        } else {

            throw {
                code: 204,
                message: "Não existem ProdutoEspecifico"
            }
        }

    }

    async InsertNovoProdutoEspecifico(fornecedor_id, produto_id, preco, caracteristicas) {

        let fornecedor = await FornecedorGW.getById(fornecedor_id)

        if (!utils.isNumber(preco)){

            throw {
                code: 400,
                message: "Preco tem de ser um número"
            }
        }

        if (fornecedor != false) {

            let produto = await ProdutoGW.getById(produto_id)

            if (produto != false) {

                if (produto.fornecedor == fornecedor_id) { 
                    try {
                        if (typeof caracteristicas === 'string' || caracteristicas instanceof String) {
                            caracteristicas = JSON.parse(caracteristicas)
                        }
                    } catch (err) {
                        throw {
                            code: 400,
                            message: "Pedido inválido."
                        }
                    }

                    let outros_produtos = await ProdutoEspecificoGW.getByProduto(produto_id)
                    for (let outro_produto of outros_produtos) {
                        let is_equal = true
                        for (let car of caracteristicas) {
                            let atr = car.atributo
                            if (is_equal != false) {
                                if (outro_produto.especificidade[atr] != car[atr]) {
                                    is_equal = false
                                }
                            }
                        }
                        if (is_equal) {
                            throw {
                                code: 400,
                                message: "Este produto especifico já existe"
                            }
                        }
                    }

                    for (let caracteristica of caracteristicas){
                        let atributo = await AtributoGW.getById(caracteristica.atributo)
            
                        if (atributo == false) {
                            throw {
                                code: 400,
                                message: "Não existe Atributo com o Id " + caracteristica.atributo
                            }
                        }
            
                        let valores = atributo.valores
            
                        if (!valores.includes(caracteristica.valor)){
            
                            throw {
                                code: 400,
                                message: "O valor " + caracteristica.valor +" não está registado."
                            }
                        }
                    }

                    return await ProdutoEspecificoGW.create(fornecedor_id, produto_id, preco, caracteristicas)

                } else {

                    throw {
                        code: 400,
                        message: "Esse Produto não pertence a esse Fornecedor"
                    }
                }   

            } else {

                throw {
                    code: 400,
                    message: "Não existe Produto com esse ID"
                }
            }

        } else {

            throw {
                code: 400,
                message: "Não existe Fornecedor com esse ID"
            }
        }
    }

    async UpdateProdutoEspecifico(id, preco) {

        let produtosEspecificos = await ProdutoEspecificoGW.getById(id)

        if (produtosEspecificos == false) {

            throw {
                code: 400,
                message: "Não existe Produto Especifico com esse id"
            }

        }

        if (preco != null) {
            if (!utils.isNumber(preco)){

                throw {
                    code: 400,
                    message: "Preco tem de ser um Number"
                }
            }
    
            await ProdutoEspecificoGW.updatePreco(id, preco)
        }

        return await ProdutoEspecificoGW.getById(id)
    }

    async DeleteProdutoEspecifico(id){

        let exists = false
        let produto_especifico = await ProdutoEspecificoGW.getById(id)
        let armazens = await ArmazemGW.getWithProdutoEmInventario(produto_especifico._id)
        if (armazens.length > 0) {
            exists = true
        }
        
        if (!exists) {
            await ProdutoEspecificoGW.deleteById(id)
        } else {
            throw {
                code: 400,
                message: "Não pode eliminar produtos com itens em inventário"
            }
        }

    }

    async GetProdutoItem(id_item) {

        let item = await ItemGW.getById(id_item)

        if (item != false) {

            let produtoEspecifico = await ProdutoEspecificoGW.getById(item.produto_especifico)

            return await ProdutoGW.getById(produtoEspecifico.produto)

        } else {

            throw {
                code: 400,
                message: "Não existe Item com esse ID"
            }
        }
    }

    async GetProdutoByFiltros(categoria, subcategoria, preco, ratingEcologico, nome, filtros){
        // {
        //     categoria: null || idCategoria
        //     subcategoria: null || idSubcategoria
        //     preco: null || {valormenor, valormaior}
        //     ratingEcologico: null || valorMenor
        //     nome: null || nome
        //     filtros: [
        //         {
        //             atributo: idAtributo,
        //             valores: []
        //         }
        //     ]
        // }
        let resultProdutos;
        let especificos = [];
        // let returnProdutos = [];

        if (subcategoria != null){
            
            if (nome != null){

                resultProdutos = await ProdutoGW.getBySubCategoriaAndNome(subcategoria, nome)

            }else {

                resultProdutos = await ProdutoGW.getBySubCategoria(subcategoria)
            }
            

        } else if (categoria != null){

            if (nome != null){

                resultProdutos = await ProdutoGW.getByCategoriaAndNome(categoria, nome)

            }else {
                
                resultProdutos = await ProdutoGW.getByCategoria(categoria)
            }

            

        } else {

            if (nome != null){

                resultProdutos = await ProdutoGW.getByLikeName(nome)

            }else {

                resultProdutos = await ProdutoGW.getAll()    
            }
            
        }

        let temEspecificos = []

        for (let i = 0; i < resultProdutos.length; i++){
            let listaEspecificos = await ProdutoEspecificoGW.getByProduto(resultProdutos[i]._id)

            if(listaEspecificos.length != 0){

                let produtoValido = false

                for (let k = 0; k < listaEspecificos.length && produtoValido == false; k++){

                    produtoValido = await FornecedorHandler.ProdutoTeveStock(listaEspecificos[k]._id)

                }

                if (produtoValido){
                    temEspecificos.push(resultProdutos[i])
                }
            }
        }
        
        resultProdutos = temEspecificos

        if (preco != null){

            let produtosPreco = []
            //Pesquisar por preço
            for (let i = 0; i < resultProdutos.length; i++){
                especificos = especificos.concat(await ProdutoEspecificoGW.getByProdutoPreco(resultProdutos[i]._id, preco.valorMenor, preco.valorMaior))
            }

            for (let i = 0; i < especificos.length; i++){
                produtosPreco = produtosPreco.concat(await ProdutoGW.getById(especificos[i].produto))
            }

            resultProdutos = utils.uniqueValuesArray(produtosPreco)
            

        }
        
        if (ratingEcologico != null){
            //Pesquisar por ratingEcologico

            let produtosRating = []

            for (let i = 0; i < resultProdutos.length; i++){
                
                let produtoTesteRating = await CadeiaHandler.GetCadeiaByProdutoId(resultProdutos[i]._id)

                if (produtoTesteRating.rating >= ratingEcologico){

                    produtosRating = produtosRating.concat(resultProdutos[i])

                }

            }

            resultProdutos = utils.uniqueValuesArray(produtosRating)
        }

        resultProdutos = JSON.parse(JSON.stringify(resultProdutos))

        if (filtros == null){


            for (let i = 0; i < resultProdutos.length; i++){
                
                let cadeia = await CadeiaHandler.GetCadeiaByProdutoId(resultProdutos[i]._id)

                resultProdutos[i].cadeia = cadeia
            }

            return resultProdutos
            

        } else {

            if (filtros.length == 0){
                for (let i = 0; i < resultProdutos.length; i++){
                
                    let cadeia = await CadeiaHandler.GetCadeiaByProdutoId(resultProdutos[i]._id)
    
                    resultProdutos[i].cadeia = cadeia
                }

                return resultProdutos
            }

            let produtosFiltro = []

            if (preco != null){
                for (let i = 0; i < resultProdutos.length; i++){
                    especificos = especificos.concat(await ProdutoEspecificoGW.getByProdutoPreco(resultProdutos[i]._id.toString(), preco.valorMenor, preco.valorMaior))
                }
            } else {
                for (let i = 0; i < resultProdutos.length; i++){
                    especificos = especificos.concat(await ProdutoEspecificoGW.getByProduto(resultProdutos[i]._id.toString()))
                }
            }
            // console.log("ESPECIFICOS")
            // console.log(especificos)

            // console.log("Fora Filtros 1")

            for (let i = 0; i < especificos.length; i++){

                // console.log("Fora Filtros 2")
                
                let validEspecifico = true

                

                for (let m = 0; m < filtros.length && validEspecifico; m++){

                    // console.log("Fora Filtros 3")

                    // console.log(especificos[i].especificidade)

                    for (let k = 0; k < especificos[i].especificidade.length && validEspecifico; k++){

                        // console.log("Fora Filtros 4")
                        // console.log(especificos[i].especificidade[k].atributo)
                        // console.log(filtros[m].atributo)
                        // console.log(especificos[i].especificidade[k].valor)
                        //console.log(filtros[m].valores)

                        if (especificos[i].especificidade[k].atributo == filtros[m].atributo){

                            // console.log("Fora Filtros 5")

                            //Verificar se os valores dão match, caso contrário validEspecifico = false
                            // console.log(especificos[i])

                            // console.log(filtros[m].valores)
                            // console.log(especificos[i].especificidade[k].valor)

                            if (!filtros[m].valores.includes(especificos[i].especificidade[k].valor)){

                                // console.log("Fora Filtros 6")
                                
                                validEspecifico = false
                                
                            }

                            // console.log(validEspecifico)
                           

                        }
                    }
                    
                    // console.log(validEspecifico)
                }

                if (validEspecifico){
                    // console.log(true)
                    // console.log(especificos[i])
                    produtosFiltro = produtosFiltro.concat(await ProdutoGW.getById(especificos[i].produto))
                }
                
            }
            //console.log("FILTRO")
            //console.log(produtosFiltro)

            resultProdutos = utils.uniqueValuesArray(produtosFiltro)

            resultProdutos = JSON.parse(JSON.stringify(resultProdutos))

            //console.log(resultProdutos)
            for (let i = 0; i < resultProdutos.length; i++){
                
                let cadeia = await CadeiaHandler.GetCadeiaByProdutoId(resultProdutos[i]._id)

                

                resultProdutos[i].cadeia = cadeia
            }

            return resultProdutos

            
        }

        
    }
}

module.exports = {
    handler_produto: new ProdutoHandler()
}
