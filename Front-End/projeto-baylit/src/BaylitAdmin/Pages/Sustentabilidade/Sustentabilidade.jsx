import React, { Component } from "react";

import ReactDOM from "react-dom";
import { getGraphsAdministrador } from "../../../Helpers/SustainabilityHelper";
import { Chart } from "react-google-charts";

import "./Sustentabilidade.css";

class Sustentabilidade extends Component {
  constructor(props) {
    super(props);
    this.stateData1 = [
      ["Tipo", "Quantidade"],
      ["Biológica", 0.33],
      ["Orgânica", 0.33],
      ["Intensiva", 0.33],
    ];
    this.stateData2 = [
      ["Categoria", "Produtos"],
      [0, 0],
    ];
    this.stateData3 = [
      ["Categoria", "Vendas"],
      [0, 0],
    ];
    this.stateData4 = [
      ["Categoria", "Classificação Produção"],
      [0, 0],
    ];
    this.stateData5 = [
      ["Categoria", "Classificação Transporte Armazém"],
      [0, 0],
    ];
    this.stateData6 = [
      ["Categoria", "Classificação Armazenamento"],
      [0, 0],
    ];
    this.stateData7 = [
      ["Categoria", "Classificação Cadeia"],
      [0, 0],
    ];
  }

  async updateStates() {
    let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));
    let token = baylitInfo.token;
    let dados = await getGraphsAdministrador(token);
    dados = dados.relatorio;
    console.log(dados);

    let grafico1new = [
      ["Tipo", "Quantidade"],
      ["Biológica", dados["tipo_producao"]["Biologica"]],
      ["Orgânica", dados["tipo_producao"]["Organica"]],
      ["Intensiva", dados["tipo_producao"]["Intensiva"]],
    ];

    let grafico2new = [["Categoria", "Produtos"]];
    for (let categoria in dados["produtos_categoria"]) {
      grafico2new.push([categoria, dados["produtos_categoria"][categoria]]);
    }
    if (grafico2new.length == 1) {
      grafico2new.push([0, 0]);
    }

    let grafico3new = [["Categoria", "Vendas"]];
    for (let categoria in dados["vendas_categoria"]) {
      grafico3new.push([categoria, dados["vendas_categoria"][categoria]]);
    }
    if (grafico3new.length == 1) {
      grafico3new.push([0, 0]);
    }

    let grafico4new = [["Categoria", "Classificação Produção"]];
    for (let categoria in dados["classificacao_producao_categoria"]) {
      grafico4new.push([
        categoria,
        dados["classificacao_producao_categoria"][categoria],
      ]);
    }
    if (grafico4new.length == 1) {
      grafico4new.push([0, 0]);
    }

    let grafico5new = [["Categoria", "Classificação Transporte Armazém"]];
    for (let categoria in dados["classificacao_transporte_armazem_categoria"]) {
      grafico5new.push([
        categoria,
        dados["classificacao_transporte_armazem_categoria"][categoria],
      ]);
    }
    if (grafico5new.length == 1) {
      grafico5new.push([0, 0]);
    }

    let grafico6new = [["Categoria", "Classificação Armazenamento"]];
    for (let categoria in dados["classificacao_armazenamento_categoria"]) {
      grafico6new.push([
        categoria,
        dados["classificacao_armazenamento_categoria"][categoria],
      ]);
    }
    if (grafico6new.length == 1) {
      grafico6new.push([0, 0]);
    }

    let grafico7new = [["Categoria", "Classificação Cadeia"]];
    for (let categoria in dados["classificacao_categoria"]) {
      grafico7new.push([
        categoria,
        dados["classificacao_categoria"][categoria],
      ]);
    }
    if (grafico7new.length == 1) {
      grafico7new.push([0, 0]);
    }

    this.setState({
      stateData1: grafico1new,
      stateData2: grafico2new,
      stateData3: grafico3new,
      stateData4: grafico4new,
      stateData5: grafico5new,
      stateData6: grafico6new,
      stateData7: grafico7new,
    });

    this.fillDataGraphs();
  }

  async fillDataGraphs() {
    let a;
    a = (
      <Chart
        chartType="PieChart"
        width="100%"
        height="400px"
        data={this.state.stateData1}
      />
    );
    ReactDOM.render(a, document.getElementById("receive_div1"));

    let b;
    b = (
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        // data={this.stateExemplo}
        data={this.state.stateData2}
      />
    );
    ReactDOM.render(b, document.getElementById("receive_div2"));

    let c;
    c = (
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={this.state.stateData3}
      />
    );
    ReactDOM.render(c, document.getElementById("receive_div3"));

    let d;
    d = (
      <Chart
        chartType="ScatterChart"
        width="100%"
        height="400px"
        data={this.state.stateData4}
      />
    );
    ReactDOM.render(d, document.getElementById("receive_div4"));

    let e;
    e = (
      <Chart
        chartType="ScatterChart"
        width="100%"
        height="400px"
        data={this.state.stateData5}
      />
    );
    ReactDOM.render(e, document.getElementById("receive_div5"));

    let f;
    f = (
      <Chart
        chartType="ScatterChart"
        width="100%"
        height="400px"
        data={this.state.stateData6}
      />
    );
    ReactDOM.render(f, document.getElementById("receive_div6"));

    let g;
    g = (
      <Chart
        chartType="ScatterChart"
        width="100%"
        height="400px"
        data={this.state.stateData7}
      />
    );
    ReactDOM.render(g, document.getElementById("receive_div7"));
  }

  componentDidMount() {
    this.updateStates();
  }

  render() {
    return (
      <div className="mainSustentabilidadePage">
        <h1 className="tituloSustentabilidadePage">Sustentabilidade</h1>
        <h3 className="subTituloSustentabilidadePage">Administrador</h3>
        <h7 className="tituloSustenbilidadeGraph1">
          Tipos de Produção dos Produtos Registados
        </h7>
        <div id="receive_div1"></div>
        <h7 className="tituloSustenbilidadeGraph2">Produtos por Categoria</h7>
        <div id="receive_div2"></div>
        <h7 className="tituloSustenbilidadeGraph2">Vendas por Categoria</h7>
        <div id="receive_div3"></div>
        <h7 className="tituloSustenbilidadeGraph2">
          Classificação da Produção por Categoria
        </h7>
        <div id="receive_div4"></div>
        <h7 className="tituloSustenbilidadeGraph2">
          Classificação do Transporte para Armazém por Categoria
        </h7>
        <div id="receive_div5"></div>
        <h7 className="tituloSustenbilidadeGraph2">
          Classificação do Armazenamento por Categoria
        </h7>
        <div id="receive_div6"></div>
        <h7 className="tituloSustenbilidadeGraph2">
          Classificação da Cadeia por Categoria
        </h7>
        <div id="receive_div7"></div>
      </div>
    );
  }
}

export default Sustentabilidade;
