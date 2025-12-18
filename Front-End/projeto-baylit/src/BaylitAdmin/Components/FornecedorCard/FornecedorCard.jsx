import React, { Component } from "react";

import "./FornecedorCard.css";
import {
  updateConsumidorGeral,
  CongelarUser,
  DescongelarUser,
  adminDeleteLocal,
} from "../../../Helpers/UserHelper";

class FornecedorCard extends Component {
  constructor(props) {
    super(props);

    this.myRefBodyFornecedorCard = React.createRef();
    this.refNome = React.createRef();
    this.refEmail = React.createRef();
    this.refNif = React.createRef();
    this.refTelemovel = React.createRef();

    this.state = {
      tipoFunction: "open",
      tipoIcon: "bi bi-chevron-right",
      nomeFornecedor: this.props.nomeFornecedor,
      idFornecedor: this.props.idFornecedor,
      armazensFornecedor: this.props.armazensFornecedor,
      emailFornecedor: this.props.emailFornecedor,
      nifFornecedor: this.props.nifFornecedor,
      telemovelFornecedor: this.props.telemovelFornecedor,
      checkBlock: this.props.checkBlock,
    };
  }

  changeDisplayCard(tipoFunction) {
    if (tipoFunction === "open") {
      this.myRefBodyFornecedorCard.current.style.display = "block";
      this.FillInputUtilizadorFornecedor();
      this.setState({
        tipoFunction: "close",
        tipoIcon: "bi bi-chevron-down",
      });
    } else if (tipoFunction === "close") {
      this.myRefBodyFornecedorCard.current.style.display = "none";

      this.setState({
        tipoFunction: "open",
        tipoIcon: "bi bi-chevron-right",
      });
    }
  }

  FillInputUtilizadorFornecedor() {
    this.refNome.current.value = this.state.nomeFornecedor;
    this.refEmail.current.value = this.state.emailFornecedor;
    this.refNif.current.value = this.state.nifFornecedor;
    this.refTelemovel.current.value = this.state.telemovelFornecedor;
  }

  displayBlock() {
    let result;
    if (this.state.checkBlock == "fornecedorBloqueado") {
      result = [<span>bloqueado</span>];
    } else if (this.state.checkBlock == "fornecedorNaoBloqueado") {
      result = [];
    }

    return result;
  }

  async EfetuarAlteracoesAdminFornecedor() {
    let campo_nome = this.refNome.current.value;
    let campo_mail = this.refEmail.current.value;
    let campo_nif = this.refNif.current.value;
    let campo_telemovel = this.refTelemovel.current.value;

    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    let idFornecedor = this.state.idFornecedor;
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
    const result = await CongelarUser(tokenA, this.state.idFornecedor);

    if (result) {
      window.location.reload();
    }
  }

  async descongelar() {
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    let tokenA = data.token;
    const result = await DescongelarUser(tokenA, this.state.idFornecedor);

    if (result) {
      window.location.reload();
    }
  }

  createArmazens() {
    let result = [];
    // console.log(this.state.armazensFornecedor);
    if (this.state.armazensFornecedor != false) {
      //   console.log(this.state.armazensFornecedor);

      for (let i = 0; i < this.state.armazensFornecedor.length; i++) {
        // console.log(this.state.armazensFornecedor[i]);
        let armazem = this.state.armazensFornecedor[i].localizacao.local;
        result.push(
          <div className="moradaFornecedorCard">
            <div
              className="btnEliminarMorada"
              onClick={async () => {
                await this.eliminarLocal(armazem._id);
              }}
            >
              <i class="bi bi-x-lg"></i>
            </div>
            <h5>Armazem</h5>

            <h3>
              {armazem.localidade}, {armazem.pais}
            </h3>
            <h3>{armazem.morada}</h3>
            <h3>{armazem.cod_postal}</h3>
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
      <div className="mainFornecedorCard">
        <div className="headerFornecedorCard">
          <div className="mainDeatails">
            <h3 className="nomeFornecedorCard">
              {this.state.nomeFornecedor}
              <span>Fornecedor</span>
            </h3>
            <span className="idFornecedorCard">
              #{this.state.idFornecedor}
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
        <div ref={this.myRefBodyFornecedorCard} className="bodyFornecedorCard">
          <div className="displayerMoradas">{this.createArmazens()}</div>
          <div className="dadosFornecedorCard">
            <h5>Dados do fornecedor</h5>
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
              <h6>Telemóvel</h6>
              <input
                type="text"
                placeholder="Telemóvel"
                id="telemovelAdmin"
                ref={this.refTelemovel}
              />
              <div
                className="btnAlterarFornecedorCard"
                onClick={async () => {
                  await this.EfetuarAlteracoesAdminFornecedor();
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
            this.state.checkBlock == "fornecedorNaoBloqueado"
              ? "botaoAdminBloquear"
              : "botaoAdminDesbloquear"
          }
          onClick={() => {
            this.state.checkBlock == "fornecedorNaoBloqueado"
              ? this.botaoBloquearConta()
              : this.descongelar();
          }}
        >
          {this.state.checkBlock == "fornecedorNaoBloqueado"
            ? "Bloquear"
            : "Desbloquear"}
        </button>
      </div>
    );
  }
}

export default FornecedorCard;
