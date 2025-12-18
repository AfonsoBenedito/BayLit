import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./ServicoIndividual.css";
import ReactDOM from "react-dom";
import {getTransporteById, cancelarTransporte, mudarEstadoTransporte, mudarEstadoLocalizacaoTransporte} from "./../../../Helpers/EncomendasHelper";
import SingularServicos from "../Serviços/SingularServicos/SingularServicos"
import { getMeioTransporteById } from "../../../Helpers/TransportadorHelper";
import {getLocalById} from "../../../Helpers/ProdutoHelper";

import { AuthVerificationDashboard } from "../../../Helpers/AuthVerification";


import { useParams } from "react-router-dom";

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class ServicoIndividual extends Component {
  constructor(props){
    super(props);
    this.state = {
        idServico: this.props.params.idServico
    };

    this.refEstadosTotal = React.createRef();
    this.refServicos = React.createRef();
    this.refLocalRota = React.createRef();

    this.cancelTransport = this.cancelTransport.bind(this);

    this.changeTransportStatus = this.changeTransportStatus.bind(this);
  }

  async displayMethodInfo(){
    let transporteObjeto = await getTransporteById(this.state.idServico);
    let estado = transporteObjeto.estado;
    let meio_transporte = transporteObjeto.meio_transporte;
    let meioDeTransporte = await getMeioTransporteById(meio_transporte);
    let marca = meioDeTransporte[0].marca;
    let modelo = meioDeTransporte[0].modelo;
    let listToAdd = [];
    listToAdd.push(<h5 id="servicoIndividualModelo" className="mainServicosOptions">Marca: {marca}</h5>);
    listToAdd.push(<h5 id="servicoIndividualModelo" className="mainServicosOptions">Modelo: {modelo} </h5>);
    listToAdd.push(<h5 id="servicoIndividualModelo" className="mainServicosOptions">Estado: {estado} </h5>);

    if (estado != "Terminado"){
    listToAdd.push(<select id="changeStateSelect" className="mainServicosOptions" name="Estados">

            <option value="Em movimento">Em movimento</option>
            <option value="Terminado">Terminado</option>
            
        </select>)
    } else {
      listToAdd.push(<select id="changeStateSelect" className="mainServicosOptions" name="Estados">

            <option value="Terminado">Terminado</option>
            
        </select>)
    }

    listToAdd.push(<button onClick={this.changeTransportStatus} id="mainServicosOptionAlterarBtn" className="mainServicosOptions">Alterar estado</button>);
    listToAdd.push(<button onClick={this.cancelTransport} id="mainServicosOptionCancelarBtn" className="mainServicosOptions">Cancelar Transporte</button>);

    ReactDOM.render(listToAdd, this.refEstadosTotal.current)
  }

  async cancelTransport(){
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    let token = data.token;
    let avisoCancelamento = document.getElementById("servicoIndividualFeedback");

    let botao = document.getElementById("mainServicosOptionCancelarBtn");
    if (botao.innerHTML == "Cancelar Transporte"){
      botao.innerHTML = "Clique para Confirmar";
      botao.style.background = "#cb9500";
    } else{
      await cancelarTransporte(token, this.state.idServico);
      avisoCancelamento.style.display = "block";
      setTimeout(
        function() {
          window.location.href = "/dashboard/Servicos";
        }
        .bind(this),
        2000
      );
      
    }
    
  }

  async changeTransportStatus(){
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    let token = data.token;
    let novo_estado = document.getElementById("changeStateSelect").value;
    let avisoCancelamento = document.getElementById("servicoIndividualFeedback");
    let a = await mudarEstadoTransporte(token, this.state.idServico, novo_estado);
    if (a){
      avisoCancelamento.style.display = "block";
      avisoCancelamento.innerHTML = "O estado do transporte foi mudado com sucesso!"
      setTimeout(
        function() {
          window.location.href = "/dashboard/Servico/"+this.state.idServico;
        }
        .bind(this),
        2000
      );
    } else {
      avisoCancelamento.style.display = "block";
      avisoCancelamento.innerHTML = "O estado não foi alterado!"
    }
    
  }

  async displayServicoInfo(){
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    let token = data.token;
    let transportadorId = data.id;
    let transporteObjeto = await getTransporteById(this.state.idServico);
    let rota = transporteObjeto.rota;
    let estadoAtual = transporteObjeto.estado
    let listaToAdd = [];
    let rotaId;
    let estadoTransporte = transporteObjeto.estado_transporte
    console.log(estadoTransporte);
    console.log(transporteObjeto);
    for (let rotaId in rota){
        let valorAdicional;
        if(parseInt(rotaId)+1 == rota.length){
            valorAdicional="(Destino)"
        }else if(rotaId == 0){
            valorAdicional="(Origem)";
        }else{
            valorAdicional=""
        }
        let estadoDaLocalidade;
        if (estadoAtual=="Disponivel" || estadoAtual=="Por iniciar"){
            estadoDaLocalidade="Não iniciado";
        }else{
            estadoDaLocalidade = estadoTransporte[rotaId].estado;
        }

        let local = await getLocalById(transportadorId, token, rota[rotaId]);
        let morada = local.local.morada;
        let idForSelect = rota[rotaId];
        let localidade = local.local.localidade;
        if(estadoDaLocalidade=="Por passar"){
          listaToAdd.push(
            <div className="servicoLocalizacaoEspecifica">
                <div className="servicoTraco">
                    <span/>
                </div>
                <div className="localizacaoEspecificaInformacao">
                    <h4>{morada}, {localidade} {valorAdicional}</h4>
                    <h5>{estadoDaLocalidade}</h5>
    
                    <select id={idForSelect} onChange={() => {this.changeTransportStatusCity(rota[rotaId])}} className="servicoIndividualSelect">
                        <option value="Por passar">Por passar</option>
                        <option value="A chegar">A chegar</option>
                    </select>
                </div>
            </div>);
        } else if(estadoDaLocalidade=="A chegar") {
          listaToAdd.push(
            <div className="servicoLocalizacaoEspecifica">
                <div className="servicoTraco">
                    <span/>
                </div>
                <div className="localizacaoEspecificaInformacao">
                    <h4>{morada}, {localidade} {valorAdicional}</h4>
                    <h5>{estadoDaLocalidade}</h5>
    
                    <select id={idForSelect} onChange={() => {this.changeTransportStatusCity(rota[rotaId])}} className="servicoIndividualSelect">
                        <option value="A chegar">A chegar</option>
                        <option value="Concluido">Concluido</option>
                    </select>
                </div>
            </div>);
        } else if(estadoDaLocalidade=="Concluido") {
          listaToAdd.push(
            <div className="servicoLocalizacaoEspecifica">
                <div className="servicoTraco">
                    <span/>
                </div>
                <div className="localizacaoEspecificaInformacao">
                    <h4>{morada}, {localidade} {valorAdicional}</h4>
                    <h5>{estadoDaLocalidade}</h5>
    
                    <select id={idForSelect} onChange={() => {this.changeTransportStatusCity(rota[rotaId])}} className="servicoIndividualSelect">
                        <option value="Concluido">Concluido</option>
                    </select>
                </div>
            </div>);
        }
        
        
    }

    ReactDOM.render(listaToAdd, this.refLocalRota.current)

  }

  async changeTransportStatusCity(idTransport){
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    let token = data.token;
    let changeCityStatus = document.getElementById(idTransport).value;
    await mudarEstadoLocalizacaoTransporte(token, this.state.idServico, idTransport, changeCityStatus);
    window.location.reload()
  }

  async componentDidMount(){
    await AuthVerificationDashboard();
    await this.displayServicoInfo();
    await this.displayMethodInfo();
  }

  render() {
    return (
      <div className="mainServicosIndividual">
        <div className="topBlockServicosIndividual">
            <h2 className="mainPath">Transporte (#{this.state.idServico})</h2>
            <div className="servicoIndividualFeedbackDiv">
              <p id="servicoIndividualFeedback" className="servicoIndividualFeedback">Sucesso! O Transporte foi Cancelado!</p>
            </div>
            <div ref={this.refEstadosTotal} className="mainServicosOptionsDiv">
            </div>
            <div ref={this.refLocalRota} className="mainServicosLocalizacoes">
                
                <div className="servicoLocalizacaoEspecifica">
                    <div className="servicoTraco">
                        <span/>
                    </div>
                    <div className="localizacaoEspecificaInformacao">
                        <h4>Lisboa</h4>
                        <h5>A caminho</h5>

                    </div>
                </div>

                <div className="servicoLocalizacaoEspecifica">
                    <div className="servicoTraco">
                        <span/>
                    </div>
                    <div className="localizacaoEspecificaInformacao">


                    </div>
                </div>

            </div>
        </div>
      </div>
    );
  }
}

export default withParams(ServicoIndividual);