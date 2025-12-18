import React, { Component } from "react";

import { getLeaf } from "../../../LeafSVG";

import "./HeaderShoppingCarLikeProduct.css";

class HeaderShoppingCarLikeProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nameProduct: this.props.nameProduct,
      subCategoryProduct: this.props.subCategoryProduct,
      rankSuntainability: this.props.rankSuntainability,

      productPrice: this.props.productPrice,
      productPromotion: this.props.productPromotion,
      srcProduct: this.props.srcProduct,

      produtoId: this.props.produtoId
    };
  }

  createRankSuntentabilidade(numLeafs) {
    let leafs = [];
    let cor;

    if (numLeafs > 3) {
      // verde
      cor = "rgb(50, 143, 94)";
    } else if (numLeafs == 3) {
      // amarelo
      cor = "rgb(206, 169, 21)";
    } else if (numLeafs < 3) {
      // vermelho
      cor = "rgb(206, 58, 21)";
    }

    for (let i = 0; i < numLeafs; i++) {
      leafs.push(getLeaf(cor));
    }

    return leafs;
  }

  createPromotion() {
    if (this.state.productPromotion) {
      return <h6>{this.state.productPromotion} €</h6>;
    }
  }

  render() {
    return (
      <a className="toLink" href={"/Shop/Product/"+this.state.produtoId}>
      <div className="mainProductCarLiked">
        <div className="leftDetailsProductsHeader">
          <div className="divImgProductHeader"><img src={this.state.srcProduct} loading="lazy" alt={this.state.nomeProduto} /></div>
          <div className="divDetailsProductHeader">
            <h3>{this.state.nameProduct}</h3>
            <h4>{this.state.subCategoryProduct}</h4>
            <div className="productHeaderleafSVG">
              {this.createRankSuntentabilidade(this.state.rankSuntainability)}
            </div>
          </div>
        </div>
        <div className="rightDetailsProductsHeader">
          <div className="toAlignPrices">
            <h3 className="mainPriceProductHeader">
              {this.state.productPrice} <span>€</span>
            </h3>
            {this.createPromotion()}
          </div>
        </div>
      </div>
      </a>
    );
  }
}

export default HeaderShoppingCarLikeProduct;
