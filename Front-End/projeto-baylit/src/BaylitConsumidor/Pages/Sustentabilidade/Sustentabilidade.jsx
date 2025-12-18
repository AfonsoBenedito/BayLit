import React, { Component } from "react";
import HistoriaBlocoProduto from "./HistoriaBloco/HistoriaBlocoProduto";
import HistoriaBlocoTransporte from "./HistoriaBloco/HistoriaBlocoTransporte";

import Paragraph1 from "../../Images/SustentabilidadeImages/paragraph1.jpg";
import Paragraph2 from "../../Images/SustentabilidadeImages/paragraph2.jpg";

import "./Sustentabilidade.css";

class Sustentabilidade extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="mainSustentabilidade">
        <h1 className="titleSustentabilidade">Sustentabilidade</h1>
        <div className="paragraphSustentabilidade">
          <h2>O que é sutentabilidade?</h2>
          <p>
            Sustentabilidade é um conceito relacionado ao desenvolvimento
            sustentável, ou seja, formado por um conjunto de ideias, estratégias
            e demais atitudes ecologicamente corretas, economicamente viáveis,
            socialmente justas e culturalmente diversas. A sustentabilidade
            serve como alternativa para garantir a sobrevivência dos recursos
            naturais do planeta, ao mesmo tempo que permite aos seres humanos e
            sociedades soluções ecológicas de desenvolvimento. Assim a Baylit
            tem como objetivo garantir a gestão sustentável, ou seja, valorizar
            todos os fatores que são diretamente ligados ao meio ambiente.
          </p>
          <div className="blocoImageSustentabilidade">
            <img src={Paragraph1} alt="" />
          </div>
        </div>
        <div className="paragraphSustentabilidade">
          <h2>Como é avaliada a sustentabilidade Baylit?</h2>
          <p>
            A sustentabilidade Baylit é medida através de um índice que pode
            variar de 1 a 5 , desde o menos sustentável ao mais sustentável.
            Temos em conta inúmeros fatores para calcular este índice como o
            transporte de um produto do seu local de produção até ao armazém
            onde fica armazenado até à sua compra, a poluição gerada na produção
            do produto, entre outros. Assim, cada produto tem associado a si um
            indice de sustentabilidade Baylit ao nível da produção,
            armazenamento e transporte que poderá ser um fator determinante na
            compra do produto.
          </p>
          <div className="blocoImageSustentabilidade">
            <img src={Paragraph2} alt="" />
          </div>
        </div>
        <h2 className="titulosIsoldadosSustentabilidade">
          Nível de sustentabilidade de um produto
        </h2>
        <div className="blockSustentabilidadeProduto">
          <h3 className="titleBlockHistoria">Produto</h3>
          <HistoriaBlocoProduto />
          <h3 className="titleBlockHistoria">Sustentabilidade</h3>
        </div>
        {/*<h2 className="titulosIsoldadosSustentabilidade">
          Nível de sustentabilidade de um transporte
        </h2>
         <div className="blockSustentabilidadeProduto">
          <h3 className="titleBlockHistoria">Transporte</h3>
          <HistoriaBlocoTransporte />
          <h3 className="titleBlockHistoria">Sustentabilidade</h3>
        </div> */}
      </div>
    );
  }
}

export default Sustentabilidade;
