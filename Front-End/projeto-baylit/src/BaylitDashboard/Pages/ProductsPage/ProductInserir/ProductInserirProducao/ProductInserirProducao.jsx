import React, { Component } from "react";
import ReactDOM from "react-dom";
import ProductInserirPopUpPoluicao from "./ProductInserirPopUpPoluicao/ProductInserirPopUpPoluicao";
import ProductInserirPopUpRecursos from "./ProductInserirPopUpRecursos/ProductInserirPopUpRecursos";
import { Navigate } from "react-router-dom";

import "./ProductInserirProducao.css";

class ProductInserirProducao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeState: this.props.changeState,
      recursosAtuais: [],
      poluicaoAtuais: [],
      redirect: false
    };

    this.myRefDisplayerRecursos = React.createRef();
    this.myRefDisplayerPoluicao = React.createRef();

    this.refTipo = React.createRef();

    this.addRecurso = this.addRecurso.bind(this)
    this.removeRecurso = this.removeRecurso.bind(this)
    this.createRecursos = this.createRecursos.bind(this)

    this.addPoluicao = this.addPoluicao.bind(this)
    this.removePoluicao = this.removePoluicao.bind(this)
    this.createPoluicao = this.createPoluicao.bind(this)
  }

  async createRecursos(){
    let result = [];

    result.push(
      <div
        className="recursoProducaoInserirAdd"
        onClick={() => {
          this.openPopUpRecursos();
        }}
      >
        <i class="bi bi-plus-lg"></i>
      </div>
    );

    for (let i = 0; i < this.state.recursosAtuais.length; i++) {
      result.push(
        <div className="recursoProducaoInserir">
          <div className="detailsProducaoBlocos toBlue">
            <h2>{this.state.recursosAtuais[i].quantidade}{this.state.recursosAtuais[i].unidade}</h2>
            <h4>{this.state.recursosAtuais[i].categoria}</h4>
            <h5>{this.state.recursosAtuais[i].nome}</h5>
          </div>
          <i class="bi bi-trash3" onClick={() => {this.removeRecurso(i)}}></i>
        </div>
      );
    }

    ReactDOM.render(result, this.myRefDisplayerRecursos.current);
  };

  addRecurso(categoria, nome, quantidade, unidade){
    let atuais = this.state.recursosAtuais
    atuais.push({categoria,nome,quantidade, unidade})
    this.setState({
      recursosAtuais: atuais
    })

    this.createRecursos()
  }

  removeRecurso(index){
    let atuais = this.state.recursosAtuais
    atuais.splice(index,1)
    this.setState({
      recursosAtuais: atuais
    })

    this.createRecursos()
  }

  async createPoluicao(){
    let result = [];

    result.push(
      <div
        className="recursoProducaoInserirAdd"
        onClick={() => {
          this.openPopUpPoluicao();
        }}
      >
        <i class="bi bi-plus-lg"></i>
      </div>
    );

    for (let i = 0; i < this.state.poluicaoAtuais.length; i++) {
      result.push(
        <div className="recursoProducaoInserir">
          <div className="detailsProducaoBlocos toYellow">
            <h2>{this.state.poluicaoAtuais[i].nome}</h2>
            <h5>{this.state.poluicaoAtuais[i].quantidade}</h5>
          </div>
          <i class="bi bi-trash3" onClick={() => {this.removePoluicao(i)}}></i>
        </div>
      );
    }

    ReactDOM.render(result, this.myRefDisplayerPoluicao.current);
  };

  addPoluicao(nome, quantidade){
    let atuais = this.state.poluicaoAtuais
    atuais.push({nome, quantidade})
    this.setState({
      poluicaoAtuais: atuais
    })

    this.createPoluicao()
  }

  removePoluicao(index){
    let atuais = this.state.poluicaoAtuais
    atuais.splice(index,1)
    this.setState({
      poluicaoAtuais: atuais
    })

    this.createPoluicao()
  }

  proximaEtapa(){
    let tipo = this.refTipo.current.value
    let recursos = this.state.recursosAtuais
    let poluicao = this.state.poluicaoAtuais

    if (recursos.length != 0 && poluicao.length != 0){
      this.state.changeState({tipo, recursos, poluicao})

      this.setState({
        redirect: true
      })
      console.log("Valido")
    }
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Navigate to='/Dashboard/Products/Inserir/Local' />
    }
  }

  openPopUpRecursos = () => {
    document.getElementById("mainProductPopUpRecursos").style.display =
      "initial";
  };

  openPopUpPoluicao = () => {
    document.getElementById("mainProductPopUpPoluicao").style.display =
      "initial";
  };

  async componentDidMount() {
    await this.createPoluicao()
    await this.createRecursos()
  }

  render() {
    return (
      <div className="mainInserirProducao">
        <h3>Tipo de produção do produto</h3>
        <div className="inputBlockProductProducao">
          <h1>Tipo</h1>
          <select name="" id="" ref={this.refTipo}>
            <option value="Biologica">Biologica</option>
            <option value="Organica">Organica</option>
            <option value="Intensiva">Intensiva</option>
          </select>
        </div>

        <h3>Recursos utilizados</h3>
        <div
          ref={this.myRefDisplayerRecursos}
          className="recursosProducaoDisplayer"
        ></div>

        <h3>Poluição produzida</h3>
        <div
          ref={this.myRefDisplayerPoluicao}
          className="recursosProducaoDisplayer"
        ></div>

        <h2 className="btnSalvarProducao" onClick={() => {this.proximaEtapa()}}>Guardar e progredir</h2>
        <ProductInserirPopUpRecursos addRecurso={this.addRecurso}/>
        <ProductInserirPopUpPoluicao addPoluicao={this.addPoluicao}/>
        {this.renderRedirect()}
      </div>
    );
  }
}

export default ProductInserirProducao;
