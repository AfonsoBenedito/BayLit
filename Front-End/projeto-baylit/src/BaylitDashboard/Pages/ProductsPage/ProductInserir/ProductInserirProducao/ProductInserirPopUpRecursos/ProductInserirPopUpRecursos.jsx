import React, { Component } from "react";
import ReactDOM from "react-dom";
import { getRecursos } from "../../../../../../Helpers/CategoryHelper";

import "./ProductInserirPopUpRecursos.css";

class ProductInserirPopUpRecursos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addRecurso: this.props.addRecurso,
      tipoRecursoHtml: [],
      recursoHtml: {},
      unidade: null,
      listaBuscada: [],
    };

    this.myRefPopUp = React.createRef();

    this.refTipoRecurso = React.createRef()
    this.refRecurso = React.createRef()
    this.refQuantidade = React.createRef()
  }

  async displayRecursos(){
    
    let tipoRecursos = await getRecursos()

    this.setState({
      listaBuscada: tipoRecursos
    })

    let resultOptionsTipoRecurso = []
    let resultOptionsRecurso = {}

    let primeiroTipoRecurso = false

    let primeiroRecurso = false
    
    for (let tipo in tipoRecursos){

      if (primeiroTipoRecurso == false){
          primeiroTipoRecurso = tipo
      }

      resultOptionsTipoRecurso.push(<option value={tipo}>{tipo}</option>)

      resultOptionsRecurso[tipo] = []

      for (let recurso in tipoRecursos[tipo]){

        if (primeiroRecurso == false){
          primeiroRecurso = tipoRecursos[tipo][recurso]
        }

        resultOptionsRecurso[tipo].push(<option value={recurso}>{recurso}</option>)

      }

    }

    this.setState({
        tipoRecursoHtml: resultOptionsTipoRecurso,
        recursoHtml: resultOptionsRecurso,
        unidade: primeiroRecurso
    })

    ReactDOM.render(resultOptionsTipoRecurso, this.refTipoRecurso.current)
    ReactDOM.render(resultOptionsRecurso[primeiroTipoRecurso], this.refRecurso.current)

  }

  changeTipoRecurso(){

    ReactDOM.render(this.state.recursoHtml[this.refTipoRecurso.current.value], this.refRecurso.current)

    let first = Object.keys(this.state.listaBuscada[this.refTipoRecurso.current.value])[0]
    let unit = this.state.listaBuscada[this.refTipoRecurso.current.value][first]
    // console.log(this.refTipoRecurso.current.value)
    // console.log(this.refRecurso.current.value)

    console.log(unit)

    this.setState({
      unidade: unit
    })
  }

  changeRecurso(){

    let unit = this.state.listaBuscada[this.refTipoRecurso.current.value][this.refRecurso.current.value]

    this.setState({
      unidade: unit
    })

  }

  guardarRecurso(){

    if (this.state.unidade != ""){

      this.state.addRecurso(this.refTipoRecurso.current.value, this.refRecurso.current.value, this.refQuantidade.current.value, this.state.unidade)

      this.closePopUp()

    } else {
      console.log("Falta Quantidade")
    }

    
  }
  

  closePopUp = () => {
    this.myRefPopUp.current.style.display = "none";
  };

  async componentDidMount(){
    await this.displayRecursos()
  }

  render() {
    return (
      <div
        ref={this.myRefPopUp}
        id="mainProductPopUpRecursos"
        className="mainProductPopUpRecursos"
      >
        <div
          className="backgroundProductPopUpRecursos"
          onClick={() => {
            this.closePopUp();
          }}
        ></div>
        <form action="/">
          <div className="productPopUpRecursos">
            <i
              class="bi bi-x-lg"
              id="closePopUpRecursosProduct"
              onClick={() => {
                this.closePopUp();
              }}
            ></i>
            <h3>Recursos</h3>
            <h6>Adicione os recursos utilizados</h6>
            <div className="inputsRecursosInserir">
              <div className="inputBlockRecursosInserir">
                <h6>Tipo recurso</h6>
                <select name="" id="" onChange={() => {this.changeTipoRecurso()}} ref={this.refTipoRecurso}>
                  {/* <option value="teste1">test1</option> */}
                </select>
              </div>
              <div className="inputBlockRecursosInserir">
                <h6>Subtipo recurso</h6>
                <select onChange={() => {this.changeRecurso()}} name="" id="" ref={this.refRecurso}>
                  {/* <option value="teste1">test1</option> */}
                </select>
              </div>
              <div className="valorGastoRecurso">
                <h6 className="titleValorGasto">Valor do gasto</h6>
                <input type="number" placeholder="Valor" min="1" step="1" ref={this.refQuantidade} />
                <div className="categoriaGastoRecurso">
                  <span>{this.state.unidade}</span>
                </div>
              </div>
            </div>

            <h2 className="btnSalvarRecursos" onClick={() => {this.guardarRecurso()}}>Guardar</h2>
          </div>
        </form>
      </div>
    );
  }
}

export default ProductInserirPopUpRecursos;
