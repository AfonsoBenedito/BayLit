import React, { Component } from "react";

import "./TransportadorCard.css";
import {
  updateConsumidorGeral,
  CongelarUser,
  DescongelarUser,
  adminDeleteLocal,
} from "../../../Helpers/UserHelper";

class TransportadorCard extends Component {
  constructor(props) {
    super(props);

    this.myRefBodyTransportadorCard = React.createRef();
    this.refNome = React.createRef();
    this.refEmail = React.createRef();
    this.refNif = React.createRef();
    this.refTelemovel = React.createRef();
    this.refPortes = React.createRef();

    this.state = {
      tipoFunction: "open",
      tipoIcon: "bi bi-chevron-right",
      nomeTransportador: this.props.nomeTransportador,
      idTransportador: this.props.idTransportador,
      sedesTransportador: this.props.sedesTransportador,
      emailTransportador: this.props.emailTransportador,
      nifTransportador: this.props.nifTransportador,
      telemovelTransportador: this.props.telemovelTransportador,
      portesTransportador: this.props.portesTransportador,
      checkBlock: this.props.checkBlock,
    };
  }

  changeDisplayCard(tipoFunction) {
    if (tipoFunction === "open") {
      this.myRefBodyTransportadorCard.current.style.display = "block";
      this.FillInputUtilizadorTransportador();
      this.setState({
        tipoFunction: "close",
        tipoIcon: "bi bi-chevron-down",
      });
    } else if (tipoFunction === "close") {
      this.myRefBodyTransportadorCard.current.style.display = "none";

      this.setState({
        tipoFunction: "open",
        tipoIcon: "bi bi-chevron-right",
      });
    }
  }

  FillInputUtilizadorTransportador() {
    this.refNome.current.value = this.state.nomeTransportador;
    this.refEmail.current.value = this.state.emailTransportador;
    this.refNif.current.value = this.state.nifTransportador;
    this.refTelemovel.current.value = this.state.telemovelTransportador;
    this.refPortes.current.value = this.state.portesTransportador;
  }

  displayBlock() {
    let result;
    if (this.state.checkBlock == "transportadorBloqueado") {
      result = [<span>bloqueado</span>];
    } else if (this.state.checkBlock == "transportadorNaoBloqueado") {
      result = [];
    }

    return result;
  }

  async EfetuarAlteracoesAdminTransportador() {
    let campo_nome = this.refNome.current.value;
    let campo_mail = this.refEmail.current.value;
    let campo_nif = this.refNif.current.value;
    let campo_telemovel = this.refTelemovel.current.value;
    let campo_portes = this.refPortes.current.value;

    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    let idTransportador = this.state.idTransportador;
    let tokenA = data.token;

    // console.log(campo_nome, campo_mail, campo_nif, idConsumidor, tokenA);

    // if (data != null) {
    //   let res = await updateConsumidorGeral(
    //     idConsumidor,
    //     campo_nome,
    //     campo_mail,
    //     campo_nif,
    //     tokenA
    //   );
    //   if (res != false) {
    //     let parag = document.getElementById("GoodFeedback");
    //     parag.innerHTML = "Alterações efetuadas com sucesso";
    //   } else {
    //     let parag = document.getElementById("GoodFeedback");
    //     parag.innerHTML = "Algo não correu bem, tente novamente";
    //   }
    // }
  }

  async botaoBloquearConta() {
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    let tokenA = data.token;
    const result = await CongelarUser(tokenA, this.state.idTransportador);

    if (result) {
      window.location.reload();
    }
  }

  async descongelar() {
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    let tokenA = data.token;
    const result = await DescongelarUser(tokenA, this.state.idTransportador);

    if (result) {
      window.location.reload();
    }
  }

  createArmazens() {
    let result = [];
    // console.log(this.state.armazensFornecedor);
    if (
      this.state.sedesTransportador != false &&
      this.state.sedesTransportador != undefined
    ) {

      for (let i = 0; i < this.state.sedesTransportador.locais.length; i++) {
        let sede = this.state.sedesTransportador.locais[i];
        result.push(
          <div className="moradaTransportadorCard">
            <div
              className="btnEliminarMorada"
              onClick={async () => {
                await this.eliminarLocal(sede._id);
              }}
            >
              <i class="bi bi-x-lg"></i>
            </div>
            <h5>Sede</h5>

            <h3>
              {sede.localidade}, {sede.pais}
            </h3>
            <h3>{sede.morada}</h3>
            <h3>{sede.cod_postal}</h3>
          </div>
        );
      }
    }

    return result;
  }

  async eliminarLocal(id_local) {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    await adminDeleteLocal(info.token, id_local);

    window.location.href = "/Admin/Transportadores";
  }

  render() {
    return (
      <div className="mainTransportadorCard">
        <div className="headerTransportadorCard">
          <div className="mainDeatails">
            <h3 className="nomeTransportadorCard">
              {this.state.nomeTransportador}
              <span>Transportador</span>
            </h3>
            <span className="idTransportadorCard">
              #{this.state.idTransportador}
              {this.displayBlock()}
            </span>
          </div>
          <i
            class={this.state.tipoIcon}
            onClick={() => {
              this.changeDisplayCard(this.state.tipoFunction);
            }}
          ></i>
        </div>
        <div
          ref={this.myRefBodyTransportadorCard}
          className="bodyTransportadorCard"
        >
          <div className="displayerMoradas">{this.createArmazens()}</div>
          <div className="dadosTransportadorCard">
            <h5>Dados do transportador</h5>
            <form action="">
              <h6>Nome</h6>
              <input
                type="text"
                placeholder="Nome"
                id="nomeAdmin"
                ref={this.refNome}
              />
              <h6>Email</h6>
              <input
                type="text"
                placeholder="Email"
                id="mailAdmin"
                ref={this.refEmail}
              />
              <h6>Portes de entrega</h6>
              <input
                type="text"
                placeholder="Portes"
                id="portesAdmin"
                ref={this.refPortes}
              />
              <h6>Nif</h6>
              <input
                type="text"
                placeholder="Nif"
                id="nifAdmin"
                ref={this.refNif}
              />
              <h6>Telemóvel</h6>
              <input
                type="text"
                placeholder="Telemóvel"
                id="telemovelAdmin"
                ref={this.refTelemovel}
              />
              <div
                className="btnAlterarTransportadorCard"
                onClick={async () => {
                  await this.EfetuarAlteracoesAdminTransportador();
                }}
              >
                Guardar alterações
              </div>
            </form>
            <p id="Feedback"></p>
          </div>
        </div>
        <button
          id={
            this.state.checkBlock == "transportadorNaoBloqueado"
              ? "botaoAdminBloquear"
              : "botaoAdminDesbloquear"
          }
          onClick={() => {
            this.state.checkBlock == "transportadorNaoBloqueado"
              ? this.botaoBloquearConta()
              : this.descongelar();
          }}
        >
          {this.state.checkBlock == "transportadorNaoBloqueado"
            ? "Bloquear"
            : "Desbloquear"}
        </button>
      </div>
    );
  }
}

export default TransportadorCard;
