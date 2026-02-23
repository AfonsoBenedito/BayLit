import React, { Component } from "react";
import ReactDOM from "react-dom";
import { useParams } from "react-router-dom";
import CadeiaLogistica from "./CadeiaLogistica/CadeiaLogistica";

import { createRankSuntentabilidade } from "../../Components/LeafSVG";

import "./ProductPage.css";
import {
  getCadeiaByProduto,
  getProduto,
  getProdutoEspecificoByProduto,
  getStockProdutoEspecifico,
} from "../../../Helpers/ProdutoHelper";
import { getAtributo } from "../../../Helpers/CategoryHelper";

// import ProductImage from "../../Images/HomeImages/productHome.jpg";
// import fotaA from "../../Images/AboutUs/teamBaylitSobreNos.jpg";
// import fotaB from "../../Images/AboutUs/Tomas3D.png";
// import fotaC from "../../Images/AboutUs/Telles3D.png";
// import fotaD from "../../Images/AboutUs/Tiago3D.png";
// import fotaE from "../../Images/AboutUs/Ventura3D.png";
// import fotaF from "../../Images/AboutUs/Tomas3D.png";
import { adicionarProdutoAoCarrinho, getUserFavoriteProducts, adicionarUserFavoriteProduct, removerUserFavoriteProduct } from "../../../Helpers/UserHelper";
import {adicionarProdutoCompare, removeProdutoCompare, verificarCompare} from "../../../Helpers/ProdutoHelper"


