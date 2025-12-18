import React, { Component } from "react";
import { getCadeiaByProduto } from "../../../../../Helpers/ProdutoHelper";
import { getUserFavoriteProducts } from "../../../../../Helpers/UserHelper";
import Product from "../../../../Components/Product/Product";

import { getSubCategoria } from "../../../../../Helpers/CategoryHelper";

import ReactDOM from "react-dom";

import "./FavoritosPage.css";

class FavoritosPage extends Component {
  constructor(props) {
    super(props);

    this.refFavoritos = React.createRef();
  }

  async displayFavoritos() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let favoritos = await getUserFavoriteProducts(info.id, info.token);

    if (favoritos != false) {
      let produtosAppend = [];

      for (let i = 0; i < favoritos.length; i++) {
        let produto = await getCadeiaByProduto(favoritos[i]._id);

        let subcategoria = await getSubCategoria(produto.subcategoria);

        let produtoTemp = (
          <Product
            srcProduct={produto.fotografia[0]}
            nivelSustentabilidade={Math.round(produto.cadeia.rating)}
            nivelProducao={produto.cadeia.producao.classificacao}
            nivelArmazenamento={produto.cadeia.armazenamento.classificacao}
            nivelTransporte={Math.round(
              produto.cadeia.transporte_armazem.classificacao
            )}
            nomeProduto={produto.nome}
            categoriaProduto={subcategoria.nome}
            promocaoProduto={null}
            precoProduto={produto.preco + "€"}
            idProduto={produto._id}
          />
        );

        produtosAppend.push(produtoTemp);
      }

      ReactDOM.render(produtosAppend, this.refFavoritos.current);
    } else {
      console.log("Favoritos Vazios");
      let toAdd = [
        <h5 className="emptyFavoritesPage">
          Ainda não efetuas-te nenhuma encomenda.
          <span>
            <a href="">Adicionar produtos</a>
          </span>
        </h5>,
      ];
      ReactDOM.render(toAdd, this.refFavoritos.current);
    }
  }

  async componentDidMount() {
    await this.displayFavoritos();
  }

  render() {
    return (
      <div ref={this.refFavoritos} className="mainFavoritos">
        {/* <Product />
        <Product />
        <Product />
        <Product />
        <Product />
        <Product />
        <Product />
        <Product /> */}
      </div>
    );
  }
}

export default FavoritosPage;
