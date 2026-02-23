import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./Orders.css";
import SingularOrder from "./SingularOrder/SingularOrder";
import {getVendasByFornecedor} from "./../../../Helpers/EncomendasHelper"

import { AuthVerificationDashboard } from "../../../Helpers/AuthVerification";

import ReactDOM from "react-dom";
import { getRelatorioVendasFornecedor } from "../../../Helpers/UserHelper";

class Orders extends Component {
  constructor(props){
    super(props);
    this.state = {};

    this.refVendas = React.createRef();
  }

  async descarregarRelatorio(filetype){

    let info = JSON.parse(localStorage.getItem('baylitInfo'))

    let res = await getRelatorioVendasFornecedor(info.id, info.token, filetype)

  }

  async displayOrders(){
    let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));
    let fornecedorID = baylitInfo.id;
    let token = baylitInfo.token;


    let vendasResultado = await getVendasByFornecedor(fornecedorID, token);
    let listaToAdd = [];
    if(vendasResultado != false){
      
      for(let venda in vendasResultado){
        let orderId = vendasResultado[venda]._id;
        let comprador = vendasResultado[venda].comprador.nome;
        let transportador;
        // let transportador = vendasResultado[venda].transportador.nome;
        let data = vendasResultado[venda].data;
        let destino;
        // let destino = vendasResultado[venda].local_entrega.localidade;
        let valor = vendasResultado[venda].valor;
        let estado = vendasResultado[venda].estado;
        let produto = vendasResultado[venda].produto;
        let itens = vendasResultado[venda].itens;
        // console.log(itens);
        listaToAdd.push(<SingularOrder orderId={orderId} produto = {produto} itens = {itens} comprador={comprador} transportador = {transportador} data={data} destino={destino} valor={valor} estado={estado}></SingularOrder>)
      }
      ReactDOM.render(listaToAdd, this.refVendas.current)
    }

  }

  async componentDidMount(){
    await AuthVerificationDashboard();
    await this.displayOrders();
  }

  render() {
    return (
      <div className="mainOrders">
        <div className="topBlockOrders">
            <h2 className="mainPath">Vendas</h2>

            <div className="ordersDownload">
              <button type="button" className="ordersBotoesDownload" id="ordersBotoesDownloadJSON" onClick={async() => {this.descarregarRelatorio("json")}}>Download JSON</button>
            </div>
            <div className="ordersDownload">
              <button type="button" className="ordersBotoesDownload" id="ordersBotoesDownloadCSV" onClick={async() => {this.descarregarRelatorio("csv")}}>Download CSV</button>
            </div>

            <div className="allOrdersInfoDiv">
              <p className="OrderTableInformation">Order ID</p>
              <p className="OrderTableInformation">Comprador</p>
              {/* <p className="OrderTableInformation">Transportador</p> */}
              <p className="OrderTableInformation">Data</p>
              {/* <p className="OrderTableInformation">Destino</p> */}
              <p className="OrderTableInformation">Valor</p>
              <p className="OrderTableInformation">Estado</p>
              {/* <p className="OrderTableInformation">Produtos</p> */}
            </div>
            <div ref={this.refVendas} className="allOrdersDiv">
            </div>
        </div>
      </div>
    );
  }
}

export default Orders;