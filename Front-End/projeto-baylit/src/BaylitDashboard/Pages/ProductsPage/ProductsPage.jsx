import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import ProductsDisplayer from "./ProductsDisplayer/ProductsDisplayer";
import ProductInserir from "./ProductInserir/ProductInserir";
import ProductsGerir from "./ProductsGerir/ProductsGerir";

import { AuthVerificationDashboard } from "../../../Helpers/AuthVerification";

import "./ProductsPage.css";

class ProductsPage extends Component {
  state = {};

  async componentDidMount() {
    await AuthVerificationDashboard();
  }

  render() {
    return (
      <div className="mainProductsPage">
        <div className="pathProducts">
          <a href="">Produtos</a>
          {/* <a href="">{">"} Inserir</a> */}
        </div>
        <Routes>
          <Route path="/" element={<ProductsDisplayer />} />
          <Route path="/:id/*" element={<ProductsGerir />} />
          <Route path="/inserir/*" element={<ProductInserir />} />
        </Routes>
      </div>
    );
  }
}

export default ProductsPage;
