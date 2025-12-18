import React, { Component } from "react";
import ReactDOM from "react-dom";

import "./HeaderShopPopUp.css";
import {
  getCategorias,
  getSubCategoriasByCategoria,
} from "../../../../../Helpers/CategoryHelper";

class HeaderShopPopUp extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.myRef = React.createRef();
  }

  async addCategories() {
    let categories = await getCategorias();

    let allCategories = [];

    for (let i = 0; i < categories.length; i++) {
      // APENAS 14 CATEGORIAS, DEPOIS NÃO MOSTRAR
      // APENAS 9 SUB-CATEGORIAS, DEPOIS ADICIONAR O VER MAIS (CASO HAJA MAIS)
      let subcategories = await getSubCategoriasByCategoria(categories[i]._id);

      let listSubcategories = [];

      for (let k = 0; k < subcategories.length && k < 8; k++) {
        let href = "/Shop/" + categories[i]._id + "/" + subcategories[k]._id;

        listSubcategories.push(
          <a href={href}>
            <p>{subcategories[k].nome}</p>
          </a>
        );
      }

      allCategories.push(
        <div className="blockCategoryShopHeader">
          <a href={"/Shop/" + categories[i]._id} className="toLink">
            <h2>{categories[i].nome}</h2>
          </a>
          {listSubcategories}
          <a href="/Shop">
            <p className="showMoreSubCatetegoriesHeader">Ver mais</p>
          </a>
        </div>
      );
    }

    ReactDOM.render(allCategories, this.myRef.current);
  }

  async componentDidMount() {
    await this.addCategories();
  }

  render() {
    return <div ref={this.myRef} className="mainShopPopUp"></div>;
  }
}

export default HeaderShopPopUp;
