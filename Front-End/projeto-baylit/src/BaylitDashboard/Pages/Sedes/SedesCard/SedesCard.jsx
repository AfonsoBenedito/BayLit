import React, { Component } from "react";
import "./SedesCard.css";
import { Link } from "react-router-dom";

class WarehouseCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      // nomeProduto: this.props.nomeProduto,
      // srcPhotoProduto: this.props.srcPhotoProduto,
      // dataInicio: this.props.dataInicio,
      // dataFim: this.props.dataFim,
      morada: this.props.morada,
      cod_postal: this.props.cod_postal,
      armazemId: this.props.armazemId,
      localidade: this.props.localidade,
      pais: this.props.pais,
      backgroundCard: this.props.backgroundCard,
  
      removeWarehouse: this.props.removeWarehouse,
    };
  }
  
  render() {
    return (
      <div className={"mainPromotionCard " + this.state.backgroundCard}>
        <div className="detailsWarehouseDiscountCard">
          
          <div className="photoNameWarehouse">
            <i className="bi bi-building buildIcon"></i>
            <h4 className="nameWarehouseP">{this.state.localidade}</h4>
          </div>
          
        </div>
        <hr />
        <div className="aboutPromotion">
          <div className="blockDatesPromotions">
            <p>{this.state.pais}, {this.state.localidade}</p>
            <p>{this.state.morada}, {this.state.cod_postal}</p>
          </div>
          <div className="blockPricePromotions">
            {/* <p>Hora de entrada</p>
            <h6>8:00h</h6> */}
            {/* <p>Hora de saída</p>
            <h6>17:00h</h6> */}
            {/* <p>Salário</p> */}
            <div className="remainingTime">
              {/* <i className="bi bi-building"></i>
              <h5>{this.state.localizacao}</h5> */}
            {/* <i class="bi bi-bank"></i>
              <h5>{this.props.salario}</h5> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WarehouseCard;
