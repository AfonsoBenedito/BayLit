import React, { Component } from "react";
import { createRankSuntentabilidade } from "../../../Components/LeafSVG";

import "./EscolhaTransporte.css";

import ReactDOM from "react-dom";

import ResumeShoppingCar from "./../ResumeShoppingCar/ResumeShoppingCar";

import { useParams } from "react-router-dom";
import {
  criarEncomenda,
  getTransportesPossiveis,
} from "../../../../Helpers/EncomendasHelper";
import {
  getTransportador,
  getUsersShoppingCart,
} from "../../../../Helpers/UserHelper";
import { getLocalById } from "../../../../Helpers/ProdutoHelper";

import { verifyConsumidor } from "../../../../Helpers/AuthVerification";

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class EscolhaTransporte extends Component {
  constructor(props) {
    super(props);

    verifyConsumidor();

    let { idCarrinho, idLocal } = this.props.params;

    this.state = {
      idCarrinho: idCarrinho,
      idLocal: idLocal,
      idTransporteEscolhido: null,
    };

    this.refTransportes = React.createRef();

    this.changeTransporte = this.changeTransporte.bind(this);

    this.checkValidity = this.checkValidity.bind(this);
  }

  async checkLocalCarrinho() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let carrinho = await getUsersShoppingCart(info.id, info.token);

    let local = await getLocalById(info.id, info.token, this.state.idLocal);

    if (carrinho._id != this.state.idCarrinho || local == false) {
      window.location.href = "/";
    }
  }

  async displayTransportes() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));


    let transportes = await getTransportesPossiveis(
      info.id,
      info.token,
      this.state.idLocal
    );

    let htmlAppend = [];


    if (transportes != false) {
      for (let i = 0; i < transportes.length; i++) {
        let transporte = transportes[i];

        let nomeTransportador = transporte.transportador.nome;

        let transporteId = transporte.transporte;

        let dia = transporte.data.split(",")[0];

        let primeiro = true;

        if (i != 0) {
          primeiro = false;
        } else {
          this.setState({
            idTransporteEscolhido: transporteId,
          });
        }

        let html = (
          <label class="containerTransporteResume">
            <input
              type="radio"
              name="transporteResume"
              onChange={this.changeTransporte}
              defaultChecked={primeiro}
              value={transporteId}
            />
            <div class="checkmarkTransporteResume">
              <div className="radioLine">
                <h3>{nomeTransportador}</h3>
                <h3>{transporte.portes + "€"}</h3>
              </div>
              <div className="radioLine">
                <h4>{transporte.consumo_item} Litros/item</h4>
                <h4>{transporte.emissao_item} gramas CO2/item</h4>
              </div>
              <div className="radioLine">
                <div className="nivelSustentabilidadeTransporte">
                  {createRankSuntentabilidade(
                    Math.round(transporte.classificacao)
                  )}
                </div>
                <div className="tempoEntregaTransporteResume">
                  <h6>Entrega </h6>
                  <h5>{dia}</h5>
                </div>
              </div>
            </div>
          </label>
        );

        htmlAppend.push(html);
      }

      ReactDOM.render(htmlAppend, this.refTransportes.current);
    } else {
    }
  }

  changeTransporte(e) {
    let { value } = e.target;

    this.setState({
      idTransporteEscolhido: value,
    });
  }

  async checkValidity() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let id_consumidor = info.id;

    let id_local = this.state.idLocal;
    let id_transporte = this.state.idTransporteEscolhido;

    let res = await criarEncomenda(
      info.token,
      id_consumidor,
      id_local,
      id_transporte
    );

    if (res != false) {
      let encomendaId = res._id;
      window.location.href =
        "/ShoppingCar/" +
        this.state.idCarrinho +
        "/" +
        this.state.idLocal +
        "/" +
        this.state.idTransporteEscolhido +
        "/" +
        encomendaId;
    } else {
      //DISPLAY DE ERRO AO CRIAR A ENCOMENDA
    }
  }

  async componentDidMount() {
    this.checkLocalCarrinho();
    this.displayTransportes();
  }

  render() {
    return (
      <div className="blocoGeralarrinho">
        <div className="blockCarAllSections">
          <h2 className="titleBlockGridShoppingCar">Escolhe o transporte</h2>
          <div ref={this.refTransportes} className="blocoDadosEntrega"></div>
          {/* <button onClick={() => {this.checkValidity()}}>Continuar</button> */}
        </div>
        <div id="blockResume">
          <h2 className="titleBlockGridShoppingCar">Resumo</h2>
          <ResumeShoppingCar
            page="transportes"
            idCarrinho={this.state.idCarrinho}
            paginaSeguinte={this.checkValidity}
          />
        </div>
      </div>
    );
  }
}

export default withParams(EscolhaTransporte);
