import React, { Component } from "react";

import "./MetodosPagamento.css";

import ResumeShoppingCar from "./../ResumeShoppingCar/ResumeShoppingCar";

import { useParams } from "react-router-dom";

import apiInfo from "../../../../apiInfo.json";

import { verifyConsumidor } from "../../../../Helpers/AuthVerification";

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class MetodosPagamento extends Component {
  constructor(props) {
    super(props);

    verifyConsumidor();

    let { idCarrinho, idLocal, idTransporte, idEncomenda } = this.props.params;

    this.state = {
      idCarrinho: idCarrinho,
      idLocal: idLocal,
      idTransporteEscolhido: idTransporte,
      idEncomenda: idEncomenda,
    };
  }

  async pagar() {

    await fetch(apiInfo.apiLink + "/utilizador/checkout-stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        encomenda: this.state.idEncomenda,
      }),
    })
      .then((response) => response.json())
      .then((data) => {

        window.location.href = data.url;
      });
  }

  render() {
    return (
      <div className="bodyPagamento">
        {/* <div className="mainMetodosPagamento"></div> */}
        <div id="blockResume">
          <h2 className="titleBlockGridShoppingCar">Resumo</h2>
          <ResumeShoppingCar
            page="pagamento"
            idCarrinho={this.state.idCarrinho}
            idTransporte={this.state.idTransporteEscolhido}
            verifyIfPagamento="pagamento"
          />
        </div>
        {/* <div clas></div> */}
        <div
          className="pagarCarrinhoBtn"
          onClick={async () => {
            await this.pagar();
          }}
        >
          <span>Efetuar pagamento</span>
        </div>
      </div>
    );
  }
}

export default withParams(MetodosPagamento);
