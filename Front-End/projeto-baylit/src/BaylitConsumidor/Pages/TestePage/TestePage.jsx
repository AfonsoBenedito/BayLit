import React, { Component } from "react";

import {
  getCategorias,
  getSubCategoriasByCategoria,
  getSubCategoria,
  getAtributo,
} from "../../../Helpers/CategoryHelper";
import {
  getProduto,
  getProdutoEspecificoByProduto,
  getProdutoEspecifico,
  getProdutosByCategoria,
  getProdutosByFornecedor,
  pesquisa,
} from "../../../Helpers/ProdutoHelper";
import {
  adicionarProdutoAoCarrinho,
  adicionarUserFavoriteProduct,
  getUserById,
  getUserFavoriteProducts,
  getUserFavoriteUsers,
} from "../../../Helpers/UserHelper";

class TestePage extends Component {
  async componentDidMount() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    // let res = await getProduto("6287ed147d1f370bdd68a760")
    // console.log(res)

    // let res2 = await getProdutoEspecificoByProduto("6287ed147d1f370bdd68a760")
    // console.log(res2)

    // let res3 = await getProdutoEspecifico("6287ed437d1f370bdd68a776")
    // console.log(res3)

    // let res4 = await getProdutosByCategoria("6287c733374dd8165fe2221c");
    // console.log(res4)

    // let res5 = await getProdutosByFornecedor("6287c62f374dd8165fe22201");
    // console.log(res5)

    // let res6 = await getCategorias();
    // console.log(res6)

    // let res7 = await getSubCategoriasByCategoria("62a1287b70e8a2b163c3c21d");
    // console.log(res7)

    // let res8 = await getSubCategoria("62a1287b70e8a2b163c3c21f");
    // console.log(res8)

    // let res9 = await getAtributo("62a1287b70e8a2b163c3c221");
    // console.log(res9)

    //Em processo
    // let res10 = await getUserFavoriteUsers("6287c654374dd8165fe22211");
    // console.log(res10)

    //Em processo
    // let res11 = await getUserFavoriteProducts("6287c654374dd8165fe22211");
    // console.log(res11)

    // let res12 = await adicionarUserFavoriteProduct(info.id, info.token, "62b6c6ef30e5ee47b79ab3e2")
    // console.log(res12)

    // let res13 = await adicionarProdutoAoCarrinho(info.id, info.token, "62b6cd1e75b8ff5c812d4cd3", 2)
    // console.log(res13)

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

    let categoriaTeste = "62a1287b70e8a2b163c3c21d";
    let subcategoriaTeste = "62a1287b70e8a2b163c3c21f";
    let precoTeste = { valorMenor: 15, valorMaior: 22 };
    let ratingEcologicoTeste = 2;
    let nomeTeste = "XPTO";

    let filtrosTeste = [
      {
        atributo: "6287c8ed73ef9c703ff23fad",
        valores: ["Amarelo"],
      },
    ];

    // let res14 = await pesquisa(null, null, null, null, null, filtrosTeste);
    // console.log(res14);
  }

  render() {
    return <div> Isto é a pagina de teste</div>;
  }
}

export default TestePage;
