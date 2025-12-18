import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./Condutores.css";
import CondutoresCard from "./CondutoresCard/CondutoresCard";
import AddCondutor from "../../Components/AddCondutor/AddCondutor";
import CloseDivButton from "../../Components/CloseDivButton/CloseDivButton";
import AddSaveButtonEmployee from "../../Components/AddSaveButtonEmployee/AddSaveButtonEmployee";

import ReactDOM from "react-dom";
import {
  getFuncionarioByFornecedor,
  getArmazemById,
} from "../../../Helpers/FornecedorHelper";
import { adicionarCondutor, getCondutoresByTransportador, deleteCondutor } from "../../../Helpers/TransportadorHelper";
// import { getArmazemById } from "../../../../../dashboard-baylit/src/Helpers/FornecedorHelper";

import { AuthVerificationDashboard } from "../../../Helpers/AuthVerification";

class Condutores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      condutorId: null
    };

    this.refCondutores = React.createRef();

    this.deleteCondutorQuestion = this.deleteCondutorQuestion.bind(this);
    this.deleteCondutorDefinitivo = this.deleteCondutorDefinitivo.bind(this);
  }

  async displayCondutores() {
    let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));
    let transportadorID = baylitInfo.id;
    let condutoresResultado = await getCondutoresByTransportador(transportadorID);
    if (condutoresResultado != false) {
      let listOfCondutores = [];
      for (let condutor in condutoresResultado) {
        let nome = condutoresResultado[condutor].nome;
        let idade = condutoresResultado[condutor].idade;
        let condutorId = condutoresResultado[condutor]._id;
        console.log(condutorId);

        listOfCondutores.push(
        <CondutoresCard
          nome={nome}
          idade={idade}
          condutorId={condutorId}
          backgroundCard="promotionAtive"
          deleteCondutorQuestion={this.deleteCondutorQuestion}
        />)
      }
          
      ReactDOM.render(listOfCondutores, this.refCondutores.current);
    }
  }

  addCondutor() {
    var addEmployeeDiv = document.getElementById("addEmployeeDiv");

    if (addEmployeeDiv.style.display === "block") {
      addEmployeeDiv.style.display = "none";
    } else {
      addEmployeeDiv.style.display = "block";
    }
  }

  async closeAEDivButton() {
    var addEmployeeDiv = document.getElementById("addEmployeeDiv");

    if (addEmployeeDiv.style.display === "none") {
      addEmployeeDiv.style.display = "block";
    } else {
      addEmployeeDiv.style.display = "none";
    }


    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    if (data != null) {
      let id_transportador = data.id;
      let token = data.token;
      let form = new FormData(document.getElementById("addCondutorForm"));

      let nome = form.get("addCondutorInputNome");
      let idade = form.get("addCondutorInputIdade");
      let a = await adicionarCondutor(id_transportador, token, nome, idade);
      
      if (a){
        let employeeFeedback = document.getElementById("addCondutorFeedbackYes");
        employeeFeedback.style.display = "block";
      } else {
        let employeeFeedback = document.getElementById("addCondutorFeedbackNo");
        employeeFeedback.style.display = "block";
      }

      setTimeout(
        function() {
          window.location.href = "/dashboard/Condutores";
        }
        .bind(this),
        2000
      );
    }
  }

  closeREDivButton() {
    var removeEmployeeDiv = document.getElementById("removeEmployeeDiv");

    if (removeEmployeeDiv.style.display === "none") {
      removeEmployeeDiv.style.display = "block";
    } else {
      removeEmployeeDiv.style.display = "none";
    }
  }

  deleteCondutorQuestion(e){
    var removeEmployeeDiv = document.getElementById("removeEmployeeDiv");
    this.setState({
      condutorId: e.nativeEvent.srcElement.id,
    });

    if (removeEmployeeDiv.style.display === "block") {
      removeEmployeeDiv.style.display = "none";
    } else {
      removeEmployeeDiv.style.display = "block";
    }
  }

  async deleteCondutorDefinitivo(){
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    console.log(this.state.condutorId);

    if (data != null) {
      let id_transportador = data.id;
      let token = data.token;
      let id_condutor = this.state.condutorId;
      deleteCondutor(id_transportador, token, id_condutor)
    }
    window.location.href = "/dashboard/Condutores";

  }

  async componentDidMount() {
    await AuthVerificationDashboard();
    await this.displayCondutores();
  }

  render() {
    return (
      <div className="mainDashboardEmployees">
        <div className="topBlockEmployees">
          <h2 className="mainPath">Condutores</h2>
          {/* <i class="bi bi-bell-fill bellIcon"></i> */}

          <AddCondutor
            name="Adicionar Condutor"
            theme="light"
            addEmployee={this.addCondutor}
          />
          <div className="addEmployeeDiv" id="addEmployeeDiv">
            <p className="addEmployeeP">Nome do Condutor</p>
            <form id="addCondutorForm">
            <input
              className="addCondutorInput"
              type="text"
              placeholder="Nome do Condutor"
              name="addCondutorInputNome"
              id="addCondutorInputNome"
            />
            <p className="addEmployeeP">Idade</p>
            <input
              className="addCondutorInput"
              type="text"
              placeholder="Idade"
              name="addCondutorInputIdade"
              id="addCondutorInputIdade"
            />
            </form>
            <AddSaveButtonEmployee
              name="Adicionar"
              theme="light"
              addSaveButtonEmployee={this.closeAEDivButton}
            />
          </div>

          <p id="addCondutorFeedbackYes">O Condutor foi bem adicionado</p>
          <p id="addCondutorFeedbackNo">O Condutor não foi bem adicionado</p>

          <div ref={this.refCondutores} className="employeesCardDiv">
          </div>

          <div className="removeEmployeeDiv" id="removeEmployeeDiv">
            <CloseDivButton
              name="X"
              theme="light"
              closeDivButton={this.closeREDivButton}
            />
            <p className="removeEmployeeQuestion">
              Tem a certeza que pretende remover o funcionário?
            </p>
            <button className="removeEmployeeDivOptionYes" onClick={async () => {await this.deleteCondutorDefinitivo()}}>Sim</button>
            <button
              className="removeEmployeeDivOptionNo"
              onClick={this.closeREDivButton}
            >
              Não
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Condutores;
