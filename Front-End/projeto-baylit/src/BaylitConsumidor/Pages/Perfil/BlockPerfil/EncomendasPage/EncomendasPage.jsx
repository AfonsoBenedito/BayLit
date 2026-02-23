import React, { Component } from "react";

import "./EncomendasPage.css";

import { createRankSuntentabilidade } from "../../../../Components/LeafSVG";

import { getEncomendasByConsumidor } from "../../../../../Helpers/EncomendasHelper";

import { getProdutoByEspecifico } from "../../../../../Helpers/ProdutoHelper";

import ReactDOM from "react-dom";
import { getRelatorioEncomendasConsumidor } from "../../../../../Helpers/UserHelper";

class EncomendasPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      maxImages: 3,
    };

    this.refEncomendas = React.createRef();
  }

  resizeImages = () => {
    let sizeWindow = window.innerWidth;
    let device = navigator.userAgent;
    let typeDevice = "";

    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(device)) {
      typeDevice = "tablet";
    } else if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        device
      )
    ) {
      typeDevice = "mobile";
    }

    // let sizeWindow = window.screen.width;
    if (typeDevice == "mobile") {
      this.setState({ maxImages: 1 });
    } else if (sizeWindow > 1200) {
      this.setState({ maxImages: 3 });
    } else if (sizeWindow > 700) {
      this.setState({ maxImages: 2 });
    } else if (sizeWindow > 500) {
      this.setState({ maxImages: 1 });
    }
  };

  addFotosProdutosEncomenda(fotografias) {
    let result = [];

    let exemplo = fotografias;

    // console.log(exemplo)

    for (let i = 0; i < exemplo.length; i++) {
      // console.log(exemplo.length)
      // console.log(i)
      // console.log(this.state.maxImages)
      if (exemplo.length > this.state.maxImages && i >= this.state.maxImages) {
        let toAddImgMore = exemplo.length - i + "+";
        result.push(
          <div className="toImgProductEncomenda toColorImgMore">
            <span className="numberMoreImgProductEncomenda">
              {toAddImgMore}
            </span>
          </div>
        );
        return result;
      }

      //TROCAR AQUI O IMG POR ELEMENTO HTML
      result.push(
        <div className="toImgProductEncomenda">
          <img className="toImgProductEncomendaSrc" src={exemplo[i]} />
        </div>
      );
    }

    return result;
  }

  async descarregarRelatorio(filetype){

    let info = JSON.parse(localStorage.getItem('baylitInfo'))

    let res = await getRelatorioEncomendasConsumidor(info.id, info.token, filetype)


  }

  async createEncomendas() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let result = [];

    //GET ENCOMENDAS ATIVAS

    let encomendas = await getEncomendasByConsumidor(info.id, info.token);


    if (encomendas != false) {

      

      for (let i = encomendas.length - 1; i >= 0; i--) {
        //ADICIONAR INFO

        let encomenda = encomendas[i];

        let fotografias = [];

        for (let k = 0; k < encomenda.produtos.length; k++) {
          let produto = await getProdutoByEspecifico(encomenda.produtos[k].produto)

          fotografias.push( produto.fotografia[0] );
        }


        if (
          encomenda.estado == "Confirmada" ||
          encomenda.estado == "Em transporte" ||
          encomenda.estado == "Entregue" ||
          encomenda.estado == "Cancelada"
        ) {
          
          let data_encomenda = encomenda.data_encomenda;
          let data_entrega = encomenda.data_entrega;

          if (!data_entrega) {
            data_entrega = "Sem previsão";
          }

          result.push(
            <a href={"/Perfil/Encomendas/" + encomenda._id} className="toLink aEncomendasPage">
              <div className="mainEncomenda">
                <div className="leftBlockEncomenda">
                  <h4>
                    {"Data da encomenda " + data_encomenda}
                    <br />
                    <span className="ratingEncomenda">
                      {createRankSuntentabilidade(4)}
                    </span>
                  </h4>
                  <br></br>
                  <p className="estadoDaEncomendaIndividual">Estado da encomenda: {encomenda.estado}</p>
                  <h6 id="estimativaDaEncomendaIndividual">Estimativa de entrega: {data_entrega.slice(0,10)}</h6>
                </div>
                <div className="rightBlockEncomenda">
                  {this.addFotosProdutosEncomenda(fotografias)}
                </div>
              </div>
            </a>
          );
        }
      }
    } else {
    }

    if (result.length == 0) {

      let toAdd = [
        <h5 className="emptyEcomendaPage">
          Ainda não efetuas-te nenhuma encomenda.
        </h5>,
      ];
      ReactDOM.render(toAdd, this.refEncomendas.current);
    } else {
      result.unshift(
        <div>
          <div className="downloadButton" onClick={async() => {this.descarregarRelatorio("csv")}}>
              Descarregar o seu relatório de encomendas em CSV
          </div>
          <div className="downloadButton" onClick={async() => {this.descarregarRelatorio("json")}}>
            Descarregar o seu relatório de encomendas em JSON
          </div>
        </div>
      )
      ReactDOM.render(result, this.refEncomendas.current);
    }
  }

  async componentDidMount() {
    this.resizeImages();
    window.addEventListener("resize", this.resizeImages);

    await this.createEncomendas();
  }

  render() {
    return <div ref={this.refEncomendas} className="mainEncomendasPage"></div>;
  }
}

export default EncomendasPage;
