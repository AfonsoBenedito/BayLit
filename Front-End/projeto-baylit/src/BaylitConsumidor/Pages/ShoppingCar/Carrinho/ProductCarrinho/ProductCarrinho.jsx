import React, { Component } from "react";
import "./ProductCarrinho.css";

import ReactDOM from "react-dom";

import { createRankSuntentabilidade } from "../../../../Components/LeafSVG";

import {
  verificarCompare,
  adicionarProdutoCompare,
  removeProdutoCompare,
  removerProdutoCarrinho,
  atualizarProdutoCarrinho,
} from "../../../../../Helpers/ProdutoHelper";

import {
  getUserFavoriteProducts,
  adicionarUserFavoriteProduct,
  removerUserFavoriteProduct,
} from "../../../../../Helpers/UserHelper";

class ProductStepOne extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nomeProduto: this.props.nomeProduto,
      descricaoProduto: this.props.descricaoProduto,
      nivelSustentabilidade: this.props.nivelSustentabilidade, //valor inteiro
      listaAtributos: this.props.listaAtributos,
      precoUnidade: this.props.precoUnidade,
      precoTotal: this.props.precoTotal,
      quantidade: this.props.quantidade,
      srcProduct: this.props.srcProduct,
      idProduct: this.props.idProduct,
      atividadeCompare: "Adicionar a",
      idSpecific: this.props.idSpecific,
    };

    console.log("props")
    console.log(this.props.quantidade)
    this.setQuantidadeDefault = this.setQuantidadeDefault.bind(this);

    this.displayCompare = this.displayCompare.bind(this);
    this.alterarCompare = this.alterarCompare.bind(this);

    this.refFavorito = React.createRef();
    this.refQuantidade = React.createRef();
    this.refbotaoCompare = React.createRef();
  }

  openSelectQnt() {
    // console.log("eheheh");
    console.log(this.myRefSelectQnt.current);
    this.myRefSelectQnt.current.focus();
  }

  addAtributos(listaAtributos) {
    let result = [];

    for (let i = 0; i < listaAtributos.length; i++) {
      if(i==0){
        result.push(
          <span className="atributoProdutoCarrinho">
            {listaAtributos[i].valor }
          </span>
        );
      } else {
        result.push(
          <span className="atributoProdutoCarrinho">
            , {listaAtributos[i].valor }
          </span>
        );
      }
      
    }

    return result;
  }

  setQuantidadeDefault() {
    document.getElementsByClassName("optionQuantidade")[
      this.state.quantidade - 1
    ].selected = "selected";
    
  }

  async displayFavorito() {
    // console.log("DISPLAY")

    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let htmlFavorito = [];

    if (info.tipo == "Consumidor" || info.tipo == "NaoAutenticado") {
      let produtos = await getUserFavoriteProducts(info.id, info.token);

      let pertence = false;

      for (let i = 0; i < produtos.length; i++) {
        let produto = produtos[i];

        if (produto._id == this.state.idProduct) {
          pertence = true;
        }
      }

      if (pertence) {
        htmlFavorito = (
          <div
            onClick={async () => {
              await this.removerProdutoFavoritos();
            }}
            className="addFavoritesCarrinho"
          >
            <i class="bi bi-heart-fill"></i>
            <span>Favoritos</span>
          </div>
        );
      } else {
        htmlFavorito = (
          <div
            onClick={async () => {
              await this.adicionarProdutoFavoritos();
            }}
            className="addFavoritesCarrinho"
          >
            <i class="bi bi-heart"></i>
            <span>Favoritos</span>
          </div>
        );
      }

      console.log(pertence);
    }

    ReactDOM.render(htmlFavorito, this.refFavorito.current);
  }

  async adicionarProdutoFavoritos() {
    // console.log("adicionar aos favs")

    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    if (info.tipo != "Consumidor"){
      console.log("TEM DE SER CONSUMIDOR PARA TER FAVORITOS")

    } else {

      await adicionarUserFavoriteProduct(
        info.id,
        info.token,
        this.state.idProduct
      );
  
      await this.displayFavorito();

    }

    
  }

  async removerProdutoFavoritos() {
    // console.log("remover dos favs")

    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    if (info.tipo != "Consumidor"){
      console.log("TEM DE SER CONSUMIDOR PARA TER FAVORITOS")

    } else {

      await removerUserFavoriteProduct(info.id, info.token, this.state.idProduct);

      await this.displayFavorito();

    }

    
  }

  displayCompare() {
    if (verificarCompare(this.state.idProduct)) {
      this.setState({
        atividadeCompare: "Remover de",
      });
      this.refbotaoCompare.current.style.color = "red";
    } else {
      this.setState({
        atividadeCompare: "Adicionar a",
      });
      this.refbotaoCompare.current.style.color = "#212529";
    }
  }

  alterarCompare() {
    if (verificarCompare(this.state.idProduct)) {
      removeProdutoCompare(this.state.idProduct);
      this.refbotaoCompare.current.style.color = "#212529";

    } else {
      adicionarProdutoCompare(this.state.idProduct);
      this.refbotaoCompare.current.style.color = "red";

    }

    this.displayCompare();
  }

  async removerProduto() {
    // console.log("REMOVER PRODUTO")

    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let res = await removerProdutoCarrinho(
      info.id,
      info.token,
      this.state.idSpecific
    );

    console.log(res);

    if (res != false) {
      window.location.href = "/ShoppingCar";
    }
  }

  async alterarQuantidade() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let res = await atualizarProdutoCarrinho(
      info.id,
      info.token,
      this.state.idSpecific,
      this.refQuantidade.current.value
    );

    if (res != false) {
      window.location.href = "/ShoppingCar";
    }
    
  }

  async componentDidMount() {
    //this.setQuantidadeDefault();
    this.displayCompare();

    await this.displayFavorito();
  }

  render() {
    return (
      <div className="mainProductCarrinho">
        <div className="imageProductCarrinho">
          <a href={"/Shop/Product/" + this.state.idProduct}>
            <img src={this.state.srcProduct} loading="lazy" alt={this.state.nomeProduto} />
          </a>
        </div>
        <div className="infoProductCarrinho">
          <a href={"/Shop/Product/" + this.state.idProduct}>
            <h3>{this.state.nomeProduto}</h3>
          </a>
          <p className="descProductShoppingCar">
            {this.state.descricaoProduto}
            <div class="fadeOutdescProductShoppingCar"></div>
          </p>
          <div className="ratingSustainability">
            {createRankSuntentabilidade(this.state.nivelSustentabilidade)}
          </div>
          <div className="atributosProductCarrinho">
            {this.addAtributos(this.state.listaAtributos)}
          </div>
          <div>
            <h4 className="individualPrice">
              {this.state.precoUnidade}€<span>/unidade</span>
            </h4>
          </div>
        </div>
        <div className="optionsProductCarrinho">
          <h1 className="titleOptionsProductCarrinho">
            <span className="actualUnityProductCarrinho">
              {" "}
              {this.state.precoTotal}€
            </span>
            <span className="actualUnityProductCarrinhoUN"> /total</span>
          </h1>

          <div className="quantityProductShoppingCar">
            <span>Quantidade:</span>
            <select
              ref={this.refQuantidade}
              onChange={async () => {
                await this.alterarQuantidade();
              }}
              value={this.state.quantidade}
              className="atributoInput"
            >
              <option className="optionQuantidade" value="1">
                1
              </option>
              <option className="optionQuantidade" value="2">
                2
              </option>
              <option className="optionQuantidade" value="3">
                3
              </option>
              <option className="optionQuantidade" value="4">
                4
              </option>
              <option className="optionQuantidade" value="5">
                5
              </option>
              <option className="optionQuantidade" value="6">
                6
              </option>
              <option className="optionQuantidade" value="7">
                7
              </option>
              <option className="optionQuantidade" value="8">
                8
              </option>
              <option className="optionQuantidade" value="9">
                9
              </option>
              <option className="optionQuantidade" value="10">
                10
              </option>
            </select>
            {/* <i class="bi bi-chevron-down"></i> */}
          </div>

          <div className="rightDetailsProductCarrinho">
            <div ref={this.refFavorito} className="externoFavoritos">
              <div className="addFavoritesCarrinho">
                <i class="bi bi-heart"></i>
                <span>Favoritos</span>
              </div>
            </div>
            <div ref={this.refbotaoCompare} onClick={this.alterarCompare} className="addCompareCarrinho">
              <i class="bi bi-arrow-left-right"></i>
              <span className="alignCompareProductCarrinho">
                {this.state.atividadeCompare} <br /> Comparar
              </span>
            </div>
            <div
              onClick={async () => {
                await this.removerProduto();
              }}
              className="addCompareCarrinho"
            >
              <i class="bi bi-trash3"></i>
              <span>Remover</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductStepOne;
