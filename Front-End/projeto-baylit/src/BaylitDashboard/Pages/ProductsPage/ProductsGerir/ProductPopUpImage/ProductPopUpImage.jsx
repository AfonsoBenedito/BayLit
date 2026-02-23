import React, { Component } from "react";
import ReactDOM from "react-dom";
import { alterarProduto } from "../../../../../Helpers/ProdutoHelper";

import "./ProductPopUpImage.css";

class ProductPopUpImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idProduto: this.props.idProduto,
      nomeProduto: this.props.nomeProduto,
      fotografias:this.props.fotografias,
      fotografiasAtuais: this.props.fotografias,
      fotografiasRemover: [],
      fotografiasAdicionar: []
    };
    this.myRefDisplayer = React.createRef();

    this.myRefPopUp = React.createRef();
  }

  closePopUp = () => {
    this.myRefPopUp.current.style.display = "none";
  };

  createFotografias() {
    let result = [];

    result.push(
      <label className="fotoProdutoPopUpAdd" htmlFor="addImgProduto">
        <i class="bi bi-plus-lg"></i>
        <input type="file" id="addImgProduto" accept="image/jpg , image/png , image/jpeg" onChange={async () => {await this.adicionarFotografia()}}/>
      </label>
    );

    // console.log(this.state.fotografias)
    // console.log(this.state.fotografiasAtuais)
    

    for (let i = 0; i < this.state.fotografiasAtuais.length; i++) {
      result.push(
        <div className="fotoProdutoPopUp">
          <img src={this.state.fotografiasAtuais[i]} alt="" />
          <i class="bi bi-trash3" onClick={async () => {await this.removerFotografia(this.state.fotografias[i])}}></i>
        </div>
      );
    }

    // console.log(this.state.fotografias)
    // console.log(this.state.fotografiasAtuais)

    ReactDOM.render(result, this.myRefDisplayer.current);
  };

  async adicionarFotografia(){

    let [inputFiles] = document.getElementById('addImgProduto').files

    // console.log(inputFiles)

    if (inputFiles){
      let novasFotosAtuais = this.state.fotografiasAtuais
      let fotosAdicionar = this.state.fotografiasAdicionar

      let url = URL.createObjectURL(inputFiles)

      novasFotosAtuais.push(url)
      fotosAdicionar.push({inputFiles, url})
    }

    this.createFotografias()

  }

  async removerFotografia(fotoRemover){

    let removeu = false
    for (let i = 0; i < this.state.fotografiasAtuais.length && removeu == false; i++){

      if (fotoRemover == this.state.fotografiasAtuais[i]){
        removeu = true
        let novasFotosAtuais = this.state.fotografiasAtuais
        novasFotosAtuais.splice(i,1)

        let fotosAdicionar = this.state.fotografiasAdicionar

        let tavaNoAdicionar = false

        for (let k = 0; k < fotosAdicionar.length && tavaNoAdicionar == false; k++){
          if (fotosAdicionar[k]['url'] == fotoRemover){
            fotosAdicionar.splice(k,1)
            tavaNoAdicionar = true
          }
        }

        let removerFotos = this.state.fotografiasRemover

        if (tavaNoAdicionar == false){
          removerFotos.push(fotoRemover)
        }

        

        this.setState({
          fotografiasAtuais: novasFotosAtuais,
          fotografiasRemover: removerFotos,
          fotografiasAdicionar: fotosAdicionar
        })

        // console.log(novasFotosAtuais)
      }

    }

    
    // console.log(this.state.fotografiasAtuais)
    // console.log(this.state.fotografiasRemover)
    // console.log(this.state.fotografiasAdicionar)

    this.createFotografias()

  }

  async enviarFotografias(){

    if (this.state.fotografiasRemover != [] && this.state.fotografiasAdicionar != []){
      let info = JSON.parse(localStorage.getItem('baylitInfo'))

      let fotosAdicionar = []

      for (let i = 0; i < this.state.fotografiasAdicionar.length; i++){
        fotosAdicionar.push(this.state.fotografiasAdicionar[i]['inputFiles'])
      }

      let res = await alterarProduto(info.token, this.state.idProduto, null, null, fotosAdicionar, this.state.fotografiasRemover)

      window.location.href = "/Dashboard/Products/" + this.state.idProduto
    } else {
    }

    
  }

  componentDidUpdate(prevProps, prevState) {
    this.createFotografias()
  }

  componentDidMount() {
    this.createFotografias()
  }
  render() {
    return (
      <div
        ref={this.myRefPopUp}
        id="mainProductPopUpImage"
        className="mainProductPopUpImage"
      >
        <div
          className="backgroundProductPopUpImage"
          onClick={() => {
            this.closePopUp();
          }}
        ></div>
        <form action="/">
          <div className="productPopUpImage">
            <i
              class="bi bi-x-lg"
              id="closePopUpImagesProduct"
              onClick={() => {
                this.closePopUp();
              }}
            ></i>
            <h3>Fotografias</h3>
            <h6>{this.state.nomeProduto}</h6>
            <div className="fotografiasPopUpDisplayer">
              <div
                ref={this.myRefDisplayer}
                className="gridFotografiasPopUp"
              ></div>
            </div>
            <h2 className="btnSalvarFotos" onClick={async () => {await this.enviarFotografias()}}>Guardar</h2>
          </div>
        </form>
      </div>
    );
  }
}

export default ProductPopUpImage;
