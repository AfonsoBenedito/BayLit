import React, { Component } from "react";
import "./SignUp.css";
import WordBaylit from "../../Images/word_baylit_black.svg";
import apiInfo from "../../../apiInfo.json";

import { useSearchParams } from "react-router-dom";

import { AutenticarGoogle } from "../../../Helpers/AuthenticationHelper";

import GoogleLogo from "../../Images/googleLogo.png";
import BaylitLogoRegisto from "../../Images/logo_baylit_black.svg";

function withSearch(Component) {
  return (props) => <Component {...props} params={useSearchParams()} />;
}

class Register extends Component {
  constructor(props) {
    super(props);

    let email = this.props.params[0].get("email");

    this.state = {
      email: email,
    };
  }

  async register(e) {
    e.preventDefault();

    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    if (info.tipo != "NaoAutenticado") {
    } else {
      let formData = new FormData(document.getElementById("form_register"));

      if (formData.get("pass") != formData.get("pass2")) {
        //Erro de passwords
        let mensagemErro = document.getElementById("mensagemFeedbackSignUpIC");
        mensagemErro.style.display = "block";

        let mensagemSucesso = document.getElementById(
          "mensagemFeedbackSignUpCE"
        );
        mensagemSucesso.style.display = "none";
        let mensagemCamposTodos = document.getElementById(
          "mensagemFeedbackSignUpCT"
        );
        mensagemCamposTodos.style.display = "none";

      } else {
        await fetch(apiInfo.apiLink + "/auth/register/consumidor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: formData.get("name") + " " + formData.get("lname"),
            email: formData.get("mail"),
            password: formData.get("pass"),
            id_nao_autenticado: info.id,
          }),
        })
          .then((response) => response.json())
          .then((data) => {

            if (data.code == 201) {
              localStorage.clear();
              localStorage.setItem("baylitInfo", JSON.stringify({
                token: data.data.auth_token,
                id: data.data.user.id,
                logged: "true",
                tipo: data.data.user.tipo,
              }));
              window.location.href = "/Shop";
            } else {
              let mensagemCamposTodos = document.getElementById(
                "mensagemFeedbackSignUpCT"
              );
              mensagemCamposTodos.style.display = "block";

              let mensagemSucesso = document.getElementById(
                "mensagemFeedbackSignUpCE"
              );
              mensagemSucesso.style.display = "none";
              let mensagemErro = document.getElementById(
                "mensagemFeedbackSignUpIC"
              );
              mensagemErro.style.display = "none";

            }
          });
      }
    }
  }

  async componentDidMount() {
    if (this.state.email) {
      let info = JSON.parse(localStorage.getItem("baylitInfo"));

      await AutenticarGoogle(info.id, info.token, this.state.email);
    }
  }

  render() {
    return (
      <div className="mainContentSignUp">
        <img src={WordBaylit} alt="Logotipo Baylit" />
        <h1>
          Torna-te um membro <br /> da marca Baylit
        </h1>
        <p>
          Cria uma conta para teres acesso ao melhor que a <br /> Baylit tem
          para te oferecer. Faz pelo mundo !
        </p>
        <a className="blockLoginOutroTipo" href="/Dashboard/Authentication">
          <img src={BaylitLogoRegisto} alt="Logotipo Google" />
          <span className="signUpOutroTipoButton">
            Registar fornecedor ou transportador
          </span>
        </a>

        {/* Google OAuth disabled for Docker setup */}
        {/* <div className="separeSignUpsConsumidor"></div>

        <a
          className="blockLoginGoogle"
          href="http://localhost:8080/auth/google"
        >
          <img src={GoogleLogo} alt="Logotipo Google" />
          <span className="signUpGoogleButton">Registo com Google</span>
        </a>

        <div className="separeSignUpsConsumidor"></div> */}

        <form id="form_register" onSubmit={this.register}>
          <input
            type="text"
            className="input"
            id="mail"
            name="mail"
            placeholder="Endereço de e-mail"
          ></input>
          <input
            type="password"
            className="input"
            id="pass"
            name="pass"
            placeholder="Palavra-Passe"
          ></input>
          <input
            type="password"
            className="input"
            id="pass2"
            name="pass2"
            placeholder="Confirmar Palavra-Passe"
          ></input>
          <input
            type="text"
            className="input"
            id="name"
            name="name"
            placeholder="Nome Próprio"
          ></input>
          <input
            type="text"
            className="input"
            id="lname"
            name="lname"
            placeholder="Apelido"
          ></input>
          {/* <input
            onChange={this.updateInfo}
            type="text"
            className="input"
            id="bday"
            name="bday"
            placeholder="dd/mm/aaaa"
            value={this.state.bday}
          ></input> */}
          {/* <input
            onChange={this.updateInfo}
            type="text"
            className="input"
            id="pais"
            name="pais"
            placeholder="País"
            value={this.state.pais}
          ></input> */}
          {/* Falta input para Morada, Nif, Telemovel (obrigatorio no backend) */}
          {/* <input
            type="text"
            className="input"
            id="address"
            name="address"
            placeholder="Morada"
          ></input>
          <input
            type="text"
            className="input"
            id="nif"
            name="nif"
            placeholder="Nif"
          ></input>
          <input
            type="text"
            className="input"
            id="phone"
            name="phone"
            placeholder="Número de Telemovél"
          ></input> */}
          <p>
            Ao registar-se concorda com a Politica de Privacidade <br /> e
            Termos de Utilização
          </p>
          <p id="mensagemFeedbackSignUpIC">Passwords não coincidem!</p>

          <p id="mensagemFeedbackSignUpCE">Sucesso! Verifique o E-mail.</p>

          <p id="mensagemFeedbackSignUpCT">Erro! Preencha os campos todos!</p>

          <button id="buttonSignUp" type="submit">
            JUNTA-TE A NÓS
          </button>
        </form>
      </div>
    );
  }
}

export default withSearch(Register);
