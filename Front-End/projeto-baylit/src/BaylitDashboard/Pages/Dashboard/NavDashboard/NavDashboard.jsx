import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./NavDashboard.css";

class NavDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.changePerfilCompany = React.createRef();
    this.changeNotificacao = React.createRef();
    this.changeSustainability = React.createRef();
  }

  pathSideBorder = (side) => {
    if (side == "url") {
      let estadoPath = window.location.pathname.split("/");
      let rightPath = estadoPath[estadoPath.length - 1];
      // console.log(estadoPath[estadoPath.length - 1]);
      if (rightPath === "PerfilCompany") {
        document.getElementById("btnPerfilCompany").style.backgroundColor =
          "rgba(96, 96, 96, 0.7)";
        document.getElementById("btnPromotions").style.backgroundColor =
          "transparent";
        document.getElementById("btnSustainability").style.backgroundColor =
          "transparent";
      } else if (rightPath === "Notificacoes") {
        document.getElementById("btnPerfilCompany").style.backgroundColor =
          "transparent";
        document.getElementById("btnPromotions").style.backgroundColor =
          "rgba(96, 96, 96, 0.7)";
        document.getElementById("btnSustainability").style.backgroundColor =
          "transparent";
      } else if (rightPath === "Sustainability") {
        document.getElementById("btnPerfilCompany").style.backgroundColor =
          "transparent";
        document.getElementById("btnPromotions").style.backgroundColor =
          "transparent";
        document.getElementById("btnSustainability").style.backgroundColor =
          "rgba(96, 96, 96, 0.7)";
      }
    } else if (side == "perfil") {
      document.getElementById("btnPerfilCompany").style.backgroundColor =
        "rgba(96, 96, 96, 0.7)";
      document.getElementById("btnPromotions").style.backgroundColor =
        "transparent";
      document.getElementById("btnSustainability").style.backgroundColor =
        "transparent";
    } else if (side == "notificacoes") {
      document.getElementById("btnPerfilCompany").style.backgroundColor =
        "transparent";
      document.getElementById("btnPromotions").style.backgroundColor =
        "rgba(96, 96, 96, 0.7)";
      document.getElementById("btnSustainability").style.backgroundColor =
        "transparent";
    } else if (side == "sustentabilidade") {
      document.getElementById("btnPerfilCompany").style.backgroundColor =
        "transparent";
      document.getElementById("btnPromotions").style.backgroundColor =
        "transparent";
      document.getElementById("btnSustainability").style.backgroundColor =
        "rgba(96, 96, 96, 0.7)";
    }
  };

  componentDidMount() {
    this.pathSideBorder("url");
  }

  render() {
    return (
      <div className="navDashboard">
        <Link
          className="linkNavDashboard"
          to="PerfilCompany"
          id="btnPerfilCompany"
          ref={this.changePerfilCompany}
          onClick={() => {
            this.state.pathSideBorder("perfil");
          }}
        >
          <i className="bi bi-house-door"></i>
          <h5>Perfil empresa</h5>
        </Link>
        <Link
          className="linkNavDashboard"
          to="Notificacoes"
          id="btnPromotions"
          ref={this.changeNotificacao}
          onClick={() => {
            this.state.pathSideBorder("notificacoes");
          }}
        >
          <i class="bi bi-bell"></i>
          <h5>Notificações</h5>
        </Link>
        <Link
          className="linkNavDashboard"
          to="Sustainability"
          id="btnSustainability"
          ref={this.changeSustainability}
          onClick={() => {
            this.state.pathSideBorder("Sustainability");
          }}
        >
          <i className="bi bi-clipboard-data"></i>
          <h5>Relatórios</h5>
        </Link>
      </div>
    );
  }
}

export default NavDashboard;
