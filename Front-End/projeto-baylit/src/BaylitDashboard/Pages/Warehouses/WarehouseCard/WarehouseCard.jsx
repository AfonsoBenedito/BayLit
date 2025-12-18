import React, { Component } from "react";
import "./WarehouseCard.css";
import { Link } from "react-router-dom";

class WarehouseCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // nomeProduto: this.props.nomeProduto,
      // srcPhotoProduto: this.props.srcPhotoProduto,
      // dataInicio: this.props.dataInicio,
      // dataFim: this.props.dataFim,
      armazemId: this.props.armazemId,
      localizacao: this.props.localizacao,
      tamanho: this.props.tamanho,
      gasto: this.props.gasto,
      pais: this.props.pais,
      backgroundCard: this.props.backgroundCard,
      idClose: this.props.idClose,

      removeWarehouse: this.props.removeWarehouse,
    };
  }

  render() {
    return (
      <div className={"mainWarehouseCard " + this.state.backgroundCard}>
        <div className="detailsWarehouseDiscountCard">
          <a href={"/dashboard/Warehouses/" + this.state.armazemId}>
            <div className="photoNameWarehouse">
              {/* {this.state.srcPhotoProduto} */}
              {/* <i className="bi bi-building buildIcon"></i> */}
              <h4 className="nameWarehouseP">{this.state.pais}</h4>
            </div>
          </a>
          {/* <i className="bi bi-three-dots"></i> */}
          {/* <button className="employeeCardButton"> */}
          <i
            id={this.state.idClose}
            class="bi bi-x-circle closeProductCardButton"
            onClick={(e) => {
              this.state.removeWarehouse(e);
            }}
          ></i>
        </div>
        <hr />
        <div className="aboutWarehouse">
          <div className="blockDatesPromotions">
            <p>Tamanho</p>
            <h6>{this.state.tamanho}</h6>
            <p>Gasto Diário</p>
            <h6>{this.state.gasto}</h6>
            <p>Localização</p>
            <div className="remainingTime">
              <i className="bi bi-building"></i>
              <h5>{this.state.localizacao}</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WarehouseCard;
