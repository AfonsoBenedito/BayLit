import React, { Component } from "react";
import ExpandButton from "../../../Components/ExpandButton/ExpandButton";
import "./Promotions.css";
import DetailsButton from "./DetailsButton/DetailsButton";
import PromotionCard from "./PromotionCard/PromotionCard";

class Promotions extends Component {
  state = {};

  expandPromotions() {
    document.getElementById("promotionsCardsBlock").style.maxHeight = "none";
    document.getElementById("expandButtonPromotions").style.display = "none";
    document.getElementById("minimizeButtonPromotions").style.display =
      "initial";
  }

  minimizePromotions() {
    document.getElementById("promotionsCardsBlock").style.maxHeight = "200px";
    document.getElementById("minimizeButtonPromotions").style.display = "none";
    document.getElementById("expandButtonPromotions").style.display = "initial";
  }
  
  render() {
    return (
      <div className="mainPromotions">
        <div className="promotionsNavDetails">
          <h3>Promoções</h3>
          <div class="detailsAboutPromotions">
            <DetailsButton name="Todas" />
            <DetailsButton colorCircle="rgb(37, 91, 69)" name="Atuais" />
            <DetailsButton colorCircle="rgb(58, 132, 135)" name="Próximas" />
            <DetailsButton colorCircle="rgb(80, 67, 64)" name="Terminadas" />
            <DetailsButton colorCircle="rgb(143, 59, 59)" name="Canceladas" />
            <DetailsButton name="Adiconar Promoção" />
          </div>
        </div>
        <div id="promotionsCardsBlock">
          <PromotionCard backgroundCard="promotionAtive" />
          <PromotionCard backgroundCard="promotionNext" />
          <PromotionCard backgroundCard="promotionFinished" />
          <PromotionCard backgroundCard="promotionCanceled" />
          <PromotionCard backgroundCard="promotionCanceled" />
        </div>
        <ExpandButton
          id="expandButtonPromotions"
          name="Expandir"
          theme="light"
          expandMinimizePromotions={this.expandPromotions}
        />
        <ExpandButton
          id="minimizeButtonPromotions"
          name="Minimizar"
          theme="light"
          expandMinimizePromotions={this.minimizePromotions}
        />
      </div>
    );
  }
}

export default Promotions;
