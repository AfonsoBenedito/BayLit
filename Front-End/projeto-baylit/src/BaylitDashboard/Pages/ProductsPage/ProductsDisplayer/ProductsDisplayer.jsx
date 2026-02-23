import React, { Component } from "react";
import ReactDOM from "react-dom";
import { getSubCategoria } from "../../../../Helpers/CategoryHelper";
import { getProdutosByFornecedor } from "../../../../Helpers/ProdutoHelper";

import "./ProductsDisplayer.css";

class ProductsDisplayer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.myRefDisplayer = React.createRef();
  }

  async createProducts(){
    let info = JSON.parse(localStorage.getItem('baylitInfo'))

    let result = [];

    let produtos = await getProdutosByFornecedor(info.id)

    for (let i = 0; i < produtos.length; i++) {

      let subcategoria = await getSubCategoria(produtos[i].subcategoria)

      result.push(
        <div className="productFornecedor">
          <div className="cellProductFornecedor">
            <img src={produtos[i].fotografia[0]} alt="" />
          </div>
          <div className="cellProductFornecedor">
            <h3>{produtos[i].nome}</h3>
            <h6>{subcategoria.nome}</h6>
            <h6 className="priceProductFornecedor">Preço</h6>
            <h4>{produtos[i].preco}€</h4>
          </div>
          <a href={"/Dashboard/Products/" + produtos[i]._id} className="toLink">
            <div className="cellProductFornecedor">
              <h5 className="btnGerirProdutoFornecedor">Gerir Inventário</h5>
            </div>
          </a>
        </div>
      );
    }


    ReactDOM.render(result, this.myRefDisplayer.current);
  };

  async componentDidMount() {

    await this.createProducts()
    
  }

  render() {
    return (
      <div className="mainProductsDisplayer">
        <div className="lineOfDisplayerProducts">
          <h1>Produtos </h1>
          <a href="/Dashboard/Products/Inserir" className="toLink">
          <h5 className="btnAddProduct">
            <span>+</span> Adicionar produto
          </h5>
          </a>
        </div>
        <div ref={this.myRefDisplayer} className="displayerProductsBlock"></div>
      </div>
    );
  }
}

export default ProductsDisplayer;
