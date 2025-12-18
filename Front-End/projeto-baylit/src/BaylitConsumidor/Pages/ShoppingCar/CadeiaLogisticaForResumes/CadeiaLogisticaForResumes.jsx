import React, { Component } from "react";

import "./CadeiaLogisticaForResumes.css";

import {
  getLeaf,
  createRankSuntentabilidade,
} from "../../../Components/LeafSVG";

class CadeiaLogisticaForResumes extends Component {
  constructor(props){
    super(props)

    this.state = {
      ratingProducao: this.props.Producao,
      ratingArmazenamento: this.props.Armazenamento,
      ratingTransporte: this.props.Transporte,
      ratingGeral: this.props.Geral
    }
  }
  

  render() {
    return (
      <div>
        <div className="resumeSustentabilidadeGeral">
          <div className="blocoResumeSustentabilidadeGeral">
            <h4>
              Sustentabilidade
              <br />
              <span className="cardTitleBold">produção</span>
            </h4>
            <h5>
              {this.state.ratingProducao}
              <span className="leaftGeralCard">{getLeaf()}</span>
            </h5>
            <span className="leaftRatingGeralCard">
              {createRankSuntentabilidade(Math.round(this.state.ratingProducao))}
            </span>
          </div>
          <div className="blocoResumeSustentabilidadeGeral">
            <h4>
              Sustentabilidade
              <br />
              <span className="cardTitleBold">armazenamento</span>
            </h4>
            <h5>
              {this.state.ratingArmazenamento}
              <span className="leaftGeralCard">{getLeaf()}</span>
            </h5>
            <span className="leaftRatingGeralCard">
              {createRankSuntentabilidade(Math.round(this.state.ratingArmazenamento))}
            </span>
          </div>
          <div className="blocoResumeSustentabilidadeGeral">
            <h4>
              Sustentabilidade
              <br />
              <span className="cardTitleBold">transporte</span>
            </h4>
            <h5>
              {this.state.ratingTransporte}
              <span className="leaftGeralCard">{getLeaf()}</span>
            </h5>
            <span className="leaftRatingGeralCard">
              {createRankSuntentabilidade(Math.round(this.state.ratingTransporte))}
            </span>
          </div>
        </div>
        <div className="ratingAllGeralResume">
          <span>{createRankSuntentabilidade(Math.round(this.state.ratingGeral))}</span>
          <h3>sustentabilidade geral do carrinho</h3>
        </div>
      </div>
    );
  }
}

export default CadeiaLogisticaForResumes;
