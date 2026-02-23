import React, { Component } from "react";
import "./HeaderPopUpFavorites.css";

import ReactDOM from "react-dom";

import HeaderShoppingCarLikeProduct from "../HeaderShoppingCarLikeProduct/HeaderShoppingCarLikeProduct";
import { getUserFavoriteProducts } from "../../../../../Helpers/UserHelper";
import { getCadeiaByProduto } from "../../../../../Helpers/ProdutoHelper";
import { verifyLoggedAndConsumidor } from "../../../../../Helpers/AuthVerification";
import { getSubCategoria } from "../../../../../Helpers/CategoryHelper";

class HeaderPopUpFavorites extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listaProdutos: this.props.listaProdutos,
      openLogin: this.props.openLogin,
    };
    this.myRef = React.createRef();
  }

  async addProdutos() {
    if (verifyLoggedAndConsumidor()) {
      let info = JSON.parse(localStorage.getItem("baylitInfo"));

      let produtos = await getUserFavoriteProducts(info.id, info.token);
      let allProducts = [];

      if (produtos != false) {
        for (let i = 0; i < produtos.length; i++) {
          let produtoId = produtos[i]._id;

          let produtoCadeia = await getCadeiaByProduto(produtos[i]._id);

          let subcategoria = await getSubCategoria(produtos[i].subcategoria)

          let nameP = produtos[i].nome;
          let subCategoryP = subcategoria.nome;
          //let rankSustainabilityP = produtos[i][2];
          let rankSustainabilityP = produtoCadeia.cadeia.rating;
          //let priceP = produtos[i][3];
          let priceP = produtos[i].preco;
          let promotionP;

          let fotografia = produtos[i].fotografia[0]

          // if (produtos[i].length > 4) {
          //   promotionP = produtos[i][4];
          // }

          allProducts.push(<div className="divLineCarHeader" />);
          allProducts.push(
            <div className="toAlignOneProductCarHeader">
              <HeaderShoppingCarLikeProduct
                produtoId={produtoId}
                srcProduct={fotografia}
                nameProduct={nameP}
                subCategoryProduct={subCategoryP}
                rankSuntainability={rankSustainabilityP}
                productPrice={priceP}
                productPromotion={promotionP}
              />
            </div>
          );
        }

        ReactDOM.render(allProducts, this.myRef.current);
      } else {
        let toAdd = [
          <h5 className="emptyFavoritesMsg">
            Não existem produtos nos favoritos
            <span>
              <a href="/shop">Adicionar produtos</a>
            </span>
          </h5>,
        ];
        ReactDOM.render(toAdd, this.myRef.current);
      }
    } else {
      let toAdd = [
        <h5 className="emptyFavoritesMsg">
          Apenas para utilizadores autenticados
        </h5>,
        <div
          className="emptyBtnLogin"
          onClick={() => {
            this.state.openLogin();
          }}
        >
          <span>Login</span>
        </div>,
      ];
      ReactDOM.render(toAdd, this.myRef.current);
    }

    //return allProducts;
  }

  async componentDidMount() {
    await this.addProdutos();
  }

  render() {
    return (
      <div className="mainPopUpFavorites">
        <h5>Favoritos</h5>

        <div ref={this.myRef} className="toAlignProductsFavoritesHeader">
          {}
        </div>

        <div className="divHeaderFavoritesToPage">
          <div className="connectionHoverBottomFavorites"></div>
          <div className="btnHeaderFavoritesToPage">
            <a href="/Perfil/Favoritos" className="btnHeaderFavoritesToPageText">
              Ir para os favoritos
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default HeaderPopUpFavorites;
