import React, { Component } from "react";
import ReactDOM from "react-dom";

import CategoryBlock from "./CategoryBlock/CategoryBlock";
import "./ShopAllProducts.css";

import {
  getCategorias,
  getSubCategoriasByCategoria,
} from "../../../Helpers/CategoryHelper";

class ShopAllProducts extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  async appendInfo() {
    let categorias = await getCategorias();

    let info = [];

    for (var i = 0; i < categorias.length; i++) {
      let subcategorias = await getSubCategoriasByCategoria(categorias[i]._id);

      info.push(
        <CategoryBlock
          name={categorias[i].nome}
          id={categorias[i]._id}
          subcategorias={subcategorias}
          fotografia={categorias[i].fotografia}
        />
      );
    }

    ReactDOM.render(
      info,
      document.getElementsByClassName("gridCategoryBlocks")[0]
    );
  }

  async componentDidMount() {
    await this.appendInfo();
  }
  render() {
    return (
      <>
        <h1 class="titleSectionShop">Categorias</h1>
        <div class="gridCategoryBlocks"></div>
      </>
    );
  }
}

export default ShopAllProducts;
