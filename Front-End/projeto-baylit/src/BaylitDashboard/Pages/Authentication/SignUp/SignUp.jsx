import React, { Component } from "react";
import "./SignUp.css";
import WordBaylit from "../../../Images/word_baylit_white.png";

class SignUp extends Component {
  state = {
    removeSignUpBtn: this.props.removeSignUpBtn,
  };

  render() {
    return (
      <>
        <img className="imageBaylitSignUp" src={WordBaylit} alt="" />
        <h2 className="titleSignUp">Regista-te no Baylit Dash</h2>
        <div className="mainSignUp">
          <form action="">
            <h3>Pessoal</h3>
            <div className="signUpNameSurname">
              <div className="signUpName">
                <p>Nome</p>
                <input type="text" placeholder="Nome" name="" id="" />
              </div>
              <div className="signUpSurname">
                <p>Apelido</p>
                <input type="text" placeholder="Apelido" name="" id="" />
              </div>
            </div>
            <p>Nome de utilizador</p>
            <input type="text" placeholder="Nome de utilizador" name="" id="" />
            <p>Email</p>
            <input type="text" placeholder="Email" name="" id="" />
            <p>Palavra-passe</p>
            <input type="text" placeholder="Palavra-passe" name="" id="" />
            <h3>Empresa</h3>
            <p>Nome empresa</p>
            <input type="text" placeholder="Nome empresa" name="" id="" />
            <p>Email empresa</p>
            <input type="text" placeholder="Palavra-passe" name="" id="" />
            <button id="btnSignUpAuth">Registar-me</button>
          </form>
        </div>
      </>
    );
  }
}

export default SignUp;
