import React, { Component } from "react";
import LogoBaylit from "../../../Images/logo_baylit_black.svg";
import { getUserById } from "../../../../Helpers/UserHelper";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { getNotificacoesUtilizador } from "../../../../Helpers/UserHelper";

import ReactDOM from "react-dom"

class MainSide extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.id,
      className: this.props.className,
      expandFunction: this.props.expandFunction,
      perfilContentId: this.props.perfilContentId,
      shopContentId: this.props.shopContentId,
      promotionContentId: this.props.promotionContentId,

      openLogin: this.props.openLogin,
      goBackSideBar: this.props.goBackSideBar,

      userType: "a",
      userName: "",
    };

    this.refNotificacoes = React.createRef()
  }

  async getNotificacoes(){
    let info = JSON.parse(localStorage.getItem('baylitInfo'))

    if (info && info.logged == "true"){

    
      let res = await getNotificacoesUtilizador(info.id, info.token)

      let cont = 0

      if (res != false){

        for (let i = 0; i < res.length; i++){
          if (res[i].vista == false){
            cont += 1
          }
        }
      }

      if (cont > 0){
      
        let htmlAppend = <div className="notificacaoMainSide">
                      <span>{cont}</span>
                    </div>;


        ReactDOM.render(htmlAppend,this.refNotificacoes.current)
      }

    }
    
  }

  ifLoggedSideMainMenu = async () => {
    let verify = JSON.parse(localStorage.getItem("baylitInfo"));

    if (verify) {
      if (verify.logged == "true") {
        if (verify.tipo == "Consumidor") {
          let user = await getUserById(verify.id, verify.tipo);

          this.setState({
            userType: verify.tipo,
            userName: user.nome,
          });
        } else if (verify.tipo == "Transportador") {
        } else if (verify.tipo == "Fornecedor") {
        } else if (verify.tipo == "Administrador") {
        }
      } else {
        // this.state.userType = "NaoAutenticado";
        this.setState({
          userType: verify.tipo,
        });
      }
    } else {
      setTimeout(this.ifLoggedNav, 100);
    }
  };

  userPerfilButton() {
    if (this.state.userType == "NaoAutenticado") {
      return (
        <li className="blockLoginSideBar">
          <p>
            Ainda não tens a sessão iniciada.
            <br />
            Junta-te à familia Baylit.
          </p>
          <button
            className="btnLoginSideMenu"
            onClick={() => {
              this.state.openLogin();
              this.state.goBackSideBar();
            }}
          >
            Iniciar Sessão
          </button>
          <p>
            Ainda não tens conta?
            <span className="SignUpSideMenu">
              <Link
                to="/SignUp"
                class="toLink"
                onClick={() => {
                  this.state.goBackSideBar();
                }}
              >
                {" "}
                Regista-te
              </Link>
            </span>
          </p>
        </li>
      );
    } else {
      return (
        <li className="perfilSideBar">
          <a href="/perfil" className="toLink">
            <div className="userSideBar">
              <i class="bi bi-person"></i>
              <h5>
                {this.state.userName}
                <div ref={this.refNotificacoes}>
                  {/* <div className="notificacaoMainSide">
                    <span>10</span>
                  </div> */}
                </div>
              </h5>
            </div>
          </a>
          <i
            className="bi bi-chevron-right"
            onClick={() => {
              this.state.expandFunction(
                this.state.id,
                this.state.perfilContentId
              );
            }}
          ></i>
        </li>
      );
    }
  }

  mainLiButton(name, rightArrow) {
    let returnMainLi;
    let forNextContentId;
    let pathLink;

    switch (name) {
      case "Loja":
        pathLink = "/shop";
        break;
      case "Sustentabilidade":
        pathLink = "/sustentabilidade";
        break;
      case "Promoções":
        pathLink = "/shop";
        break;
      default:
        pathLink = "/";
        break;
    }

    if (rightArrow == true) {
      if (name == "Loja") {
        forNextContentId = this.state.shopContentId;
      } else if (name == "Promoções") {
        forNextContentId = this.state.promotionContentId;
      }
      returnMainLi = (
        <li className="mainButtonsSideBar">
          <a href={pathLink} className="toLink">
            <h2>{name}</h2>
          </a>
          <i
            className="bi bi-chevron-right"
            onClick={() => {
              this.state.expandFunction(this.state.id, forNextContentId);
            }}
          ></i>
        </li>
      );
    } else {
      returnMainLi = (
        <a href={pathLink} className="toLink">
          <li className="mainButtonsSideBar">
            <h2>{name}</h2>
          </li>
        </a>
      );
    }

    return returnMainLi;
  }

  secondaryButton(name, icon) {
    let pathLink;
    switch (name) {
      case "Carrinho":
        pathLink = "/shoppingcar";
        break;
      case "Favoritos":
        pathLink = "/perfil/favoritos";
        break;
      case "Encomendas":
        pathLink = "/perfil";
        break;
      case "Ajuda":
        pathLink = "/faq";
        break;
      default:
        pathLink = "/";
        break;
    }
    if (name == "Encomendas") {
      if (this.state.userType == "Consumidor") {
        return (
          <a href={pathLink} className="toLink">
            <li className="secondaryButtonsSideBar">
              <i className={icon}></i>
              <h5>{name}</h5>
            </li>
          </a>
        );
      } else {
        return;
      }
    } else {
      return (
        <a href={pathLink} className="toLink">
          <li className="secondaryButtonsSideBar">
            <i className={icon}></i>
            <h5>{name}</h5>
          </li>
        </a>
      );
    }
  }

  aboutUsButton() {
    return (
      <a href="/aboutus" className="toLink">
        <li className="secondaryButtonsSideBar">
          <img src={LogoBaylit} alt="Logotipo Baylit" />
          <h5>Sobre Nós</h5>
        </li>
      </a>
    );
  }

  async componentDidMount() {
    // efr
    this.ifLoggedSideMainMenu();

    await this.getNotificacoes()
  }

  // updateState()

  render() {
    // this.ifLoggedSideMainMenu();

    return (
      <div id={this.state.id} className={this.state.className}>
        {this.userPerfilButton()}
        <hr />
        {this.mainLiButton("Loja", true)}
        {this.mainLiButton("Sustentabilidade", false)}
        {this.mainLiButton("Promoções", true)}
        <hr />
        <hr />
        <hr />
        {this.secondaryButton("Carrinho", "bi bi-bag")}
        {this.secondaryButton("Favoritos", "bi bi-heart")}
        {this.secondaryButton("Encomendas", "bi bi-box-seam")}
        {this.secondaryButton("Ajuda", "bi bi-question-circle")}
        <hr />
        {this.aboutUsButton()}
      </div>
    );
  }
}

export default MainSide;
