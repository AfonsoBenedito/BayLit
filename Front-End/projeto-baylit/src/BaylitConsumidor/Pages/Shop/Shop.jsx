import React, { Component } from "react";
import { Link, Routes, Route } from "react-router-dom";

import ShopAllProducts from "../ShopAllProducts/ShopAllProducts";
import ShopCategory from "../ShopCategory/ShopCategory";
import ProductPage from "../ProductPage/ProductPage";

import "./Shop.css";

class Shop extends Component {
  render() {
    return (
      <div className="mainContentShop">
        <div id="pathContentShop">
          {/* <span>
            <i id="arrowButtonBackPathShop" class="bi bi-arrow-90deg-left"></i>
            <span id="buttonBackPathShop">Voltar</span>
          </span> */}
          <span>
            {/* <Link to="/Shop" className="toLink">
              Loja
            </Link> */}
            <a href="/Shop" className="toLink">
              {" "}
              Loja{" "}
            </a>
          </span>
          <span id="categoryPath"></span>
          <span id="subCategoryPath"></span>
          <span id="productPath"></span>
        </div>
        <Routes>
          <Route path="/" element={<ShopAllProducts />} />
          <Route path="/:categoryId" element={<ShopCategory />} />
          <Route
            path="/:categoryId/:subcategoryId"
            element={<ShopCategory />}
          />
          <Route
            exact
            path="/product/:productId"
            element={<ProductPage />}
          ></Route>
        </Routes>
        {/* <ShopAllProducts /> */}
        {/* <ShopCategory /> */}
        {/* <h1 class="titleSectionShop">Produtos</h1>
        <div class="gridCategoryBlocks">
        </div> */}

        {/* <h1 class="titleSectionShop">Nome do Produto</h1>
        <ProductPage /> */}
      </div>
    );
  }
}

export default Shop;
