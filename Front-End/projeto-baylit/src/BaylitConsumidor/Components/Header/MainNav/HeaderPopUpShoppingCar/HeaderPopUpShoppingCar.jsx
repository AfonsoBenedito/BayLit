import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./HeaderPopUpShoppingCar.css";

import HeaderShoppingCarLikeProduct from "../HeaderShoppingCarLikeProduct/HeaderShoppingCarLikeProduct";

import { getUsersShoppingCart } from "../../../../../Helpers/UserHelper";
import {
  getCadeiaByProduto,
  adicionarPrecoAoResultUnico,
  getProduto,
  getPrecoDoProduto,
} from "../../../../../Helpers/ProdutoHelper";
import { getSubCategoria } from "../../../../../Helpers/CategoryHelper";

class HeaderPopUpShoppingCar extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
  }

  async addProdutos() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let carrinho = await getUsersShoppingCart(info.id, info.token);

    // console.log(carrinho)

    if (carrinho != false) {
      let allProducts = [];

      for (let i = 0; i < carrinho.produtos.length; i++) {
        let produto = await getCadeiaByProduto(
          carrinho.produtos[i].produto.produto
        );

        // console.log(produto);
        // console.log(produto.preco)

        let nameP = produto.nome;
        let subCategoryP = await getSubCategoria(produto.subcategoria);
        let rankSustainabilityP = produto.cadeia.rating;
        let priceP = produto.preco;
        let promotionP;

        // if (carrinho.produtos.length > 4) {
        //   promotionP = this.state.listaProdutos[i][4];
        // }

        allProducts.push(<div className="divLineCarHeader" />);
        allProducts.push(
          <div className="toAlignOneproductCarHeader">
            <HeaderShoppingCarLikeProduct
              srcProduct={produto.fotografia[0]}
              nameProduct={nameP}
              subCategoryProduct={subCategoryP.nome}
              rankSuntainability={rankSustainabilityP}
              productPrice={priceP}
              productPromotion={promotionP}
            />
          </div>
        );
      }

      ReactDOM.render(allProducts, this.myRef.current);
    } else {
      //Adicionar Default de Carrinho
      console.log("Carrinho Vazio");
      let toAdd = [
        <h5 className="emptyCarMsg">
          Não existem produtos no carrinho
          <span>
            <a href="/shop">Adicionar produtos</a>
          </span>
        </h5>,
      ];
      ReactDOM.render(toAdd, this.myRef.current);
    }
  }

  async componentDidMount() {
    // console.log("Montou");
    await this.addProdutos();
  }

  render() {
    return (
      <div className="mainPopUpShoppingCar">
        <h5>Carrinho</h5>

        <div ref={this.myRef} className="toAlignProductsCarHeader"></div>

        <div className="divHeaderCarToPage">
          <div className="connectionHoverBottom"></div>
          <div className="btnHeaderCarToPage">
            <a href="/ShoppingCar" className="btnHeaderCarToPageText">Ir para o carrinho</a>
          </div>
          <div className="btnHeaderCarToBuy">
            <a href="/ShoppingCar" className="btnHeaderCarToBuyText">Finalizar compra</a>
          </div>
        </div>
      </div>
    );
  }
}

export default HeaderPopUpShoppingCar;
