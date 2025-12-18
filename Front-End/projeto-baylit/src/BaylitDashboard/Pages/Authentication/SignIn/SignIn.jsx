import React, { Component } from "react";
import "./SignIn.css";
import WordBaylit from "../../../Images/word_baylit_white.png";

import { Login } from "../../../../Helpers/AuthenticationHelper";

class SignIn extends Component {
  state = {
    removeSignInBtn: this.props.removeSignInBtn,
  };

  async login(e) {
    e.preventDefault();
    let formData = new FormData(document.getElementById("form_login"));

    let email = formData.get("mail");
    let password = formData.get("pass");

    let res = await Login(email, password);

    if (res == true) {
      window.location = "/Dashboard/PerfilCompany";
    } else {
      let msg_erro = res;
      document.getElementById("erro").innerHTML = msg_erro;
    }

    console.log("entrei");
  }

  render() {
    this.state.removeSignInBtn();
    return (
      <>
        <img className="imageBaylitSignIn" src={WordBaylit} alt="" />
        <h2 className="titleSignIn">Entra no Baylit Dash</h2>
        <div className="mainSignIn">
          <form action="" id="form_login" onSubmit={this.login}>
            <p>Email</p>
            <input
              type="text"
              placeholder="Email"
              name="mail"
              id="inputLOGIN"
            />
            <p>Palavra-passe</p>
            <input
              type="password"
              placeholder="Palavra-passe"
              name="pass"
              id="inputLOGIN"
            />
            <button id="btnSignInAuth">Entrar</button>
          </form>
          <p id="erro"></p>
        </div>
      </>
    );
  }
}

export default SignIn;
