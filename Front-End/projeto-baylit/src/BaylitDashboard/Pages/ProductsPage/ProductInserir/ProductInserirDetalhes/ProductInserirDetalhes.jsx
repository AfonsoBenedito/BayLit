import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Navigate } from "react-router-dom";
import { getCategorias, getSubCategoriasByCategoria } from "../../../../../Helpers/CategoryHelper";

import "./ProductInserirDetalhes.css";

class ProductInserirDetalhes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fotografiasDisplay: [],
      fotografiasFiles: [],
      categoriasHtml: [],
      subcategoriasHtml: {},
      redirect: false,
      changeState: this.props.changeState

    };

    

    this.myRefDisplayerFotos = React.createRef();

    this.refNome = React.createRef()
    this.refDescricao = React.createRef()
    this.refCategoria = React.createRef()
    this.refSubcategoria = React.createRef()

    this.refRedirect = React.createRef()

    this.removerFotografia = this.removerFotografia.bind(this)
  }

  createFotografias(){
    let result = [];

    result.push(
      <label className="fotoProdutoInserirAdd" htmlFor="addImgProdutoInserir">
        <i class="bi bi-plus-lg"></i>
        <input type="file" id="addImgProdutoInserir" accept="image/*" onChange={() => {this.adicionarFotografia()}}/>
      </label>
    );

    for (let i = 0; i < this.state.fotografiasDisplay.length; i++) {
      result.push(
        <div className="fotoProdutoInserir">
          <img src={this.state.fotografiasDisplay[i]} alt="" />
          <i class="bi bi-trash3" onClick={() => {this.removerFotografia(this.state.fotografiasDisplay[i])}}></i>
        </div>
      );
    }

    ReactDOM.render(result, this.myRefDisplayerFotos.current);
  };

  adicionarFotografia(){

   

    let [inputFiles] = document.getElementById('addImgProdutoInserir').files

    // console.log(inputFiles)

    if (inputFiles){
      let fotosDisplay = this.state.fotografiasDisplay
      let fotosFiles = this.state.fotografiasFiles

      let url = URL.createObjectURL(inputFiles)

      fotosDisplay.push(url)
      fotosFiles.push({inputFiles,url})

      this.setState({
        fotografiasDisplay: fotosDisplay,
        fotografiasFiles: fotosFiles
      })

    }

    this.createFotografias()
  
  }

  removerFotografia(fotoRemover){

    let removeu = false
    for (let i = 0; i < this.state.fotografiasDisplay.length && removeu == false; i++){

      if (fotoRemover == this.state.fotografiasDisplay[i]){


        removeu = true
        let novasFotosDisplay = this.state.fotografiasDisplay
        novasFotosDisplay.splice(i,1)

        let fotosAdicionar = this.state.fotografiasFiles

        let tavaNoAdicionar = false

        for (let k = 0; k < fotosAdicionar.length && tavaNoAdicionar == false; k++){
          if (fotosAdicionar[k]['url'] == fotoRemover){
            fotosAdicionar.splice(k,1)
            tavaNoAdicionar = true
          }
        }

        
        this.setState({
          fotografiasDisplay: novasFotosDisplay,
          fotografiasFiles: fotosAdicionar
        })

      }

    }

    this.createFotografias()
  }

  async displayCategorias(){

    let categorias = await getCategorias()

    let listaIdsCategorias = []


    let resultOptionsCategorias = []

    let resultOptionsSubcategorias = {}

    let primeiroValorCategoria;

    for (let i = 0; i < categorias.length; i++){

        if (i == 0){
            primeiroValorCategoria = categorias[i]._id
        }

        listaIdsCategorias.push(categorias[i]._id)

        resultOptionsCategorias.push(<option value={categorias[i]._id}>{categorias[i].nome}</option>)

        let subcategorias = await getSubCategoriasByCategoria(categorias[i]._id)

        resultOptionsSubcategorias[categorias[i]._id] = []

        for (let k = 0; k < subcategorias.length; k++){

            resultOptionsSubcategorias[categorias[i]._id].push(<option value={subcategorias[k]._id}>{subcategorias[k].nome}</option>)

        }

    }

    this.setState({
        categoriasHtml: resultOptionsCategorias,
        subcategoriasHtml: resultOptionsSubcategorias
    })


    ReactDOM.render(resultOptionsCategorias, this.refCategoria.current)
    ReactDOM.render(resultOptionsSubcategorias[primeiroValorCategoria], this.refSubcategoria.current)

  }

  changeCategoria(){

    ReactDOM.render(this.state.subcategoriasHtml[this.refCategoria.current.value], this.refSubcategoria.current)

  }

  proximaEtapa(){

    let nome = this.refNome.current.value
    let descricacao = this.refDescricao.current.value
    let categoria = this.refCategoria.current.value
    let subcategoria = this.refSubcategoria.current.value
    let fotografias = this.state.fotografiasFiles

    // console.log(nome)
    // console.log(descricacao)
    // console.log(categoria)
    // console.log(subcategoria)
    // console.log(fotografias.length)

    if (nome != "" && descricacao != "" && categoria != "" && subcategoria != "" && fotografias.length > 0){

      this.state.changeState({nome, descricacao, categoria, subcategoria, fotografias})
      
      this.setState({
        redirect: true
      })

    }
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Navigate to='/Dashboard/Products/Inserir/Producao' />
    }
  }

  async componentDidMount() {
    await this.displayCategorias()
    this.createFotografias()
  }

  render() {
    return (
      <div className="mainInserirDetalhes">
        <h3>Detalhes do produto</h3>
        <div className="inputBlockProductInserir">
          <h6>Nome</h6>
          <input type="text" placeholder="Nome" ref={this.refNome} />
        </div>
        <div className="inputBlockProductInserir">
          <h6>Descrição</h6>
          <textarea maxLength={500} ref={this.refDescricao}>
          </textarea>
        </div>

        <h3>Fotografias</h3>
        <div
          ref={this.myRefDisplayerFotos}
          className="fotografiasInserirDisplayer"
        ></div>

        <h3>Categoria do produto</h3>
        <div className="inputBlockProductInserir">
          <h6>Categoria</h6>
          <select onChange={() => {this.changeCategoria()}} name="" id="" ref={this.refCategoria}>
          </select>
        </div>
        <div className="inputBlockProductInserir" >
          <h6>Subcategoria</h6>
          <select name="" id="" ref={this.refSubcategoria}>
          </select>
        </div>
        <h2 className="btnSalvarFotosInserir" onClick={() => {this.proximaEtapa()}}>Guardar e progredir</h2>
        {this.renderRedirect()}
      </div>
    );
  }
}

export default ProductInserirDetalhes;
