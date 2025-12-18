import React, { Component } from "react";
import "./TransportesCard.css";
import { Link } from "react-router-dom";

class ProductsCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      // nomeProduto: this.props.nomeProduto,
      // srcPhotoProduto: this.props.srcPhotoProduto,
      // dataInicio: this.props.dataInicio,
      // dataFim: this.props.dataFim,
      marca: this.props.marca,
      modelo: this.props.modelo,
      tipo: this.props.tipo,
      emissao: this.props.emissao,
      consumo: this.props.consumo,
      idTransporte: this.props.idTransporte,
      removeTransporte: this.props.removeTransporte,

      backgroundCard: this.props.backgroundCard,
  
      removeProduct: this.props.removeProduct,
    };
  }

  
  render() {
    return (
      <div className={"mainTransporteCard " + this.state.backgroundCard}>
        <div className="detailsTransporteCard">
          <div className="photoNameTransporte">
            <h4 className="nameProduct">{this.state.marca}</h4>
          </div>
          {/* <i className="bi bi-three-dots"></i> */}
          {/* <button className="employeeCardButton"> */}
          <i id={this.state.idTransporte} class="bi bi-x-circle closeProductCardButton"
          onClick={(e) => {
          this.state.removeTransporte(e);
          }}></i>
          {/* <p id="removeItemProductsCardA">{this.state.idClose}</p> */}
        </div>
        <hr />
        <div className="aboutPromotion">
          <div className="blockDatesPromotions">
            <p>Tipo</p>
            <h6>{this.state.tipo}</h6>
            <p>Emissao</p>
            <h6>{this.state.emissao}</h6>
            
          </div>
          <div className="blockPricePromotions">
            <p>Modelo</p>
            <h6>{this.state.modelo}</h6>
            <p>Consumo</p>
            <h6>{this.state.consumo}</h6>
            
          </div>
      </div>
    </div>
    );
  }
}

export default ProductsCard;
