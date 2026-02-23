import React, { Component } from "react";
import "./SignIn.css";
import WordBaylit from "../../Images/word_baylit_white.png";
import apiInfo from "../../../apiInfo.json";

class SignIn extends Component {
  async login(e) {
    e.preventDefault();
    let formData = new FormData(document.getElementById("form_login"));

    let nome = formData.get("name");
    let password = formData.get("pass");

    let res = await fetch(apiInfo.apiLink + "/auth/login/administrador", {
      method: "POST",
      body: JSON.stringify({
        nome: nome,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (data.code == 200) {
      localStorage.clear("baylitInfo");
      let toStorage = {
        token: data.data.auth_token,
        tipo: "Administrador",
        logged: "true",
      };

      localStorage.setItem("baylitInfo", JSON.stringify(toStorage));
      window.location = "/admin/consumidores";
    } else {
      let msg_erro = data.message;
      document.getElementById("erro").innerHTML = msg_erro;
    }
  }

  hideLeft() {
    let a = document.getElementById("btnsUtilizadores");
    a.style.display = "none";

    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    if (info.tipo != "Administrador") {
      document.getElementById("terminarAdmin").style.display = "none";
    }
  }

  async componentDidMount() {
    this.hideLeft();
  }

  render() {
    return (
      <div className="signInComponentDivAdmin">
        <div className="loginLogoBaylit">
          <img className="imageBaylitSignIn" src={WordBaylit} alt="" />
        </div>
        <h2 className="titleSignIn">Bem-Vindo Administrador</h2>
        <div className="mainSignInAdmin">
          <form action="" id="form_login" onSubmit={this.login}>
            <span>Nome</span>
            <input type="text" placeholder="Nome" name="name" id="inputAdmin" />
            <span id="inputPassAdmin">Palavra-passe</span>
            <input
              type="password"
              placeholder="Palavra-passe"
              name="pass"
              id="inputAdmin"
            />
            <button id="btnSignInAuth">Entrar</button>
          </form>
          <p id="erro"></p>
        </div>
        <a href="/" className="btnVisitarSiteCons">
          Visitar Baylit consumidores
        </a>
        <a href="/dashboard" className="btnVisitarSiteForn">
          Visitar Baylit fornecedores e transportadores
        </a>
      </div>
    );
  }
}

export default SignIn;
