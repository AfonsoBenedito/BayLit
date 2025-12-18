import React, { Component } from "react";
import { adicionarLocal, adicionarProducao, adicionarProduto } from "../../../../../Helpers/FornecedorHelper";

import "./ProductInserirLocal.css";

class ProductInserirLocal extends Component {
  constructor(props){
    super(props)
    this.state = {
      changeState: this.props.changeState,
      buscarDetalhes: this.props.buscarDetalhes,
      buscarProducao: this.props.buscarProducao
    };

    this.refPais = React.createRef()
    this.refLocalidade = React.createRef()
    this.refMorada = React.createRef()
    this.refCodigo = React.createRef()
  }

  async finalizar(){
    let info = JSON.parse(localStorage.getItem('baylitInfo'))

    let pais = this.refPais.current.value
    let localidade = this.refLocalidade.current.value
    let morada = this.refMorada.current.value
    let codigo = this.refCodigo.current.value

    if (pais != "" && localidade != "" && morada != "" && codigo != ""){

      let local = {pais, localidade, morada, codigo}

      this.state.changeState(local)


      let detalhes = this.state.buscarDetalhes()
      let producao = this.state.buscarProducao()
      
      // console.log(detalhes)
      // console.log(producao)
      // console.log(local)

      let fotosFiles = []

      for (let i = 0; i < detalhes.fotografias.length; i++){
        fotosFiles.push(detalhes.fotografias[i].inputFiles)
      }

      let produtoRes = await adicionarProduto(info.id,info.token,detalhes.nome,detalhes.categoria, detalhes.subcategoria, detalhes.descricao,fotosFiles)

      if (produtoRes != false){

        let localRes = await adicionarLocal(info.id, info.token, "local_producao", local.morada, local.codigo, local.localidade, local.pais)

        if (localRes != false){

          let producaoRes = await adicionarProducao(info.token, produtoRes._id, localRes._id, producao.tipo, producao.recursos, producao.poluicao)

          if (producaoRes != false){
            console.log("Correu top")
            console.log(produtoRes)
            console.log(localRes)
            console.log(producaoRes)

            window.location.href = "/Dashboard/Products/" + produtoRes._id
          } else {
            console.log("Correu mal producao")
          }
        } else {
          console.log("Correu mal local")
        }

      } else {
        console.log("Correu mal produto")
      }

    }
  }
  
  render() {
    return (
      <div className="mainInserirLocal">
        <h3>Local de produção do produto</h3>
        <div className="inputBlockProductLocal">
          <h1>País</h1>
          <input type="text" placeholder="País" ref={this.refPais}/>
        </div>
        <div className="inputBlockProductLocal">
          <h1>Localidade</h1>
          <input type="text" placeholder="Localidade" ref={this.refLocalidade}/>
        </div>
        <div className="inputBlockProductLocal">
          <h1>Morada</h1>
          <input type="text" placeholder="Morada" ref={this.refMorada}/>
        </div>
        <div className="inputBlockProductLocal">
          <h1>Código postal</h1>
          <input type="text" placeholder="cccc-nnn" ref={this.refCodigo}/>
        </div>
        <h2 className="btnSalvarProducao" onClick={async () => {await this.finalizar()}}>Finalizar e guardar</h2>
      </div>
    );
  }
}

export default ProductInserirLocal;
