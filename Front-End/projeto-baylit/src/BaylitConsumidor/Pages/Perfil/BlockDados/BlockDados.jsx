import React, { Component } from "react";

import {
  getUserById,
  updateConsumidorGeral,
  getLocaisUtilizador,
  deleteLocalUtilizador,
} from "../../../../Helpers/UserHelper";

import "./BlockDados.css";

import ReactDOM from "react-dom";
import { adicionarLocal } from "../../../../Helpers/FornecedorHelper";

class BlockDados extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nome: "",
      email: "",
      nif: "",
      info: {},
    };

    this.refNome = React.createRef();
    this.refEmail = React.createRef();
    this.refNif = React.createRef();

    this.refPais = React.createRef();
    this.refLocalidade = React.createRef();
    this.refMorada = React.createRef();
    this.refCodigo = React.createRef();

    this.refLocais = React.createRef();
  }

  async getConsumidorInfo() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let user = await getUserById(info.id, info.tipo);

    let displayNif;

    if (user.nif) {
      displayNif = user.nif;
    } else {
      displayNif = "";
    }

    this.setState({
      nome: user.nome,
      email: user.email,
      nif: displayNif,
      info: info,
    });
  }

  async alterarDadosGerais() {
    let nome = this.refNome.current.value;
    let email = this.refEmail.current.value;
    let nif = this.refNif.current.value;

    if (nome == "") {
      nome = null;
    }

    if (email == "") {
      email = null;
    }

    if (nif == "") {
      nif = null;
    }

    let res = false;

    res = await updateConsumidorGeral(
      this.state.info.id,
      nome,
      email,
      nif,
      this.state.info.token
    );


    if (res != false) {
      window.location.href = "/perfil/dados";
    } else {
    }
  }

  async displayBlocoLocais() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let locaisBusca = await getLocaisUtilizador(info.id, info.token);

    let listaHtml = [<h2 className="titleMainDadosEntrega">Locais</h2>];

    let k = 0;

    if (locaisBusca != false) {
      let locais = locaisBusca.locais;

      if (locais != false) {
        for (let i = 0; i < locais.length; i++) {
          let idLocal = locais[i]._id;
          let pais = locais[i].pais;
          let morada = locais[i].morada;
          let localidade = locais[i].localidade;
          let codigo = locais[i].cod_postal;

          let html = (
            <label class="blocoMorada">
              <div class="displayBlocoMorada">
                <h5>Morada</h5>
                <h4>{pais}</h4>
                <h4>{localidade}</h4>
                <h4>{morada} </h4>
                <h4>{codigo}</h4>
              </div>
              <div className="removeLocalBlockDados" onClick={async () => {await this.apagarMorada(idLocal)}}>
                <i class="bi bi-trash3"></i>
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
            <button
              onClick={async () => {
                await this.alterarDadosMorada();
              }}
              className="btnSubmitChangesDados"
              type="button"
            >
              Guardar alterações
            </button>
          </form>
        </div>
      </label>
    );

    listaHtml.push(htmlAdicionarLocal);

    ReactDOM.render(listaHtml, this.refLocais.current);
  }

  async alterarDadosMorada() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let pais = this.refPais.current.value;
    let localidade = this.refLocalidade.current.value;
    let morada = this.refMorada.current.value;
    let codigo = this.refCodigo.current.value;

    if (pais != "" && localidade != "" && morada != "" && codigo != "") {

      let res = await adicionarLocal(
        info.id,
        info.token,
        "local_entrega",
        morada,
        codigo,
        localidade,
        pais
      );

      if (res) {
        window.location.href = "/perfil/dados";
      } else {
      }
    } else {
    }
  }

  async apagarMorada(id_local){
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let res = await deleteLocalUtilizador(info.id, info.token, id_local)

    if (res){
      window.location.href = "/perfil/dados";
    } else {
    }

  }

  async componentDidMount() {
    await this.getConsumidorInfo();
    await this.displayBlocoLocais();
  }

  render() {
    return (
      <div className="mainBlockDados">
        <h2 className="titlePageBlockDados">Dados pessoais</h2>
        <div className="alignAllBlocksDados">
          <div className="blocoDadosAlterar">
            <div className="titleBlocoDados">
              <i class="bi bi-person"></i>
              <h3>Dados utilizador</h3>
            </div>
            <form className="blocoInputsBlockDados">
              <h6>Nome</h6>
              <input
                ref={this.refNome}
                type="text"
                name=""
                id=""
                placeholder={this.state.nome}
              />
              <h6>Email</h6>
              <input
                ref={this.refEmail}
                type="text"
                name=""
                id=""
                placeholder={this.state.email}
              />
              <h6>Nº contibuinte (opcional)</h6>
              <input
                ref={this.refNif}
                type="text"
                name=""
                id=""
                placeholder={this.state.nif}
              />

              <button
                className="btnSubmitChangesDados"
                type="button"
                onClick={() => {
                  this.alterarDadosGerais();
                }}
              >
                Guardar alterações
              </button>
            </form>
          </div>
          <div ref={this.refLocais} className="blocoDadosAlterar">
            {/* <div className="titleBlocoDados">
              <i class="bi bi-person"></i>
              <h3>Morada</h3>
            </div>
            <form className="blocoInputsBlockDados" action="">
              <h6>País</h6>
              <input ref={this.refPais} type="text" name="" id="" placeholder="País" />
              <h6>Localidade</h6>
              <input ref={this.refLocalidade} type="text" name="" id="" placeholder="Localidade" />
              <h6>Morada</h6>
              <input ref={this.refMorada} type="text" name="" id="" placeholder="Morada" />
              <h6>Código postal</h6>
              <input ref={this.refCodigo} type="text" name="" id="" placeholder="xxxx-xxx" /> */}

            {/* <button className="btnSubmitChangesDados" type="" >
                Guadar alterações
              </button>
            </form> */}
          </div>
        </div>
      </div>
    );
  }
}

export default BlockDados;
