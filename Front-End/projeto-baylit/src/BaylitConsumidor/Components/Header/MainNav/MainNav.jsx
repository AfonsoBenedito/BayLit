import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./MainNav.css";
import LogoBaylit from "../../../Images/logo_baylit_black.svg";
import WordBaylit from "../../../Images/word_baylit_black.svg";
import HeaderPopUpUser from "./HeaderPopUpUser/HeaderPopUpUser";
import HeaderPopUpShoppingCar from "./HeaderPopUpShoppingCar/HeaderPopUpShoppingCar";
import HeaderPopUpFavorites from "./HeaderPopUpFavorites/HeaderPopUpFavorites";
import HeaderShopPopUp from "./HeaderShopPopUp/HeaderShopPopUp";
import HeaderPopUpCompare from "./HeaderPopUpCompare/HeaderPopUpCompare";
import Product from "../../Product/Product";

import { pesquisa } from "../../../../Helpers/ProdutoHelper";

import { getSubCategoria } from "../../../../Helpers/CategoryHelper";

import ReactDOM from "react-dom";
import { getNotificacoesUtilizador } from "../../../../Helpers/UserHelper";

class MainNav extends Component {
  constructor(props) {
    super(props);

    this.popUpSearchBar = React.createRef();
    this.popUpSearchBarInput = React.createRef();
    this.popUpSearchBarBack = React.createRef();

    this.myRefShowAllResults = React.createRef();

    this.refProdutosPesquisa = React.createRef();
    this.refResultPesquisa = React.createRef();

    this.refNotificacoes = React.createRef()

    this.refPopUpCompare = React.createRef()
    this.refPopUpFavoritos = React.createRef()
    this.refPopUpCarrinho = React.createRef()

    this.state = {
      positionScroll: 0,
      openSideMenu: this.props.openSideMenu,
      openLogin: this.props.openLogin,

      backVisibilityShopPopUp: "hidden",
      contPesquisa: 0,
    };
  }

  listaProdutosCarrinho = [
    ["Nome Produto", "subcategoria", "3", "14.99", "16.00"],
    ["Nome Produto", "subcategoria", "4", "14.99", "16.00"],
    ["Nome Produto", "subcategoria", "3", "14.99"],
    ["Nome Produto", "subcategoria", "2", "14.99", "16.00"],
    ["Nome Produto", "subcategoria", "3", "14.99", "16.00"],
  ];

  async getNotificacoes(){
    let info = JSON.parse(localStorage.getItem('baylitInfo'))

    if (info && info.logged == "true"){

      let res = await getNotificacoesUtilizador(info.id, info.token)

      let cont = 0

      if (res != false){

        for (let i = 0; i < res.length; i++){
          if (res[i].vista == false){
            cont += 1
          }
        }
      }

      if (cont > 0){
      
        let htmlAppend = <div className="sinalNotificacao">
                      <span>{cont}</span>
                    </div>;


        ReactDOM.render(htmlAppend,this.refNotificacoes.current)
      }

    }
    
  }

  

  ifLoggedNav = () => {
    //console.log("entrou");
    let verify = JSON.parse(localStorage.getItem("baylitInfo"));

    if (verify) {
      if (verify.logged == "true") {
        if (verify.tipo == "Consumidor") {
          //console.log("consumidor");
          document.getElementById("btnUserInfo").style.display = "inline-block";
        } else if (verify.tipo == "Transportador") {
          //console.log("transportador");
          document.getElementById("btnUserInfo").style.display = "inline-block";
        } else if (verify.tipo == "Fornecedor") {
          //console.log("fornecedor");
          document.getElementById("btnUserInfo").style.display = "inline-block";
        } else if (verify.tipo == "Administrador") {
          //console.log("admin");
          document.getElementById("btnUserInfo").style.display = "inline-block";
        }
      } else {
        //console.log("nao autenticado");
        document.getElementById("btnOpenLogin").style.display = "inline-block";
      }
    } else {
      setTimeout(this.ifLoggedNav, 100);
    }
  };

  openSearchBarSelect = () => {
    this.popUpSearchBarBack.current.style.display = "initial";
    this.popUpSearchBar.current.style.display = "grid";
    this.popUpSearchBarInput.current.focus();
    this.popUpSearchBarInput.current.select();
  };

  closeSearchBarSelect = () => {
    this.popUpSearchBarBack.current.style.display = "none";
    this.popUpSearchBar.current.style.display = "none";
  };

