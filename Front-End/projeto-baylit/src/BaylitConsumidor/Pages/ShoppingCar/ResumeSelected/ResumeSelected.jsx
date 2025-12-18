import React, { Component } from "react";

import "./ResumeSelected.css";

import { createRankSuntentabilidade } from "../../../Components/LeafSVG";
import CadeiaLogisticaForResumes from "../CadeiaLogisticaForResumes/CadeiaLogisticaForResumes";

class ResumeSelected extends Component {
  constructor(props) {
    super(props);
  }

  createProducts = () => {
    let result = [];

    for (let i = 0; i < 3; i++) {
      result.push(
        <div className="productResumeSelected">
          <div className="leftBlockProductResumeSelected">
            <div className="blocoImgProductResumeSelected"></div>
            <div className="detailsProductResumeSelected">
              <div className="toAlignDetailsProductResumeSelected">
                <h3>Nome produto kjsgdksagdkjw eadlhfewjkfe bjfacljdhvj</h3>
                <h4>Quantidade 2</h4>
                <h4>
                  <span>L</span> <span>Azul</span>
                </h4>
                <div className="ratingProductResumeSelected">
                  {createRankSuntentabilidade(4)}
                </div>
              </div>
            </div>
          </div>
          <div className="rightBlockProductResumeSelected">
            <span className="editarProductResumeSelected">editar</span>
            <h5>
              <span>400€</span>
              <br />
              300€
            </h5>
          </div>
        </div>
      );
    }

    return result;
  };

  render() {
    return (
      <div className="mainResumeSelected">
        <h2 className="titleMainResume">Resume</h2>
        <div className="lineDivResumeSelected" />
        <CadeiaLogisticaForResumes />
        <div className="lineDivResumeSelected" />
        <div className="displayProductsResumeSelected">
          {this.createProducts()}
        </div>
        <div className="lineDivResumeSelected" />
        <div className="priceResumeSelected">
          <h5>Envio</h5>
          <h5>10€</h5>
        </div>
        <div className="priceResumeSelected">
          <h5>Itens</h5>
          <h5>100€</h5>
        </div>
        <div className="lineDivResumeSelected" />
        <div className="priceResumeSelected">
          <h4>Valor total</h4>
          <h4>110€</h4>
        </div>
      </div>
    );
  }
}

export default ResumeSelected;
