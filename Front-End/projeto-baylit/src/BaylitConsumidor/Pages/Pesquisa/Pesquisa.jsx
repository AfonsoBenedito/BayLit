import React, { Component } from "react";
import Product from "../../Components/Product/Product";

import "./Pesquisa.css";
import { pesquisa } from "../../../Helpers/ProdutoHelper";
import { getSubCategoria } from "../../../Helpers/CategoryHelper";

import { useSearchParams } from "react-router-dom";
import ReactDOM from "react-dom"

function withSearch(Component) {
  return (props) => <Component {...props} params={useSearchParams()} />;
}

class Pesquisa extends Component {
  constructor(props) {
    super(props);

    let nomePesquisa = this.props.params[0].get("nome")

    console.log(nomePesquisa)

    if (nomePesquisa){
      nomePesquisa = nomePesquisa.replaceAll("_", " ");
    } else {
      nomePesquisa = ""
    }

    this.state = {
      nomePesquisa: nomePesquisa,
      numeroResultados: 0
    };

    console.log(nomePesquisa)

    this.refInputSearch = React.createRef()
    this.refResultadosPesquisa = React.createRef()
    this.refNumeroResultados = React.createRef()
  }



  async displayProdutos() {
    ReactDOM.render(<div></div>, this.refResultadosPesquisa.current)
    let valor = this.refInputSearch.current.value

    let produtos = await pesquisa(null, null, null, null, valor, null)

    let produtosAppend = []

    if (produtos != false){

      this.setState({
        numeroResultados: produtos.length
      })

      for (let i = 0; i < produtos.length; i++){

        let subcategoria = await getSubCategoria(produtos[i].subcategoria);

        let produtoTemp = (
          <Product
            srcProduct={produtos[i].fotografia[0]}
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
      ReactDOM.render(produtosAppend, this.refResultadosPesquisa.current)
      
    } else {
      ReactDOM.render(<div>Sem Resultados</div>, this.refResultadosPesquisa.current)
      this.setState({
        numeroResultados: 0
      })
    }
  }

  async componentDidMount(){
    if (this.state.nomePesquisa != ""){
      this.refInputSearch.current.value = this.state.nomePesquisa
      this.displayProdutos()
    }
  }

  render() {
    return (
      <div className="mainPesquisa">
        <h1 className="titlePesquisa">Pesquisa</h1>

        <div className="searchAndResultPesquisa">
          <h2 className="titleResultadosPesquisa">
            <span>Resultados para</span>
            Palavra pesquisada ({this.state.numeroResultados})
          </h2>
          <div className="blockInputPagePesquisa">
            <input
              ref={this.refInputSearch}
              onKeyUp={async() => {await this.displayProdutos()}}
              name="pesquisar"
              className="searchBarPagePesquisa"
              type="text"
              placeholder="Pesquisar"
            />
            <div className="icon_positionSearchPagePesquisa">
              <i className="bi bi-search"></i>
            </div>
          </div>
        </div>

        <div className="breakLinePesquisa" />

        <div ref={this.refResultadosPesquisa} className="displayProdutosResultadoPesquisa">
          {/* {this.displayProdutos()} */}
        </div>
      </div>
    );
  }
}

export default withSearch(Pesquisa);
