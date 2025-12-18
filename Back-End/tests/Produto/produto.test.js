let atlas_access = require('../../db/atlas_access')
const auth_handler = require('../../handlers/AutenticacaoHandler').handler_auth;
const config = require("../config.json")
const Mongoose = require("mongoose");
const Fornecedor = require("../../models/Fornecedor");
const FornecedorHistorico = require("../../models/FornecedorHistorico");
const Utilizador = require("../../models/Utilizador");
const ProdutoHistorico = require("../../models/ProdutoHistorico");
const ProdutoEspecificoHistorico = require("../../models/ProdutoEspecificoHistorico");
const produto_handler = require('../../handlers/ProdutoHandler').handler_produto;
const CategoriaGW = require("../../gateway/CategoriaGat")
const SubCategoriaGW = require("../../gateway/SubCategoriaGat")
const ProdutoGW = require("../../gateway/ProdutoGat")
const ProdutoEspecificoGW = require("../../gateway/ProdutoEspecificoGat")
const AtributoGW = require("../../gateway/AtributoGat")

var fornecedor = ""
var categoria = ""
var subcategoria = ""
var produto = ""
var produtoEspecifico = ""
var atributo = ""

beforeAll(async () => {
    require("../../conn");
    await atlas_access.connectToDB()

    fornecedor = await auth_handler.RegistarFornecedor(config.new_username, config.new_email, config.new_password, config.new_morada, config.new_nif, config.new_telemovel);

    expect(typeof fornecedor.id).toBe("object");
})

afterAll(async () => {
    const deleted = await Fornecedor.deleteOne(
        {_id: fornecedor}
    ).exec()

    const deleted_2 = await FornecedorHistorico.deleteOne(
        {_id: fornecedor}
    ).exec()

    const deleted_3 = await Utilizador.deleteOne(
        {_id: fornecedor}
    ).exec()

    const deleted_4 = await CategoriaGW.deleteById(categoria._id.toString())
    
    const deleted_5 = await SubCategoriaGW.deleteById(subcategoria._id.toString())

    const deleted_6 = await ProdutoGW.deleteById(produto._id.toString())

    const deleted_7 = await AtributoGW.deleteById(atributo._id.toString())

    const deleted_8 = await ProdutoHistorico.deleteOne(
        {_id: produto._id}
    ).exec()

    const deleted_9 = await ProdutoEspecificoGW.deleteById(produtoEspecifico._id.toString())

    const deleted_10 = await ProdutoEspecificoHistorico.deleteOne(
        {_id: produtoEspecifico._id}
    ).exec()

    if(deleted && deleted_2 && deleted_3 && deleted_4 && deleted_5 && deleted_6 && deleted_7 && deleted_8 && deleted_9 && deleted_10){
        Mongoose.connection.close()
    }
})

test("Criar Atributo", async () => {
    atributo = await AtributoGW.create(config.atributo_nome, config.atributo_descricao, config.atributo_valores)

    expect(typeof atributo).toBe("object");
    expect(typeof atributo._id).toBe("object");
    expect(atributo.nome).toBe(config.atributo_nome);
    expect(atributo.valido).toBe(true);
})

test("Criar Categoria", async () => {
    categoria = await CategoriaGW.create(config.categoria)

    expect(typeof categoria).toBe("object");
    expect(typeof categoria._id).toBe("object");
    expect(categoria.nome).toBe(config.categoria);
    expect(categoria.validado).toBe(true);
})

test("Criar Sub Categoria", async () => {
    subcategoria = await SubCategoriaGW.create(config.sub_categoria, categoria._id)

    expect(typeof subcategoria).toBe("object");
    expect(typeof subcategoria._id).toBe("object");
    expect(subcategoria.nome).toBe(config.sub_categoria);
    expect(subcategoria.validado).toBe(true);
})

test("Criar Produto", async () => {
    produto = await produto_handler.InsertProduct(fornecedor.toString(), config.produto, categoria._id.toString(), subcategoria._id.toString(), config.info_adicional)

    expect(typeof produto).toBe("object");
    expect(typeof produto._id).toBe("object");
    expect(produto.nome).toBe(config.produto);
    expect(produto.fornecedor).toStrictEqual(fornecedor);
    expect(produto.categoria).toStrictEqual(categoria._id);
    expect(produto.subcategoria).toStrictEqual(subcategoria._id);
})

test("Criar Produto Especifico", async () => {
    produtoEspecifico = await produto_handler.InsertNovoProdutoEspecifico(fornecedor.toString(), produto._id, config.produto_especifico_preco, [
        {
            "atributo": atributo._id.toString(),
            "valor": 'Valor Jest'
        }
    ])

    expect(typeof produtoEspecifico).toBe("object");
    expect(typeof produtoEspecifico._id).toBe("object");
    expect(produtoEspecifico.fornecedor).toStrictEqual(fornecedor);
    expect(produtoEspecifico.produto).toStrictEqual(produto._id);
    expect(produtoEspecifico.preco).toStrictEqual(config.produto_especifico_preco);
})

test("Update Produto Especifico", async () => {
    const result = await produto_handler.UpdateProdutoEspecifico(produtoEspecifico._id.toString(), config.produto_especifico_new_preco, null)

    expect(typeof result).toBe("object");
    expect(typeof result._id).toBe("object");
    expect(result.fornecedor).toStrictEqual(fornecedor);
    expect(result.preco).toStrictEqual(config.produto_especifico_new_preco);
})

test("GET Produto by Id", async () => {
    const result = await produto_handler.GetProdutoByID(produto._id.toString())

    expect(typeof result).toBe("object");
    expect(typeof result._id).toBe("object");
    expect(result.nome).toBe(config.produto);
    expect(result.fornecedor).toStrictEqual(fornecedor);
    expect(result.categoria).toStrictEqual(categoria._id);
    expect(result.subcategoria).toStrictEqual(subcategoria._id);
})

test("GET Produto by Fornecedor", async () => {
    const result = await produto_handler.GetProdutoByFornecedor(produto.fornecedor.toString())

    expect(typeof result).toBe("object");
})

test("GET Produto by Categoria", async () => {
    const result = await produto_handler.GetProdutoByCategoria(produto.categoria.toString())

    expect(typeof result).toBe("object");
})

test("GET Produto by SubCategoria", async () => {
    const result = await produto_handler.GetProdutoBySubCategoria(produto.subcategoria.toString())

    expect(typeof result).toBe("object");
})

test("GET Produto Especifico By Id", async () => {
    const result = await produto_handler.GetProdutoEspecificoByID(produtoEspecifico._id.toString())

    expect(typeof result).toBe("object");
    expect(typeof result._id).toBe("object");
    expect(result.fornecedor).toStrictEqual(fornecedor);
})

test("GET Produto Especifico By ProdutoId", async () => {
    const result = await produto_handler.GetEspecificosByProdutoID(produtoEspecifico.produto.toString())

    expect(typeof result).toBe("object");
})

test("GET Todos os especificos", async () => {
    const result = await produto_handler.GetAllEspecificos()

    expect(typeof result).toBe("object");
})