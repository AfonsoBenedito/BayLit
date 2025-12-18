import React, { Component } from "react";
import FornecedorCard from "../../Components/FornecedorCard/FornecedorCard";
import ReactDOM from "react-dom";
import {
  getAllConsumidores,
  getAllFornecedores,
  getAllTransportadores,
  getUtilizadorGeralById,
} from "../../../Helpers/UserHelper.jsx";

import { getArmazensByFornecedor } from "../../../Helpers/FornecedorHelper";
import { AuthVerificationAdmin } from '../../../Helpers/AuthVerification';

import "./Fornecedores.css";

class Fornecedores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      respostaFornecedores: false,
    };

    this.refFornecedores = React.createRef();
  }

  showNaoBloqueados() {
    console.log("Nao bloqueados");

    let allBloqueados = document.getElementsByClassName("fornecedorBloqueado");
    for (let i = 0; i < allBloqueados.length; i++) {
      allBloqueados[i].style.display = "none";
    }

    let allNaoBloqueados = document.getElementsByClassName(
      "fornecedorNaoBloqueado"
    );
    for (let i = 0; i < allNaoBloqueados.length; i++) {
      allNaoBloqueados[i].style.display = "block";
    }
  }

  showBloqueados() {
    console.log("Bloqueados");

    let allBloqueados = document.getElementsByClassName("fornecedorBloqueado");
    for (let i = 0; i < allBloqueados.length; i++) {
      allBloqueados[i].style.display = "block";
    }

    let allNaoBloqueados = document.getElementsByClassName(
      "fornecedorNaoBloqueado"
    );
    console.log(allBloqueados);
    console.log(allNaoBloqueados);
    for (let i = 0; i < allNaoBloqueados.length; i++) {
      allNaoBloqueados[i].style.display = "none";
    }
  }

  showAll() {
    console.log("Todos");

    let allBloqueados = document.getElementsByClassName("fornecedorBloqueado");
    for (let i = 0; i < allBloqueados.length; i++) {
      allBloqueados[i].style.display = "block";
    }

    let allNaoBloqueados = document.getElementsByClassName(
      "fornecedorNaoBloqueado"
    );
    for (let i = 0; i < allNaoBloqueados.length; i++) {
      allNaoBloqueados[i].style.display = "block";
    }
  }

  async handlerInfo() {
    let respostaFornecedores = await getAllFornecedores();
    // console.log(respostaFornecedores);

    if (respostaFornecedores != false) {
      let listaFornecedores = [];

      for (let i = 0; i < respostaFornecedores.length; i++) {
        let nomeFornecedor = respostaFornecedores[i].nome; //Retorna os nomes deles Obrigatorio
        let idFornecedor = respostaFornecedores[i]._id; // Obrigatorio
        // let moradas_de_cada1 = respostaFornecedores[i].morada; //Obrigatorio
        let info = JSON.parse(localStorage.getItem("baylitInfo"));
        let armazensFornecedor = await getArmazensByFornecedor(
          idFornecedor,
          info.token
        );

        console.log(armazensFornecedor);

        let emailFornecedor = respostaFornecedores[i].email; // Obrigatorio
        let nifFornecedor = respostaFornecedores[i].nif; //Fica em branco e opcional de preencher
        let telemovelFornecedor = respostaFornecedores[i].telemovel;

        let verifyCongelarFornecedor = await getUtilizadorGeralById(
          idFornecedor
        );

        if (verifyCongelarFornecedor != false) {
          verifyCongelarFornecedor = verifyCongelarFornecedor[0].isCongelado;
        }

        let classBlocked;

        if (verifyCongelarFornecedor == true) {
          classBlocked = "fornecedorBloqueado";
        } else if (
          verifyCongelarFornecedor == false ||
          verifyCongelarFornecedor == undefined
        ) {
          classBlocked = "fornecedorNaoBloqueado";
        }

        if (nifFornecedor == undefined) {
          nifFornecedor = "Nenhum nif registado";
        }

        if (telemovelFornecedor == undefined) {
          telemovelFornecedor = "Nenhum telemovel registado";
        }

        listaFornecedores.push(
          <div className={classBlocked}>
            <FornecedorCard
              nomeFornecedor={nomeFornecedor}
              idFornecedor={idFornecedor}
              armazensFornecedor={armazensFornecedor}
              emailFornecedor={emailFornecedor}
              nifFornecedor={nifFornecedor}
              telemovelFornecedor={telemovelFornecedor}
              checkBlock={classBlocked}
            />
          </div>
        );
      }

      ReactDOM.render(listaFornecedores, this.refFornecedores.current);
    }
  }

  async componentDidMount() {
    this.handlerInfo();
    await AuthVerificationAdmin()
  }

  render() {
    return (
      <div className="mainFornecedoresPage">
        <h1 className="tituloFornecedoresPage">Fornecedores</h1>
        <h3 className="subTituloFornecedoresPage">Administrador</h3>
        <div className="filtrosFornecedoresPage">
          <div
            className="filtroEspecificoFornecedores"
            onClick={async () => {
              this.showAll();
            }}
          >
            <h5>Todos</h5>
          </div>
          <div
            className="filtroEspecificoFornecedores"
            onClick={async () => {
              this.showNaoBloqueados();
            }}
          >
            <h5>Sem restrições</h5>
          </div>
          <div
            className="filtroEspecificoFornecedores"
            onClick={() => {
              this.showBloqueados();
            }}
          >
            <h5>Bloqueados</h5>

            {/* <button onClick={this.handlerInfo()}>Bloqueados</button> */}
          </div>
        </div>

        <div ref={this.refFornecedores} className="displayerFornecedores">
          {/* <ConsumidorCard />
          <ConsumidorCard />
          <ConsumidorCard /> */}
        </div>
      </div>
    );
  }
}

export default Fornecedores;
