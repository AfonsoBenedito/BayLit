import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./HeaderPopUpCompare.css";

import ReactDom from "react-dom";

import { createRankSuntentabilidade } from "../../../../Components/LeafSVG";

import HeaderShoppingCarLikeProduct from "../HeaderShoppingCarLikeProduct/HeaderShoppingCarLikeProduct";
import { getUserFavoriteProducts } from "../../../../../Helpers/UserHelper";
import {
  getCadeiaByProduto,
  removeProdutoCompare,
} from "../../../../../Helpers/ProdutoHelper";
import { getSubCategoria } from "../../../../../Helpers/CategoryHelper";

class HeaderPopUpCompare extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listaProdutos: this.props.listaProdutos,
    };
    this.myRefProductsCompare = React.createRef();
  }

  async addProdutos() {
    let compareInfo;

    if (sessionStorage.getItem("baylitCompare")) {
      compareInfo = JSON.parse(sessionStorage.getItem("baylitCompare"));
    } else {
      compareInfo = {
        compareList: [],
      };

      sessionStorage.setItem("baylitCompare", JSON.stringify(compareInfo));
    }

    let listaComparacao = compareInfo.compareList;

    let produtosComparacao = [];

    for (let i = 0; i < listaComparacao.length; i++) {
      let cadeia = await getCadeiaByProduto(listaComparacao[i]);

      if (cadeia != false) {
        produtosComparacao.push(cadeia);
      }
    }

    if (produtosComparacao.length != 0) {
      let allProducts = [];

      for (let i = 0; i < produtosComparacao.length; i++) {
        let subcategoria = await getSubCategoria(
          produtosComparacao[i].subcategoria
        );

        allProducts.push(
          <div className="productComparePopUp">
            <div className="imageProductComparePopUp">
              <img src={produtosComparacao[i].fotografia[0]} alt="" loading="lazy" />
            </div>
            <div className="detailsProductComparePopUp">
              <h3>{produtosComparacao[i].nome}</h3>
              <h4>{subcategoria.nome}</h4>
              <span>
                {createRankSuntentabilidade(
                  Math.round(produtosComparacao[i].cadeia.rating)
                )}
              </span>
            </div>
            <div className="removeProductComparePopUp">
              <h4
                onClick={() => {
                  removeProdutoCompare(produtosComparacao[i]._id);
                  this.addProdutos();
                }}
              >
                Remover
              </h4>
            </div>
          </div>
        );
      }
      console.log(allProducts)

      ReactDOM.render(allProducts, this.myRefProductsCompare.current);
    } else {
      // console.log("Comparação Vazia");
      let toAdd = [
        <h5 className="emptyCompareMsg">
          Não existem produtos para comparar
          <span>
            <a href="/shop">Adicionar produtos</a>
          </span>
        </h5>,
      ];
      ReactDOM.render(toAdd, this.myRefProductsCompare.current);
    }
    // return allProducts;

  }

  async componentDidMount() {
    await this.addProdutos();
  }

  async componentWillUnmount(){
    this.myRefProductsCompare = "";
    this.state = "";
  }

  render() {
    return (
      <div className="mainPopUpCompare">
        <h5>Comparar</h5>

        <div
          ref={this.myRefProductsCompare}
          className="toAlignProductsCompareHeader"
        ></div>

        <div className="divHeaderCompareToPage">
          <div className="connectionHoverBottomCompare"></div>
          <div className="btnHeaderCompareToPage">
            <a href="/Compare" className="btnHeaderCompareToPageText">
              Comparar produtos
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default HeaderPopUpCompare;
