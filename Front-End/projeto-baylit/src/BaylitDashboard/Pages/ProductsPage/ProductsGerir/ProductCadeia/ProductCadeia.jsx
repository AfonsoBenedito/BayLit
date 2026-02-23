import React, { Component } from "react";

import "./ProductCadeia.css";

import {
  getLeaf,
  createRankSuntentabilidade,
} from "../../../../../BaylitConsumidor/Components/LeafSVG";

import { getLocalById } from "../../../../../Helpers/ProdutoHelper";

class ProductCadeia extends Component {
  constructor(props) {
    super(props);

    this.myRefBtnGeral = React.createRef();
    this.myRefBtnProducao = React.createRef();
    this.myRefBtnArmazenamento = React.createRef();
    this.myRefBtnTransporte = React.createRef();

    this.myRefBlockGeral = React.createRef();
    this.myRefBlockProducao = React.createRef();
    this.myRefBlockArmazenamento = React.createRef();
    this.myRefBlockTransporte = React.createRef();

    this.myRefTableRecursos = React.createRef();
    this.myRefTablePoluicao = React.createRef();
    // this.myRefTableRecursosIcon = React.createRef();
    // this.myRefTablePoluicaoIcon = React.createRef();

    this.state = {
      functionBtnRecursos: this.openTableRecursos,
      functionBtnPoluicao: this.openTablePoluicao,

      classBtnRecursos: "bi bi-caret-right-fill",
      classBtnPoluicao: "bi bi-caret-right-fill",

      cadeia: this.props.cadeia,
      local: "Local",
    };

  }

  async getLocal() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    // console.log(this.state.cadeia.producao.local)

    let local = await getLocalById(
      info.id,
      info.token,
      this.state.cadeia.producao.local
    );

    // console.log(local);

