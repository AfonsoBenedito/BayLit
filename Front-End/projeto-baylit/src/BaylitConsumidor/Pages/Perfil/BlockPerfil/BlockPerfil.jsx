import React, { Component } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

import "./BlockPerfil.css";
import EncomendasPage from "./EncomendasPage/EncomendasPage";
import FavoritosPage from "./FavoritosPage/FavoritosPage";
import NotificacoesPage from "./NotificacoesPage/NotificacoesPage";

import { getUserById } from "../../../../Helpers/UserHelper";

class BlockPerfil extends Component {
  constructor(props) {
    super(props);

    this.myRefEncomendas = React.createRef();
    this.myRefFavoritos = React.createRef();
    this.myRefArquivos = React.createRef();

    let estadoPath = window.location.pathname.split("/");
    let nameEstadoPath = estadoPath[estadoPath.length - 1];

    let nomeEstado;

    if (nameEstadoPath == "perfil") {
      nomeEstado = 1;
    } else if (nameEstadoPath == "favoritos") {
      nomeEstado = 2;
    } else if (nameEstadoPath == "arquivos") {
      nomeEstado = 3;
    } else {
      nomeEstado = 1;
    }

    this.state = {
      estado: nomeEstado,
      nome: "",
    };
  }

  async getConsumidorInfo() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let user = await getUserById(info.id, info.tipo);

    this.setState({
      nome: user.nome,
    });
  }

  displayBtnBorder = (estado) => {
    if (estado == "url"){
      let path = window.location.pathname.split("/");
      let pathReal = path[path.length-1]
      if (pathReal == "perfil"){
        estado=1
      } else if (pathReal == "favoritos"){
        estado = 2
      } else if (pathReal == "notificacoes"){
        estado = 3
      }
    }
    if (estado == 1) {
      this.myRefEncomendas.current.style.borderTop = "2px solid black";
      this.myRefFavoritos.current.style.borderTop = "none";
      this.myRefArquivos.current.style.borderTop = "none";
    } else if (estado == 2) {
      this.myRefEncomendas.current.style.borderTop = "none";
      this.myRefFavoritos.current.style.borderTop = "2px solid black";
      this.myRefArquivos.current.style.borderTop = "none";
    } else if (estado == 3) {
      this.myRefEncomendas.current.style.borderTop = "none";
      this.myRefFavoritos.current.style.borderTop = "none";
      this.myRefArquivos.current.style.borderTop = "2px solid black";
    }
  };

  async componentDidMount() {
    this.displayBtnBorder("url");
    await this.getConsumidorInfo();
  }

  render() {
    return (
      <div className="mainBlockPerfil">
        <div className="blocoInfoUserPerfil">
          <h2>{this.state.nome}</h2>
        </div>

        <div className="blocoBtnUserPerfil">
          <Link
            to="/perfil"
            className="toLink"
            onClick={() => {
              this.displayBtnBorder(1);
            }}
          >
            <div ref={this.myRefEncomendas} className="btnUserPrefil">
              <i class="bi bi-box-seam"></i>
              <h4>Encomendas</h4>
            </div>
          </Link>
          <Link
            to="/perfil/favoritos"
            className="toLink"
            onClick={() => {
              this.displayBtnBorder(2);
            }}
          >
            <div ref={this.myRefFavoritos} className="btnUserPrefil">
              <i class="bi bi-heart"></i>
              <h4>Favoritos</h4>
            </div>
          </Link>
          <Link
            to="/perfil/notificacoes"
            className="toLink"
            onClick={() => {
              this.displayBtnBorder(3);
            }}
          >
            <div ref={this.myRefArquivos} className="btnUserPrefil">
              <i class="bi bi-bell"></i>
              <h4>Notificações</h4>
            </div>
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<EncomendasPage />}></Route>
          <Route path="/favoritos" element={<FavoritosPage />}></Route>
          <Route path="/notificacoes" element={<NotificacoesPage />}></Route>
          <Route path="/*" element={<Navigate to="/perfil" />}></Route>
        </Routes>
      </div>
    );
  }
}

export default BlockPerfil;
