import React, { Component } from "react";
import "./SpecificProduct.css";
import productImage from '../../../Images/productImage.png';
import { getAtributo } from '../../../../Helpers/CategoryHelper';
import { getPossiveisVeiculo } from '../../../../Helpers/FornecedorHelper';
import { getArmazensByFornecedor } from '../../../../Helpers/FornecedorHelper';
import { adicionarInventario } from '../../../../Helpers/FornecedorHelper';

import ReactDOM from "react-dom";

class SpecificProduct extends Component {
  constructor(props){
    super(props);
    this.state = {
      preco: this.props.preco,
      especificidade: this.props.especificidade
    };

    this.refAtributos = React.createRef();
    this.refLocalizacoes = React.createRef();
    this.refTiposVeiculo = React.createRef();
    this.refMarcaVeiculo = React.createRef();
    this.refModeloVeiculo = React.createRef();
    this.displayTipoVeiculo = this.displayTipoVeiculo.bind(this);
    this.displayMarcaVeiculo = this.displayMarcaVeiculo.bind(this);
    this.displayModeloVeiculo = this.displayModeloVeiculo.bind(this);
  }

  async addInventoryWarehouses(){
    let data = JSON.parse(localStorage.getItem("baylitInfo"));

    if (data != null) {
      let listaLocalizacoes = [];
      let fornecedorID = data.id;
      let fornecedorToken = data.token;
      let armazens = await getArmazensByFornecedor(fornecedorID, fornecedorToken);
      for (let armazem in armazens){
        let localizacao = armazens[armazem].localizacao.local.localidade;
        listaLocalizacoes.push(<option className="warehouseOptionColor" value={localizacao}> {localizacao} </option>);
      }
      ReactDOM.render(listaLocalizacoes, this.refLocalizacoes.current);
    }
  }

  async displayAtributes(){
    let listaAtributos = [];
    listaAtributos.push(<p className="specificProductInformation">Preço: {this.state.preco}</p>);
    for (let atributo in this.state.especificidade){
      let atributoId = this.state.especificidade[atributo].atributo;
      let atributoValor = this.state.especificidade[atributo].valor;
      let atributoLista = await getAtributo(atributoId);
      let atributoNome = atributoLista.nome;
      listaAtributos.push(<p className="specificProductInformation">{atributoNome}: {atributoValor}</p>);
    }
    listaAtributos.push(<p className="specificProductActualQnt"> Quantidade atual: 525</p>);
    listaAtributos.push(<button id="specificProductQntButton" onClick={this.specificProductQntOpenForm} className="specificProductQntButton">Adicionar inventário</button>);
        
        

    ReactDOM.render(listaAtributos, this.refAtributos.current);
    // this.setState({
    //   categoriaSelecionada: categoryID
    // })
  }

  async displayTipoVeiculo(){
    let listaTotal = await getPossiveisVeiculo();
    let listaTipos = listaTotal.tipo;
    let listaTiposADD = [];
    for (let tipo in listaTipos){
      let tipoNome = listaTipos[tipo]
      listaTiposADD.push(<option className="warehouseOptionColor" value={tipoNome}> {tipoNome} </option>);
    }
    ReactDOM.render(listaTiposADD, this.refTiposVeiculo.current)
  }

