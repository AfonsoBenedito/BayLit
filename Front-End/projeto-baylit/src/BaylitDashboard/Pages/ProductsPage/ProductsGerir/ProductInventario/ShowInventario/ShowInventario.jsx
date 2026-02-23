import React, { Component } from "react";
import "./ShowInventario.css";
import { Link } from "react-router-dom";
import { adicionarInventario, getArmazensByFornecedor, getPossiveisVeiculo } from "../../../../../../Helpers/FornecedorHelper";

import ReactDOM from "react-dom"

class ShowInventario extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      idEspecifico:this.props.idEspecifico
    }

    this.refArmazens = React.createRef()
    this.refQuantidade = React.createRef()
    this.refDesperdicio = React.createRef()
    this.refTipoTransporte = React.createRef()
    this.refMarcaTransporte = React.createRef()
    this.refModeloTransporte = React.createRef()
    
  }

  async displayArmazens(){

    let info = JSON.parse(localStorage.getItem('baylitInfo'))

    let armazens = await getArmazensByFornecedor(info.id, info.token)

    let result = []

    for (let i = 0; i < armazens.length; i++){
      result.push(<option value={armazens[i]._id}>{armazens[i].localizacao.local.localidade}</option>)
    }

    ReactDOM.render(result, this.refArmazens.current)

  }

  async displayTransportes(clicked){

    let veiculos = await getPossiveisVeiculo(null, null, null);
    
    let tipos = veiculos.tipo

    let resultTipos = []
    let resultMarcas = []
    let resultModelo = []

    for (let i = 0; i < tipos.length; i++){
      resultTipos.push(<option value={tipos[i]}>{tipos[i]}</option>)
    }

    if(this.refTipoTransporte.current.value == ""){
      let veiculosMarcas = await getPossiveisVeiculo(tipos[0], null, null)


      let marcas = veiculosMarcas.marca
      for (let i = 0; i < marcas.length; i++){
        resultMarcas.push(<option value={marcas[i]}>{marcas[i]}</option>)
      }

      
      let veiculosModelo = await getPossiveisVeiculo(tipos[0],marcas[0],null)

      let modelos = veiculosModelo.modelo
      for (let i = 0; i < modelos.length; i++){
        resultModelo.push(<option value={modelos[i]}>{modelos[i]}</option>)
      }
      

    } else {
      let veiculosMarcas = await getPossiveisVeiculo(this.refTipoTransporte.current.value, null, null)


      let marcas = veiculosMarcas.marca
      for (let i = 0; i < marcas.length; i++){
        resultMarcas.push(<option value={marcas[i]}>{marcas[i]}</option>)
      }

      if(clicked == "tipo"){

        

        let veiculosModelo = await getPossiveisVeiculo(this.refTipoTransporte.current.value, marcas[0],null)


        let modelos = veiculosModelo.modelo
        for (let i = 0; i < modelos.length; i++){
          resultModelo.push(<option value={modelos[i]}>{modelos[i]}</option>)
        }

      } else {


        let veiculosModelo = await getPossiveisVeiculo(this.refTipoTransporte.current.value, this.refMarcaTransporte.current.value,null)


        let modelos = veiculosModelo.modelo
        for (let i = 0; i < modelos.length; i++){
          resultModelo.push(<option value={modelos[i]}>{modelos[i]}</option>)
        }

      }

      

    }

    


    ReactDOM.render(resultTipos, this.refTipoTransporte.current)
    ReactDOM.render(resultMarcas, this.refMarcaTransporte.current)
    ReactDOM.render(resultModelo, this.refModeloTransporte.current)
  }


  async finalizar(){

    let info = JSON.parse(localStorage.getItem('baylitInfo'))
    
    if (this.refQuantidade.current.value != 0 && this.refDesperdicio.current.value != "" && this.refDesperdicio.current.value != ""){
      
      let tipo = this.refTipoTransporte.current.value
      let marca = this.refMarcaTransporte.current.value
      let modelo = this.refModeloTransporte.current.value
      let armazem = this.refArmazens.current.value
      let quantidade = this.refQuantidade.current.value
      let desperdicio = this.refDesperdicio.current.value
      let idEspecifico = this.state.idEspecifico


      let add = await adicionarInventario(info.token,armazem,idEspecifico,quantidade, null, {marca,modelo,tipo},desperdicio)

      if(add != false){
        window.location.reload()
      } else {
      }

    }

  }
  

  async componentDidMount(){
    await this.displayArmazens();
    await this.displayTransportes()
  }

  
  render() {
    return (
        <div className="popUpInventarioAdd">
        <div className="cellPopUpInventario">
          <h6>Armazem</h6>
          <select id="" ref={this.refArmazens}>
          
          </select>
        </div>
        <div className="cellPopUpInventario">
          <h6>Quantidade</h6>
          <input type="number" placeholder="Quantidade" min="0" defaultValue="0" ref={this.refQuantidade}/>
        </div>
        <div className="cellPopUpInventario">
          <h6>Desperdicio</h6>
          <input type="number" placeholder="Quantidade desperdiçada" ref={this.refDesperdicio} min="0" defaultValue="0"/>
        </div>
        <div className="cellPopUpInventario">
          <h6>Tipo transporte</h6>
          <select id="" ref={this.refTipoTransporte} onChange={async () => {await this.displayTransportes("tipo")}}>
            {/* <option value="teste">teste</option> */}
          </select>
        </div>
        <div className="cellPopUpInventario">
          <h6>Marca transporte</h6>
          <select id="" ref={this.refMarcaTransporte} onChange={async () => {await this.displayTransportes("marca")}}>
            {/* <option value="teste">teste</option> */}
          </select>
        </div>
        <div className="cellPopUpInventario">
          <h6>Modelo transporte</h6>
          <select id="" ref={this.refModeloTransporte} >
            {/* <option value="teste">teste</option> */}
          </select>
        </div>
        <div className="cellPopUpInventario" onClick={async () => {await this.finalizar()}}>
          <h5>Adicionar Inventário</h5>
        </div>
      </div>
    );
  }
}

export default ShowInventario;