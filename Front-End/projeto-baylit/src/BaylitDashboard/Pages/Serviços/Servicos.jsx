import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./Servicos.css";
import SingularServicos from "./SingularServicos/SingularServicos";
import {getTransportesByTransportador} from "./../../../Helpers/EncomendasHelper"
import ReactDOM from "react-dom";

import { AuthVerificationDashboard } from "../../../Helpers/AuthVerification";


class Servicos extends Component {
  constructor(props){
    super(props);
    this.state = {};

    this.refServicos = React.createRef();
  }

  async displayOrders(){
    let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));
    let transportadorID = baylitInfo.id;
    let token = baylitInfo.token;

    let transportesResultado = await getTransportesByTransportador(transportadorID, token);
    
    if(transportesResultado != false){
      let listaToAdd = [];
      for(let transporte in transportesResultado){
        let orderId = transportesResultado[transporte]._id;
        let meio_transporte = transportesResultado[transporte].meio_transporte;
        let data = transportesResultado[transporte].data_inicio;
        let newData = data.replace("T", " ").substring(0, 16);
        let distancia = transportesResultado[transporte].distancia;
        let emissao = transportesResultado[transporte].emissao;
        let consumo = transportesResultado[transporte].consumo;
        let estado = transportesResultado[transporte].estado;
        listaToAdd.push(<SingularServicos orderId={orderId} meio_transporte={meio_transporte} data={newData} distancia = {distancia} emissao={emissao} consumo={consumo} estado={estado}></SingularServicos>)
        if(transporte<transportesResultado.length){
          listaToAdd.push(<hr/>)
        }
        
      }

      
      listaToAdd = listaToAdd.sort((a, b) => (a.props.data > b.props.data) ? 1 : -1)

      ReactDOM.render(listaToAdd, this.refServicos.current)
    }
    
  }

  async componentDidMount(){
    await AuthVerificationDashboard();
    await this.displayOrders();
  }

  render() {
    return (
      <div className="mainServicos">
        <div className="topBlockServicos">
            <h2 className="mainPath">Serviços de Transporte</h2>

            <div className="allServicosInfoDiv">
              <p className="ServicosTableInformation">Transporte ID</p>
              <p className="ServicosTableInformation">Marca do transporte</p>
              <p className="ServicosTableInformation">Modelo do transporte</p>
              <p className="ServicosTableInformation">Data</p>
              <p className="ServicosTableInformation">Emissao</p>
              <p className="ServicosTableInformation">Consumo</p>
              <p className="ServicosTableInformation">Estado</p>
              <p className="ServicosTableInformation"></p>
            </div>
            <div ref={this.refServicos} className="allServicosDiv">

            </div>
        </div>
      </div>
    );
  }
}

export default Servicos;