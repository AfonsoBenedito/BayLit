import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./AppAdmin.css";
import HeaderAdmin from "./Components/HeaderAdmin/HeaderAdmin";

import SignIn from "./Pages/SignIn/SignIn.jsx";
import Consumidores from "./Pages/Consumidores/Consumidores";
import Fornecedores from "./Pages/Fornecedores/Fornecedores";
import Transportadores from "./Pages/Transportadores/Transportadores";
import Sustentabilidade from "./Pages/Sustentabilidade/Sustentabilidade";

class AppAmin extends Component {
  constructor(props) {
    super(props);

    this.myRefConsumidores = React.createRef();
    this.myRefFornecedores = React.createRef();
    this.myRefTransportadores = React.createRef();
    this.myRefSustentabilidade = React.createRef();

    this.state = {};
  }

  changeBorderLink(tipo) {
    let btnChange;
    switch (tipo) {
      case "url":
        let estadoPath = window.location.pathname.split("/");
        let nameEstadoPath = estadoPath[estadoPath.length - 1];
        console.log(nameEstadoPath);
        btnChange = nameEstadoPath;
        break;
      case "consumidores":
        btnChange = "consumidores";
        break;
      case "fornecedores":
        btnChange = "fornecedores";
        break;
      case "transportadores":
        btnChange = "transportadores";
        break;
      case "sustentabilidade":
        btnChange = "sustentabilidade";
        break;
      default:
        btnChange = "consumidores";
        break;
    }

    console.log(btnChange);

    if (btnChange === "consumidores") {
      this.myRefConsumidores.current.style.border = "1px solid black";
      this.myRefFornecedores.current.style.border =
        "1px solid rgba(255, 255, 255, 0)";
      this.myRefTransportadores.current.style.border =
        "1px solid rgba(255, 255, 255, 0)";
      this.myRefSustentabilidade.current.styel.border =
        "1px solid rgba(255, 255, 255, 0)";
    } else if (btnChange === "fornecedores") {
      this.myRefConsumidores.current.style.border =
        "1px solid rgba(255, 255, 255, 0)";
      this.myRefFornecedores.current.style.border = "1px solid black";
      this.myRefTransportadores.current.style.border =
        "1px solid rgba(255, 255, 255, 0)";
      this.myRefSustentabilidade.current.styel.border =
        "1px solid rgba(255, 255, 255, 0)";
    } else if (btnChange === "transportadores") {
      this.myRefConsumidores.current.style.border =
        "1px solid rgba(255, 255, 255, 0)";
      this.myRefFornecedores.current.style.border =
        "1px solid rgba(255, 255, 255, 0)";
      this.myRefTransportadores.current.style.border = "1px solid black";
      this.myRefSustentabilidade.current.styel.border =
        "1px solid rgba(255, 255, 255, 0)";
    } else if (btnChange === "sustentabilidade") {
      this.myRefConsumidores.current.style.border =
        "1px solid rgba(255, 255, 255, 0)";
      this.myRefFornecedores.current.style.border =
        "1px solid rgba(255, 255, 255, 0)";
      this.myRefTransportadores.current.style.border =
        "1px solid rgba(255, 255, 255, 0)";
      this.myRefSustentabilidade.current.style.border = "1px solid black";
    }
  }

  async componentDidMount() {
    this.changeBorderLink("url");
  }

  render() {
    return (
      <div className="AppAdmin">
        <HeaderAdmin />

        <div id="mainUtilizadoresPage" className="mainUtilizadoresPage">
          <div id="btnsUtilizadores" className="btnsUtilizadores">
            <a
              ref={this.myRefConsumidores}
              href="/admin/consumidores"
              className="btnUtilizadorEspecifico toLink"
              onClick={() => {
                this.changeBorderLink("consumidores");
              }}
            >
              <i class="bi bi-people"></i>
              <h5>Consumidores</h5>
            </a>
            <a
              ref={this.myRefFornecedores}
              href="/admin/fornecedores"
              className="btnUtilizadorEspecifico toLink"
              onClick={() => {
                this.changeBorderLink("fornecedores");
              }}
            >
              <i class="bi bi-building"></i>
              <h5>Fornecedores</h5>
            </a>
            <a
              ref={this.myRefTransportadores}
              href="/admin/transportadores"
              className="btnUtilizadorEspecifico toLink"
              onClick={() => {
                this.changeBorderLink("transportadores");
              }}
            >
              <i className="bi bi-truck transportesIcon"></i>
              <h5>Transportadores</h5>
            </a>
            <a
              ref={this.myRefSustentabilidade}
              href="/admin/sustentabilidade"
              className="btnUtilizadorEspecifico toLink"
              onClick={() => {
                this.changeBorderLink("sustentabilidade");
              }}
            >
              <i className="bi bi-graph-up-arrow"></i>
              <h5>Sustentabilidade</h5>
            </a>
          </div>
          <div className="pageUtilizadoresContent">
            <Routes>
              <Route path="/login" element={<SignIn />} />
              <Route path="/consumidores" element={<Consumidores />} />
              <Route path="/fornecedores" element={<Fornecedores />} />
              <Route path="/transportadores" element={<Transportadores />} />
              <Route path="/sustentabilidade" element={<Sustentabilidade />} />
              <Route path="/" element={<Navigate to="/admin/consumidores" />} />
            </Routes>
          </div>
        </div>

        {/* <Routes>
                <Route path="/utilizadores/*" element={<Utilizadores/>}></Route>
            </Routes> */}
      </div>
    );
  }
}

export default AppAmin;
