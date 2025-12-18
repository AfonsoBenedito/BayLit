import React, { Component } from "react";
import "./ResumeShoppingCar.css";

import ReactDOM from "react-dom";

import {
  getLeaf,
  createRankSuntentabilidade,
} from "../../../Components/LeafSVG";
import CadeiaLogisticaForResumes from "../CadeiaLogisticaForResumes/CadeiaLogisticaForResumes";
import {
  getTransportador,
  getUsersShoppingCart,
  getUsersShoppingCartCadeia,
} from "../../../../Helpers/UserHelper";
import { getCadeiaByProduto } from "../../../../Helpers/ProdutoHelper";
import { getTransporteById } from "../../../../Helpers/EncomendasHelper";

class ResumeShoppingCar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: this.props.page,
      idCarrinho: this.props.idCarrinho,
      idLocal: this.props.idLocal,
      idTransporte: this.props.idTransporte,
      paginaSeguinte: this.props.paginaSeguinte,

      ratingProducao: null,
      ratingArmazenamento: null,
      ratingTransporte: null,
      ratingGeral: null,

      precoTotal: null,
      numeroProdutos: 0,
      portesFinais: null,

      verifyIfPagamento: this.props.verifyIfPagamento,
    };

    this.myRefBtnSeguinte = React.createRef();

    this.refCadeiaLogistica = React.createRef();
    this.refCarrinho = React.createRef();
    this.refTransporte = React.createRef();
    this.refPagamento = React.createRef();

    this.refPrecoTotal = React.createRef();
  }

  async carregarResumo() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let cadeia = await getUsersShoppingCartCadeia(info.id, info.token);

    console.log(cadeia);

    //FALTA RATING GERAL A RECEBER A CADEIA
    this.setState({
      ratingProducao: cadeia.producao.classificacao.toFixed(2),
      ratingArmazenamento: cadeia.armazenamento.classificacao.toFixed(2),
      ratingTransporte: cadeia.transporte_armazem.classificacao.toFixed(2),
      ratingGeral: cadeia.classificacao.toFixed(2),
    });

    let carrinho = await getUsersShoppingCart(info.id, info.token);

    for (let i = 0; i < carrinho.produtos.length; i++) {
      this.setState({
        numeroProdutos:
          this.state.numeroProdutos + carrinho.produtos[i].quantidade,
      });
    }

    this.setState({
      precoTotal: carrinho.valor.total.toFixed(2),
    });

    ReactDOM.render(
      <CadeiaLogisticaForResumes
        Producao={this.state.ratingProducao}
        Armazenamento={this.state.ratingArmazenamento}
        Transporte={this.state.ratingTransporte}
        Geral={this.state.ratingGeral}
      />,
      this.refCadeiaLogistica.current
    );
  }

  async carregarCarrinho() {
    let produtos = await this.createProducts();

    ReactDOM.render(produtos, this.refCarrinho.current);
  }

  async carregarTransporte() {
    let transporte = await this.createTransportes();

    ReactDOM.render(transporte, this.refTransporte.current);
  }

  async carregarPagamento() {
    let pagamento = await this.createPagamento();

    ReactDOM.render(pagamento, this.refPagamento.current);
  }

  async createTransportes() {
    let transporte = await getTransporteById(this.state.idTransporte);

    let transportador = await getTransportador(transporte.transportador);

    console.log(transporte);
    console.log(transportador);

    this.setState({
      portesFinais: transportador.portes_encomenda,
    });

    let result = [
      <div class="checkmarkTransporteResume">
        <div className="radioLine">
          <h3>{transportador.nome}</h3>
          <h3>{transportador.portes_encomenda}€</h3>
        </div>
        <div className="radioLine">{/* <h4>Empresa</h4> */}</div>
        <div className="radioLine">
          <div className="nivelSustentabilidadeTransporte">
            {createRankSuntentabilidade(Math.round(transporte.classificacao))}
          </div>
          <div className="tempoEntregaTransporteResume">
            {/* <h6>Entrega</h6>
            <h5>4 dias</h5> */}
          </div>
        </div>
      </div>,
    ];

    return result;
  }

  async createProducts() {
    let result = [];

    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let carrinho = await getUsersShoppingCart(info.id, info.token);

    for (let i = 0; i < carrinho.produtos.length; i++) {
      this.setState({
        numeroProdutos:
          this.state.numeroProdutos + carrinho.produtos[i].quantidade,
      });

      let cadeia = await getCadeiaByProduto(
        carrinho.produtos[i].produto.produto
      );

      let spans = [];

      for (
        let k = 0;
        k < carrinho.produtos[i].produto.especificidade.length;
        k++
      ) {
        spans.push(
          <span>{carrinho.produtos[i].produto.especificidade[k].valor}</span>
        );
      }

      result.push(
        <div className="productResumeSelected">
          <div className="leftBlockProductResumeSelected">
            <div className="blocoImgProductResumeSelected">
              <img src={cadeia.fotografia[0]} />
            </div>
            <div className="detailsProductResumeSelected">
              <div className="toAlignDetailsProductResumeSelected">
                <h3>{cadeia.nome}</h3>
                <h4>Quantidade {carrinho.produtos[i].quantidade}</h4>
                <h4>{spans}</h4>
                <div className="ratingProductResumeSelected">
                  {createRankSuntentabilidade(Math.round(cadeia.cadeia.rating))}
                </div>
              </div>
            </div>
          </div>
          <div className="rightBlockProductResumeSelected">
            <span className="editarProductResumeSelected">editar</span>
            <h5>
              <br />
              {carrinho.produtos[i].produto.preco *
                carrinho.produtos[i].quantidade} €
            </h5>
          </div>
        </div>
      );
    }

    this.setState({
      precoTotal: carrinho.valor.total,
    });

    return result;
  }

  async createPagamento() {
    let result = [];

    result.push(
      <div>
        <div className="lineTwoArguments lineSubtotal">
          <h5>Produtos</h5>
          <h5>{this.state.precoTotal}€</h5>
        </div>

        <div className="lineTwoArguments lineSubtotal">
          <h5>Envio</h5>
          <h5>{this.state.portesFinais}€</h5>
        </div>

        <div className="lineTwoArguments">
          <h5>Preço total</h5>
          <h5>{this.state.precoTotal + this.state.portesFinais}€</h5>
        </div>
      </div>
    );

    return result;
  }

  async componentDidMount() {
    if (this.state.page == "carrinho") {
      await this.carregarResumo();
    } else if (this.state.page == "dados") {
      await this.carregarResumo();
      await this.carregarCarrinho();
    } else if (this.state.page == "transportes") {
      await this.carregarResumo();
      await this.carregarCarrinho();
    } else if (this.state.page == "pagamento") {
      await this.carregarResumo();
      await this.carregarCarrinho();
      await this.carregarTransporte();
      await this.carregarPagamento();
    }

    if (this.state.verifyIfPagamento == "pagamento") {
      this.myRefBtnSeguinte.current.style.display = "none";
    }

    // await this.carregarCarrinho()
  }

  render() {
    return (
      <div className="mainResumeShoppingCar">
        <div className="lineTwoArguments">
          <h5>
            Carrinho <span>({this.state.numeroProdutos})</span>
          </h5>
          <h5>
            {this.state.precoTotal}€{" "}
            <span className="totalExtension">/total</span>
          </h5>
        </div>
        <div className="divLineResume" />

        <div ref={this.refCadeiaLogistica} className="lineOneArgument">
          {/*  */}
        </div>

        <div className="divLineResume" />
        {/* <div className="lineOneArgument">
          <p>
            Escolhe a empresa que pretendes para transporte dos teus produtos.
            <br />
            Faz uma escolha consciente. Pensa no mundo.
            <br />
            A cada transporte está associado um nível de sustentabilidade de
            transporte segundo a escala de sustentabilidade Baylit.
            <br />
            <span className="escalaResumo">Ver escala</span>
          </p>
        </div> */}

        <div
          ref={this.refCarrinho}
          className="displayProductsResumeSelected"
        ></div>

        <div ref={this.refTransporte} className="blocoTransportesResume"></div>

        <div ref={this.refPagamento}></div>
        <div
          ref={this.myRefBtnSeguinte}
          onClick={async () => {
            await this.state.paginaSeguinte();
          }}
          className="finalizarCompraResume"
        >
          <span>Seguinte</span>
        </div>
      </div>
    );
  }
}

export default ResumeShoppingCar;
