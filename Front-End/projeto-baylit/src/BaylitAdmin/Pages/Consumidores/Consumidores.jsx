import React, { Component } from "react";
import ConsumidorCard from "../../Components/ConsumidorCard/ConsumidorCard";
import ReactDOM from "react-dom";
import {
  getAllConsumidores,
  getAllFornecedores,
  getAllTransportadores,
  getUtilizadorGeralById,
  getLocaisUtilizador,
} from "../../../Helpers/UserHelper.jsx";

import { AuthVerificationAdmin } from '../../../Helpers/AuthVerification';

import "./Consumidores.css";

class Consumidores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      respostaConsumidores: false,
    };

    this.refConsumidores = React.createRef();
  }

  showNaoBloqueados() {

    let allBloqueados = document.getElementsByClassName("consumidorBloqueado");
    for (let i = 0; i < allBloqueados.length; i++) {
      allBloqueados[i].style.display = "none";
    }

    let allNaoBloqueados = document.getElementsByClassName(
      "consumidorNaoBloqueado"
    );
    for (let i = 0; i < allNaoBloqueados.length; i++) {
      allNaoBloqueados[i].style.display = "block";
    }
  }

  showBloqueados() {

    let allBloqueados = document.getElementsByClassName("consumidorBloqueado");
    for (let i = 0; i < allBloqueados.length; i++) {
      allBloqueados[i].style.display = "block";
    }

    let allNaoBloqueados = document.getElementsByClassName(
      "consumidorNaoBloqueado"
    );
    for (let i = 0; i < allNaoBloqueados.length; i++) {
      allNaoBloqueados[i].style.display = "none";
    }
  }

  showAll() {

    let allBloqueados = document.getElementsByClassName("consumidorBloqueado");
    for (let i = 0; i < allBloqueados.length; i++) {
      allBloqueados[i].style.display = "block";
    }

    let allNaoBloqueados = document.getElementsByClassName(
      "consumidorNaoBloqueado"
    );
    for (let i = 0; i < allNaoBloqueados.length; i++) {
      allNaoBloqueados[i].style.display = "block";
    }
  }

  async handlerInfo() {
    let respostaConsumidores = await getAllConsumidores();

    if (respostaConsumidores != false) {
      let listadeConsumidores = [];

      for (let i = 0; i < respostaConsumidores.length; i++) {
        let nomeConsumidor = respostaConsumidores[i].nome; //Retorna os nomes deles Obrigatorio
        let idConsumidor = respostaConsumidores[i]._id; // Obrigatorio
        // let moradas_de_cada1 = respostaConsumidores[i].morada; //Obrigatorio
        let info = JSON.parse(localStorage.getItem("baylitInfo"));
        let moradasConsumidor = await getLocaisUtilizador(
          idConsumidor,
          info.token
        );
        let emailConsumidor = respostaConsumidores[i].email; // Obrigatorio
        let nifConsumidor = respostaConsumidores[i].nif; //Fica em branco e opcional de preencher

        // if (moradasConsumidor != false) {
        //   console.log("lalalala");
        //   console.log(moradasConsumidor.locais);
        // }

        let veriryCongeladoCondumidor = await getUtilizadorGeralById(
          idConsumidor
        );
        if (veriryCongeladoCondumidor != false) {
          veriryCongeladoCondumidor = veriryCongeladoCondumidor[0].isCongelado;
        }
        // veriryCongeladoCondumidor = veriryCongeladoCondumidor.isCongelado;
        // console.log(veriryCongeladoCondumidor);
        // veriryCongeladoCondumidor[0].isCongelado == true;
        // console.log(veriryCongeladoCondumidor[0].isCongelado);
        // if(veriryCongeladoCondumidor[0].isCongelado)
        // console.log(veriryCongeladoCondumidor);

        let classBlocked;

        if (veriryCongeladoCondumidor == true) {
          classBlocked = "consumidorBloqueado";
        } else if (
          veriryCongeladoCondumidor == false ||
          veriryCongeladoCondumidor == undefined
        ) {
          classBlocked = "consumidorNaoBloqueado";
        }

        if (nifConsumidor == undefined) {
          nifConsumidor = "Nenhum nif registado";
        }

        listadeConsumidores.push(
          <div className={classBlocked}>
            <ConsumidorCard
              nomes_de_cada1={nomeConsumidor}
              ids_de_cada1={idConsumidor}
              moradasConsumidor={moradasConsumidor}
              emails_de_cada1={emailConsumidor}
              nifs_de_cada1={nifConsumidor}
              checkBlock={classBlocked}
            />
          </div>
        );
      }

      ReactDOM.render(listadeConsumidores, this.refConsumidores.current);
    }
  }

  async componentDidMount() {
    this.handlerInfo();
    await AuthVerificationAdmin()
  }

  render() {
    return (
      <div className="mainConsumidoresPage">
        <h1 className="tituloConsumidoresPage">Consumidores</h1>
        <h3 className="subTituloConsumidoresPage">Administrador</h3>
        <div className="filtrosConsumidoresPage">
          <div
            className="filtroEspecificoConsumidor"
            onClick={async () => {
              this.showAll();
            }}
          >
            <h5>Todos</h5>
          </div>
          <div
            className="filtroEspecificoConsumidor"
            onClick={async () => {
              this.showNaoBloqueados();
            }}
          >
            <h5>Sem restrições</h5>
          </div>
          <div
            className="filtroEspecificoConsumidor"
            onClick={() => {
              this.showBloqueados();
            }}
          >
            <h5>Bloqueados</h5>

            {/* <button onClick={this.handlerInfo()}>Bloqueados</button> */}
          </div>
        </div>

        <div ref={this.refConsumidores} className="displayerConsumidores">
          {/* <ConsumidorCard />
          <ConsumidorCard />
          <ConsumidorCard /> */}
        </div>
      </div>
    );
  }
}

export default Consumidores;
