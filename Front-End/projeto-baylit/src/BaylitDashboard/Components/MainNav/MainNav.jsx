import React, { Component } from "react";
import WordBaylit from "../../Images/word_baylit_white.png";
import LogoBaylit from "../../Images/logo_baylit_white.png";
import "./MainNav.css";
import { Outlet } from "react-router-dom";
//import { getUser } from "../../../Helpers/UserHelper";
import {
  getFornecedor,
  getTransportador,
  getUserT,
} from "../../../Helpers/UserHelper";
import { Link } from "react-router-dom";

class MainNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closeNavMobile: this.props.closeNavMobile,
    };

    this.myRefArmazens = React.createRef();
    this.myRefFuncionarios = React.createRef();
    this.myRefProdutos = React.createRef();
    this.myRefOrders = React.createRef();
  }

  // FECHAR NAV
  closeMainNav() {
    // HIDE CLOSE BUTTON
    document.getElementById("closeNavIcon").style.display = "none";
    document.getElementById("openNavIcon").style.display = "inline-block";

    // MINIMIZE NAV
    document.getElementById("mainNav").style.width = "50px";

    document.documentElement.style.setProperty("--widthNav", "50px");

    // HIDE LOGO
    document.getElementById("iconBaylitDash").style.display = "none";

    // HIDE TEXT FROM BUTTONS
    var elementsBtnText = document.getElementsByClassName("navButtonText");
    for (var i = 0, len = elementsBtnText.length; i < len; i++) {
      elementsBtnText[i].style.display = "none";
    }

    // CENTER ICO IN BUTTONS
    var elementsBtn = document.getElementsByClassName("navButton");
    for (var i = 0, len = elementsBtn.length; i < len; i++) {
      elementsBtn[i].style.justifyContent = "center";
    }

    document.getElementById("navPerfil").style.justifyContent = "center";
    document.getElementById("navPerfilPhoto").style.marginRight = "0";

    document.getElementById("navLogoBaylit").style.justifyContent = "center";

    // HIDE COMPONENTS FROM PERFIL NAV
    document.getElementById("navPerfilText").style.display = "none";
    document.getElementById("openDefinitionsPerfilNav").style.display = "none";
    document.getElementById("navPerfilPhoto").style.width = "30px";
    document.getElementById("navPerfilPhoto").style.height = "30px";
  }

  // ABRIR NAV
  openMainNav() {
    // HIDE CLOSE BUTTON
    document.getElementById("closeNavIcon").style.display = "inline-block";
    document.getElementById("openNavIcon").style.display = "none";

    // MINIMIZE NAV
    document.getElementById("mainNav").style.width = "230px";

    document.documentElement.style.setProperty("--widthNav", "230px");

    // HIDE LOGO
    document.getElementById("iconBaylitDash").style.display = "inline-block";

    // HIDE TEXT FROM BUTTONS
    var elementsBtnText = document.getElementsByClassName("navButtonText");
    for (var i = 0, len = elementsBtnText.length; i < len; i++) {
      elementsBtnText[i].style.display = "flex";
    }

    // CENTER ICO IN BUTTONS
    var elementsBtn = document.getElementsByClassName("navButton");
    for (var i = 0, len = elementsBtn.length; i < len; i++) {
      elementsBtn[i].style.justifyContent = "flex-start";
    }

    document.getElementById("navPerfil").style.justifyContent = "space-between";
    document.getElementById("navPerfilPhoto").style.marginRight = "10px";

    document.getElementById("navLogoBaylit").style.justifyContent =
      "space-between";

    // HIDE COMPONENTS FROM PERFIL NAV
    document.getElementById("navPerfilText").style.display = "inline-block";
    document.getElementById("openDefinitionsPerfilNav").style.display =
      "inline-block";
    document.getElementById("navPerfilPhoto").style.width = "40px";
    document.getElementById("navPerfilPhoto").style.height = "40px";
  }

  handlerMobile(open) {
    // if (window.innerWidth < 600) {
    //   open();
    //   document.getElementById("closeNavIcon").style.display = "none";
    // } else if (
    //   window.innerWidth > 600 &&
    //   document.getElementById("openNavIcon").style.display != "inline-block"
    // ) {
    //   document.getElementById("closeNavIcon").style.display = "inline-block";
    // }
  }

  endSession() {
    localStorage.clear();
    window.location = "/Dashboard/Authentication";
  }

  openTab() {
    let a = document.getElementById("dropwdown_menu");
    if (a.style.display === "block") {
      a.style.display = "none";
    } else {
      a.style.display = "block";
    }
  }

  async profile() {
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    if (data != null) {
      let tipo = data.tipo;
      let id = data.id;

      document.getElementById("tipo").innerHTML = tipo;

      if (tipo == "Transportador") {
        let res = await getTransportador(id);
        if (res != false) {
          document.getElementById("nome").innerHTML = res.nome;

          document.getElementById("navPerfilPhoto").style.backgroundColor =
            "green";
          let a = document.getElementById("navPerfilPhoto");
          let nome = res.nome;
          let letra_nome = nome.charAt(0);
          a.append(letra_nome);
          a.style.fontSize = "25px";
          // console.log("ENTERI");
          document.getElementById("mainNavFT").innerHTML =
            "Meios de transporte";
          document.getElementById("produtosIcon").style.display = "none";
          document.getElementById("transportesIcon").style.display = "block";

          document.getElementById("mainNavAS").innerHTML = "Sedes";
          document.getElementById("mainNavVS").innerHTML = "Serviços";
          document.getElementById("mainNavFC").innerHTML = "Condutores";

          this.myRefArmazens.current.setAttribute("href", "/dashboard/Sedes");
          this.myRefFuncionarios.current.setAttribute(
            "href",
            "/dashboard/Condutores"
          );
          this.myRefProdutos.current.setAttribute(
            "href",
            "/dashboard/Transportes"
          );
          this.myRefOrders.current.setAttribute("href", "/dashboard/Servicos");
        }
      } else if (tipo == "Fornecedor") {
        document.getElementById("transportesIcon").style.display = "none";
        document.getElementById("mainNavAS").innerHTML = "Armazéns";
        document.getElementById("mainNavVS").innerHTML = "Vendas";
        document.getElementById("mainNavFC").innedHTML = "Funcionários";
        let res1 = await getFornecedor(id);
        document.getElementById("nome").innerHTML = res1.nome;
        document.getElementById("navPerfilPhoto").style.backgroundColor =
          "var(--corUtilizador)";
        let nome = res1.nome;
        let letra_nome = nome.charAt(0);
        let a = document.getElementById("navPerfilPhoto");
        a.append(letra_nome);
        a.style.fontSize = "25px";
      } else {
        document.getElementById("navPerfil").style.display = "hidden";
        //como n tem localStorage Redirect para a Pagina inicial da DASHboard (?)
      }
    }
  }

  componentDidMount() {
    this.profile();
  }

  render() {
    window.addEventListener("resize", () => {
      this.handlerMobile(this.openMainNav);
    });

    // window.onload = this.profile;
    return (
      <>
        <div id="backgroundCloseNav"></div>
        <nav id="mainNav" className="mainNav">
          <div className="upDiv">
            <div id="navLogoBaylit">
              <img id="iconBaylitDash" src={WordBaylit}></img>
              <div
                id="closeNavIcon"
                onClick={() => {
                  this.closeMainNav();
                }}
              >
                <i className="bi bi-chevron-left"></i>
              </div>

              <div
                id="openNavIcon"
                onClick={() => {
                  this.openMainNav();
                }}
              >
                <i className="bi bi-chevron-right"></i>
              </div>

              <div
                id="closeMobileNavIcon"
                onClick={() => {
                  this.state.closeNavMobile();
                }}
              >
                <i className="bi bi-x-lg"></i>
              </div>
            </div>
            <div id="navPerfil">
              <div className="navPerfilSettings">
                <div id="navPerfilPhoto" className="navPerfilPhoto"></div>
                <div id="navPerfilText" className="navPerfilText">
                  <h6 id="nome"></h6>

                  <p id="tipo"></p>
                </div>
              </div>
              <i
                id="openDefinitionsPerfilNav"
                className="bi bi-three-dots-vertical"
                onClick={() => {
                  this.openTab();
                }}
              ></i>
            </div>
            <div className="dropdown_menu" id="dropwdown_menu">
              <Link
                className="barLink"
                exact="true"
                to="/dashboard/PerfilCompany"
              >
                <div id="editar_perfil">
                  <i class="bi bi-person-circle" id="icone_perfil"></i>
                  <h5 className="navButtonText1" id="edit">
                    Editar Perfil
                  </h5>
                </div>
              </Link>
              <div id="end_session" onClick={this.endSession}>
                <i class="bi bi-box-arrow-right" id="icone_end"></i>
                <h5 className="navButtonText1" id="end">
                  Terminar Sessão
                </h5>
              </div>
            </div>
            <hr />
            <Link
              className="barLink"
              exact="true"
              to="/dashboard/PerfilCompany"
            >
              <div className="navButton">
                <i className="bi bi-grid"></i>
                <h5 className="navButtonText">Dashboard</h5>
              </div>
            </Link>
            <Link className="barLink" exact="true" to="/dashboard/Notificacoes">
              <div className="navButton">
                <i class="bi bi-bell"></i>
                <h5 className="navButtonText">Notificações</h5>
              </div>
            </Link>
            <hr />
            <a
              ref={this.myRefFuncionarios}
              className="barLink"
              exact="true"
              href="/dashboard/Employees"
            >
              <div className="navButton">
                <i className="bi bi-people"></i>
                <h5 id="mainNavFC" className="navButtonText">
                  Funcionários
                </h5>
              </div>
            </a>
            <a
              ref={this.myRefProdutos}
              className="barLink"
              exact="true"
              href="/dashboard/Products"
            >
              <div className="navButton">
                <i
                  id="transportesIcon"
                  className="bi bi-truck transportesIcon"
                ></i>
                <i
                  id="produtosIcon"
                  className="bi bi-box-seam produtosIcon"
                ></i>
                <h5 id="mainNavFT" className="navButtonText">
                  Produtos
                </h5>
              </div>
            </a>
            <a
              ref={this.myRefArmazens}
              className="barLink"
              exact="true"
              href="/dashboard/Warehouses"
            >
              <div className="navButton">
                <i className="bi bi-building"></i>
                <h5 id="mainNavAS" className="navButtonText">
                  Armazéns
                </h5>
              </div>
            </a>
            <a
              ref={this.myRefOrders}
              className="barLink"
              exact="true"
              href="/dashboard/Orders"
            >
              <div className="navButton">
                <i className="bi bi-wallet"></i>
                <h5 id="mainNavVS" className="navButtonText">
                  Vendas
                </h5>
              </div>
            </a>
            <hr />
            <Link
              className="barLink"
              exact="true"
              to="/dashboard/Sustainability"
            >
              <div className="navButton">
                <i className="bi bi-clipboard-data"></i>
                <h5 className="navButtonText">Relatórios</h5>
              </div>
            </Link>
            {/* <Link className="barLink" exact="true" to="/dashboard/Messages">
              <div className="navButton">
                <i className="bi bi-send"></i>
                <h5 className="navButtonText">Mensagens</h5>
              </div>
            </Link> */}
            <Link className="barLink" exact="true" to="/dashboard/Definitions">
              <div className="navButton">
                <i className="bi bi-gear"></i>
                <h5 className="navButtonText">Definições</h5>
              </div>
            </Link>
          </div>
          <Link className="barLink" exact="true" to="/dashboard/Support">
            <div className="downDiv">
              <div className="navButton">
                <img src={LogoBaylit} alt="Logotipo Baylit" />
                <h5 className="navButtonText">Suporte</h5>
              </div>
            </div>
          </Link>
        </nav>
        <Outlet />
      </>
    );
  }
}

export default MainNav;