  async searchProducts() {
    let cont = this.state.contPesquisa + 1
    this.setState({
      contPesquisa: cont
    })

    ReactDOM.render(<div></div>, this.refProdutosPesquisa.current);
    let valor = this.popUpSearchBarInput.current.value;

    //Função de Pesquisa


    let produtos = await pesquisa(null, null, null, null, valor, null);


    let produtosAppend = [];

    if (cont == this.state.contPesquisa){

      if (produtos != false) {
        for (let i = 0; i < 6 && i < produtos.length; i++) {
          let subcategoria = await getSubCategoria(produtos[i].subcategoria);
  
          let produtoTemp = (
            <Product
              srcProduct={produtos[i].fotografia[0]}
              subcategoryImage={subcategoria.fotografia}
              nivelSustentabilidade={Math.round(produtos[i].cadeia.rating)}
              nivelProducao={produtos[i].cadeia.producao.classificacao}
              nivelArmazenamento={produtos[i].cadeia.armazenamento.classificacao}
              nivelTransporte={Math.round(
                produtos[i].cadeia.transporte_armazem.classificacao
              )}
              nomeProduto={produtos[i].nome}
              categoriaProduto={subcategoria.nome}
              promocaoProduto={null}
              precoProduto={produtos[i].preco + "€"}
              idProduto={produtos[i]._id}
            />
          );
  
          produtosAppend.push(produtoTemp);
        }
        ReactDOM.render(produtosAppend, this.refProdutosPesquisa.current);
      } else {
        ReactDOM.render(
          <div>Sem Resultados</div>,
          this.refProdutosPesquisa.current
        );
      }

    }

    

    this.refResultPesquisa.current.href =
      "/Pesquisa?nome=" +
      this.popUpSearchBarInput.current.value.replaceAll(" ", "_");
  }

  openPopUpShop() {
    this.setState({
      backVisibilityShopPopUp: "visible",
    });
  }

  closePopUpShop() {
    this.setState({
      backVisibilityShopPopUp: "hidden",
    });
  }

  addProducts() {
    let result = [];

    for (let i = 0; i < 8; i++) {
      // MAX 6 PRODUTOS MOSTRADOS
      // result.push(<Product />);
    }
    return result;
  }

  async displayPopUpCompare(){
    ReactDOM.unmountComponentAtNode(this.refPopUpCompare.current)
    ReactDOM.render(<HeaderPopUpCompare/>, this.refPopUpCompare.current)
  }

  async displayPopUpFavoritos(){
    ReactDOM.unmountComponentAtNode(this.refPopUpFavoritos.current)
    ReactDOM.render(<HeaderPopUpFavorites
      listaProdutos={this.listaProdutosCarrinho}
      openLogin={this.state.openLogin}
    />, this.refPopUpFavoritos.current)
    

  }

  async displayPopUpCarrinho(){
    ReactDOM.unmountComponentAtNode(this.refPopUpCarrinho.current)
    ReactDOM.render(<HeaderPopUpShoppingCar
      listaProdutos={this.listaProdutosCarrinho}
    />, this.refPopUpCarrinho.current)
    

  }

  

  async componentDidMount() {
    // efr
    this.ifLoggedNav();
    await this.getNotificacoes()
  }

