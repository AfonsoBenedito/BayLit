import React, { Component } from "react";
import ReactDOM from "react-dom";
import { getTiposPoluicao } from "../../../../../../Helpers/CategoryHelper";

import "./ProductInserirPopUpPoluicao.css";

class ProductInserirPopUpPoluicao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addPoluicao: this.props.addPoluicao
    };

    this.myRefPopUp = React.createRef();

    this.refNome = React.createRef();
    this.refQualidade = React.createRef();

    this.guardarPoluicao = this.guardarPoluicao.bind(this)
  }

  async displayPoluicao(){

    let tipos = await getTiposPoluicao()

    console.log(tipos)

    let resultTipos = []

    for (let i = 0; i < tipos.length; i++){

      resultTipos.push(<option value={tipos[i]}>{tipos[i]}</option>)

    }
    
    ReactDOM.render(resultTipos, this.refNome.current)

  }

  guardarPoluicao(){
    this.state.addPoluicao(this.refNome.current.value, this.refQualidade.current.value)
    this.closePopUp()
  }



  closePopUp = () => {
    this.myRefPopUp.current.style.display = "none";
  };

  async componentDidMount(){
    await this.displayPoluicao()
  }

  render() {
    return (
      <div
        ref={this.myRefPopUp}
        id="mainProductPopUpPoluicao"
        className="mainProductPopUpPoluicao"
      >
        <div
          className="backgroundProductPopUpPoluicao"
          onClick={() => {
            this.closePopUp();
          }}
        ></div>
        <form action="/">
          <div className="productPopUpPoluicao">
            <i
              class="bi bi-x-lg"
              id="closePopUpPoluicaoProduct"
              onClick={() => {
                this.closePopUp();
              }}
            ></i>
            <h3>Poluição</h3>
            <h6>Adicione os tipos de poluição produzidos</h6>
            <div className="inputsPoluicaoInserir">
              <div className="inputBlockPoluicaoInserir">
                <h6>Tipo recurso</h6>
                <select name="" id="" ref={this.refNome}>
                  {/* <option value="teste1">test1</option> */}
                </select>
              </div>
              <div className="inputBlockPoluicaoInserir">
                <h6>Subtipo recurso</h6>
                <select name="" id="" ref={this.refQualidade}>
                  <option value="Residual">Residual</option>
                  <option value="Marginal">Marginal</option>
                  <option value="Moderada">Moderada</option>
                  <option value="Severa">Severa</option>
                  <option value="Critica">Critica</option>
                </select>
              </div>
            </div>

            <h2 className="btnSalvarPoluicao" onClick={() => {this.guardarPoluicao()}}>Guardar</h2>
          </div>
        </form>
      </div>
    );
  }
}

export default ProductInserirPopUpPoluicao;
