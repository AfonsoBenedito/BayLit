import React, {
  Component,
  useState,
  useEffect,
  useRef,
  createRef,
} from "react";
import "./SignUpTransportador.css";

import termos from "../Termos_Utilização_Baylit.pdf";

import { Link } from "react-router-dom";
import { RegistoTransportador } from "../../../../Helpers/AuthenticationHelper";

class SignUpTransportador extends Component {
  constructor(props) {
    super(props);
    this.state1 = {
      removeSignUpBtn: props.removeSignUpBtn,
    };

    this.state = { isChecked: true };
    //console.log(this.state);
    //this.isItChecked = this.isItChecked.bind(this);
  }

  // isItChecked = () => {
  //   //this.setState({ isChecked: !this.state.isChecked });
  //   this.setState({ isChecked: !this.state.isChecked });
  //   if (this.state.isChecked == true) {
  //     console.log("yey");
  //   } else {
  //     console.log("nop");
  //   }

  //   /* if (this.state.isChecked == true) {
  //     return true;
  //   } else {
  //     return false;
  //   } */
  // };

  async registo(e) {
    e.preventDefault();
    let formData = new FormData(
      document.getElementById("form_registo_transportador")
    );

    let nome = formData.get("name");
    let email = formData.get("email");
    let password = formData.get("pass");
    let morada = formData.get("morada");
    let nif = formData.get("nif");
    let telemovel = formData.get("telemovel");
    let portes = formData.get("portes");

    if (document.getElementById("termos").checked) {
      let res = await RegistoTransportador(
        nome,
        email,
        password,
        morada,
        nif,
        telemovel,
        portes
      );

      if (res == true) {
        window.location = "/Dashboard/PerfilCompany";
      } else {
        let msg_erro = res;
        document.getElementById("erro").innerHTML = msg_erro;
      }
    } else {
      let msgem_erro = "Por Favor, confirme os Termos de Utilização";
      document.getElementById("erro").innerHTML = msgem_erro;
    }
  }

  render() {
    return (
      <>
        <h2 className="titleSignUp">Regista-te como Transportador</h2>
        <div className="mainSignUp">
          <form
            action=""
            id="form_registo_transportador"
            onSubmit={this.registo}
          >
            <h3>Pessoal</h3>
            <div className="signUpNameSurname">
              <div className="signUpName">
                <p>Nome</p>
                <input
                  type="text"
                  placeholder="Nome de utilizador"
                  name="name"
                  id="inputT"
                  required
                />
              </div>
              <div className="signUpSurname">
                <p>Palavra-Passe</p>
                <input
                  type="password"
                  placeholder="Palavra-Passe"
                  name="pass"
                  id="inputT"
                  required
                />
              </div>
            </div>
            <p>Email</p>
            <input
              type="text"
              placeholder="Email"
              name="email"
              id="inputT"
              required
            />
            <p>Morada</p>
            <input
              type="text"
              placeholder="Morada"
              name="morada"
              id="inputT"
              required
            />
            <p>NIF</p>
            <input
              type="text"
              placeholder="Número de Identificação Fiscal"
              name="nif"
              id="inputT"
            />
            <p>Telemóvel</p>
            <input
              type="text"
              placeholder="Número de Telemóvel"
              name="telemovel"
              id="inputT"
            />
            <h3>Empresa</h3>
            <p>Portes</p>
            <input
              type="number"
              min="0.00"
              step="0.01"
              placeholder="Portes"
              name="portes"
              id="inputT"
              required
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

export default SignUpTransportador;
