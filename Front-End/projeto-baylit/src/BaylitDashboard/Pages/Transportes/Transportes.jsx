import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./Transportes.css";
import TransportesCard from "./TransportesCard/TransportesCard";
import AddTransporte from "../../Components/AddTransporte/AddTransporte";
import CloseDivButton from "../../Components/CloseDivButton/CloseDivButton";
import AddSaveButtonTransporte from "../../Components/AddSaveButtonTransporte/AddSaveButtonTransporte";
import { getPossiveisVeiculo } from '../../../Helpers/FornecedorHelper';
import ReactDOM from "react-dom";
import { getProdutosByFornecedor } from "../../../Helpers/FornecedorHelper";
import {
  getCategoria,
  getCategoriaByName,
  getSubCategoriaByName,
} from "../../../Helpers/CategoryHelper";
import { getSubCategoria } from "../../../Helpers/CategoryHelper";
import { getCategorias } from "../../../Helpers/CategoryHelper";
import { getSubCategoriasByCategoria } from "../../../Helpers/CategoryHelper";
import { adicionarProduto } from "../../../Helpers/FornecedorHelper";
import { deleteProduto } from "../../../Helpers/FornecedorHelper";
import { Link } from "react-router-dom";
import {adicionarMeioTransporte, getSedesByTransportador, getMeioTransporteByTransportador, apagarMeioTransporte} from "../../../Helpers/TransportadorHelper";


import { AuthVerificationDashboard } from "../../../Helpers/AuthVerification";

