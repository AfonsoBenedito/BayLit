import React, { Component } from "react";
import "./PromotionCard.css";

class PromotionCard extends Component {
  state = {
    nomeProduto: this.props.nomeProduto,
    srcPhotoProduto: this.props.srcPhotoProduto,
    dataInicio: this.props.dataInicio,
    dataFim: this.props.dataFim,
    backgroundCard: this.props.backgroundCard,
  };
  render() {
    return (
      <div className={"mainPromotionCard " + this.state.backgroundCard}>
        <div className="detailsProductDiscountCard">
          <div className="photoNameProductDiscount">
            <div className="photoProductDiscount"></div>
            <h4 className="nameProductDiscount">Nome do produtfesferewcdo</h4>
          </div>
          <i className="bi bi-three-dots"></i>
        </div>
        <hr />
        <div className="aboutPromotion">
          <div className="blockDatesPromotions">
            <p>Inicio</p>
            <h6>12/04/2022</h6>
            <p>Fim</p>
            <h6>12/04/2022</h6>
            <p>Acaba em</p>
            <div className="remainingTime">
              <i className="bi bi-clock-history"></i>
              <h5>48h</h5>
            </div>
          </div>
          <div className="blockPricePromotions">
            <p>Preço normal</p>
            <h6>150€</h6>
            <p>Preço final</p>
            <h6>125€</h6>
            <p>Desconto</p>
            <div className="remainingTime">
              <i className="bi bi-gift"></i>
              <h5>20%</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PromotionCard;
