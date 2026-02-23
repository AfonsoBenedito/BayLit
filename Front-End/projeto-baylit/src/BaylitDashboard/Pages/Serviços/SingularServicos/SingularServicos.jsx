import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { getTransporteById } from "../../../../Helpers/EncomendasHelper";
import { getMeioTransporteById } from "../../../../Helpers/TransportadorHelper";
import ReactDOM from "react-dom";

import "./SingularServicos.css";


class SingularServicos extends Component {
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
      emissao: this.props.emissao,
      consumo: this.props.consumo,
      meio_transporte: this.props.meio_transporte
    };

    this.gerirTransporteRef = React.createRef();
  }
  
  displayGerirTrasporte(){
    let listToAdd = [];
    
    if (this.state.estado != "Cancelado"){
      listToAdd.push(
      <a href={"/dashboard/Servico/" + this.state.orderId}>
      <div className="ServicosTableConcreteInformationProductDiv">
        <p className="ServicosTableConcreteInformation">Gerir Transporte</p>
        <hr />
      </div>
      </a>)
    } else {
      listToAdd.push(
      <div className="ServicosTableConcreteInformationProductDivCancelled">
        <p className="ServicosTableConcreteInformation">Transporte Cancelado</p>
        <hr />
      </div>
      )
    }

    ReactDOM.render(listToAdd, this.gerirTransporteRef.current)

  }

  async displayMeioDeTransporte(){
    
    let meioDeTransporte = await getMeioTransporteById(this.state.meio_transporte);
    let marca = meioDeTransporte[0].marca;
    let modelo = meioDeTransporte[0].modelo;
    this.setState({
      marca: marca,
      modelo: modelo
    })

  }

  async componentDidMount(){
    await this.displayMeioDeTransporte();
    await this.displayGerirTrasporte();
  }

  
  render() {
    // const { stats } = this.state;
    // const alternatingColor = ['#d5d5d5', '#a9a9a9']; // you can move it out of the render method

    // const Stats = stats.map((season, index) => {
    //     return <SingularOrder color={alternatingColor[index % alternatingColor.length]}  {...season}/>;
    // });
    return (
      <div className="SingularServicosMainDiv">
        <p className="ServicosTableConcreteInformation">{this.state.orderId}</p>
        <p className="ServicosTableConcreteInformation">{this.state.marca}</p>
        <p className="ServicosTableConcreteInformation">{this.state.modelo}</p>
        <p className="ServicosTableConcreteInformation">{this.state.data}</p>
        <p className="ServicosTableConcreteInformation">{this.state.emissao}</p>
        <p className="ServicosTableConcreteInformation">{this.state.consumo}</p>
        <p className="ServicosTableConcreteInformation">{this.state.estado}</p>
        
        <div ref={this.gerirTransporteRef}>
          
        </div>
      </div>
    );
  }
}

export default SingularServicos;