  async displayMarcaVeiculo(){
    let tipoSelecionado = document.getElementById("SpecificProductInputTVeiculo").value;
    let marcasDoTipo = await getPossiveisVeiculo(tipoSelecionado);
    let listaMarcas = marcasDoTipo.marca;
    let listaMarcasADD = [];
    for (let marca in listaMarcas){
      let marcaNome = listaMarcas[marca];
      listaMarcasADD.push(<option className="warehouseOptionColor" value={marcaNome}> {marcaNome} </option>);
    }
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
      listaModelosADD.push(<option className="warehouseOptionColor" value={modeloNome}> {modeloNome} </option>);
    }
    ReactDOM.render(listaModelosADD, this.refModeloVeiculo.current);
  }

  specificProductQntOpenForm(){
    let specificProductInformationDiv = document.getElementById("specificProductInformationDiv");
    let addSpecificProductP = document.getElementById("addSpecificProductP");
    let addSpecificProductInput = document.getElementById("addSpecificProductInput");

    let addSpecificProductForm = document.getElementById("addSpecificProductForm");
    if (specificProductInformationDiv.style.display==="none"){
      specificProductInformationDiv.style.display="block";
      addSpecificProductForm.style.display="none";

    } else {
      specificProductInformationDiv.style.display="none";
      addSpecificProductForm.style.display="block";
      addSpecificProductP.style.display="block";
      addSpecificProductInput.style.display="block";
    }
  }

  async specificProductQndSaveForm(){
    let specificProductInformationDiv = document.getElementById("specificProductInformationDiv");
    // let specificProductQnt = document.getElementById("specificProductQnt");
    let specificProductQntButton = document.getElementById("specificProductQntButton");

    let addSpecificProductForm = document.getElementById("addSpecificProductForm");
    if (specificProductInformationDiv.style.display==="block"){
      specificProductInformationDiv.style.display="none";
      // specificProductQnt.style.display="none";
      specificProductQntButton.style.display="none";
      addSpecificProductForm.style.display="block";

    } else {
      specificProductInformationDiv.style.display="block";
      // specificProductQnt.style.display="block";
      specificProductQntButton.style.display="block";
      addSpecificProductForm.style.display="none";
    }



    // Adicionar Inventário
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    if (data != null) {
      let fornecedorID = data.id;
      let fornecedorToken = data.token; // Token - 1!
      let idArmazem; // Armazem - 2!
      let id_especifico; // Idk
      let armazemSelLocalidade = document.getElementById("SpecificProductInputArmazem").value;
      let allArmazens = await getArmazensByFornecedor(fornecedorID);
      for (let armazem in allArmazens){
        if (allArmazens[armazem].localizacao.local.localidade === armazemSelLocalidade){
          idArmazem = allArmazens[armazem]._id;
        }
      }

      let form = new FormData(document.getElementById("addInventarioForm"));
      let quantidade = form.get("specificProductQnt"); // Quantidade - 4!
      let desperdicio = form.get("SpecificProductInputDesperdicio"); // desperdicio - 7!
      let tipoVeiculo = form.get("SpecificProductInputTVeiculo");
      let marcaVeiculo = form.get("SpecificProductInputMVeiculo");
      let modeloVeiculo = form.get("SpecificProductInputMoVeiculo");



      //await adicionarInventario(fornecedorToken, idArmazem, id_especifico, quantidade, prazo_de_validade, meio_transporte, desperdicio);

    }

    

  }

  specificProductQndCloseForm(){
    let specificProductInformationDiv = document.getElementById("specificProductInformationDiv");
    let specificProductQnt = document.getElementById("specificProductQnt");
    let specificProductQntButton = document.getElementById("specificProductQntButton");

    let addSpecificProductForm = document.getElementById("addSpecificProductForm");
    if (specificProductInformationDiv.style.display==="block"){
      specificProductInformationDiv.style.display="none";
      specificProductQnt.style.display="none";
      specificProductQntButton.style.display="none";
      addSpecificProductForm.style.display="none";

    } else {
      specificProductInformationDiv.style.display="block";
      specificProductQnt.style.display="block";
      specificProductQntButton.style.display="block";
      addSpecificProductForm.style.display="block";
    }
  }

  async componentDidMount() {
    await this.displayAtributes();
    await this.addInventoryWarehouses();
    await this.displayTipoVeiculo();
    // await this.displayMarcaVeiculo();
  }
  
  render() {
    return (
      <div className="specificProductDiv">
        <div className="specificProductImage">
            <img className="specificProductImageSrc" src={productImage}></img>
        </div>
        <div ref={this.refAtributos} id="specificProductInformationDiv" className="specificProductInformationDiv">
          
        </div>
        {/* <p className="specificProductActualQnt"> Quantidade atual: 525</p>
        <input id="specificProductQnt" placeholder="Qnt" className="specificProductQnt" type="number"></input>
        <button id="specificProductQntButton" onClick={this.specificProductQntOpenForm} className="specificProductQntButton">Adicionar inventário</button> */}

        <div id="addSpecificProductForm" className="addSpecificProductForm">
          <form id="addInventarioForm">
            <input id="specificProductQnt" placeholder="Qnt" className="specificProductQnt" name="specificProductQnt" type="number"></input>
            <p className="addSpecificProductP">Armazem</p>
            <select ref={this.refLocalizacoes} id="SpecificProductInputArmazem" className="addSpecificProductInput" type="text" placeholder="Armazém" name="SpecificProductInputArmazem"/>
            <p className="addSpecificProductP">Desperdício</p>
            <input id="SpecificProductInputDesperdicio" className="addSpecificProductInput" type="text" placeholder="Desperdicio" name="SpecificProductInputDesperdicio"/>
            <p className="addSpecificProductP">Tipo de veículo</p>
            <select onChange={this.displayMarcaVeiculo} ref={this.refTiposVeiculo} id="SpecificProductInputTVeiculo" className="addSpecificProductInput" name="SpecificProductInputTVeiculo" type="text" placeholder="Veiculo">
              {/* <option value="Depende"></option> */}
            </select>
            <p className="addSpecificProductP">Marca do veículo</p>
            <select onChange={this.displayModeloVeiculo} ref={this.refMarcaVeiculo} id="SpecificProductInputMVeiculo" name="SpecificProductInputMVeiculo" className="addSpecificProductInput" type="text" placeholder="Veiculo">
              {/* <option value="Depende"></option> */}
            </select>
            <p className="addSpecificProductP">Modelo do veículo</p>
            <select ref={this.refModeloVeiculo} id="SpecificProductInputMoVeiculo" name="SpecificProductInputMoVeiculo" className="addSpecificProductInput" type="text" placeholder="Veiculo">
              {/* <option value="Depende"></option> */}
            </select>
          </form>
          <button id="addSpecificProductFormSave" className="addSpecificProductFormSave" onClick={this.specificProductQndSaveForm}>Guardar</button>
          <button id="addSpecificProductFormCancel" className="addSpecificProductFormCancel" onClick={this.specificProductQndCloseForm}>Cancelar</button>
        </div>
      </div>
    );
  }
}

export default SpecificProduct;
