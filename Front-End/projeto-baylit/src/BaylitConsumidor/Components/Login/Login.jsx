import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import { Redirect } from "react-router-dom";
import LogoBaylit from "../../Images/word_baylit_black.svg";
import apiInfo from "../../../apiInfo.json";

import "./Login.css";

class Login extends Component {
  state = { closeLogin: this.props.closeLogin };

  async beginSession(e) {
    e.preventDefault();
    let formData = new FormData(document.getElementById("form_autentication"));

    try {
      await fetch(apiInfo.apiLink + "/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("mail"),
          password: formData.get("pass"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          if (data.code == 200) {
            localStorage.clear();

            let toStorage = {
              token: data.data.auth_token,
              id: data.data.user.id,
              logged: "true",
              tipo: data.data.user.tipo,
            };

            localStorage.setItem("baylitInfo", JSON.stringify(toStorage));

            window.location.href = "/Shop";
          } else if (data.code == 400) {
            document.getElementById("mensagem_erro").innerText = data.message;
          }
        });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div id="mainLogin">
        <div
          id="backgroundLogin"
          onClick={() => {
            this.state.closeLogin();
          }}
        ></div>
        <div className="mainBox">
          <i
            className="bi bi-x-lg closeLogin"
            onClick={() => {
              this.state.closeLogin();
            }}
          ></i>
          <div className="loginLogoBaylit">
            <img src={LogoBaylit} alt="Logotipo da Baylit." />
          </div>
          <h3 className="loginTitle">INICIAR SESSÃO PARA OS PRODUTOS BAYLIT</h3>
          <p id="mensagem_erro"></p>
          <form id="form_autentication" onSubmit={this.beginSession}>
            <input placeholder="Endereço de e-mail" name="mail" />
            <input placeholder="Palavra-passe" type="password" name="pass" />
            <div className="aboutLogin">
              {/* <div className="keepSession">
                <input className="checkBox" type="checkbox" />
                <p>Manter sessão iniciada</p>
              </div> */}
              <div className="forgetPass">
                <span>Esqueceu-se da palavra- passe?</span>
              </div>
            </div>
            <p className="privacyPolicy">
              Ao iniciar sessão, concorda com a Política de privacidade e Termos
              de utilização
            </p>
            <button type="submit"> Iniciar Sessão </button>
          </form>
          <p className="registeSection">
            Ainda não estás registado?{" "}
            <span>
              <Link
                onClick={() => {
                  this.state.closeLogin();
                }}
                to="/signup"
                className="toLink"
              >
                Junta-te a nós
              </Link>
            </span>
          </p>
        </div>
      </div>
    );
  }
}

export default Login;
