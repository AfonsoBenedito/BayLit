// import React from "react";
import React, { Component } from "react";
import "./Product.css";

import ReactDOM from "react-dom"

import { verificarCompare, adicionarProdutoCompare, removeProdutoCompare } from "../../../Helpers/ProdutoHelper";

import {getUserFavoriteProducts, adicionarUserFavoriteProduct, removerUserFavoriteProduct} from "../../../Helpers/UserHelper"

import { createRankSuntentabilidade, getLeaf } from "../LeafSVG";

class Product extends Component {
  constructor(props) {
    super(props);

    this.myRefRating = React.createRef();
    this.myRefBlockRating = React.createRef();

    this.state = {
      srcProduct: this.props.srcProduct,
      nivelSustentabilidade: this.props.nivelSustentabilidade, //1,2,3,4,5
      nivelProducao: this.props.nivelProducao,
      nivelArmazenamento: this.props.nivelArmazenamento,
      nivelTransporte: this.props.nivelTransporte,
      nomeProduto: this.props.nomeProduto,
      categoriaProduto: this.props.categoriaProduto,
      promocaoProduto: this.props.promocaoProduto,
      precoProduto: this.props.precoProduto,
      idProduto: this.props.idProduto,

      atividadeCompare: "Adicionar a"
    };

    this.displayCompare = this.displayCompare.bind(this)
    this.alterarCompare = this.alterarCompare.bind(this)

    this.refbotaoCompare = React.createRef()
    this.refFavorito = React.createRef()
  }

  async displayFavorito(){

    let info = JSON.parse(localStorage.getItem('baylitInfo'))

    let htmlFavorito = [];

    if (info.tipo == 'Consumidor'){

      let produtos = await getUserFavoriteProducts(info.id, info.token);

      let pertence = false

      for (let i = 0; i < produtos.length; i++){

        let produto = produtos[i]

        if (produto._id == this.state.idProduto){
          pertence = true
        }
      }

      if (pertence){

        htmlFavorito = <div onClick={async () => {await this.removerProdutoFavoritos()}} className="btnLikeProductCard">
                            <i class="bi bi-heart-fill"></i>
                          </div>
        

      } else {

        htmlFavorito = <div onClick={async () => {await this.adicionarProdutoFavoritos()}} className="btnLikeProductCard">
                            <i class="bi bi-heart"></i>
                          </div>

      }

    }



    ReactDOM.render(htmlFavorito, this.refFavorito.current)


  }

  async adicionarProdutoFavoritos(){

    console.log("adicionar aos favs")

    let info = JSON.parse(localStorage.getItem('baylitInfo'))

    await adicionarUserFavoriteProduct(info.id, info.token, this.state.idProduto)

    await this.displayFavorito()

  }

  async removerProdutoFavoritos(){

    console.log("remover dos favs")

    let info = JSON.parse(localStorage.getItem('baylitInfo'))

    await removerUserFavoriteProduct(info.id, info.token, this.state.idProduto)

    await this.displayFavorito()

  }


  displayCompare(){

    if (verificarCompare(this.state.idProduto)){

      this.setState({
        atividadeCompare: "Remover de"
      })

      this.refbotaoCompare.current.style.color = "red";

    } else {

      this.setState({
        atividadeCompare: "Adicionar a"
      })

      this.refbotaoCompare.current.style.color = "#212529";
      
    }

  }

  alterarCompare(){

    if (verificarCompare(this.state.idProduto)){

      this.refbotaoCompare.current.style.color = "#212529";

      removeProdutoCompare(this.state.idProduto)

    } else {

      this.refbotaoCompare.current.style.color = "red";

      adicionarProdutoCompare(this.state.idProduto)

    }

    this.displayCompare()
  }

  async componentDidMount(){
    this.displayCompare()

    await this.displayFavorito()
  }

  componentWillUnmount(){
    this.refFavorito = "";
    this.myRefBlockRating = "";
    this.myRefRating = "";
  }


  render() {
    // const srcProduct = this.state.srcProduct;

    return (
      <div className="mainProduct">
        
          <div className="blockImageProduct">
            <a href={"/Shop/Product/" + this.state.idProduto} className="toLink">
              <img src={this.state.srcProduct} />
            </a>
            <div ref={this.refFavorito}>
              {/* <div className="btnLikeProductCard">
                <i class="bi bi-heart"></i>
              </div> */}
            </div>
            <div
              ref={this.myRefBlockRating}
              className="blockRatingSstentabilidade"
            >
              <div
                ref={this.myRefRating}
                className="ratingSustentabilidadeGeral"
              >
                {createRankSuntentabilidade(this.state.nivelSustentabilidade)}
              </div>
              <div className="ratingSustentabilidadeEspecifica">
                <div className="detailSustentabilidade">
                  <h6>Produção</h6>
                  <h4>
                    {this.state.nivelProducao}
                    <span className="detailLeafProduto">{getLeaf()}</span>
                  </h4>
                </div>
                <div className="detailSustentabilidade">
                  <h6>Armazenamento</h6>
                  <h4>
                    {this.state.nivelArmazenamento}
                    <span className="detailLeafProduto">{getLeaf()}</span>
                  </h4>
                </div>
                <div className="detailSustentabilidade">
                  <h6>Transporte</h6>
                  <h4>
                    {this.state.nivelTransporte}
                    <span className="detailLeafProduto">{getLeaf()}</span>
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <a href={"/Shop/Product/" + this.state.idProduto} className="toLink">
            <h4 className="nameProductCard">{this.state.nomeProduto}</h4>
          </a>
          <h5 className="subcategoryProductCard">
            {this.state.categoriaProduto}
          </h5>

          <div class="lineProductCard">
            <h5 className="priceProductCard">
              <span>{this.state.promocaoProduto}</span>{" "}
              {this.state.precoProduto}
            </h5>
            <div ref={this.refbotaoCompare} onClick={this.alterarCompare} className="compareBtnProductCard">
              <i class="bi bi-arrow-left-right"></i>
              <h6>
                {this.state.atividadeCompare} <br /> comparar
              </h6>
            </div>
          </div>
      </div>
    );
  }
}

export default Product;