  render() {
    // window.onload = this.ifLoggedNav;

    return (
      <div id="mainMiddle" className="mainMiddle">
        <div className="secondaryMiddle">
          {/* ESQUERDO */}
          <div className="blockLeft">
            <Link exact="true" to="/">
              <img className="logoBaylit" src={LogoBaylit} alt="Logotipo" />
            </Link>
            <Link exact="true" to="/">
              <img className="wordBaylit" src={WordBaylit} alt="Logotipo" />
            </Link>
          </div>

          {/* CENTRO */}

          <div className="blockMiddle">
            <div
              style={{ visibility: this.state.backVisibilityShopPopUp }}
              className="backMainShopPopUp"
            ></div>
            <h4
              onMouseEnter={() => {
                this.openPopUpShop();
              }}
              onMouseLeave={() => {
                this.closePopUpShop();
              }}
              id="mainButtonShopHeader"
            >
              <div className="connectHeaderShopPopUp"></div>
              <div
                className="containerHeaderShopPopUp"
                // onMouseEnter={() => {
                //   this.openPopUpShop();
                // }}
              >
                <HeaderShopPopUp />
              </div>
              <a className="toLink" href="/Shop">
                Loja
              </a>
            </h4>

            <h4>
              <Link exact="true" className="toLink" to="/sustentabilidade">
                Sustentabilidade
              </Link>
            </h4>
            <h4>
              <Link exact="true" className="toLink" to="/aboutus">
                Equipa
              </Link>
            </h4>
          </div>

          {/* DIREITO */}
          <div className="blockRight">
            <div
              id="btnPesquisaFechado"
              onClick={() => {
                this.openSearchBarSelect();
              }}
            >
              <div className="iconPositionSearchClose">
                <i className="bi bi-search" id="searchIcon"></i>
                <h6 id="searchName">Procurar</h6>
              </div>
            </div>

            <div
              ref={this.popUpSearchBarBack}
              id="backBtnPesquisa"
              onClick={() => {
                this.closeSearchBarSelect();
              }}
            ></div>
            <div ref={this.popUpSearchBar} id="btnPesquisaOpen">
              <div className="sidesSearchBarClose">
                <img src={LogoBaylit} alt="" />
              </div>
              <form className="formSearchBar">
                {/* INPUT */}
                <input
                  ref={this.popUpSearchBarInput}
                  // id="searchBarInput"
                  onChange={async () => {
                    await this.searchProducts();
                  }}
                  name="pesquisar"
                  className="searchBarHeader"
                  type="text"
                  placeholder="Pesquisar"
                />
                <div className="icon_positionSearch">
                  <i className="bi bi-search" id="searchIcon"></i>
                </div>
                <h3 className="titleResultadoPesquisa">
                  Resultado da pesquisa
                </h3>
                {/* ------------- */}
                <div
                  ref={this.refProdutosPesquisa}
                  className="resultadosPesquisa"
                ></div>
                {/* --------------- */}
                <h6
                  ref={this.myRefShowAllResults}
                  className="showAllResultsSearchPopUp"
                >
                  <a ref={this.refResultPesquisa} href="">
                    Ver todos os resultados
                  </a>
                </h6>
              </form>
              <div className="sidesSearchBarClose">
                <div
                  className="closePopUpShop"
                  onClick={() => {
                    this.closeSearchBarSelect();
                  }}
                >
                  <i class="bi bi-x-lg"></i>
                </div>
              </div>
            </div>

            {/*BTN COMPARAR*/}
            <div id="btnCompare" className="icon_position" onMouseEnter={async () => {await this.displayPopUpCompare()}}>
              <a href="/Compare">
                <i id="headerColor" className="bi bi-arrow-left-right"></i>
                <h6 id="headerColor">Comparar</h6>
              </a>
              <div id="appendConnectionCompare"></div>
              <div ref={this.refPopUpCompare}></div>
              {/* <HeaderPopUpCompare /> */}
            </div>

            {/*BTN FAVORITOS*/}
            <div id="btnFavorites" className="icon_position" onMouseEnter={async () => {await this.displayPopUpFavoritos()}}>
              <a href="/Perfil/Favoritos">
                <i id="headerColor" className="bi bi-heart"></i>
                <h6 id="headerColor">Favoritos</h6>
              </a>
              <div id="appendConnectionFavorites"></div>
              <div ref={this.refPopUpFavoritos}></div>
              {/* <HeaderPopUpFavorites
                listaProdutos={this.listaProdutosCarrinho}
                openLogin={this.state.openLogin}
              /> */}
            </div>
            {/*BTN CARRINHO*/}
            <div id="btnShoppingCar" className="icon_position" onMouseEnter={async () => {await this.displayPopUpCarrinho()}}>
              <a href="/ShoppingCar">
                <i id="headerColor" className="bi bi-bag"></i>
                <h6 id="headerColor">Cesto</h6>
              </a>
              <div id="appendConnectionCar"></div>
              <div ref={this.refPopUpCarrinho}></div>
              {/* <HeaderPopUpShoppingCar
                listaProdutos={this.listaProdutosCarrinho}
              /> */}
            </div>
            {/*BTN PERFIL NAO LOGADO*/}
            <div
              id="btnOpenLogin"
              className="icon_position"
              onClick={() => {
                this.state.openLogin();
              }}
            >
              <i className="bi bi-person"></i>
              <h6>Login</h6>
            </div>
            {/*BTN PERFIL LOGADO*/}
            <div id="btnUserInfo" className="icon_position">
              <i class="bi bi-person-circle"></i>
              <h6>Perfil</h6>
              <div id="appendConnectionUser"></div>
              <HeaderPopUpUser />
              {/* FALTA DINAMIZAR */}
              <div ref={this.refNotificacoes}>
                {/* <div className="sinalNotificacao">
                  <span>10</span>
                </div> */}
              </div>
            </div>

            {/*BTN MENU LATERAL*/}
            <div
              id="btnOpenSideMenu"
              className="icon_position"
              onClick={() => {
                this.state.openSideMenu();
              }}
            >
              <i className="bi bi-list searchIconAdd"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MainNav;
