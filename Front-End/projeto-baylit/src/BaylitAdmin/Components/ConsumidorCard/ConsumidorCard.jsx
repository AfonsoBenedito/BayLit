import React, { Component } from "react";

import "./ConsumidorCard.css";
import {
  updateConsumidorGeral,
  CongelarUser,
  DescongelarUser,
  adminDeleteLocal,
} from "../../../Helpers/UserHelper";

class ConsumidorCard extends Component {
  constructor(props) {
    super(props);

    this.myRefBodyConsumidorCard = React.createRef();
    this.refNome = React.createRef();
    this.refEmail = React.createRef();
    this.refNif = React.createRef();

    this.state = {
      tipoFunction: "open",
      tipoIcon: "bi bi-chevron-right",
      nomes_de_cada1: this.props.nomes_de_cada1,
      ids_de_cada1: this.props.ids_de_cada1,
      moradasConsumidor: this.props.moradasConsumidor,
      emails_de_cada1: this.props.emails_de_cada1,
      nifs_de_cada1: this.props.nifs_de_cada1,
      checkBlock: this.props.checkBlock,
    };
  }

  changeDisplayCard(tipoFunction) {
    if (tipoFunction === "open") {
      this.myRefBodyConsumidorCard.current.style.display = "block";
      this.FillInputUtilizadorConsumidor();
      this.setState({
        tipoFunction: "close",
        tipoIcon: "bi bi-chevron-down",
      });
    } else if (tipoFunction === "close") {
      this.myRefBodyConsumidorCard.current.style.display = "none";

      this.setState({
        tipoFunction: "open",
        tipoIcon: "bi bi-chevron-right",
      });
    }
  }

  FillInputUtilizadorConsumidor() {
    this.refNome.current.value = this.state.nomes_de_cada1;
    this.refEmail.current.value = this.state.emails_de_cada1;
    this.refNif.current.value = this.state.nifs_de_cada1;
  }

  displayBlock() {
    let result;
    if (this.state.checkBlock == "consumidorBloqueado") {
      result = [<span>bloqueado</span>];
    } else if (this.state.checkBlock == "consumidorNaoBloqueado") {
      result = [];
    }

    return result;
  }

  async EfetuarAlteracoesAdminConsumidor() {
    let campo_nome = this.refNome.current.value;
    let campo_mail = this.refEmail.current.value;
    let campo_nif = this.refNif.current.value;

    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    let idConsumidor = this.state.ids_de_cada1;
    let tokenA = data.token;

    // console.log(campo_nome, campo_mail, campo_nif, idConsumidor, tokenA);

    if (data != null) {
      let res = await updateConsumidorGeral(
        idConsumidor,
        campo_nome,
        campo_mail,
        campo_nif,
        tokenA
      );
      if (res != false) {
        let parag = document.getElementById("GoodFeedback");
        parag.innerHTML = "Alterações efetuadas com sucesso";
      } else {
        let parag = document.getElementById("GoodFeedback");
        parag.innerHTML = "Algo não correu bem, tente novamente";
      }
    }
  }

  async botaoBloquearConta() {
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    let tokenA = data.token;
    const result = await CongelarUser(tokenA, this.state.ids_de_cada1);

    if (result) {
      window.location.reload();
    }
  }

  async descongelar() {
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    let tokenA = data.token;
    const result = await DescongelarUser(tokenA, this.state.ids_de_cada1);

    if (result) {
      window.location.reload();
    }
  }

  createMoradas() {
    let result = [];

    if (this.state.moradasConsumidor != false) {
      for (let i = 0; i < this.state.moradasConsumidor.locais.length; i++) {
        result.push(
          <div className="moradaConsumidorCard">
            <div
              className="btnEliminarMorada"
              onClick={async () => {
                await this.eliminarLocal(
                  this.state.moradasConsumidor.locais[i]._id
                );
              }}
            >
              <i class="bi bi-x-lg"></i>
            </div>
            <h5>Local</h5>

            <h3>
              {this.state.moradasConsumidor.locais[i].localidade},{" "}
              {this.state.moradasConsumidor.locais[i].pais}
            </h3>
            <h3>{this.state.moradasConsumidor.locais[i].morada}</h3>
            <h3>{this.state.moradasConsumidor.locais[i].cod_postal}</h3>
          </div>
        );
      }
    }

    return result;

    // return result;
  }

  async eliminarLocal(id_local) {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    await adminDeleteLocal(info.token, id_local);

    window.location.href = "/Admin/Transportadores";
  }

  render() {
    // console.log("morada ");
    // console.log(this.state.moradas_de_cada1);
    return (
      <div className="mainConsumidorCard">
        <div className="headerConsumidorCard">
          <div className="mainDeatails">
            <h3 className="nomeConsumidorCard">
              {this.state.nomes_de_cada1}
              <span>Consumidor</span>
            </h3>
            <span className="idConsumidorCard">
              #{this.state.ids_de_cada1}
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
        <div ref={this.myRefBodyConsumidorCard} className="bodyConsumidorCard">
          <div className="displayerMoradas">{this.createMoradas()}</div>
          <div className="dadosConsumidorCard">
            <h5>Dados do utilizador</h5>
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
              <h6>Nif</h6>
              <input
                type="text"
                placeholder="Nif"
                id="nifAdmin"
                ref={this.refNif}
              />
              <div
                className="btnAlterarConsumidorCard"
                onClick={async () => {
                  await this.EfetuarAlteracoesAdminConsumidor();
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
            this.state.checkBlock == "consumidorNaoBloqueado"
              ? "botaoAdminBloquear"
              : "botaoAdminDesbloquear"
          }
          onClick={() => {
            this.state.checkBlock == "consumidorNaoBloqueado"
              ? this.botaoBloquearConta()
              : this.descongelar();
          }}
        >
          {this.state.checkBlock == "consumidorNaoBloqueado"
            ? "Bloquear"
            : "Desbloquear"}
        </button>
      </div>
    );
  }
}

export default ConsumidorCard;
