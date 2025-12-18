import React, { Component } from "react";
import "./ResumeShoppingCar.css";

import {
  getLeaf,
  createRankSuntentabilidade,
} from "../../../../Components/LeafSVG";
import CadeiaLogisticaForResumes from "../../CadeiaLogisticaForResumes/CadeiaLogisticaForResumes";

class ResumeShoppingCar extends Component {
  state = {};

  createTransportes() {
    let result = [];

    for (let i = 0; i < 8; i++) {
      result.push(
        <label class="containerTransporteResume">
          <input type="radio" name="transporteResume" />
          <div class="checkmarkTransporteResume">
            <div className="radioLine">
              <h3>Nome Transporte carro</h3>
              <h3>3.5€</h3>
            </div>
            <div className="radioLine">
              <h4>Empresa</h4>
            </div>
            <div className="radioLine">
              <div className="nivelSustentabilidadeTransporte">
                {createRankSuntentabilidade(3)}
              </div>
              <div className="tempoEntregaTransporteResume">
                <h6>Entrega em</h6>
                <h5>4 dias</h5>
              </div>
            </div>
          </div>
        </label>
      );
    }

    return result;
  }
  render() {
    return (
      <div className="mainResumeShoppingCar">
        <div className="lineTwoArguments">
          <h5>
            Carrinho <span>(2)</span>
          </h5>
          <h5>
            <span className="lastPrice">800€ /total</span> 720€{" "}
            <span className="totalExtension">/total</span>
          </h5>
        </div>
        <div className="divLineResume" />

        <div className="lineOneArgument">
          {/*  */}
          <CadeiaLogisticaForResumes />
        </div>

        <div className="divLineResume" />
        <div className="lineOneArgument">
          <p>
            Escolhe a empresa que pretendes para transporte dos teus produtos.
            <br />
            Faz uma escolha consciente. Pensa no mundo.
            <br />
            A cada transporte está associado um nível de sustentabilidade de
            transporte segundo a escala de sustentabilidade Baylit.
            <br />
            <span className="escalaResumo">Ver escala</span>
          </p>
        </div>
        {/* <div className="blocoTransportesResume">{this.createTransportes()}</div> */}

        <div className="lineTwoArguments">
          <h5>Total produtos</h5>
          <h5>800€</h5>
        </div>

        <div className="lineTwoArguments lineDescontos">
          <h5>Descontos</h5>
          <h5>80€</h5>
        </div>

        <div className="lineTwoArguments">
          <h5>Preço</h5>
          <h5>720€</h5>
        </div>

        <div className="finalizarCompraResume">
          <span>Seguinte</span>
        </div>
      </div>
    );
  }
}

export default ResumeShoppingCar;
