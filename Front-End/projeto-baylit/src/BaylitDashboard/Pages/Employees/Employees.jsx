import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./Employees.css";
import EmployeesCard from "./EmployeesCard/EmployeesCard";
import AddEmployee from "../../Components/AddEmployee/AddEmployee";
import CloseDivButton from "../../Components/CloseDivButton/CloseDivButton";
import AddSaveButtonEmployee from "../../Components/AddSaveButtonEmployee/AddSaveButtonEmployee";

import ReactDOM from "react-dom";
import {
  getFuncionarioByFornecedor,
  getArmazemById,
  getArmazensByFornecedor,
  adicionarFuncionario,
  getLocalById,
  deleteFuncionario
} from "../../../Helpers/FornecedorHelper";
// import { getArmazemById } from "../../../../../dashboard-baylit/src/Helpers/FornecedorHelper";

import { AuthVerificationDashboard } from "../../../Helpers/AuthVerification";

class Employees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      condutorId: null
    };

    this.refEmployees = React.createRef();
    this.refArmazemDeTrabalho = React.createRef();

    this.deleteEmployeeDefinitivo = this.deleteEmployeeDefinitivo.bind(this);
    this.removeEmployee = this.removeEmployee.bind(this);
  }

  async displayArmazensDeTrabalho(){
    let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));
    let fornecedorID = baylitInfo.id;
    let token = baylitInfo.token;
    let armazensResultado = await getArmazensByFornecedor(fornecedorID, token);
    let armazensToAdd = [];
    for (let armazem in armazensResultado){
      let localidade = armazensResultado[armazem].localizacao.local.localidade;
      let idArmazem = armazensResultado[armazem]._id;

      armazensToAdd.push(<option className="optionColor" value={idArmazem}>{localidade}</option>)
    }

    ReactDOM.render(armazensToAdd, this.refArmazemDeTrabalho.current);
  }

  async displayEmployees() {
    let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));
    let fornecedorID = baylitInfo.id;
    let fornecedorToken = baylitInfo.token;
    let employeesResultado = await getFuncionarioByFornecedor(
      fornecedorID,
      fornecedorToken
    );

    if (employeesResultado != false) {
      let listOfEmployees = [];
      for (let employee in employeesResultado) {
        let nome = employeesResultado[employee].nome;
        let idade = employeesResultado[employee].idade;
        let armazemID = employeesResultado[employee].armazem;
        let employeeID = employeesResultado[employee]._id;
        // console.log(armazemID);
        let armazemTotal = await getArmazemById(
          fornecedorID,
          fornecedorToken,
          armazemID
        );
        if (armazemTotal != false){
          let localizacaoId = armazemTotal[0].localizacao;
          let localizacao = await getLocalById(fornecedorID, fornecedorToken, localizacaoId);
          let localidadeCard = localizacao.local.localidade;
          // let armazem = armazemTotal.localizacao.local.localidade;
          listOfEmployees.push(
            <EmployeesCard
              employeeID = {employeeID}
              nome={nome}
              idade={idade}
              localidadeCard = {localidadeCard}
              backgroundCard="promotionAtive"
              removeEmployee={this.removeEmployee}
            />
          );
        }
      }
      if (listOfEmployees.length==0){
        listOfEmployees.push(<div id="zeroEmployeeDiv" className="zeroEmployeeDiv"><p id="zeroEmployeeText">Desculpe! Não existem fucionários.</p><p id="zeroEmployeeTextAdd">Clique no botão a cima para adicionar!</p></div>)
      }
      ReactDOM.render(listOfEmployees, this.refEmployees.current);
    }
  }

  addEmployee() {
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

    //Adicionar Funcionário
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    if (data != null) {
      let id_fornecedor = data.id;
      let token = data.token;
      let form = new FormData(document.getElementById("addEmployeeForm"));
      let nome = form.get("addEmployeeInputNome");
      let idade = form.get("addEmployeeInputIdade");
      let armazem = form.get("addEmployeeInputArmazem");
      let a = await adicionarFuncionario(id_fornecedor, token, armazem, nome, idade);
      if (a){
        let employeeFeedback = document.getElementById("addEmployeeFeedbackYes");
        employeeFeedback.style.display = "block";
        document.getElementById("zeroEmployeeDiv").style.display = "none";
      } else {
        let employeeFeedback = document.getElementById("addEmployeeFeedbackNo");
        employeeFeedback.style.display = "block";
        document.getElementById("zeroEmployeeDiv").style.display = "none";
      }
      setTimeout(
        function() {
          window.location.href = "/dashboard/Employees";
        }
        .bind(this),
        2000
      );
      
    }
  }

  removeEmployee(e) {
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

  async deleteEmployeeDefinitivo(){
    let data = JSON.parse(localStorage.getItem("baylitInfo"));

    if (data != null) {
      let id_fornecedor = data.id;
      let token = data.token;
      let id_condutor = this.state.condutorId;
      await deleteFuncionario(id_fornecedor, token, id_condutor);
    }
    window.location.href = "/dashboard/Employees";

  }

  closeREDivButton() {
    var removeEmployeeDiv = document.getElementById("removeEmployeeDiv");

    if (removeEmployeeDiv.style.display === "none") {
      removeEmployeeDiv.style.display = "block";
    } else {
      removeEmployeeDiv.style.display = "none";
    }
  }

  

  async componentDidMount() {
    await AuthVerificationDashboard();

    await this.displayArmazensDeTrabalho();
    await this.displayEmployees();
    
  }

  render() {
    return (
      <div className="mainDashboardEmployees">
        <div className="topBlockEmployees">
          <h2 className="mainPath">Funcionários</h2>
          {/* <i class="bi bi-bell-fill bellIcon"></i> */}

          <AddEmployee
            name="Adicionar Funcionário"
            theme="light"
            addEmployee={this.addEmployee}
          />
          <div className="addEmployeeDiv" id="addEmployeeDiv">
            <form id="addEmployeeForm">
              <p className="addEmployeeP">Nome do Funcionário</p>
              <input
                className="addEmployeeInput"
                type="text"
                placeholder="Nome do Funcionário"
                name="addEmployeeInputNome"
                id="addEmployeeInputNome"
              />
              <p className="addEmployeeP">Idade</p>
              <input
                className="addEmployeeInput"
                type="text"
                placeholder="Idade"
                name="addEmployeeInputIdade"
                id="addEmployeeInputIdade"
              />
              <p className="addEmployeeP">Armazém de trabalho</p>
              <select
                ref={this.refArmazemDeTrabalho}
                className="addEmployeeInput"
                type="text"
                placeholder="Armazém de trabalho"
                name="addEmployeeInputArmazem"
                id="addEmployeeInputArmazem"
              />
            </form>
            <AddSaveButtonEmployee
              name="Adicionar"
              theme="light"
              addSaveButtonEmployee={this.closeAEDivButton}
            />
          </div>
          {/* <button className="addEmployee">
            Adicionar funcionário
          </button> */}
          <p id="addEmployeeFeedbackYes">O funcionário foi bem adicionado</p>
          <p id="addEmployeeFeedbackNo">O funcionário não foi bem adicionado</p>
          <div ref={this.refEmployees} className="employeesCardDiv">
            {/* <EmployeesCard salario="2500€" idade="16 anos"nome="Nome do tropa" backgroundCard="promotionFinished" removeEmployee={this.removeEmployee}/>
            <EmployeesCard backgroundCard="promotionFinished" removeEmployee={this.removeEmployee}/>
            <EmployeesCard backgroundCard="promotionFinished" removeEmployee={this.removeEmployee}/>
            <EmployeesCard backgroundCard="promotionFinished" removeEmployee={this.removeEmployee}/>
            <EmployeesCard backgroundCard="promotionFinished" removeEmployee={this.removeEmployee}/>
            <EmployeesCard backgroundCard="promotionFinished" removeEmployee={this.removeEmployee}/>
            <EmployeesCard backgroundCard="promotionFinished" removeEmployee={this.removeEmployee}/>
            <EmployeesCard backgroundCard="promotionFinished" removeEmployee={this.removeEmployee}/>
            <EmployeesCard backgroundCard="promotionFinished" removeEmployee={this.removeEmployee}/>
            <EmployeesCard backgroundCard="promotionFinished" removeEmployee={this.removeEmployee}/>
            <EmployeesCard backgroundCard="promotionFinished" removeEmployee={this.removeEmployee}/>
            <EmployeesCard backgroundCard="promotionFinished" removeEmployee={this.removeEmployee}/>
            <EmployeesCard backgroundCard="promotionFinished" removeEmployee={this.removeEmployee}/>
            <EmployeesCard backgroundCard="promotionFinished" removeEmployee={this.removeEmployee}/> */}
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
            <button onClick={async () => {await this.deleteEmployeeDefinitivo()}} className="removeEmployeeDivOptionYes">Sim</button>
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

export default Employees;
