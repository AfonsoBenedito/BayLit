import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link, Route, Routes } from "react-router-dom";
import {
  alterarProduto,
  getCadeiaByProduto,
  getProduto,
} from "../../../../Helpers/ProdutoHelper";
import ProductCadeia from "./ProductCadeia/ProductCadeia";
import ProductInventario from "./ProductInventario/ProductInventario";
import ProductPopUpImage from "./ProductPopUpImage/ProductPopUpImage";

import { useParams } from "react-router-dom";

import "./ProductsGerir.css";
import {
  getCategoria,
  getSubCategoria,
} from "../../../../Helpers/CategoryHelper";

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class ProductsGerir extends Component {
  constructor(props) {
    super(props);
    this.myRefFotosDisplayer = React.createRef();

    let { id } = this.props.params;

    this.state = {
      productId: id,
      productInfo: {
        nome: "Produto",
        descricao: "Descrição",
        categoria: "Categoria",
        subcategoria: "Subcategoria",
        fotografias: [""],
        idSubcategoria: "",
      },
      productCadeia: {
        nome: "Produto",
        preco: 10,
        cadeia: { rating: 3 },
        informacao_adicional: "Descrição",
        fotografia: "",
      },
    };
    this.myRefCadeiaBlock = React.createRef();

    this.myRefInventario = React.createRef();
    this.myRefCadeia = React.createRef();
    this.refPopUpImages = React.createRef();

    this.refNomeProduto = React.createRef()
    this.refDescricaoProduto = React.createRef()

    this.refFeedbackDetalhes = React.createRef()
  }

  async getProductInfo() {
    let produto = await getProduto(this.state.productId);
    let categoria = await getCategoria(produto.categoria);
    let subcategoria = await getSubCategoria(produto.subcategoria);


    let novoProductInfo = this.state.productInfo;

    novoProductInfo.nome = produto.nome;
    novoProductInfo.descricao = produto.informacao_adicional;
    novoProductInfo.categoria = categoria.nome;
    novoProductInfo.subcategoria = subcategoria.nome;
    novoProductInfo.fotografias = produto.fotografia;
    novoProductInfo.idSubcategoria = produto.subcategoria;

    this.setState({
      productInfo: novoProductInfo,
    });
  }

  openPopUpFotografias = () => {
    document.getElementById("mainProductPopUpImage").style.display = "initial";
  };

  async createFotos() {
    let result = [];

    let fotos = this.state.productInfo.fotografias;

    for (let i = 0; i < fotos.length; i++) {
      if (i >= 3) {
        result.push(
          <div className="fotoProductFornecedorMore">
            <span>+2</span>
          </div>
        );
      } else {
        result.push(
          <div className="fotoProductFornecedor">
            <img src={fotos[i]} alt="" />
          </div>
        );
      }
    }

    ReactDOM.render(result, this.myRefFotosDisplayer.current);

    ReactDOM.render(
      <ProductPopUpImage
        idProduto={this.state.productId}
        fotografias={this.state.productInfo.fotografias}
        nomeProduto={this.state.productInfo.nome}
      />,
      this.refPopUpImages.current
    );
  }

  async pathSideBorder(side) {
    if (side == "url") {
      let estadoPath = window.location.pathname.split("/").length;

      if (estadoPath === 4) {
        // Inventario
        this.myRefInventario.current.style.color = "rgba(31, 149, 82, 1)";
        this.myRefInventario.current.style.borderTop =
          "2px solid rgba(31, 149, 82, 0.6)";
        this.myRefCadeia.current.style.color = "white";
        this.myRefCadeia.current.style.borderTop = "none";
      } else {
        // cadeia
        this.myRefInventario.current.style.color = "white";
        this.myRefInventario.current.style.borderTop = "none";
        this.myRefCadeia.current.style.color = "rgba(31, 149, 82, 1)";
        this.myRefCadeia.current.style.borderTop =
          "2px solid rgba(31, 149, 82, 0.6)";
      }
    } else if (side == "inventario") {
      this.myRefInventario.current.style.color = "rgba(31, 149, 82, 1)";
      this.myRefInventario.current.style.borderTop =
        "2px solid rgba(31, 149, 82, 0.6)";
      this.myRefCadeia.current.style.color = "white";
      this.myRefCadeia.current.style.borderTop = "none";
    } else if (side == "cadeia") {
      this.myRefInventario.current.style.color = "white";
      this.myRefInventario.current.style.borderTop = "none";
      this.myRefCadeia.current.style.color = "rgba(31, 149, 82, 1)";
      this.myRefCadeia.current.style.borderTop =
        "2px solid rgba(31, 149, 82, 0.6)";
    }
    await this.getProductInfoCadeia();
  }

  async getProductInfoCadeia() {
    let cadeia = await getCadeiaByProduto(this.state.productId);


    this.setState({
      productCadeia: cadeia,
    });

    ReactDOM.render(
      <ProductCadeia cadeia={this.state.productCadeia.cadeia} />,
      this.myRefCadeiaBlock.current
    );
  }

  async alterarDadosProduto(){
    let info = JSON.parse(localStorage.getItem('baylitInfo'))
    let nome = this.refNomeProduto.current.value
    let descricao = this.refDescricaoProduto.current.value

    if (nome == ""){
      nome = null
    }

    if (descricao == ""){
      descricao = null
    }
    
    if (nome != null || descricao != null){

      let alterar = await alterarProduto(info.token, this.state.productId, nome, descricao, null, null)

      if (alterar != false){
        ReactDOM.render(<span className="salvarAlteracoesProdutoGerirReturn">
        Alterações guardadas com sucesso!
        </span>, this.refFeedbackDetalhes.current)

        setTimeout(
          function() {
              window.location.reload()
          }
          .bind(this),
          1500
        );
      } else {
        ReactDOM.render(<span className="salvarAlteracoesProdutoGerirReturn">
        Erro ao alterar!
      </span>, this.refFeedbackDetalhes.current)
      }

    }
    
    


  }

  async componentDidMount() {
    this.pathSideBorder("url");

    await this.getProductInfo();

    await this.createFotos();

    await this.getProductInfoCadeia();
  }

  render() {
    return (
      <div className="mainProductsGerir">
        <div ref={this.refPopUpImages}></div>

        <div className="lineOfGerirProducts">
          <h1>{this.state.productInfo.nome}</h1>
          <span className="salvarAlteracoesProdutoGerir" onClick={async () => {await this.alterarDadosProduto()}}>
            Guardar alterações
          </span>
          <div ref={this.refFeedbackDetalhes}></div>
          {/* <span className="salvarAlteracoesProdutoGerirReturn">
            Alterações guardadas com sucesso!
          </span> */}
        </div>
        <div className="bodyGerirProduct">
          <div className="detailsGerirProductBlock">
            <div className="fotosGerirProducts">
              <div
                ref={this.myRefFotosDisplayer}
                className="boxFotosProductFornecedor"
              ></div>
              <div className="btnAlterarFotosProductFornecedor">
                <h5
                  className="btnAlterarFotos"
                  onClick={() => {
                    this.openPopUpFotografias();
                  }}
                >
                  Alterar fotografias
                </h5>
              </div>
            </div>
            <div className="detailsProductGeral">
              <div className="inputBlockProductFornecedor">
                <h6>Nome</h6>
                <input
                  type="text"
                  name="nomeProduto"
                  placeholder={this.state.productInfo.nome}
                  ref={this.refNomeProduto}
                />
              </div>
              <div className="inputBlockProductFornecedor">
                <h6>Descrição</h6>
                <textarea
                  maxLength={500}
                  ref={this.refDescricaoProduto}
                  placeholder={this.state.productInfo.descricao}
                ></textarea>
              </div>
              <div className="inputBlockProductFornecedor">
                <h6>Categoria</h6>
                <input
                  type="text"
                  name="categoriaProduto"
                  value={this.state.productInfo.categoria}
                  disabled
                />
              </div>
              <div className="inputBlockProductFornecedor">
                <h6>Subcategoria</h6>
                <input
                  type="text"
                  name="subcategoriaProduto"
                  value={this.state.productInfo.subcategoria}
                  disabled
                />
              </div>
              {/* <ProductAtributos /> */}
            </div>
          </div>
          <div className="blockProdutosEspecificos">
            <div className="blockBtnsStockCadeia">
              <Link
                to={"/dashboard/Products/" + this.state.productId}
                onClick={() => {
                  this.pathSideBorder("inventario");
                }}
              >
                <h6 ref={this.myRefInventario}>Inventário</h6>
              </Link>
              <Link
                to={
                  "/dashboard/Products/" +
                  this.state.productId +
                  "/cadeialogistica"
                }
                onClick={() => {
                  this.pathSideBorder("cadeia");
                }}
              >
                <h6 ref={this.myRefCadeia}>Cadeia Logistica</h6>
              </Link>
            </div>
            <Routes>
              <Route
                path="/"
                element={<ProductInventario idProduto={this.state.productId} />}
                subcategoria={this.state.productInfo.subcategoria}
              />
              <Route
                path="/cadeialogistica"
                element={<div ref={this.myRefCadeiaBlock}></div>}
              />
            </Routes>
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(ProductsGerir);
