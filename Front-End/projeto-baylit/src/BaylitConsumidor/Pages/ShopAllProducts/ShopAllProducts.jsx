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

    // Fetch all subcategories in parallel instead of sequentially
    const subcategoriasAll = await Promise.all(
      categorias.map((cat) => getSubCategoriasByCategoria(cat._id))
    );

    let info = categorias.map((cat, i) => (
      <CategoryBlock
        key={cat._id}
        name={cat.nome}
        id={cat._id}
        subcategorias={subcategoriasAll[i]}
        fotografia={cat.fotografia}
      />
    ));

    ReactDOM.render(
      info,
      document.getElementsByClassName("gridCategoryBlocks")[0]
    );
  }

  componentDidMount() {
    this.appendInfo();
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
