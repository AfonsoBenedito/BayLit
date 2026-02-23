import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./Warehouses.css";
import WarehouseCard from "./WarehouseCard/WarehouseCard";
import AddWarehouse from "../../Components/AddWarehouse/AddWarehouse";
import CloseDivButton from "../../Components/CloseDivButton/CloseDivButton";
import AddSaveButtonWarehouse from "../../Components/AddSaveButtonWarehouse/AddSaveButtonWarehouse";

import ReactDOM from "react-dom";
import { getArmazensByFornecedor } from "../../../Helpers/FornecedorHelper";
import { adicionarArmazem, deleteArmazem } from "../../../Helpers/FornecedorHelper";
import { getArmazemById } from "../../../Helpers/FornecedorHelper";

import { AuthVerificationDashboard } from "../../../Helpers/AuthVerification";

class Warehouses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deleteId: null
    };

    this.refArmazens = React.createRef();
    this.removerArmazemDefinitivo = this.removerArmazemDefinitivo.bind(this);
  }

  async displayArmazens() {
    let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));
    let fornecedorID = baylitInfo.id;
    let fornecedorToken = baylitInfo.token;
    let armazensResultado = await getArmazensByFornecedor(
      fornecedorID,
      fornecedorToken
    );
    let listOfArmazens = [];

    if (!armazensResultado){
      listOfArmazens.push(<div id="zeroWarehouseDiv" className="zeroWarehouseDiv"><p id="zeroWarehouseText">Desculpe! Não existem Armazéns.</p><p id="zeroWarehouseTextAdd">Clique no botão a cima para adicionar!</p></div>)
      ReactDOM.render(listOfArmazens, this.refArmazens.current);
    }
    if (armazensResultado != false) {
      
      for (let armazem in armazensResultado) {
        let localizacaoArmazem = armazensResultado[armazem].localizacao.local.localidade;
        let pais = armazensResultado[armazem].localizacao.local.pais;
        let tamanho = armazensResultado[armazem].tamanho;
        let gasto = armazensResultado[armazem].gasto_diario;
        let armazemId = armazensResultado[armazem]._id;
        listOfArmazens.push(
          <WarehouseCard
            armazemId={armazemId}
            pais={pais}
            localizacao={localizacaoArmazem}
            tamanho={tamanho}
            gasto={gasto}
            backgroundCard="promotionAtive"
            removeWarehouse={this.removeWarehouse}
            idClose = {armazemId}
          />
        );
      }
      
      ReactDOM.render(listOfArmazens, this.refArmazens.current);
    }
  }

  addWarehouse() {
    var addWarehouseDiv = document.getElementById("addWarehouseDiv");

    if (addWarehouseDiv.style.display === "block") {
      addWarehouseDiv.style.display = "none";
    } else {
      addWarehouseDiv.style.display = "block";
    }
  }

  async closeAWDivButton() {
    var addWarehouseDiv = document.getElementById("addWarehouseDiv");

    if (addWarehouseDiv.style.display === "none") {
      addWarehouseDiv.style.display = "block";
    } else {
      addWarehouseDiv.style.display = "none";
    }

    let data = JSON.parse(localStorage.getItem("baylitInfo"));

    if (data != null) {
      let fornecedorID = data.id;
      let fornecedorToken = data.token;
      let form = new FormData(document.getElementById("addWarehouseForm"));

      let localidade = form.get("WarehouseInputLocalidade");
      let tamanho = form.get("WarehouseInputTamanho");
      let gasto = form.get("WarehouseInputGasto");
      let pais = form.get("WarehouseInputPais");
      let morada = form.get("WarehouseInputMorada");
      let codigo = form.get("WarehouseInputCodigo");

      let res = await adicionarArmazem(
        fornecedorID,
        fornecedorToken,
        tamanho,
        gasto,
        morada,
        codigo,
        localidade,
        pais
      );
      
      if (res != false) {
        document.getElementById("zeroWarehouseDiv").style.display="none";
        document.getElementById("warehouseInfo").innerHTML =
          "Armazém foi bem adicionado";
        document.getElementById("warehouseInfoError").style.display = "none";
        await this.displayArmazens();
      } else {
        document.getElementById("warehouseInfoError").innerHTML =
          "Armazém não foi bem adicionado";
        document.getElementById("warehouseInfo").style.display = "none";
      }

      setTimeout(
        function() {
          window.location.href = "/dashboard/Warehouses";
        }
        .bind(this),
        2000
      );
      
    }
  }

  removeWarehouse = (e) => {
    var removeWarehouseDiv = document.getElementById("removeWarehouseDiv");
    this.setState({
      deleteId: e.nativeEvent.srcElement.id
    });
    
    if (removeWarehouseDiv.style.display === "block") {
      removeWarehouseDiv.style.display = "none";
    } else {
      removeWarehouseDiv.style.display = "block";
    }
  }

  closeRWDivButton() {
    var removeWarehouseDiv = document.getElementById("removeWarehouseDiv");

    if (removeWarehouseDiv.style.display === "none") {
      removeWarehouseDiv.style.display = "block";
    } else {
      removeWarehouseDiv.style.display = "none";
    }
  }

  async removerArmazemDefinitivo() {
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    let idArmazem = this.state.deleteId;

    if (data != null) {
      let fornecedorToken = data.token;
      
      let a = await deleteArmazem(fornecedorToken, idArmazem);
      // window.location.href = "/dashboard/Warehouses";
    }
  }

  async componentDidMount() {
    await AuthVerificationDashboard();
    await this.displayArmazens();
  }

  render() {
    return (
      <div className="mainWarehouses">
        <div className="topBlockWarehouses">
          <h2 className="mainPath">Armazéns</h2>

          <AddWarehouse
            name="Adicionar Warehouse"
            theme="light"
            addWarehouse={this.addWarehouse}
          />
          <div className="addWarehouseDiv" id="addWarehouseDiv">
            <form id="addWarehouseForm">
              <p className="addWarehouseP">Localidade</p>
              <input
                id="WarehouseInputLocalidade"
                className="addWarehouseInput"
                type="text"
                placeholder="Local"
                name="WarehouseInputLocalidade"
              />
              <p className="addWarehouseP">País</p>
              <input
                id="WarehouseInputPais"
                className="addWarehouseInput"
                type="text"
                placeholder="Pais"
                name="WarehouseInputPais"
              />
              <p className="addWarehouseP">Morada</p>
              <input
                id="WarehouseInputMorada"
                className="addWarehouseInput"
                type="text"
                placeholder="Morada"
                name="WarehouseInputMorada"
              />
              <p className="addWarehouseP">Código Postal</p>
              <input
                id="WarehouseInputCodigo"
                className="addWarehouseInput"
                type="text"
                placeholder="Codigo Postal"
                name="WarehouseInputCodigo"
              />
              <p className="addWarehouseP">Tamanho</p>
              <input
                id="WarehouseInputTamanho"
                className="addWarehouseInput"
                type="text"
                placeholder="Tamanho"
                name="WarehouseInputTamanho"
              />
              <p className="addWarehouseP">Gasto diário</p>
              <input
                id="WarehouseInputGasto"
                className="addWarehouseInput"
                type="text"
                placeholder="Gasto diário"
                name="WarehouseInputGasto"
              />
            </form>
            <AddSaveButtonWarehouse
              name="Adicionar"
              theme="light"
              addSaveButtonWarehouse={this.closeAWDivButton}
            />
          </div>
          <p id="warehouseInfo"></p>
          <p id="warehouseInfoError"></p>
          {/* <button className="addEmployee">
            Adicionar funcionário
          </button> */}
          <div ref={this.refArmazens} className="warehousesCardDiv">
            {/* <WarehouseCard localizacao="Lisboaaaa" backgroundCard="promotionAtive" removeWarehouse={this.removeWarehouse}/>
            <WarehouseCard localizacao="Lisboaaaa" backgroundCard="promotionAtive" removeWarehouse={this.removeWarehouse}/>
            <WarehouseCard localizacao="Lisboaaaa" backgroundCard="promotionAtive" removeWarehouse={this.removeWarehouse}/>
            <WarehouseCard localizacao="Lisboaaaa" backgroundCard="promotionAtive" removeWarehouse={this.removeWarehouse}/>
            <WarehouseCard localizacao="Lisboaaaa" backgroundCard="promotionAtive" removeWarehouse={this.removeWarehouse}/>
            <WarehouseCard localizacao="Lisboaaaa" backgroundCard="promotionAtive" removeWarehouse={this.removeWarehouse}/>
            <WarehouseCard localizacao="Lisboaaaa" backgroundCard="promotionAtive" removeWarehouse={this.removeWarehouse}/>
            <WarehouseCard localizacao="Lisboaaaa" backgroundCard="promotionAtive" removeWarehouse={this.removeWarehouse}/>
            <WarehouseCard localizacao="Lisboaaaa" backgroundCard="promotionAtive" removeWarehouse={this.removeWarehouse}/>
            <WarehouseCard localizacao="Lisboaaaa" backgroundCard="promotionAtive" removeWarehouse={this.removeWarehouse}/>
            <WarehouseCard localizacao="Lisboaaaa" backgroundCard="promotionAtive" removeWarehouse={this.removeWarehouse}/>
            <WarehouseCard localizacao="Lisboaaaa" backgroundCard="promotionAtive" removeWarehouse={this.removeWarehouse}/>
            <WarehouseCard localizacao="Lisboaaaa" backgroundCard="promotionAtive" removeWarehouse={this.removeWarehouse}/>
            <WarehouseCard localizacao="Lisboaaaa" backgroundCard="promotionAtive" removeWarehouse={this.removeWarehouse}/> */}
          </div>

          <div className="removeWarehouseDiv" id="removeWarehouseDiv">
            <CloseDivButton
              name="X"
              theme="light"
              closeDivButton={this.closeRWDivButton}
            />
            <p className="removeWarehouseQuestion">
              Tem a certeza que pretende remover o Armazém?
            </p>
            <button className="removeWarehouseDivOptionYes" onClick={async () => {await this.removerArmazemDefinitivo()}}>Sim</button>
            <button
              className="removeWarehouseDivOptionNo"
              onClick={this.closeRWDivButton}
            >
              Não
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Warehouses;