function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class ProductPage extends Component {
  constructor(props) {
    super(props);

    let { productId } = this.props.params;

    this.myRefTodasFotos = React.createRef();
    this.myRefMainFoto = React.createRef();

    this.myRefEscolhaAtributos = React.createRef();
    this.myRefLines = React.createRef();
    this.myRefVerMais = React.createRef();
    this.myRefVerMaisText = React.createRef();

    this.refCadeiaLogistica = React.createRef();

    this.refFavorito = React.createRef();

    this.refbotaoCompare = React.createRef();

    this.state = {
      productId: productId,
      productInfo: {
        nome: "Produto",
        preco: 10,
        cadeia: { rating: 3 },
        informacao_adicional: "Descrição",
        fotografia: "",
      },
      functionShowTableDetais: this.openTableDetails,

      todosProdutosEspecificos: [],
      produtosEspecificosDisponiveis: [],
      todosValores: [],
      valoresDisponivieis: [],
      atributosSelecionados:[],
      filtrosAplicados: [],
      todosAtributos: [],


      atividadeCompare: "Adicionar a"


    };

    this.clickAtributo = this.clickAtributo.bind(this)

    this.displayCompare = this.displayCompare.bind(this);
    this.alterarCompare = this.alterarCompare.bind(this);
  }

  async getEspecificidadesInicial(){

    let especificos = await getProdutoEspecificoByProduto(this.state.productId)

    let especificosStock = []

    let atributosTodos = []

    let valoresTodos = []

    for (let i = 0; i < especificos.length; i++){

      if (await getStockProdutoEspecifico(especificos[i]._id, "now") > 0){

        especificosStock.push(especificos[i])

        // console.log(especificos[i].especificidade)

        for (let k = 0; k < especificos[i].especificidade.length; k++){

          if (atributosTodos.includes(especificos[i].especificidade[k].atributo)){

            if (!valoresTodos[atributosTodos.indexOf(especificos[i].especificidade[k].atributo)].includes(especificos[i].especificidade[k].valor)){
              
              valoresTodos[atributosTodos.indexOf(especificos[i].especificidade[k].atributo)].push(especificos[i].especificidade[k].valor)

            }
  
          } else {
  
            // console.log(especificos[i].especificidade[k].atributo)
  
            atributosTodos.push(especificos[i].especificidade[k].atributo)
  
            valoresTodos.push([especificos[i].especificidade[k].valor])
          }
        }
      }
    }


    this.setState({
      todosProdutosEspecificos: especificosStock,
      produtosEspecificosDisponiveis: especificosStock,
      todosAtributos: atributosTodos,
      todosValores: valoresTodos,
      valoresDisponivieis: valoresTodos,
      filtrosAplicados: [],
      atributosSelecionados: []

    })

    // console.log(especificosStock)
    // console.log(atributosTodos)
    // console.log(valoresTodos)

  }

  async displayFavorito(){

    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    if(info.tipo == "Consumidor"){

    let htmlFavorito = [];

    if (info.tipo == "Consumidor" || info.tipo == "NaoAutenticado") {
      let produtos = await getUserFavoriteProducts(info.id, info.token);

      let pertence = false;

      for (let i = 0; i < produtos.length; i++) {
        let produto = produtos[i];

        if (produto._id == this.state.productId) {
          pertence = true;
        }
      }

      if (pertence) {
        htmlFavorito = (
          <div
            onClick={async () => {
              await this.removerProdutoFavoritos();
            }}
            className=""
          >
            <i class="bi bi-heart-fill"></i>
            <span>Remover dos <br /> Favoritos</span>
          </div>
        );
      } else {
        htmlFavorito = (
          <div
            onClick={async () => {
              await this.adicionarProdutoFavoritos();
            }}
            className=""
          >
            <i class="bi bi-heart"></i>
            <span>Adicionar aos <br /> Favoritos</span>
          </div>
        );
      }

    }

    ReactDOM.render(htmlFavorito, this.refFavorito.current);

    }
  }

  async adicionarProdutoFavoritos() {
    // console.log("adicionar aos favs")

    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    if (info.tipo != "Consumidor"){
    } else {

      await adicionarUserFavoriteProduct(
        info.id,
        info.token,
        this.state.productId
      );
  
      await this.displayFavorito();

    }

    
  }

  async removerProdutoFavoritos() {
    // console.log("remover dos favs")

    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    if (info.tipo != "Consumidor"){
    } else {

      await removerUserFavoriteProduct(info.id, info.token, this.state.productId);

      await this.displayFavorito();

    }
  }

  displayCompare() {
    if (verificarCompare(this.state.productId)) {
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
    if (verificarCompare(this.state.productId)) {
      removeProdutoCompare(this.state.productId);

      this.refbotaoCompare.current.style.color = "#212529";
    } else {
      adicionarProdutoCompare(this.state.productId);

      this.refbotaoCompare.current.style.color = "red";
    }

    this.displayCompare();
  }

  async adicionarAoCarrinho(){
    let info = JSON.parse(localStorage.getItem('baylitInfo'))

    let botaoAdicionar = document.getElementById("addCarrinhoPageProduct");
    // let teste = document.getElementById("adicionarAoCarrinhoAnimação");

    // botaoAdicionar.animate({
    //   backgroundColor: "Green"
    // }, 1000);

    // window.scrollTo(0, 0);

    // // teste.style.display = "block";
    // teste.animate({
    //   transform: "translate(750px, -600px)",
    //   height: "20px",
    //   width: "20px"
    // }, 600)

    // setTimeout(
    //   function() {
    //     teste.style.display = "none";
    //     teste.style.height = "40px";
    //     teste.style.width = "250px";
    //   }
    //   .bind(this),
    //   600
    // );
    

    if (this.state.produtosEspecificosDisponiveis.length == 1){

      let res = await adicionarProdutoAoCarrinho(info.id,info.token, this.state.produtosEspecificosDisponiveis[0]._id ,1)


      if (res != false){

        botaoAdicionar.animate({
          backgroundColor: "Green"
        }, 1500);
        //ADICIONADO COM SUCESSO
        //por enquanto vou mudar de página para ter feedback

        setTimeout(
          function() {
            window.location.href = "/Shoppingcar"
          }
          .bind(this),
          1500
        );
        
      } else {
        botaoAdicionar.animate({
          backgroundColor: "Red"
        }, 1500);
      }

    } else {

      botaoAdicionar.animate({
        backgroundColor: "Red"
      }, 1500);
      let divInfo = document.getElementById("erroAoAdicionarDiv");
      let textInfo = document.getElementById("erroAoAdicionarText")
      textInfo.style.color = "red";
      divInfo.style.display = "block";
      textInfo.innerHTML = "Erro! Por favor, selecione as opções do produto!"
      //FAZER DISPLAY DE TER QUE SELECIONAR MAIS ATRIBUTOS
    }
    
  }

  resetarFiltros(){

    window.location.href = "/Shop/Product/" + this.state.productId

  }

  clickAtributo(e){

    let {name, value} = e.target

    let filtrosAplicados = this.state.filtrosAplicados

    let atributosSelecionados = this.state.atributosSelecionados

    if (atributosSelecionados.length != 0){

      let encontrouFiltro = false

      for (let i = 0; i < filtrosAplicados.length; i++){

        if (filtrosAplicados[i].atributo == name){
  
          filtrosAplicados[i].valor = value

          encontrouFiltro = true
          atributosSelecionados.splice(atributosSelecionados.indexOf(name), 1)

          atributosSelecionados.push(name)
  
        }
  
      }

      if (encontrouFiltro == false){

        filtrosAplicados.push({
          atributo: name,
          valor: value
        })

        atributosSelecionados.push(name)

      }

    } else {

      filtrosAplicados.push({
        atributo: name,
        valor: value
      })

      atributosSelecionados.push(name)

    }

    // console.log(atributosSelecionados)

    this.setState({
      filtrosAplicados: filtrosAplicados,
      atributosSelecionados: atributosSelecionados
    })

    this.alterarValoresDisponiveis()

    // this.getEspecificosDisponiveis()

    // this.alterarBotoesDisponiveis()

  }

  alterarValoresDisponiveis(){

    let todosAtributos = this.state.todosAtributos

    let valoresDisponivieis = this.state.valoresDisponivieis

    let filtrosAplicados = this.state.filtrosAplicados

    let atributosSelecionados = this.state.atributosSelecionados

    // let indexUltimoAtributo = todosAtributos.indexOf(atributosSelecionados[atributosSelecionados.length - 1])

    // console.log(indexUltimoAtributo)

    for (let i = 0; i < valoresDisponivieis.length; i++){

      // if (i != indexUltimoAtributo){

        for (let k = 0; k < filtrosAplicados.length; k++){

          if (todosAtributos[i] == filtrosAplicados[k].atributo){

            valoresDisponivieis[i] = [filtrosAplicados[k].valor]

          }

        }

      // }

    }

    this.setState({
      valoresDisponivieis: valoresDisponivieis
    }, () => {this.getEspecificosDisponiveis()})

    // console.log(valoresDisponivieis)
    

  }

  getEspecificosDisponiveis(){

    let produtosEspecificosDisponiveis = this.state.produtosEspecificosDisponiveis

    let valoresDisponiveis = this.state.valoresDisponivieis

    // let atributosSelecionados = this.state.atributosSelecionados

    let atributosTodos = this.state.todosAtributos

    let novosEspecificos = []

    for (let i = 0; i < produtosEspecificosDisponiveis.length; i++){

      let especificoValido = true

      for (let k = 0; k < produtosEspecificosDisponiveis[i].especificidade.length; k++){

        for (let p = 0; p < valoresDisponiveis.length; p++){

          if (atributosTodos[p] == produtosEspecificosDisponiveis[i].especificidade[k].atributo){

            if (!valoresDisponiveis[p].includes(produtosEspecificosDisponiveis[i].especificidade[k].valor)){

              especificoValido =  false

            }

          }

        }

      }

      if (especificoValido ){
        novosEspecificos.push(produtosEspecificosDisponiveis[i])
      }

    }

    // console.log(produtosEspecificosDisponiveis)
    // console.log(valoresDisponiveis)

    this.setState({
      produtosEspecificosDisponiveis: novosEspecificos
    }, () => {this.alterarBotoesDisponiveis()})


    let infoProduto = this.state.productInfo

    infoProduto.preco = novosEspecificos[0].preco

  }

  alterarBotoesDisponiveis(){

    let produtosEspecificosDisponiveis = this.state.produtosEspecificosDisponiveis

    let valoresDisplay = []

    let todosAtributos = this.state.todosAtributos



    for (let i = 0; i < todosAtributos.length; i++){

      valoresDisplay.push([])

    }


    for (let k = 0; k < produtosEspecificosDisponiveis.length; k++){
      for (let j = 0; j < produtosEspecificosDisponiveis[k].especificidade.length; j++){

        let indexAtributo = todosAtributos.indexOf(produtosEspecificosDisponiveis[k].especificidade[j].atributo)

        if (!valoresDisplay[indexAtributo].includes(produtosEspecificosDisponiveis[k].especificidade[j].valor)){
          valoresDisplay[indexAtributo].push(produtosEspecificosDisponiveis[k].especificidade[j].valor)
        }

      }

    }


    for (let i = 0; i < todosAtributos.length; i++){

      let botoesLista = document.getElementsByName(todosAtributos[i])

      for (let k = 0; k < botoesLista.length; k++){

        let botao = document.getElementsByName(todosAtributos[i])[k]

        if (!valoresDisplay[i].includes(botao.value)){
          document.getElementsByName(todosAtributos[i])[k].disabled = 'true'
        }

      }

    }

  }



  async getProductInfo() {
    let cadeia = await getCadeiaByProduto(this.state.productId);


    this.setState({
      productInfo: cadeia,
    });
  }

  displayProductInfo() {
    // await this.getProductInfo()

    // console.log(this.state.productInfo)

    ReactDOM.render(
      <CadeiaLogistica cadeia={this.state.productInfo.cadeia} />,
      this.refCadeiaLogistica.current
    );
  }

  openTableDetails = () => {
    this.myRefLines.current.style.maxHeight = "unset";
    this.myRefVerMaisText.current.innerHTML = "Ver menos";

    this.setState({ functionShowTableDetais: this.closeTableDetails });
  };

  closeTableDetails = () => {
    this.myRefLines.current.style.maxHeight = "125px";
    this.myRefVerMaisText.current.innerHTML = "Ver mais";

    this.setState({ functionShowTableDetais: this.openTableDetails });
  };

  changeMainFoto = (source) => {
    this.myRefMainFoto.current.src = source;
  };

  createFotos = () => {
    let result = [];

    // console.log("fotos")

    // console.log(this.state.productInfo.fotografia)

    let fotos = this.state.productInfo.fotografia

    //let fotos = [ProductImage, fotaA, fotaB, fotaC, fotaD, fotaE, fotaF];

    for (let i = 0; i < 7 && i < fotos.length; i++) {
      result.push(
        <div
          className="miniaturaFoto"
          onMouseEnter={() => {
            this.changeMainFoto(fotos[i]);
          }}
        >
          <img src={fotos[i]} alt="" loading="lazy" />
        </div>
      );
    }

    ReactDOM.render(result, this.myRefTodasFotos.current);
  };

  async createEscolhaAtributos() {
    let result = [];

    // listaTotal = {
    //   a: [1, 2, 3, 4],
    //   b: [1, 2, 3, 4],
    // };

    // [{atributo, valores}, ]

    // console.log(this.state.todosValores)

    let listaTotal = this.state.todosValores

    // console.log(listaTotal)

    result.push(
      <div className="resetFiltersButton" onClick={() => {this.resetarFiltros()}}>Resetar Filtros</div>
    )

    for (let i = 0; i < listaTotal.length; i++) {

      let atributoNome = await getAtributo(this.state.todosAtributos[i])

      atributoNome = atributoNome.nome

      let atributos = [];

      for (let k = 0; k < listaTotal[i].length; k++) {

        atributos.push(
          <label class="containerAtributoEscolha">
            <input type="radio" onChange={this.clickAtributo} name={this.state.todosAtributos[i]} value={listaTotal[i][k]}/>
            <div class="checkmarkAtributoEscolha">
              {/* valor atributo */}
              <h5>{listaTotal[i][k]}</h5>
            </div>
          </label>
        );

      }


      result.push(
        <div className="lineOfAtributes">
          {/* titulo atributos */}
          <h4>{atributoNome}</h4>
          <form action="">{atributos}</form>
        </div>
      );

    }

    ReactDOM.render(result, this.myRefEscolhaAtributos.current);
  };

  createVerMaisDetails = () => {
    let result;
    let num = this.myRefLines.current.childNodes.length;

    if (num > 5) {
      result = [
        <div
          className="expandTableCaracteristicasPageProduct"
          onClick={() => {
            this.state.functionShowTableDetais();
          }}
        >
          <span ref={this.myRefVerMaisText}>Ver mais</span>
        </div>,
      ];

      ReactDOM.render(result, this.myRefVerMais.current);
    }
  };

  async addCaracteristicas() {
    let especificos = await getProdutoEspecificoByProduto(this.state.productId);
    // console.log(especificos)

    let atributos = [];
    let valores = [];

    for (let i = 0; i < especificos.length; i++) {
      for (let k = 0; k < especificos[i].especificidade.length; k++) {
        if (atributos.includes(especificos[i].especificidade[k].atributo)) {
          let index = atributos.indexOf(
            especificos[i].especificidade[k].atributo
          );

          if (!valores[index].includes(especificos[i].especificidade[k].valor)) {
            valores[index].push(especificos[i].especificidade[k].valor);
          }
        } else {
          atributos.push(especificos[i].especificidade[k].atributo);

          let index = atributos.indexOf(
            especificos[i].especificidade[k].atributo
          );

          valores[index] = [especificos[i].especificidade[k].valor];
        }
      }
    }

    let caracteristicasAppend = [];

    let atributosNomes = [];

    for (let p = 0; p < atributos.length; p++) {
      let atributo = await getAtributo(atributos[p]);

      if (atributo && atributo.nome) {
        atributosNomes.push(atributo.nome);

        let valoresString = JSON.stringify(valores[p]);

        valoresString = valoresString.replaceAll('"', "");
        valoresString = valoresString.replace("[", "");
        valoresString = valoresString.replace("]", "");
        valoresString = valoresString.replaceAll(",", ", ")

        // console.log(valoresString)

        let caracteristica = (
          <div className="lineTabelaCaracteristicasPageProduct">
            <h5>{atributo.nome}</h5>
            <h6>{valoresString}</h6>
          </div>
        );

        caracteristicasAppend.push(caracteristica);
      }
    }

    this.setState({
      atributos: atributos,
      valores: valores,
      atributosNomes: atributosNomes,
    });

    ReactDOM.render(caracteristicasAppend, this.myRefLines.current);
  }

  async componentDidMount() {
    this.createVerMaisDetails();

    await this.getProductInfo();

    this.displayProductInfo();

    await this.addCaracteristicas();

    
    this.createFotos();

    await this.getEspecificidadesInicial()

    await this.createEscolhaAtributos();

    await this.displayFavorito();

    this.displayCompare();
  }

  render() {
    return (
      <>
        <h1 class="titleSectionShop">{this.state.productInfo.nome}</h1>
        <div class="mainProductContent">
          <div id="firstDivProduct">
            <img
              ref={this.myRefMainFoto}
              // id="firstDivProduct"
              src={this.state.productInfo.fotografia[0]}
              alt={this.state.productInfo.nome}
              loading="eager"
            />
          </div>
          <div ref={this.myRefTodasFotos} id="secondDivProduct"></div>
          <div id="thirdDivProduct">
            <p className="descricaoProduto">
              {/* The expression can be values combining the addition , subtraction
              , multiplication and division operators, using standard operator
              precedence rules. Make sure to put a space on each side of the +
              and - operands. The operands in the expression may be any syntax
              value. */}
              {this.state.productInfo.informacao_adicional}
            </p>
            <div ref={this.refCadeiaLogistica} class="blockCadeiaLogistica">
              {/* <CadeiaLogistica /> */}
            </div>
            <div className="blocoRatingSustentabilidadeGeral">
              <div className="leafsRatingSVG">
                {createRankSuntentabilidade(
                  this.state.productInfo.cadeia.rating
                )}
              </div>
              <p>nível geral de sustentabilidade</p>
            </div>
            <div
              ref={this.myRefEscolhaAtributos}
              className="blocoSelectAtributosProduct"
            ></div>
            <div className="blocoPricePageProduto">
              {/* <h6>100€</h6> */}
              <h4>
                {this.state.productInfo.preco} <span>€</span>
              </h4>
            </div>
            {/* <h5>FALTA OPÇÕES DE SELECIONAR DEFAULT</h5> */}
            {/* <div id="adicionarAoCarrinhoAnimação"></div> */}
            <div id="erroAoAdicionarDiv">
              <p id="erroAoAdicionarText">Erro ao adicionar ao carrinho</p>
            </div>
            <div className="blocoBtnsProduto">
              <div onClick={async() => {await this.adicionarAoCarrinho()}} className="addCarrinhoPageProduct" id="addCarrinhoPageProduct">
                <span>Adicionar ao carrinho</span>
              </div>
              
              <div ref={this.refbotaoCompare} onClick={this.alterarCompare} className="addComparePageProduct">
                <i class="bi bi-arrow-left-right"></i>
                <span>
                  {this.state.atividadeCompare} <br /> Comparar
                </span>
              </div>
              <div ref={this.refFavorito} className="addFavoritesPageProduct">
              </div>
            </div>
            <div className="caracteristicasPageProduct">
              <nav>
                <div className="btnDetalhesProduto">
                  <span> Detalhes do produto</span>
                </div>
              </nav>
              <div
                ref={this.myRefLines}
                className="tabelaCaracteristicasPageProduct"
              >
                {/* <div className="lineTabelaCaracteristicasPageProduct">
                  <h5>Caracteristica um</h5>
                  <h6>Detalhe numero um</h6>
                </div>
                <div className="lineTabelaCaracteristicasPageProduct">
                  <h5>Caracteristica um</h5>
                  <h6>Detalhe numero um</h6>
                </div>
                <div className="lineTabelaCaracteristicasPageProduct">
                  <h5>Caracteristica um</h5>
                  <h6>Detalhe numero um</h6>
                </div>
                <div className="lineTabelaCaracteristicasPageProduct">
                  <h5>Caracteristica um</h5>
                  <h6>Detalhe numero um</h6>
                </div>
                <div className="lineTabelaCaracteristicasPageProduct">
                  <h5>Caracteristica um</h5>
                  <h6>Detalhe numero um</h6>
                </div>
                <div className="lineTabelaCaracteristicasPageProduct">
                  <h5>Caracteristica um</h5>
                  <h6>Detalhe numero um</h6>
                </div> */}
              </div>
              <div ref={this.myRefVerMais}></div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withParams(ProductPage);
