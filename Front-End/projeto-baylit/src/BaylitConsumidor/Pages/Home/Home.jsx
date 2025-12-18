import React from "react";
import Product from "../../Components/Product/Product";
import MainButton from "../../Components/Buttons/mainButton";

import WelcomeImage from "../../Images/HomeImages/welcomeImage.png";
import TeamImage from "../../Images/HomeImages/teamBaylit.png";
import SustainabilityImage from "../../Images/HomeImages/sustainability.jpg";
import ProductImage from "../../Images/HomeImages/productHome.jpg";
import TransportImage from "../../Images/HomeImages/transportHome.jpg";

import "./Home.css";
import { Component } from "react";
import { getCategorias, getCategoria } from "../../../Helpers/CategoryHelper";
import { pesquisa } from "../../../Helpers/ProdutoHelper";

import ReactDOM from "react-dom";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.refCategorias = React.createRef();
    this.refProdutosSustentaveis = React.createRef();
  }

  async getCategoriasImages() {
    let categorias = await getCategorias();

    let resultHtml = [];

    for (let i = 1; i < 8; i++) {
      resultHtml.push(
        <a
          href={"/Shop/" + categorias[i]._id}
          className="categoryInDisplayerHome"
        >
          <img src={categorias[i].fotografia} alt="" />
          <div className="hoverNameCategory">
            <span>{categorias[i].nome}</span>
          </div>
        </a>
      );
    }

    ReactDOM.render(resultHtml, this.refCategorias.current);
  }

  async displayProdutosSustentaveis() {
    let listToAdd = [];
    let contagem = 0;
    let resultados5 = await pesquisa(null, null, null, 5, null, null);
    console.log(resultados5);
    if (resultados5) {
      console.log("Entrei!");
      for (let resultado5 in resultados5) {
        if (contagem < 7) {
          let srcProduct = resultados5[resultado5].fotografia[0];
          let nomeProduto = resultados5[resultado5].nome;
          let nivelArmazenamento =
            resultados5[resultado5].cadeia.armazenamento.classificacao;
          let nivelTransporte =
            resultados5[resultado5].cadeia.transporte_armazem.classificacao;
          let nivelProducao =
            resultados5[resultado5].cadeia.producao.classificacao;
          let nivelSustentabilidade = resultados5[resultado5].cadeia.rating;
          let idProduto = resultados5[resultado5]._id;
          let categoriaId = resultados5[resultado5].categoria;
          let categoria = await getCategoria(categoriaId);
          let categoriaProduto = categoria.nome;
          let preco = resultados5[resultado5].preco;
          let precoProduto = preco + "€";
          listToAdd.push(
            <Product
              precoProduto={precoProduto}
              categoriaProduto={categoriaProduto}
              idProduto={idProduto}
              nivelSustentabilidade={nivelSustentabilidade}
              nivelArmazenamento={nivelArmazenamento}
              nivelTransporte={nivelTransporte}
              nivelProducao={nivelProducao}
              nomeProduto={nomeProduto}
              srcProduct={srcProduct}
            ></Product>
          );
          contagem = contagem + 1;
        }
      }
    }

    if (contagem < 7) {
      let resultados4 = await pesquisa(null, null, null, 4, null, null);
      if (resultados4) {
        for (let resultado4 in resultados4) {
          if (contagem < 7) {
            let srcProduct = resultados4[resultado4].fotografia[0];
            let nomeProduto = resultados4[resultado4].nome;
            let nivelArmazenamento =
              resultados4[resultado4].cadeia.armazenamento.classificacao;
            let nivelTransporte =
              resultados4[resultado4].cadeia.transporte_armazem.classificacao;
            let nivelProducao =
              resultados4[resultado4].cadeia.producao.classificacao;
            let nivelSustentabilidade = resultados4[resultado4].cadeia.rating;
            let idProduto = resultados4[resultado4]._id;
            let categoriaId = resultados4[resultado4].categoria;
            let categoria = await getCategoria(categoriaId);
            let categoriaProduto = categoria.nome;
            let preco = resultados4[resultado4].preco;
            let precoProduto = preco + "€";
            listToAdd.push(
              <Product
                precoProduto={precoProduto}
                categoriaProduto={categoriaProduto}
                idProduto={idProduto}
                nivelSustentabilidade={nivelSustentabilidade}
                nivelArmazenamento={nivelArmazenamento}
                nivelTransporte={nivelTransporte}
                nivelProducao={nivelProducao}
                nomeProduto={nomeProduto}
                srcProduct={srcProduct}
              ></Product>
            );
            contagem = contagem + 1;
          }
        }
      }
    }

    if (contagem < 7) {
      let resultados3 = await pesquisa(null, null, null, 3, null, null);
      if (resultados3) {
        for (let resultado3 in resultados3) {
          if (contagem < 7) {
            let srcProduct = resultados3[resultado3].fotografia[0];
            let nomeProduto = resultados3[resultado3].nome;
            let nivelArmazenamento =
              resultados3[resultado3].cadeia.armazenamento.classificacao;
            let nivelTransporte =
              resultados3[resultado3].cadeia.transporte_armazem.classificacao;
            let nivelProducao =
              resultados3[resultado3].cadeia.producao.classificacao;
            let nivelSustentabilidade = resultados3[resultado3].cadeia.rating;
            let idProduto = resultados3[resultado3]._id;
            let categoriaId = resultados3[resultado3].categoria;
            let categoria = await getCategoria(categoriaId);
            let categoriaProduto = categoria.nome;
            let preco = resultados3[resultado3].preco;
            let precoProduto = preco + "€";
            listToAdd.push(
              <Product
                precoProduto={precoProduto}
                categoriaProduto={categoriaProduto}
                idProduto={idProduto}
                nivelSustentabilidade={nivelSustentabilidade}
                nivelArmazenamento={nivelArmazenamento}
                nivelTransporte={nivelTransporte}
                nivelProducao={nivelProducao}
                nomeProduto={nomeProduto}
                srcProduct={srcProduct}
              ></Product>
            );
            contagem = contagem + 1;
          }
        }
      }
    }

    ReactDOM.render(listToAdd, this.refProdutosSustentaveis.current);

    // let resultados4 = await pesquisa(null, null, null, 4, null, null);
    // console.log(resultados4);
    // if (resultados4 == false || resultados4.length < 5){
    //   let resultados3 = await pesquisa(null, null, null, 3, null, null);
    //   console.log(resultados3.length);
    // } else {
    //   // Existem 5+ produtos de 4 ou 5 de sustentabilidade
    // }
  }

  async componentDidMount() {
    await this.getCategoriasImages();
    await this.displayProdutosSustentaveis();
  }

  render() {
    return (
      <div className="mainHome">
        {/* MAIN IMAGE DIVISION */}
        <div className="secondaryBox">
          <div className="teamImageHome">
            <img src={WelcomeImage} />
          </div>
          <h1 className="mainTitleHome">MUDA O RUMO DO MUNDO</h1>
          <p className="mainParagraphHome">
            Compra com consciência. Pensa no mundo. Faz a tua parte!
          </p>
          <a href="/shop">
            <button className="mainButtonHome">Comprar</button>
          </a>
        </div>

        {/* CATEGORIES DIVISION */}
        <div className="categoriesHomeBox">
          <div className="secondaryTitle">
            <h2>Conhece as nossas categorias</h2>
          </div>
          <div ref={this.refCategorias} className="displayerCategoriesHome">
            {/* <div className="categoryInDisplayerHome">
              <img src={WelcomeImage} alt="" />
              <div className="hoverNameCategory">
                <span>Category</span>
              </div>
            </div>
            <div className="categoryInDisplayerHome">
              <img src={WelcomeImage} alt="" />
              <div className="hoverNameCategory">
                <span>Category</span>
              </div>
            </div>
            <div className="categoryInDisplayerHome">
              <img src={WelcomeImage} alt="" />
              <div className="hoverNameCategory">
                <span>Category</span>
              </div>
            </div>
            <div className="categoryInDisplayerHome">
              <img src={WelcomeImage} alt="" />
              <div className="hoverNameCategory">
                <span>Category</span>
              </div>
            </div>
            <div className="categoryInDisplayerHome">
              <img src={WelcomeImage} alt="" />
              <div className="hoverNameCategory">
                <span>Category</span>
              </div>
            </div>
            <div className="categoryInDisplayerHome">
              <img src={WelcomeImage} alt="" />
              <div className="hoverNameCategory">
                <span>Category</span>
              </div>
            </div>
            <div className="categoryInDisplayerHome">
              <img src={WelcomeImage} alt="" />
              <div className="hoverNameCategory">
                <span>Category</span>
              </div>
            </div> */}
          </div>
          <p className="mainParagraphHome">A loja para todos os gostos.</p>
          <a href="/shop">
            <button className="mainButtonHome">Loja</button>
          </a>
        </div>

        {/* SUSTENTABILIDADE DIVISON */}
        <div className="categoriesHomeBox">
          <div className="secondaryTitle">
            <h2>Sustentabilidade na Baylit</h2>
          </div>
          <div className="displayDoubleSustentabilidadeHome">
            <div className="doubleContainerHome">
              <img className="doubleImageHome" src={ProductImage} alt="" />
              <h3>Sustentabilidade do produto</h3>
              <a
                href="/sustentabilidade"
                className="mainButtonHomeWhite signUpHome"
              >
                Consultar
              </a>
            </div>
            <div className="doubleContainerHome">
              <img className="doubleImageHome" src={TransportImage} alt="" />
              <h3>Sustentabilidade do transportador</h3>
              <a
                href="/sustentabilidade"
                className="mainButtonHomeWhite signUpHome"
              >
                Consultar
              </a>
            </div>
          </div>
        </div>

        {/* PRODUCTS DIVISION */}
        <div className="categoriesHomeBox">
          <div className="secondaryTitle">
            <h2>Encontra produtos sustentáveis</h2>
          </div>
          <div className="displayerProductsHome">
            <div className="forMarginAlign" />
            <div ref={this.refProdutosSustentaveis} className="theSlider">
              {/* <Product />
              <Product />
              <Product />
              <Product />
              <Product />
              <Product />
              <Product /> */}
            </div>
            <div className="forMarginAlign" />
          </div>
        </div>

        {/* FIFTH DIVISION */}
        <div className="secondaryBox">
          <div className="secondaryTitle">
            <h2>Conhece a BayLit</h2>
          </div>
          <div className="teamImageHome">
            <img className="teamBaylitImage" src={TeamImage} />
          </div>
          <p className="mainParagraphHome">Membros BayLit</p>
          <h1 className="mainTitleHome">QUEM SOMOS</h1>
          {/* MainButton name->buttonName & theme->dark/light */}
          <a href="/aboutus">
            <button className="mainButtonHome">Conhecer história</button>
          </a>
        </div>
        {/* SIXTH DIVISION */}
        <div className="secondaryBox">
          <div className="secondaryTitle">
            <h2>Junta-te à BayLit</h2>
          </div>
          <div className="signUpCointainerHome">
            <img
              className="sustainabilityImageHome"
              src={SustainabilityImage}
              alt=""
            />
            <h1 className="signUpTitleHome">INSCREVE-TE AGORA</h1>
            <h2 className="signUpParagraphHome">
              Inscreve-te e sabe quais são os melhores produtos para o mundo!
            </h2>
            <div className="blockForTypeSign">
              <a href="signup">
                <button className="mainButtonHomeWhite">Consumidor</button>
              </a>
              <a href="dashboard/Authentication/SignUp/Fornecedor">
                <button className="mainButtonHomeWhite">Fornecedor</button>
              </a>
              <a href="dashboard/Authentication/SignUp/Transportador">
                <button id="signUpFTLC" className="mainButtonHomeWhite">
                  Transportador
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* EIGHTH DIVISION */}
        {/* <footer></footer> */}
      </div>
    );
  }
}

export default Home;
