import React, { Component } from "react";

import "./DadosEntrega.css";

import ReactDOM from "react-dom";
import {
  getLocaisUtilizador,
  getUsersShoppingCart,
} from "../../../../Helpers/UserHelper";
import { adicionarLocal } from "../../../../Helpers/FornecedorHelper";

import { useParams } from "react-router-dom";

import ResumeShoppingCar from "./../ResumeShoppingCar/ResumeShoppingCar";

import {verifyConsumidor} from "../../../../Helpers/AuthVerification"

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class DadosEntrega extends Component {
  constructor(props) {
    super(props);

    verifyConsumidor()

    let { idCarrinho } = this.props.params;

    this.state = {
      idCarrinho: idCarrinho,
      localValue: "novoLocal",
      idLocalEntrega: null,
    };

    this.refLocais = React.createRef();
    this.refPais = React.createRef();
    this.refLocalidade = React.createRef();
    this.refMorada = React.createRef();
    this.refCodigo = React.createRef();

    this.changeLocalValue = this.changeLocalValue.bind(this);
    this.checkValidity = this.checkValidity.bind(this);
  }

  async checkCarrinho() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let carrinho = await getUsersShoppingCart(info.id, info.token);

    if (carrinho._id != this.state.idCarrinho) {
      window.location.href = "/";
    }
  }

  checkIfFirst(index) {
    if (index == 0) {
      return true;
    } else {
      return false;
    }
  }

  async displayBlocoLocais() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let locaisBusca = await getLocaisUtilizador(info.id, info.token);

    let listaHtml = [
      <h2 className="titleMainDadosEntrega">Dados de entrega</h2>,
    ];

    let k = 0;

    if (locaisBusca != false) {
      let locais = locaisBusca.locais;

      if (locais != false) {
        for (let i = 0; i < locais.length; i++) {
          if (this.checkIfFirst(i)) {
            this.setState({
              localValue: locais[i]._id,
            });
          }

          let pais = locais[i].pais;
          let morada = locais[i].morada;
          let localidade = locais[i].localidade;
          let codigo = locais[i].cod_postal;

          let html = (
            <label class="blocoMorada">
              <input
                type="radio"
                name="morada"
                defaultChecked={this.checkIfFirst(i)}
                value={locais[i]._id}
                onChange={this.changeLocalValue}
              />
              <div class="displayBlocoMorada">
                <h5>Morada atual</h5>
                <h4>{pais}</h4>
                <h4>{localidade}</h4>
                <h4>{morada} </h4>
                <h4>{codigo}</h4>
              </div>
            </label>
          );

          listaHtml.push(html);

          k = i;
        }
      }
    }

    let htmlAdicionarLocal = (
      <label class="blocoMorada">
        <input
          type="radio"
          name="morada"
          value="novoLocal"
          defaultChecked={this.checkIfFirst(k)}
          onChange={this.changeLocalValue}
        />
        <div class="displayBlocoMorada">
          <form id="formRegistoLocalEncomenda">
            <h5>Nova morada</h5>
            <h6>País</h6>
            <input ref={this.refPais} type="text" />
            <h6>Localidade</h6>
            <input ref={this.refLocalidade} type="text" />
            <h6>Morada</h6>
            <input ref={this.refMorada} type="text" />
            <h6>Código postal</h6>
            <input ref={this.refCodigo} type="text" />
          </form>
        </div>
      </label>
    );

    listaHtml.push(htmlAdicionarLocal);

    ReactDOM.render(listaHtml, this.refLocais.current);
  }

  changeLocalValue(e) {
    let { value } = e.target;

    console.log(value);

    this.setState({
      localValue: value,
    });
  }

  async checkValidity() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let idLocalEntrega;

    let isValid = false;

    if (this.state.localValue == "novoLocal") {
      if (
        this.refPais.current.value != "" &&
        this.refLocalidade.current.value != "" &&
        this.refMorada.current.value != "" &&
        this.refCodigo.current.value != ""
      ) {
        let local = await adicionarLocal(
          info.id,
          info.token,
          "local_entrega",
          this.refMorada.current.value,
          this.refCodigo.current.value,
          this.refLocalidade.current.value,
          this.refPais.current.value
        );

        if (local != false) {
          idLocalEntrega = local._id;

          isValid = true;
        } else {
          console.log("Erro ao adicionar local");
        }
      } else {
        console.log("Erro ao adicionar local");
      }
    } else {
      idLocalEntrega = this.state.localValue;
      isValid = true;
    }

    this.setState({
      idLocalEntrega: idLocalEntrega,
    });

    if (isValid) {
      window.location.href =
        "/ShoppingCar/" + this.state.idCarrinho + "/" + idLocalEntrega;
    }
  }

  async componentDidMount() {
    await this.checkCarrinho();
    await this.displayBlocoLocais();
  }

  render() {
    return (
      <div className="blocoGeralarrinho">
        <div className="blockCarAllSections">
          <h2 className="titleBlockGridShoppingCar">Dados de entrega</h2>
          <div ref={this.refLocais} className="blocoDadosEntrega">
            {/* <h2 className="titleMainDadosEntrega">Dados de entrega</h2>

            <label class="blocoMorada">
              <input type="radio" name="morada" />
              <div class="displayBlocoMorada">
                <h5>Morada atual</h5>
                <h4>Lisboa, Portugal</h4>
                <h4>Rua Maria Manuel das Couves n10 101E </h4>
                <h4>7200-023</h4>
              </div>
            </label>

            <label class="blocoMorada">
              <input type="radio" name="morada" />
              <div class="displayBlocoMorada">
                <form action="">
                  <h5>Nova morada</h5>
                  <h6>País</h6>
                  <input type="text" />
                  <h6>Localidade</h6>
                  <input type="text" />
                  <h6>Morada</h6>
                  <input type="text" />
                  <h6>Código postal</h6>
                  <input type="text" />
                </form>
              </div>
            </label> */}
          </div>
          {/* <button onClick={() => {this.checkValidity()}}>Continuar</button> */}
        </div>
        <div id="blockResume">
          <h2 className="titleBlockGridShoppingCar">Resumo</h2>
          <ResumeShoppingCar
            page="dados"
            idCarrinho={this.state.idCarrinho}
            paginaSeguinte={this.checkValidity}
          />
        </div>
      </div>
    );
  }
}

export default withParams(DadosEntrega);
