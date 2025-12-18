import React, { Component } from "react";
import { getSubCategoria } from "../../../Helpers/CategoryHelper";
import {
  getCadeiaByProduto,
  removeProdutoCompare,
} from "../../../Helpers/ProdutoHelper";

import { createRankSuntentabilidade, getLeaf } from "../../Components/LeafSVG";
import "./Compare.css";

import SadSmile from "../../Images/SadSmile.png";

import ReactDOM from "react-dom";

class Compare extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ratingGeral: [],
      ratingProducao: [],
      ratingArmazenamento: [],
      ratingTransporte: [],
      precos: [],
    };

    this.refCompareList = React.createRef();

    this.displayProductsCompare = this.displayProductsCompare.bind(this)
  }

  async displayProductsCompare() {
    let result = [];

    let compareList = JSON.parse(
      sessionStorage.getItem("baylitCompare")
    ).compareList;

    if (compareList.length != 0) {
      for (let i = 0; i < compareList.length; i++) {
        let cadeia = await getCadeiaByProduto(compareList[i]);

        console.log(cadeia);

        let subcategoria = await getSubCategoria(cadeia.subcategoria);

        let ratGeral = this.state.ratingGeral
        ratGeral.push(cadeia.cadeia.rating)

        let ratProducao = this.state.ratingProducao
        ratProducao.push(cadeia.cadeia.producao.classificacao)

        let ratArmazenamento = this.state.ratingArmazenamento
        ratArmazenamento.push(cadeia.cadeia.armazenamento.classificacao)

        let ratTransportes = this.state.ratingTransporte
        ratTransportes.push(cadeia.cadeia.transporte_armazem.classificacao)

        let pre = this.state.precos
        pre.push(cadeia.preco)

        this.setState({
          ratingGeral: ratGeral,
          ratingProducao: ratProducao,
          ratingArmazenamento: ratArmazenamento,
          ratingTransporte: ratTransportes,
          precos: pre,
        });

        result.push(
          <div className="lineCompare">
            
            <div className="compareCellProduct">
              <a href={"/Shop/Product/" + cadeia._id} className="toLink">
                <div className="blockImgCompareCell">
                  <img src={cadeia.fotografia[0]} />
                </div>
                <h3 className="nameProductCompareCell">
                  {cadeia.nome}
                  <span className="categoryProductCompareCell">
                    {subcategoria.nome}
                  </span>
                </h3>
              </a>
            </div>
            
            {/* Geral */}
            <div className="compareCell compareGeral">
              <h5 className="nivelCompareCell">
                {Math.round(cadeia.cadeia.rating)}{" "}
                <span className="leafCompare">{getLeaf()}</span>
                <br />
                <span className="ratingNivelCompare">
                  {createRankSuntentabilidade(Math.round(cadeia.cadeia.rating))}
                </span>
              </h5>
            </div>
            {/* Produção */}
            <div className="compareCell compareProducao">
              <h5 className="nivelCompareCell">
                {Math.round(cadeia.cadeia.producao.classificacao)}{" "}
                <span className="leafCompare">{getLeaf()}</span>
                <br />
                <span className="ratingNivelCompare">
                  {createRankSuntentabilidade(
                    Math.round(cadeia.cadeia.producao.classificacao)
                  )}
                </span>
              </h5>
            </div>
            {/* Armazenamento */}
            <div className="compareCell compareArmazenamento">
              <h5 className="nivelCompareCell">
                {Math.round(cadeia.cadeia.armazenamento.classificacao)}{" "}
                <span className="leafCompare">{getLeaf()}</span>
                <br />
                <span className="ratingNivelCompare">
                  {createRankSuntentabilidade(
                    Math.round(cadeia.cadeia.armazenamento.classificacao)
                  )}
                </span>
              </h5>
            </div>
            {/* Transporte */}
            <div className="compareCell compareTransporte">
              <h5 className="nivelCompareCell">
                {Math.round(cadeia.cadeia.transporte_armazem.classificacao)}{" "}
                <span className="leafCompare">{getLeaf()}</span>
                <br />
                <span className="ratingNivelCompare">
                  {createRankSuntentabilidade(
                    Math.round(cadeia.cadeia.transporte_armazem.classificacao)
                  )}
                </span>
              </h5>
            </div>
            {/* Preço */}
            <div className="compareCell comparePreco">
              <h5 className="nivelCompareCell">
                <span className="lastPriceCompareCell"></span> {cadeia.preco}
              </h5>
            </div>
            <div className="compareCell">
              <h6
                className="removeCompareCell"
                onClick={() => {
                  removeProdutoCompare(cadeia._id);
                  window.location.href = "/Compare"
                }}
              >
                Remover
              </h6>
            </div>
          </div>
        );
      }

      ReactDOM.render(result, this.refCompareList.current);
      // return result;

      this.verificarMelhor();
    } else {
      console.log("Página compare vazia");
      let listToAdd = []
      listToAdd.push(<div className="zeroCompareImageDiv"><img className="zeroCompareImage" src={SadSmile}></img></div>)
      listToAdd.push(<h5 className="zeroCompareText">Não tem produtos para comparar, tente adicionar!!</h5>)
      // return <div></div>
      // let vazio = <div>Tá vazia brodda</div>;

      ReactDOM.render(listToAdd, this.refCompareList.current);
    }
  }

  verificarMelhor() {
    let ratingGeralMaior = 0;
    let indexRatingGeral = 0;
    for (let i = 0; i < this.state.ratingGeral.length; i++) {
      if (this.state.ratingGeral[i] > ratingGeralMaior) {
        indexRatingGeral = i;
        ratingGeralMaior = this.state.ratingGeral[i];
      }
    }

    let ratingProducaoMaior = 0;
    let indexRatingProducao = 0;
    for (let i = 0; i < this.state.ratingProducao.length; i++) {
      if (this.state.ratingProducao[i] > ratingProducaoMaior) {
        indexRatingProducao = i;
        ratingProducaoMaior = this.state.ratingProducao[i];
      }
    }

    let ratingArmazenamentoMaior = 0;
    let indexRatingArmazenamento = 0;
    for (let i = 0; i < this.state.ratingArmazenamento.length; i++) {
      if (this.state.ratingArmazenamento[i] > ratingArmazenamentoMaior) {
        indexRatingArmazenamento = i;
        ratingArmazenamentoMaior = this.state.ratingArmazenamento[i];
      }
    }

    let ratingTransporteMaior = 0;
    let indexRatingTransporte = 0;
    for (let i = 0; i < this.state.ratingTransporte.length; i++) {
      if (this.state.ratingTransporte[i] > ratingTransporteMaior) {
        indexRatingTransporte = i;
        ratingTransporteMaior = this.state.ratingTransporte[i];
      }
    }

    let precoMenor = 10000000;
    let indexPreco = 0;
    for (let i = 0; i < this.state.precos.length; i++) {
      if (this.state.precos[i] < precoMenor) {
        indexPreco = i;
        precoMenor = this.state.precos[i];
      }
    }

    console.log(
      document.getElementsByClassName("compareGeral")[indexRatingGeral]
    );

    document.getElementsByClassName("compareGeral")[
      indexRatingGeral
    ].style.backgroundColor = "rgba(163, 233, 198, 0.5)";
    document.getElementsByClassName("compareProducao")[
      indexRatingProducao
    ].style.backgroundColor = "rgba(163, 233, 198, 0.4)";
    document.getElementsByClassName("compareArmazenamento")[
      indexRatingArmazenamento
    ].style.backgroundColor = "rgba(163, 233, 198, 0.5)";
    document.getElementsByClassName("compareTransporte")[
      indexRatingTransporte
    ].style.backgroundColor = "rgba(163, 233, 198, 0.4)";
    document.getElementsByClassName("comparePreco")[
      indexPreco
    ].style.backgroundColor = "rgba(163, 233, 198, 0.5)";
  }

  async componentDidMount() {
    await this.displayProductsCompare();
  }

  render() {
    return (
      <div className="mainCompare">
        <h2 className="mainTitleCompare">Comparar produtos</h2>
        <div className="compareBlock">
          <div className="headerCompare">
            <div className="compareCellHeader">
              <h2>Produto</h2>
            </div>
            <div className="compareCellHeader">
              <h2>Sustentabilidade</h2>
            </div>
            <div className="compareCellHeader">
              <h2>
                Sustentabilidade <br /> produção
              </h2>
            </div>
            <div className="compareCellHeader">
              <h2>
                Sustentabilidade <br /> armazenamento
              </h2>
            </div>
            <div className="compareCellHeader">
              <h2>
                Sustentabilidade <br /> transporte
              </h2>
            </div>
            <div className="compareCellHeader">
              <h2>Preço</h2>
            </div>
          </div>
          <div ref={this.refCompareList} className="displayProductsCompare">
            {/* {this.displayProductsCompare()} */}
          </div>
        </div>
        {/* <h2 className="mainTitleCompare">Guardados para comparar</h2> */}
      </div>
    );
  }
}

export default Compare;
