import React, { Component } from "react";
import { Link, Route, Routes } from "react-router-dom";
import BlockDados from "./BlockDados/BlockDados";

import BlockPerfil from "./BlockPerfil/BlockPerfil";

import "./Perfil.css";

import { verifyConsumidor } from "../../../Helpers/AuthVerification";
import BlockSeguranca from "./BlockSeguranca/BlockSeguranca";
import BlockEncomenda from "./BlockEncomenda/BlockEncomenda";

import Logout from "./Logout/Logout";

class Perfil extends Component {
  constructor(props) {
    super(props);

    this.myRefPerfil = React.createRef();
    this.myRefPerfilH5 = React.createRef();
    this.myRefPerfilI = React.createRef();

    this.myRefDados = React.createRef();
    this.myRefDadosH5 = React.createRef();
    this.myRefDadosI = React.createRef();

    this.myRefSeguranca = React.createRef();
    this.myRefSegurancaH5 = React.createRef();
    this.myRefSegurancaI = React.createRef();

    this.state = {};

    verifyConsumidor();
  }

  displayBtnBorder = (estado) => {
    let estadoPath = window.location.pathname.split("/");
    let nameEstadoPath = estadoPath[estadoPath.length - 1];

    let selectExecut;

    switch (estado) {
      case "url":
        switch (nameEstadoPath) {
          case "perfil":
            selectExecut = "executPerfil";
            break;
          case "dados":
            selectExecut = "executDados";
            break;
          case "seguranca":
            selectExecut = "executSeguranca";
            break;
          default:
            selectExecut = "executPerfil";
            break;
        }
        break;
      case "perfil":
        selectExecut = "executPerfil";
        break;
      case "dados":
        selectExecut = "executDados";
        break;
      case "seguranca":
        selectExecut = "executSeguranca";
        break;
      default:
        selectExecut = "executPerfil";
        break;
    }

    if (selectExecut === "executPerfil") {
      this.myRefPerfil.current.style.border = "1px solid black";
      this.myRefPerfilH5.current.style.fontWeight = "600";
      this.myRefPerfilI.current.style.webkitTextStroke = ".7px";

      this.myRefDados.current.style.border = "none";
      this.myRefDadosH5.current.style.fontWeight = "500";
      this.myRefDadosI.current.style.webkitTextStroke = ".3px";

      this.myRefSeguranca.current.style.border = "none";
      this.myRefSegurancaH5.current.style.fontWeight = "500";
      this.myRefSegurancaI.current.style.webkitTextStroke = ".3px";
    } else if (selectExecut === "executDados") {
      this.myRefPerfil.current.style.border = "none";
      this.myRefPerfilH5.current.style.fontWeight = "500";
      this.myRefPerfilI.current.style.webkitTextStroke = ".3px";

      this.myRefDados.current.style.border = "1px solid black";
      this.myRefDadosH5.current.style.fontWeight = "600";
      this.myRefDadosI.current.style.webkitTextStroke = ".7px";

      this.myRefSeguranca.current.style.border = "none";
      this.myRefSegurancaH5.current.style.fontWeight = "500";
      this.myRefSegurancaI.current.style.webkitTextStroke = ".3px";
    } else if (selectExecut === "executSeguranca") {
      this.myRefPerfil.current.style.border = "none";
      this.myRefPerfilH5.current.style.fontWeight = "500";
      this.myRefPerfilI.current.style.webkitTextStroke = ".3px";

      this.myRefDados.current.style.border = "none";
      this.myRefDadosH5.current.style.fontWeight = "500";
      this.myRefDadosI.current.style.webkitTextStroke = ".3px";

      this.myRefSeguranca.current.style.border = "1px solid black";
      this.myRefSegurancaH5.current.style.fontWeight = "600";
      this.myRefSegurancaI.current.style.webkitTextStroke = ".7px";
    }
  };

  componentDidMount() {
    this.displayBtnBorder("url");
  }
  render() {
    return (
      <div className="mainPerfilPage">
        <div className="toAlignBtnsPerfilPage">
          <Link
            className="toLink"
            to="/perfil"
            onClick={() => {
              this.displayBtnBorder("perfil");
            }}
          >
            <div ref={this.myRefPerfil} className="btnPagePerfil">
              <i ref={this.myRefPerfilI} class="bi bi-person"></i>
              <h5 ref={this.myRefPerfilH5}>Perfil</h5>
            </div>
          </Link>
          <Link
            className="toLink"
            to="/perfil/dados"
            onClick={() => {
              this.displayBtnBorder("dados");
            }}
          >
            <div ref={this.myRefDados} className="btnPagePerfil">
              <i ref={this.myRefDadosI} class="bi bi-shield-check"></i>
              <h5 ref={this.myRefDadosH5}>Dados pessoais</h5>
            </div>
          </Link>
          <Link
            className="toLink"
            to="/perfil/seguranca"
            onClick={() => {
              this.displayBtnBorder("seguranca");
            }}
          >
            <div ref={this.myRefSeguranca} className="btnPagePerfil">
              <i ref={this.myRefSegurancaI} class="bi bi-lock"></i>
              <h5 ref={this.myRefSegurancaH5}>Segurança</h5>
            </div>
          </Link>
          <a href="/faq" className="toLink">
            <div className="btnPagePerfil">
              <i class="bi bi-chat-square-quote"></i>
              <h5>Ajuda</h5>
            </div>
          </a>
        </div>

        <Routes>
          <Route path="/*" element={<BlockPerfil />}></Route>
          <Route path="/encomendas/:idEncomenda" element={<BlockEncomenda />}></Route>
          <Route path="/dados" element={<BlockDados />}></Route>
          <Route path="/seguranca" element={<BlockSeguranca />}></Route>
          <Route path="/logout" element={<Logout />}></Route>
        </Routes>
      </div>
    );
  }
}

export default Perfil;
