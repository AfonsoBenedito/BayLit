import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
// import { alterarPalavraPasse } from "../../../src/Helpers/DefinitionsHelper";
import {
  mudarPasswordTransportador,
  mudarPasswordFornecedor,
  deleteUtilizador,
} from "../../../Helpers/UserHelper";

import { AuthVerificationDashboard } from "../../../Helpers/AuthVerification";

import "./Definitions.css";

class Definitions extends Component {
  state = {};

  toggleTheme() {
    // console.log("a");
    document.documentElement.style.setProperty("--mainColor", "#9394a5"); //#DEE4E7
    document.documentElement.style.setProperty("--secondaryColor", "	#e4e5f1"); //#fff
    document.documentElement.style.setProperty("--fontColor", "#0B0B0C");
  }

  openCloseChangePassword() {
    let divOpcaoEliminarConta = document.getElementById(
      "divOpcaoEliminarConta"
    );
    let divOpcaoTermos = document.getElementById("divOpcaoTermos");
    let divOpcaoMudarPass = document.getElementById("divOpcaoMudarPass");

    if (divOpcaoMudarPass.style.display === "block") {
      divOpcaoMudarPass.style.display = "none";
      divOpcaoTermos.style.display = "none";
      divOpcaoEliminarConta.style.display = "none";
    } else {
      divOpcaoMudarPass.style.display = "block";
      divOpcaoTermos.style.display = "none";
      divOpcaoEliminarConta.style.display = "none";
    }
  }

  openCloseDeleteAccount() {
    let divOpcaoEliminarConta = document.getElementById(
      "divOpcaoEliminarConta"
    );
    let divOpcaoTermos = document.getElementById("divOpcaoTermos");
    let divOpcaoMudarPass = document.getElementById("divOpcaoMudarPass");

    if (divOpcaoEliminarConta.style.display === "block") {
      divOpcaoEliminarConta.style.display = "none";
      divOpcaoTermos.style.display = "none";
      divOpcaoMudarPass.style.display = "none";
    } else {
      divOpcaoEliminarConta.style.display = "block";
      divOpcaoTermos.style.display = "none";
      divOpcaoMudarPass.style.display = "none";
    }
  }

  openCloseTermos() {
    let divOpcaoEliminarConta = document.getElementById(
      "divOpcaoEliminarConta"
    );
    let divOpcaoTermos = document.getElementById("divOpcaoTermos");
    let divOpcaoMudarPass = document.getElementById("divOpcaoMudarPass");

    if (divOpcaoTermos.style.display === "block") {
      divOpcaoTermos.style.display = "none";
      divOpcaoEliminarConta.style.display = "none";
      divOpcaoMudarPass.style.display = "none";
    } else {
      divOpcaoTermos.style.display = "block";
      divOpcaoEliminarConta.style.display = "none";
      divOpcaoMudarPass.style.display = "none";
    }
  }

