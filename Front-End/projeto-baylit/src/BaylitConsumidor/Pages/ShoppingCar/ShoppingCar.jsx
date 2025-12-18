import React, { Component } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./ShoppingCar.css";

import PathShoppingCar from "./PathShoppingCar/PathShoppingCar";
import Carrinho from "./Carrinho/Carrinho";
import DadosEntrega from "./DadosEntrega/DadosEntrega";
import MetodosPagamento from "./MetodosPagamento/MetodosPagamento";
import ResumeShoppingCar from "./ResumeShoppingCar/ResumeShoppingCar";
import EscolhaTransporte from "./EscolhaTransporte/EscolhaTransporte";

class ShoppingCar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      estado: 1,
    };
  }

  // changeEstadoPath = (estado) => {
  //   this.setState({ estado: estado });
  // };

  // componentDidMount() {
  //   console.log("dewe");
  //   this.changeEstadoPath(2);
  // }

  render() {
    return (
      <div className="mainContentShoppingCar">
        <PathShoppingCar estado={this.state.estado} />

        {/* <div className="blocoGeralAllCarrinho"> */}
        <Routes>
          {/* SE ALTERAR /ROUTES -> ALTERAR IF's DO PATHSHOPPINGCAR.JSX  */}
          <Route path="/" element={<Carrinho />}></Route>
          <Route path="/:idCarrinho" element={<DadosEntrega />}></Route>
          <Route
            path="/:idCarrinho/:idLocal"
            element={<EscolhaTransporte />}
          ></Route>
          <Route
            path="/:idCarrinho/:idLocal/:idTransporte/:idEncomenda"
            element={<MetodosPagamento />}
          ></Route>
          <Route path="/*" element={<Navigate to="/shoppingcar" />}></Route>
        </Routes>

        {/* <div id="blockResume">
            <h2 className="titleBlockGridShoppingCar">Resumo</h2>
            <ResumeShoppingCar />
          </div> */}
        {/* </div> */}
      </div>
    );
  }
}

export default ShoppingCar;
