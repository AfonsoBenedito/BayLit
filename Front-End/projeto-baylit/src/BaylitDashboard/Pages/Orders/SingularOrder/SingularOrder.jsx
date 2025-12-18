import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./SingularOrder.css";
import {getProduto, getProdutoEspecifico, getItemsByEspecifico} from "./../../../../Helpers/FornecedorHelper"
import ReactDOM from "react-dom";

class SingularOrder extends Component {
  constructor(props){
    super(props);
    this.state = {
      orderId: this.props.orderId,
      comprador: this.props.comprador,
      transportador:this.props.transportador,
      data: this.props.data,
      destino: this.props.destino,
      valor: this.props.valor,
      estado: this.props.estado,
      tipoFuncaoOrder: "open",

      produto: this.props.produto,
      itens: this.props.itens,
    };

    this.refOrderDiv = React.createRef();
    this.refOrderDivFoto = React.createRef();
    this.displayProdutosDaEncomenda = this.displayProdutosDaEncomenda.bind(this);
    this.displayProdutoDiv = this.displayProdutoDiv.bind(this);
  }

  async displayProdutoDiv(){
    let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));
    let fornecedorID = baylitInfo.id;
    let token = baylitInfo.token;

    let listaToAdd = [];
    let produtoEspecificoId = this.state.produto;
    // console.log(this.state.orderId);
    // console.log(produtoEspecificoId);
    let produtoEspecifico = await getProdutoEspecifico(produtoEspecificoId);

    let produtoId = produtoEspecifico.produto;
    let produtoGeral = await getProduto(produtoId);

    let foto = produtoGeral.fotografia;

    listaToAdd.push(<img className="orderPhotoDivSrc" src={foto}></img>);

    let atributos = produtoEspecifico.especificidade;
    for (let atributo in atributos){
      let valor = atributos[atributo].valor;
      console.log(valor);
      listaToAdd.push(<p className="atributoSingularOrder">{valor}</p>);
    }

    ReactDOM.render(listaToAdd, this.refOrderDivFoto.current);
  }
  
  async changeStatusColor(){
    if(this.state.estado === "Cancelada"){
      document.getElementById(this.state.orderId).style.color="#ff6961";
    }else if (this.state.estado === "Confirmada"){
      document.getElementById(this.state.orderId).style.color="#61ffb5";
    }
  }

  displayProdutosDaEncomenda(funcao){
    if (funcao=="open"){
      this.refOrderDiv.current.style.display = "block";
      this.setState({
        tipoFuncaoOrder: "close"
      })
    } else if(funcao=="close"){
      this.refOrderDiv.current.style.display = "none";
      this.setState({
        tipoFuncaoOrder: "open"
      })
    }

    // let OrderTableConcreteInformationProductDiv = document.getElementById("OrderTableConcreteInformationProductDiv");

    // console.log(OrderTableConcreteInformationProductDiv.style.display);
  }

  async componentDidMount(){
    await this.changeStatusColor();
    await this.displayProdutoDiv();
  }
  
  render() {
    // const { stats } = this.state;
    // const alternatingColor = ['#d5d5d5', '#a9a9a9']; // you can move it out of the render method

    // const Stats = stats.map((season, index) => {
    //     return <SingularOrder color={alternatingColor[index % alternatingColor.length]}  {...season}/>;
    // });
    return (
      <div className="SingularOrderMainComponent">
        <div onClick={() =>{this.displayProdutosDaEncomenda(this.state.tipoFuncaoOrder)}} className="SingularOrderMainDiv">
          <p className="OrderTableConcreteInformation">{this.state.orderId}</p>
          <p className="OrderTableConcreteInformation">{this.state.comprador}</p>
          {/* <p className="OrderTableConcreteInformation">{this.state.transportador}</p> */}
          <p className="OrderTableConcreteInformation">{this.state.data}</p>
          {/* <p className="OrderTableConcreteInformation">{this.state.destino}</p> */}
          <p className="OrderTableConcreteInformation">{this.state.valor}</p>
          <p id={this.state.orderId} className="OrderTableConcreteInformation">{this.state.estado}</p>
          
        </div>
        <div ref={this.refOrderDiv} id="OrderTableConcreteInformationProductDiv" className="OrderTableConcreteInformationProductDiv">
            <div className="orderDivFotos" ref={this.refOrderDivFoto}></div>
        </div>
      </div>
    );
  }
}

export default SingularOrder;