  async changePass() {
    let formData = new FormData(
      document.getElementsByClassName("formsMudarPasse")[0]
    );
    let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));
    let id = baylitInfo.id;
    let tipo = baylitInfo.tipo;
    let token = baylitInfo.token;
    let passA = formData.get("passA");
    let passC = formData.get("passC");
    let passC2 = formData.get("passC2");
    // console.log(passA, passC, passC2);

    if (passC == passC2 && passC.length > 1) {
      if (tipo === "Fornecedor") {
        let res = await mudarPasswordFornecedor(id, token, passA, passC);

        // console.log(res)
        if (res === true) {
          document.getElementById("good").innerHTML =
            "A sua Palavra Passe foi alterada com sucesso.";

          setTimeout(
            function() {
                window.location.href = "/Dashboard/Definitions"
            }
            .bind(this),
            1500
          );
        } else {
          document.getElementById("bad").innerHTML =
            "Algo de errado aconteceu, tente novamente.";
        }
      } else if (tipo == "Transportador") {
        let res = await mudarPasswordTransportador(id, token, passA, passC);

        if (res === true) {
          document.getElementById("good").innerHTML =
            "A sua Palavra Passe foi alterada com sucesso.";

          setTimeout(
            function() {
                window.location.href = "/Dashboard/Definitions"
            }
            .bind(this),
            1500
          );

        } else {
          document.getElementById("bad").innerHTML =
            "Algo de errado aconteceu, tente novamente.";
        }
      }
    }
  }

  async deleteAcc() {
    let formData = new FormData(
      document.getElementsByClassName("formPass4")[0]
    );
    let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));
    let id = baylitInfo.id;
    let token = baylitInfo.token;

    let passA = formData.get("inputsChangePWD4");
    //ta a dar erro , o passA vem a null idk why
    // console.log("ai1");
    // console.log(passA);
    // console.log("ai2");
    if (passA.length > 1) {



      let res = await deleteUtilizador(id, token);
      // let res = false;
      if (res === true) {
        localStorage.removeItem('baylitInfo');

        document.getElementById("good").innerHTML =
          "Conta apagada com sucesso, adeus.";
        setTimeout(
          function() {
              window.location.href = "/Dashboard"
          }
          .bind(this),
          1500
        ); 
        
      } else {
        document.getElementById("bad").innerHTML =
          "Algo de errado aconteceu, tente novamente.";
      }
    }
  }

  async componentDidMount(){
    await AuthVerificationDashboard();
  }

  render() {
    return (
      <div className="mainDefinitions">
        <div className="topBlockDefinitions">
          <h2 className="mainPath">Definições</h2>
          <div className="mainDivOfDefinitions">
            <div
              className="options_Definitions"
              onClick={this.openCloseChangePassword}
            >
              <div className="definitionsDivConstant">
                <p className="title_Definitions" id="olhaTema">
                  Mudar Palavra Passe
                </p>
                {/* <i class="bi bi-patch-plus plusDefinitionsIcon"></i> */}
              </div>
            </div>
            {/*<div className="options_Definitions" onClick={this.toggleTheme}>
              <p className="title_DefinitionsTheme" id="olhaTema">
                Mudar o Tema
              </p>
              {/* <i class="bi bi-patch-plus plusDefinitionsIcon"></i> 
            </div>*/}

            <div className="options_Definitions" onClick={this.openCloseTermos}>
              <div className="definitionsDivConstant">
                <p className="title_Definitions" id="olhaTema">
                  Termos de utilização
                </p>
                {/* <i class="bi bi-patch-plus plusDefinitionsIcon"></i> */}
              </div>
            </div>

            <div
              className="options_Definitions"
              onClick={this.openCloseDeleteAccount}
            >
              <div className="definitionsDivConstant">
                <p className="title_Definitions" id="olhaTema">
                  Eliminar a Conta
                </p>
                {/* <i class="bi bi-patch-plus plusDefinitionsIcon"></i> */}
              </div>
            </div>
          </div>
        </div>
        <div id="divOpcaoMudarPass">
          <div id="div_changepassword_dashboard">
            <form id="formPass" className="formsMudarPasse">
              <h3 id="titulo_mudarPass">
                Aqui poderá mudar a sua Palavra-Passe
              </h3>

              <p id="titulo_inputs_pass">Palavra-passe Atual</p>
              <input
                type="password"
                placeholder="Palavra-passe Atual"
                className="inputsChangePWD"
                id="passA"
                name="passA"
              />
              <p id="titulo_inputs_pass">Palavra-passe Nova</p>
              <input
                type="password"
                placeholder="Palavra-passe Nova"
                className="inputsChangePWD"
                id="passC"
                name="passC"
              />
              <p id="titulo_inputs_pass">Palavra-passe Nova (Confirmação)</p>
              <input
                type="password"
                placeholder="Palavra-passe Nova"
                className="inputsChangePWD"
                id="passC2"
                name="passC2"
              />

              <button id="btnDefinitionsPass" type="button" onClick={async () => {await this.changePass()}}>
                Alterar Palavra-Passe
              </button>
            </form>
            <p id="good"></p>
            <p id="bad"></p>
          </div>
        </div>
        <div id="divOpcaoEliminarConta">
          <div id="div_changepassword_deleteAcc">
            <form id="formPass" className="formPass4">
              <h3 id="titulo_mudarPass">
                Ao eliminar a sua conta todos os seus dados serão perdidos.
              </h3>
              <h3 id="titulo_mudarPass">Este ato é irreversível.</h3>

              <p id="titulo_inputs_pass">Palavra-passe Atual</p>
              <input
                className="inputsChangePWD"
                type="password"
                placeholder="Palavra-passe Atual"
                name="inputsChangePWD4"
                id="passA"
              />

              <button id="btnDefinitionsDelete" onClick={async () => {await this.deleteAcc()}}>
                Apagar Conta
              </button>
            </form>

            <p id="bad"></p>
          </div>

          {/* ashdo */}
        </div>
        <div id="divOpcaoTermos">
          <div id="div_geral_defenicaoT">
            <h2 id="relatorio_termos_titloA">Armazenamento de dados</h2>
            <p id="relatorio_termos_textoA">
              Os armazenamentos de todos os seus dados estão protegidos pela
              equipa da Baylit, estes não serão disponibilizados para outros de
              modo a garantir a sua privacidade. As palavras-passes não são
              guardadas em claro, é utilizado o serviço bcrypt que processa as
              mesmas tratando depois da sua encriptação.
            </p>
            <h2 id="relatorio_termos_titloA">Conduta Online</h2>
            <p id="relatorio_termos_textoA">
              O Utilizador concorda em utilizar o Site exclusivamente para as
              finalidades permitidas pela legislação. É proibido publicar ou
              transmitir ao Site ou através dele qualquer material considerado
              ilegal, prejudicial, ameaçador, abusivo, difamatório, vulgar,
              obsceno, profano, que provoque ódio ou qualquer outro material que
              possa resultar em responsabilidade civil ou criminal de acordo com
              a legislação. Podemos divulgar qualquer conteúdo ou comunicação
              eletrónica de qualquer tipo (incluindo o seu perfil, endereço de
              e-mail e outras informações) (1) para satisfazer exigências
              legais, regulamentares ou governamentais; (2) se a divulgação for
              necessária ou apropriada para a operação do Site; (3) para
              proteger os direitos ou a propriedade do Grupo, das suas afiliadas
              e do Utilizador.
            </p>
            <h2 id="relatorio_termos_titloA">
              Ligações para sites de terceiros
            </h2>
            <p id="relatorio_termos_textoA">
              As ligações constantes deste Site poderão conduzir a serviços ou
              sites não controlados ou operados pelo Grupo. Fornecemos tais
              ligações para sua conveniência e informação. As ligações não
              constituem uma aprovação do site ou serviço. Não assumimos
              qualquer responsabilidade por outros sites ou serviços. Toda e
              qualquer utilização que o Utilizador fizer dos sites ou serviços
              ligados a partir deste Site é da sua exclusiva responsabilidade.
            </p>
          </div>
        </div>
        {/* <div id="divOpcaoMudarTema"></div> */}
      </div>
    );
  }
}

export default Definitions;
