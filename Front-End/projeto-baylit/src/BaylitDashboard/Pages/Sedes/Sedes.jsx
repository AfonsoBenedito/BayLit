import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./Sedes.css";
import SedesCard from "./SedesCard/SedesCard";
import AddSede from "../../Components/AddSede/AddSede";
import CloseDivButton from "../../Components/CloseDivButton/CloseDivButton";
import AddSaveButtonSede from "../../Components/AddSaveButtonSede/AddSaveButtonSede";

import ReactDOM from "react-dom";
import { getArmazensByFornecedor } from "../../../Helpers/FornecedorHelper";
import { adicionarArmazem, deleteArmazem } from "../../../Helpers/FornecedorHelper";
import { getArmazemById } from "../../../Helpers/FornecedorHelper";

import {adicionarSede, getSedesByTransportador} from "../../../Helpers/TransportadorHelper";

import { AuthVerificationDashboard } from "../../../Helpers/AuthVerification";

class Sedes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deleteId: null
    };

    this.refArmazens = React.createRef();
    this.removerArmazemDefinitivo = this.removerArmazemDefinitivo.bind(this);
    this.displaySedes = this.displaySedes.bind(this);
  }

  async displaySedes() {
    let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));
    let id_transportador = baylitInfo.id;
    let token = baylitInfo.token;
    let armazensResultado = await getSedesByTransportador(id_transportador, token);
    console.log(armazensResultado.locais);
    armazensResultado = armazensResultado.locais;
    if (armazensResultado != false) {
      let listOfArmazens = [];
      for (let armazem in armazensResultado) {
        console.log(armazensResultado[armazem]);
        let localidade = armazensResultado[armazem].localidade;
        let pais = armazensResultado[armazem].pais;
        let morada = armazensResultado[armazem].morada;
        let cod_postal = armazensResultado[armazem].cod_postal;
        listOfArmazens.push(
          <SedesCard
            pais = {pais}
            morada = {morada}
            localidade = {localidade}
            cod_postal = {cod_postal}
            backgroundCard="promotionAtive"
            removeWarehouse={this.removeWarehouse}
          />
        );
      }
      ReactDOM.render(listOfArmazens, this.refArmazens.current);
    }
  }

  addWarehouse() {
    var addSedeDiv = document.getElementById("addSedeDiv");

    if (addSedeDiv.style.display === "block") {
      addSedeDiv.style.display = "none";
    } else {
      addSedeDiv.style.display = "block";
    }
  }

  async closeAWDivButton() {
    var addSedeDiv = document.getElementById("addSedeDiv");
    console.log(addSedeDiv);

    if (addSedeDiv.style.display === "none") {
      addSedeDiv.style.display = "block";
    } else {
      addSedeDiv.style.display = "none";
    }

    let data = JSON.parse(localStorage.getItem("baylitInfo"));

    if (data != null) {
      let id_transportador = data.id;
      let token = data.token;
      let form = new FormData(document.getElementById("addSedeForm"));

      let localidade = form.get("SedeInputLocalidade");
      let pais = form.get("SedeInputPais");
      let morada = form.get("SedeInputMorada");
      let codigo = form.get("SedeInputCodigo");


      console.log(localidade);
      console.log(pais);
      console.log(morada);
      console.log(codigo);
      let res = await adicionarSede(
        id_transportador,
        token,
        morada,
        codigo,
        localidade,
        pais
      );

      console.log(res);
      
      if (res != false) {
        document.getElementById("warehouseInfo").innerHTML =
          "Sede foi bem adicionada";
        document.getElementById("warehouseInfoError").style.display = "none";
        // await this.displaySedes();
      } else {
        document.getElementById("warehouseInfoError").innerHTML =
          "Sede não foi bem adicionada";
        document.getElementById("warehouseInfo").style.display = "none";
      }
      setTimeout(
        function() {
          window.location.href = "/dashboard/Sedes";
        }
        .bind(this),
        3000
    );
      // window.location.href = "/dashboard/Sedes";
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
      console.log(fornecedorToken);
      console.log(idArmazem);
      let a = await deleteArmazem(fornecedorToken, idArmazem);
      // console.log(a);
      // window.location.href = "/dashboard/Warehouses";
    }
  }

  async componentDidMount() {
    await AuthVerificationDashboard();
    await this.displaySedes();
  }

  render() {
    return (
      <div className="mainWarehouses">
        <div className="topBlockWarehouses">
          <h2 className="mainPath">Sedes</h2>

          <AddSede
            name="Adicionar Sede"
            theme="light"
            addWarehouse={this.addWarehouse}
          />
          <div className="addSedeDiv" id="addSedeDiv">
            <form id="addSedeForm">
              <p className="addSedeP">Localidade</p>
              <input
                id="SedeInputLocalidade"
                className="addSedeInput"
                type="text"
                placeholder="Local"
                name="SedeInputLocalidade"
              />
              <p className="addSedeP">País</p>
              <input
                id="SedeInputPais"
                className="addSedeInput"
                type="text"
                placeholder="Pais"
                name="SedeInputPais"
              />
              <p className="addSedeP">Morada</p>
              <input
                id="SedeInputMorada"
                className="addSedeInput"
                type="text"
                placeholder="Morada"
                name="SedeInputMorada"
              />
              <p className="addSedeP">Código Postal</p>
              <input
                id="SedeInputCodigo"
                className="addSedeInput"
                type="text"
                placeholder="Codigo Postal"
                name="SedeInputCodigo"
              />
            </form>
            <AddSaveButtonSede
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
              Tem a certeza que pretende remover o Produto?
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

export default Sedes;