class Transportes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deleteId: null,
    };

    this.refProduto = React.createRef();
    this.refCategorias = React.createRef();
    this.refSubCategorias = React.createRef();
    this.refTiposVeiculo = React.createRef();
    this.refMarcaVeiculo = React.createRef();
    this.refModeloVeiculo = React.createRef();
    this.refSedes = React.createRef();

    this.displayTipoVeiculo = this.displayTipoVeiculo.bind(this);
    this.displayMarcaVeiculo = this.displayMarcaVeiculo.bind(this);
    this.displayModeloVeiculo = this.displayModeloVeiculo.bind(this);
    this.addDisplaySedes = this.addDisplaySedes.bind(this);
    this.removeTransporte = this.removeTransporte.bind(this);
    this.removerTransporteDefinitivo = this.removerTransporteDefinitivo.bind(this);

    // this.addSubCategoriesToSelect = this.addSubCategoriesToSelect.bind(this);
    // this.removeProduct = this.removeProduct.bind(this);
    // this.removerProdutoDefinitivo = this.removerProdutoDefinitivo.bind(this);
  }

  async addDisplaySedes(){
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    console.log("ASHUDHASU")
    if (data != null) {
      let id_transportador = data.id;
      let token = data.token;
      let listaSedes = await getSedesByTransportador(id_transportador, token);
      let listaSedesAdd = []
      console.log(listaSedes);
      for (let sede in listaSedes.locais){
        console.log(listaSedes.locais[sede]);
        let nomeSede = listaSedes.locais[sede].localidade;
        console.log(nomeSede);
        listaSedesAdd.push(<option
          className="optionColor"
          value={listaSedes.locais[sede]._id}
        >
          {nomeSede}
        </option>)
        
      }
      ReactDOM.render(listaSedesAdd, this.refSedes.current);
    }

  }

  async displayTipoVeiculo(){
    let listaTotal = await getPossiveisVeiculo();
    let listaTipos = listaTotal.tipo;
    let listaTiposADD = [];
    for (let tipo in listaTipos){
      let tipoNome = listaTipos[tipo]
      listaTiposADD.push(<option className="VeiculoOptionColor" value={tipoNome}> {tipoNome} </option>);
    }
    ReactDOM.render(listaTiposADD, this.refTiposVeiculo.current)
  }

  async displayMarcaVeiculo(){
    let tipoSelecionado = document.getElementById("SpecificProductInputTVeiculo").value;
    let marcasDoTipo = await getPossiveisVeiculo(tipoSelecionado);
    console.log(marcasDoTipo);
    let listaMarcas = marcasDoTipo.marca;
    let listaMarcasADD = [];
    for (let marca in listaMarcas){
      let marcaNome = listaMarcas[marca];
      listaMarcasADD.push(<option className="VeiculoOptionColor" value={marcaNome}> {marcaNome} </option>);
    }
    console.log(listaMarcasADD);
    ReactDOM.render(listaMarcasADD, this.refMarcaVeiculo.current)
  }

  async displayModeloVeiculo(){
    let tipoSelecionado = document.getElementById("SpecificProductInputTVeiculo").value;
    let marcaSelecionada = document.getElementById("SpecificProductInputMVeiculo").value;
    let modelosDoTM = await getPossiveisVeiculo(tipoSelecionado, marcaSelecionada);
    let listaModelos = modelosDoTM.modelo;

    let listaModelosADD = [];
    for (let modelo in listaModelos){
      let modeloNome = listaModelos[modelo];
      listaModelosADD.push(<option className="VeiculoOptionColor" value={modeloNome}> {modeloNome} </option>);
    }
    ReactDOM.render(listaModelosADD, this.refModeloVeiculo.current);
  }

  async displayTransportes() {
    let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));
    let transportadorID = baylitInfo.id;
    let transportesResultado = await getMeioTransporteByTransportador(transportadorID);
    if (transportesResultado != false) {
      let listOfTransportes = [];
      for (let transporte in transportesResultado) {
        let marca = transportesResultado[transporte].marca;
        let modelo = transportesResultado[transporte].modelo;
        let tipo = transportesResultado[transporte].tipo;
        let emissao = transportesResultado[transporte].emissao;
        let consumo = transportesResultado[transporte].consumo;
        let idTransporte = transportesResultado[transporte]._id;
        listOfTransportes.push(
          <TransportesCard
            marca={marca}
            modelo={modelo}
            emissao={emissao}
            consumo={consumo}
            tipo={tipo}
            idTransporte = {idTransporte}
            removeTransporte = {this.removeTransporte}
            // descricao = {descricao}
            backgroundCard="promotionNext"
            removeProduct={this.removeProduct}
          />
        );
        // listOfProducts.push(<Link exact="true" to="/SpecificProduct"><ProductsCard backgroundCard="promotionAtive" removeProduct={this.removeProduct}/></Link>);
      }
      ReactDOM.render(listOfTransportes, this.refProduto.current);
    }
  }

  addProduct() {
    var addProductDiv = document.getElementById("addProductDiv");
    //console.log(addProductDiv.style.display);

    if (addProductDiv.style.display === "block") {
      addProductDiv.style.display = "none";
    } else {
      addProductDiv.style.display = "block";
    }
  }

  async closeAPDivButton() {
    var addProductDiv = document.getElementById("addProductDiv");

    if (addProductDiv.style.display === "none") {
      addProductDiv.style.display = "block";
    } else {
      addProductDiv.style.display = "none";
    }

    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    if (data != null) {
      let id_transportador = data.id;
      let fornecedorToken = data.token;
      let form = new FormData(document.getElementById("addTransporteForm"));

      let tipoVeiculo = form.get("SpecificProductInputTVeiculo");
      let marcaVeiculo = form.get("SpecificProductInputMVeiculo");
      let modeloVeiculo = form.get("SpecificProductInputMoVeiculo");
      let id_sede = form.get("TransporteInputSede");
      console.log(tipoVeiculo);
      console.log(marcaVeiculo);
      console.log(modeloVeiculo);

      let res = await adicionarMeioTransporte(
        id_transportador,
        fornecedorToken,
        marcaVeiculo,
        modeloVeiculo,
        tipoVeiculo,
        id_sede
      );
      console.log(res);

      if (res != false) {
        document.getElementById("transporteInfo").innerHTML =
          "Transporte foi bem adicionado";
        document.getElementById("transporteInfoError").style.display = "none";
        document.getElementById("transporteInfo").style.display = "block";
        // await this.displayTransportes();
      } else {
        document.getElementById("transporteInfoError").innerHTML =
          "Transporte não foi bem adicionado";
        document.getElementById("transporteInfo").style.display = "none";
        document.getElementById("transporteInfoError").style.display = "block";
      }

      setTimeout(
        function() {
          window.location.href = "/dashboard/Transportes";
        }
        .bind(this),
        2000
    );
    }
  }

  closeRPDivButton() {
    var removeProductDiv = document.getElementById("removeProductDiv");

    if (removeProductDiv.style.display === "none") {
      removeProductDiv.style.display = "block";
    } else {
      removeProductDiv.style.display = "none";
    }
  }

  removeTransporte(e) {
    var removeProductDiv = document.getElementById("removeProductDiv");
    // console.log(e);
    // console.log(e.nativeEvent.srcElement.id);
    this.setState({
      deleteId: e.nativeEvent.srcElement.id,
    });


    if (removeProductDiv.style.display === "block") {
      removeProductDiv.style.display = "none";
    } else {
      removeProductDiv.style.display = "block";
    }
  }

  async removerTransporteDefinitivo() {
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    // let produto = document.getElementById("removeProductDivOptionYes");
    let idTransporte = this.state.deleteId;
    // console.log(produto);
    if (data != null) {
      let token = data.token;
      let a = await apagarMeioTransporte(token, idTransporte);
      window.location.href = "/dashboard/Transportes";
    }
  }

  async componentDidMount() {
    await AuthVerificationDashboard();
    await this.addDisplaySedes();
    await this.displayTipoVeiculo();
    await this.displayTransportes();
  }

  render() {
    return (
      <div className="mainProducts">
        <div className="topBlockProducts">
          <h2 className="mainPath">Meios de transporte</h2>

          <AddTransporte
            id="addProductMainButton"
            name="Adicionar Transporte"
            theme="light"
            addProduct={this.addProduct}
          />

          <div className="addProductDiv" id="addProductDiv">
            <form id="addTransporteForm">
                <p className="addSpecificProductP">Tipo de veículo</p>
                <select onChange={this.displayMarcaVeiculo} ref={this.refTiposVeiculo} id="SpecificProductInputTVeiculo" className="addSpecificProductInput" name="SpecificProductInputTVeiculo" type="text" placeholder="Veiculo">
                
                </select>
                <p className="addSpecificProductP">Marca do veículo</p>
                <select onChange={this.displayModeloVeiculo} ref={this.refMarcaVeiculo} id="SpecificProductInputMVeiculo" name="SpecificProductInputMVeiculo" className="addSpecificProductInput" type="text" placeholder="Veiculo">
                
                </select>
                <p className="addSpecificProductP">Modelo do veículo</p>
                <select ref={this.refModeloVeiculo} id="SpecificProductInputMoVeiculo" name="SpecificProductInputMoVeiculo" className="addSpecificProductInput" type="text" placeholder="Veiculo">
                
                </select>
                <p className="addSpecificProductP">Sede</p>
                <select ref={this.refSedes} id="TransporteInputSede" name="TransporteInputSede" className="addSpecificProductInput" type="text" placeholder="sede"></select>
            
            </form>
            <AddSaveButtonTransporte
              name="Adicionar"
              theme="light"
              addSaveButtonProduct={this.closeAPDivButton}
            />
          </div>
          <p id="transporteInfo"></p>
          <p id="transporteInfoError"></p>
          <div ref={this.refProduto} className="productCardDiv">
          </div>


          <div className="removeProductDiv" id="removeProductDiv">
            <CloseDivButton
              name="X"
              theme="light"
              closeDivButton={this.closeRPDivButton}
            />
            <p className="removeProductQuestion">
              Tem a certeza que pretende remover o Transporte?
            </p>
            <button
              className="removeProductDivOptionYes"
              onClick={async () => {
                await this.removerTransporteDefinitivo();
              }}
            >
              Sim
            </button>
            <button
              className="removeProductDivOptionNo"
              onClick={this.closeRPDivButton}
            >
              Não
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Transportes;