    if (local) {
      this.setState({
        local: local.local,
      });
    }
  }

  openTableRecursos = () => {
    this.myRefTableRecursos.current.style.display = "block";

    this.setState({
      functionBtnRecursos: this.closeTableRecursos,
      classBtnRecursos: "bi bi-caret-down-fill",
    });
  };

  closeTableRecursos = () => {
    this.myRefTableRecursos.current.style.display = "none";

    this.setState({
      functionBtnRecursos: this.openTableRecursos,
      classBtnRecursos: "bi bi-caret-right-fill",
    });
  };

  openTablePoluicao = () => {
    this.myRefTablePoluicao.current.style.display = "block";

    this.setState({
      functionBtnPoluicao: this.closeTablePoluicao,
      classBtnPoluicao: "bi bi-caret-down-fill",
    });
  };

  closeTablePoluicao = () => {
    this.myRefTablePoluicao.current.style.display = "none";

    this.setState({
      functionBtnPoluicao: this.openTablePoluicao,
      classBtnPoluicao: "bi bi-caret-right-fill",
    });
  };

  createBlockProducao() {
    let resultBlock;

    let valoresTabelaRecursos = [];

    let producaoRecursos = this.state.cadeia.producao.recursos;
    let producaoPoluicao = this.state.cadeia.producao.poluicao;

    for (let i = 0; i < producaoRecursos.length; i++) {
      valoresTabelaRecursos.push(
        <tr>
          <td>{producaoRecursos[i].nome}</td>
          <td>{producaoRecursos[i].quantidade}</td>
          <td>{producaoRecursos[i].unidade_medida}</td>
        </tr>
      );
    }

    let valoresTabelaPoluicao = [];

    for (let i = 0; i < producaoPoluicao.length; i++) {
      valoresTabelaPoluicao.push(
        <tr>
          <td>{producaoPoluicao[i].nome}</td>
          <td>{producaoPoluicao[i].quantidade}</td>
        </tr>
      );
    }

    resultBlock = [
      <>
        <div className="blockNivelDetails_Fornecedor">
          <h6>
            Nível de sustentabilidade na produção -{" "}
            <span className="numberNivelDetails_Fornecedor">
              {this.state.cadeia.producao.classificacao}
            </span>
            <span className="iconNivelDetails_Fornecedor">{getLeaf()}</span>
          </h6>
          <div className="productLeafSVGDetails_Fornecedor">
            {createRankSuntentabilidade(
              this.state.cadeia.producao.classificacao
            )}
          </div>
        </div>
        <div className="localizacaoProducao_Fornecedor">
          <i class="bi bi-geo-alt-fill"></i>
          <h6>{this.state.local.localidade}</h6>
        </div>
        <h4>Produção Biológica</h4>
        <h5
          className="producaoBtnTable_Fornecedor"
          onClick={() => {
            this.state.functionBtnRecursos();
          }}
        >
          Recursos{" "}
          <span>
            <i class={this.state.classBtnRecursos}></i>
          </span>
        </h5>
        <div
          ref={this.myRefTableRecursos}
          className="producaoBlockTable_Fornecedor"
        >
          <table className="producaoTable_Fornecedor">
            {/* <tr>
              <th>Nome</th>
              <th>Quantidade</th>
              <th>Unidade de medida</th>
            </tr> */}
            {valoresTabelaRecursos}
          </table>
        </div>

        <h5
          className="producaoBtnTable_Fornecedor"
          onClick={() => {
            this.state.functionBtnPoluicao();
          }}
        >
          Poluição{" "}
          <span>
            <i class={this.state.classBtnPoluicao}></i>
          </span>
        </h5>
        <div
          ref={this.myRefTablePoluicao}
          className="producaoBlockTable_Fornecedor"
        >
          <table className="producaoTable_Fornecedor">
            {/* <tr>
              <th>Nome</th>
              <th>Quantidade</th>
            </tr> */}
            {valoresTabelaPoluicao}
          </table>
        </div>
      </>,
    ];

    return resultBlock;
  }

  createBlockArmazenamento() {
    let resultBlock;

    resultBlock = [
      <>
        <div className="blockNivelDetails_Fornecedor">
          <h6>
            Nível de sustentabilidade no armanezamento -{" "}
            <span className="numberNivelDetails_Fornecedor">
              {this.state.cadeia.armazenamento.classificacao}
            </span>
            <span className="iconNivelDetails_Fornecedor">{getLeaf()}</span>
          </h6>
          <div className="productLeafSVGDetails_Fornecedor">
            {createRankSuntentabilidade(
              this.state.cadeia.armazenamento.classificacao
            )}
          </div>
        </div>
        <div className="topicoBlockTable_Fornecedor">
          <table className="topicoTable_Fornecedor">
            <tr>
              <th>Consumo</th>
              <th>Duração</th>
            </tr>
            <tr>
              <td>{this.state.cadeia.armazenamento.consumo}</td>
              <td>{this.state.cadeia.armazenamento.duracao} dias</td>
            </tr>
          </table>
        </div>
      </>,
    ];

    return resultBlock;
  }

  createBlockTransporte() {
    let resultBlock;

    resultBlock = [
      <>
        <div className="blockNivelDetails_Fornecedor">
          <h6>
            Nível de sustentabilidade no transporte para o armazém -{" "}
            <span className="numberNivelDetails_Fornecedor">
              {this.state.cadeia.transporte_armazem.classificacao}
            </span>
            <span className="iconNivelDetails_Fornecedor">{getLeaf()}</span>
          </h6>
          <div className="productLeafSVGDetails_Fornecedor">
            {createRankSuntentabilidade(
              this.state.cadeia.transporte_armazem.classificacao
            )}
          </div>
        </div>
        <div className="topicoBlockTable_Fornecedor">
          <table className="topicoTable_Fornecedor">
            <tr>
              <th>Distância</th>
              <th>Consumo</th>
              <th>Emissão</th>
              <th>Número de itens</th>
            </tr>
            <tr>
              <td>
                {Math.round(this.state.cadeia.transporte_armazem.distancia)} KM
              </td>
              <td>
                {Math.round(this.state.cadeia.transporte_armazem.consumo)}
              </td>
              <td>
                {Math.round(this.state.cadeia.transporte_armazem.emissao)}
              </td>
              <td>{this.state.cadeia.transporte_armazem.n_itens}</td>
            </tr>
          </table>
        </div>
      </>,
    ];

    return resultBlock;
  }

  openBlock(type) {
    let borderGeral = "none";
    let borderProducao = "none";
    let borderArmazenamento = "none";
    let borderTransporte = "none";

    let displayGeral = "none";
    let displayProducao = "none";
    let displayArmazenamento = "none";
    let displayTransporte = "none";

    switch (type) {
      case "geral":
        borderGeral = "3px solid rgb(219, 219, 219)";
        displayGeral = "flex";
        break;
      case "producao":
        borderProducao = "3px solid rgb(219, 219, 219)";
        displayProducao = "flex";
        break;
      case "armazenamento":
        borderArmazenamento = "3px solid rgb(219, 219, 219)";
        displayArmazenamento = "flex";
        break;
      case "transporte":
        borderTransporte = "3px solid rgb(219, 219, 219)";
        displayTransporte = "flex";
        break;
    }

    this.myRefBtnGeral.current.style.borderBottom = borderGeral;
    this.myRefBtnProducao.current.style.borderBottom = borderProducao;
    this.myRefBtnArmazenamento.current.style.borderBottom = borderArmazenamento;
    this.myRefBtnTransporte.current.style.borderBottom = borderTransporte;

    this.myRefBlockGeral.current.style.display = displayGeral;
    this.myRefBlockProducao.current.style.display = displayProducao;
    this.myRefBlockArmazenamento.current.style.display = displayArmazenamento;
    this.myRefBlockTransporte.current.style.display = displayTransporte;
  }

  async componentDidMount() {
    await this.getLocal();
  }

  render() {
    return (
      <div className="mainProductCadeia_Fornecedor">
        <div className="navCadeiaLogistica_Fornecedor">
          <div
            ref={this.myRefBtnGeral}
            className="btnCadeiaLogisticaDetail_Fornecedor"
            onClick={() => {
              this.openBlock("geral");
            }}
          >
            <span>Geral</span>
          </div>
          <div
            ref={this.myRefBtnProducao}
            className="btnCadeiaLogisticaDetail_Fornecedor"
            onClick={() => {
              this.openBlock("producao");
            }}
          >
            <span>Produção</span>
          </div>
          <div
            ref={this.myRefBtnArmazenamento}
            className="btnCadeiaLogisticaDetail_Fornecedor"
            onClick={() => {
              this.openBlock("armazenamento");
            }}
          >
            <span>Armazenamento</span>
          </div>
          <div
            ref={this.myRefBtnTransporte}
            className="btnCadeiaLogisticaDetail_Fornecedor"
            onClick={() => {
              this.openBlock("transporte");
            }}
          >
            <span>Transporte do armazém</span>
          </div>
        </div>
        {/* BLOCO GERAL */}
        <div ref={this.myRefBlockGeral} className="geralBlock_Fornecedor">
          <div className="cardGeralBlock_Fornecedor">
            <h6>Produção</h6>
            <h5>{this.state.cadeia.producao.tipo}</h5>
            <h6>Nível</h6>
            <h5 className="nivelSustainabilityProductValue_Fornecedor">
              {this.state.cadeia.producao.classificacao}
            </h5>
            <div className="productLeafSVG">
              {createRankSuntentabilidade(
                this.state.cadeia.producao.classificacao
              )}
            </div>
          </div>
          <div className="cardGeralBlock">
            <h6>Armazenamento</h6>
            <h5>{this.state.cadeia.armazenamento.duracao} dias</h5>
            <h6>Nível</h6>
            <h5 className="nivelSustainabilityProductValue_Fornecedor">
              {this.state.cadeia.armazenamento.classificacao}
            </h5>
            <div className="productLeafSVG_Fornecedor">
              {createRankSuntentabilidade(
                this.state.cadeia.armazenamento.classificacao
              )}
            </div>
          </div>
          <div className="cardGeralBlock_Fornecedor">
            <h6>Transporte</h6>
            <h5>
              {Math.round(this.state.cadeia.transporte_armazem.distancia)} KM
            </h5>
            <h6>Nível</h6>
            <h5 className="nivelSustainabilityProductValue_Fornecedor">
              {Math.round(this.state.cadeia.transporte_armazem.classificacao)}
            </h5>
            <div className="productLeafSVG_Fornecedor">
              {createRankSuntentabilidade(
                this.state.cadeia.transporte_armazem.classificacao
              )}
            </div>
          </div>
        </div>

        {/* BLOCO PRODUÇÃO */}
        <div ref={this.myRefBlockProducao} className="producaoBlock_Fornecedor">
          {this.createBlockProducao()}
        </div>
        {/* BLOCO ARMAZENAMENTO */}
        <div
          ref={this.myRefBlockArmazenamento}
          className="armazenamentoBlock_Fornecedor"
        >
          {this.createBlockArmazenamento()}
        </div>
        {/* BLOCO TRANSPORTE */}
        <div
          ref={this.myRefBlockTransporte}
          className="transporteBlock_Fornecedor"
        >
          {this.createBlockTransporte()}
        </div>
      </div>
    );
  }
}

export default ProductCadeia;
