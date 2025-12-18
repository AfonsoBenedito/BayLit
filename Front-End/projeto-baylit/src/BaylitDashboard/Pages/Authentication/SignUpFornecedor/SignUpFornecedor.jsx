import React, { Component } from "react";
import "./SignUpFornecedor.css";
import { Link } from "react-router-dom";

import { RegistoFornecedor } from "../../../../Helpers/AuthenticationHelper";
import termos from "../Termos_Utilização_Baylit.pdf";

class SignUpFornecedor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      removeSignUpBtn: props.removeSignUpBtn,
    };
  }

  async registo(e) {
    e.preventDefault();
    let formData = new FormData(
      document.getElementById("form_registo_fornecedor")
    );

    let nome = formData.get("name");
    let email = formData.get("mail");
    let password = formData.get("pass");
    let morada = formData.get("address");
    let nif = formData.get("nif");
    let telemovel = formData.get("phone");

    if (document.getElementById("termos").checked) {
      let res = await RegistoFornecedor(
        nome,
        email,
        password,
        morada,
        nif,
        telemovel
      );

      if (res == true) {
        document.getElementById("erro").innerHTML = "Por favor confirme o seu email";
        // window.location = "/Dashboard/PerfilCompany";
      } else {
        let msg_erro = res;
        document.getElementById("erro").innerHTML = msg_erro;
      }
    } else {
      let msgem_erro = "Por Favor, Confirme os termos de Utilização";
      document.getElementById("erro").innerHTML = msgem_erro;
    }
  }

  render() {
    return (
      <>
        <h2 className="titleSignUp">Regista-te como Fornecedor</h2>
        <div className="mainSignUp">
          <form action="" id="form_registo_fornecedor" onSubmit={this.registo}>
            <h3>Pessoal</h3>
            <div className="signUpNameSurname">
              <div className="signUpName">
                <p>Nome</p>
                <input
                  type="text"
                  placeholder="Nome de Utilizador"
                  name="name"
                  id="inputF"
                  required
                />
              </div>
              <div className="signUpSurname">
                <p>Palavra-Passe</p>
                <input
                  type="password"
                  placeholder="Palavra-Passe"
                  name="pass"
                  id="inputF"
                  required
                />
              </div>
            </div>
            <p>Email</p>
            <input
              type="text"
              placeholder="Email"
              name="mail"
              id="inputF"
              required
            />
            <p>Morada</p>
            <input
              type="text"
              placeholder="Morada"
              name="address"
              id="inputF"
              required
            />
            <p>NIF</p>
            <input
              type="text"
              placeholder="Número de Identificação Fiscal"
              name="nif"
              id="inputF"
            />
            <p>Telemóvel</p>
            <input
              type="text"
              placeholder="Número de Telemóvel"
              name="phone"
              id="inputF"
            />

            <div id="termos_servico">
              <p>Termos de Privacidade</p>
              <input
                type="checkbox"
                name="termos"
                id="termos"
                onClick={this.isItChecked}
              />

              <p id="texto_termos">
                Ao selecionar esta opção, concorda com os nossos
              </p>

              <a
                id="download_termos"
                href={termos}
                download="Termos_Utilização_Baylit.pdf"
              >
                Termos de Utilização
              </a>
            </div>

            <button id="btnSignUpAuth">Registar-me</button>
            <p id="erro"></p>
          </form>
        </div>
      </>
    );
  }
}

export default SignUpFornecedor;
