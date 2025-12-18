import React, { Component } from "react";
import TransportadorCard from "../../Components/TransportadorCard/TransportadorCard";
import ReactDOM from "react-dom";
import {
  getAllConsumidores,
  getAllFornecedores,
  getAllTransportadores,
  getUtilizadorGeralById,
} from "../../../Helpers/UserHelper.jsx";

import { getSedesByTransportador } from "../../../Helpers/TransportadorHelper";
import { AuthVerificationAdmin } from '../../../Helpers/AuthVerification';

import "./Transportadores.css";

class Transportadores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      respostaTransportadores: false,
    };

    this.refTransportadores = React.createRef();
  }

  showNaoBloqueados() {
    console.log("Nao bloqueados");

    let allBloqueados = document.getElementsByClassName(
      "transportadorBloqueado"
    );
    for (let i = 0; i < allBloqueados.length; i++) {
      allBloqueados[i].style.display = "none";
    }

    let allNaoBloqueados = document.getElementsByClassName(
      "transportadorNaoBloqueado"
    );
    for (let i = 0; i < allNaoBloqueados.length; i++) {
      allNaoBloqueados[i].style.display = "block";
    }
  }

  showBloqueados() {
    console.log("Bloqueados");

    let allBloqueados = document.getElementsByClassName(
      "transportadorBloqueado"
    );
    for (let i = 0; i < allBloqueados.length; i++) {
      allBloqueados[i].style.display = "block";
    }

    let allNaoBloqueados = document.getElementsByClassName(
      "transportadorNaoBloqueado"
    );
    console.log(allBloqueados);
    console.log(allNaoBloqueados);
    for (let i = 0; i < allNaoBloqueados.length; i++) {
      allNaoBloqueados[i].style.display = "none";
    }
  }

  showAll() {
    console.log("Todos");

    let allBloqueados = document.getElementsByClassName(
      "transportadorBloqueado"
    );
    for (let i = 0; i < allBloqueados.length; i++) {
      allBloqueados[i].style.display = "block";
    }

    let allNaoBloqueados = document.getElementsByClassName(
      "transportadorNaoBloqueado"
    );
    for (let i = 0; i < allNaoBloqueados.length; i++) {
      allNaoBloqueados[i].style.display = "block";
    }
  }

  async handlerInfo() {
    let respostaTransportadores = await getAllTransportadores();
    // console.log(respostaFornecedores);

    if (respostaTransportadores != false) {
      let listaTransportadores = [];

      for (let i = 0; i < respostaTransportadores.length; i++) {
        let nomeTransportador = respostaTransportadores[i].nome; //Retorna os nomes deles Obrigatorio
        let idTransportador = respostaTransportadores[i]._id; // Obrigatorio
        // let moradas_de_cada1 = respostaFornecedores[i].morada; //Obrigatorio
        let info = JSON.parse(localStorage.getItem("baylitInfo"));
        let sedesTransportador = await getSedesByTransportador(
          idTransportador,
          info.token
        );

        console.log("sedes");
        console.log(sedesTransportador);

        let emailTransportador = respostaTransportadores[i].email; // Obrigatorio
        let nifTransportador = respostaTransportadores[i].nif; //Fica em branco e opcional de preencher
        let telemovelTransportador = respostaTransportadores[i].telemovel;
        let portesTransportador = respostaTransportadores[i].portes;

        let verifyCongelarTransportador = await getUtilizadorGeralById(
          idTransportador
        );

        if (verifyCongelarTransportador != false) {
          verifyCongelarTransportador =
            verifyCongelarTransportador[0].isCongelado;
        }

        let classBlocked;

        if (verifyCongelarTransportador == true) {
          classBlocked = "transportadorBloqueado";
        } else if (
          verifyCongelarTransportador == false ||
          verifyCongelarTransportador == undefined
        ) {
          classBlocked = "transportadorNaoBloqueado";
        }

        if (nifTransportador == undefined) {
          nifTransportador = "Nenhum nif registado";
        }

        if (portesTransportador == undefined) {
          portesTransportador = "Portes de entrega não registado";
        }
        if (telemovelTransportador == undefined) {
          telemovelTransportador = "Nenhum telemovel registado";
        }

        listaTransportadores.push(
          <div className={classBlocked}>
            <TransportadorCard
              nomeTransportador={nomeTransportador}
              idTransportador={idTransportador}
              sedesTransportador={sedesTransportador}
              emailTransportador={emailTransportador}
              nifTransportador={nifTransportador}
              telemovelTransportador={telemovelTransportador}
              portesTransportador={portesTransportador}
              checkBlock={classBlocked}
            />
          </div>
        );
      }

      ReactDOM.render(listaTransportadores, this.refTransportadores.current);
    }
  }

  async componentDidMount() {
    this.handlerInfo();
    await AuthVerificationAdmin()
  }

  render() {
    return (
      <div className="mainTransportadoresPage">
        <h1 className="tituloTransportadoresPage">Transportadores</h1>
        <h3 className="subTituloTransportadoresPage">Administrador</h3>
        <div className="filtrosTransportadoresPage">
          <div
            className="filtroEspecificoTransportadores"
            onClick={async () => {
              this.showAll();
            }}
          >
            <h5>Todos</h5>
          </div>
          <div
            className="filtroEspecificoTransportadores"
            onClick={async () => {
              this.showNaoBloqueados();
            }}
          >
            <h5>Sem restrições</h5>
          </div>
          <div
            className="filtroEspecificoTransportadores"
            onClick={() => {
              this.showBloqueados();
            }}
          >
            <h5>Bloqueados</h5>

            {/* <button onClick={this.handlerInfo()}>Bloqueados</button> */}
          </div>
        </div>

        <div ref={this.refTransportadores} className="displayerTransportadores">
          {/* <ConsumidorCard />
          <ConsumidorCard />
          <ConsumidorCard /> */}
        </div>
      </div>
    );
  }
}

export default Transportadores;
