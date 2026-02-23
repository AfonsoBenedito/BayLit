import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Chart } from "react-google-charts";
import ReactDOM from "react-dom";
import { Export } from "react-google-charts";

import "./Sustainability.css";
import {
  getGraphsFornecedor,
  getGraphsTransportador,
  getGraphsAdministrador,
} from "../../../../Helpers/SustainabilityHelper";

class Sustainability extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grafico1T: [
        ["Dia", "Transportes"],
        [0, 0],
      ],
      grafico2T: [
        ["Dia", "Consumo"],
        [0, 0],
      ],
      grafico3T: [
        ["Dia", "Emissão"],
        [0, 0],
      ],
      grafico4T: [
        ["Veiculo", "Classificacao"],
        [0, 0],
      ],
      grafico1F: [
        ["Dia", "Vendas"],
        [0, 0],
      ],
      grafico2F: [
        ["Armazenamento", "Produto"],
        [0, 0],
      ],
      grafico3F: [
        ["Duracao de Armazenamento", "Produto"],
        [0, 0],
      ],
      grafico4F: [
        ["Classificacao de Armazenamento", "Produto"],
        [0, 0],
      ],
      grafico5F: [
        ["Vendas", "Cliente"],
        [0, 0],
      ],
    };
  }

  downloadPDF() {
    // let grafico1 = document.getElementById("teste");
    // // let pdf_chart_image = grafico1.getImageURI( 0, 0);
    // let pdf_chart_image = grafico1.getImageURI();
    // let pdf = new jsPDF();
    // pdf.setFontSize(20);
    // pdf.addImage(pdf_chart_image, "JPEG", 15, 15, 280, 150);
    // pdf.save("relatorio_sustentabilidade.pdf");
    // const doc = new jsPDF();
    // doc.text("Hello world!", 10, 10);
    // doc.save("a4.pdf");
    // let grafico = document.getElementById("teste");
    // let image = grafico.toDataURL("image/png", 1.0);
    // let pdf = new jsPDF("landscape");
    // pdf.addImage(image, "PNG", 15, 15, 280, 150);
    // pdf.save("chart.pdf");
    //let pdf = new jsPDF();
    // let chart = new Chart(document.getElementById("grafico1F"));
    // let imageLink = document.createElement("a");
    // let canvas = document.getElementById("grafico1F");
    // imageLink.download = "relatorio_sustentabilidade.png";
    // imageLink.href = canvas.toDataURL("relatorioG1.png", 1);
    // imageLink.click();
    //--------------------------------------------------------------------
    //-------------------------------------------------------------------
  }

  async handlerInformacaoT(filtro) {
    //retorna a lista de valores a usar referentes ao Fornecedor dependendo da metrica;
    let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));
    let token = baylitInfo.token;
    let tipo = baylitInfo.tipo;
    let dados;

    if (tipo === "Transportador") {
      let transportadorID = baylitInfo.id;
      dados = await getGraphsTransportador(transportadorID, filtro, token);
      if (dados.lenght === 0) {
        /* console.log("dados vêm vazios , não conseguimos dar display"); */
      }
    }
    /*  console.log(dados);*/

    let grafico1Tnew = [["Dia", "Transportes"]];
    for (let dia of dados["transportes/dia"]) {
      grafico1Tnew.push([dia.dia, dia.num_transportes]);
    }
    if (grafico1Tnew.length == 1) {
      grafico1Tnew.push([0, 0]);
    }
    // console.log(grafico1Tnew);

    let grafico2Tnew = [["Dia", "Consumo"]];
    for (let dia of dados["consumo/dia"]) {
      grafico2Tnew.push([dia.dia, dia.consumo_media]);
    }
    if (grafico2Tnew.length == 1) {
      grafico2Tnew.push([0, 0]);
    }
    // console.log(grafico2Tnew);

    let grafico3Tnew = [["Dia", "Emissão"]];
    for (let dia of dados["emissao/dia"]) {
      grafico3Tnew.push([dia.dia, dia.emissao_media]);
    }
    if (grafico3Tnew.length == 1) {
      grafico3Tnew.push([0, 0]);
    }
    // console.log(grafico3Tnew);

    let grafico4Tnew = [["Veiculo", "Classificacao"]];
    for (let veiculo of dados["classificacao/veiculo"]) {
      grafico4Tnew.push([veiculo.veiculo.nome, veiculo.classificacao]);
    }
    if (grafico4Tnew.length == 1) {
      grafico4Tnew.push([0, 0]);
    }
    // console.log(grafico4Tnew);

    this.setState({
      grafico1T: grafico1Tnew,
      grafico2T: grafico2Tnew,
      grafico3T: grafico3Tnew,
      grafico4T: grafico4Tnew,
    });

    this.createGraphs();
  }

  async handlerInformacaoF(filtro) {
    //retorna a lista de valores a usar referentes ao Fornecedor dependendo da metrica;
    let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));
    let token = baylitInfo.token;
    let tipo = baylitInfo.tipo;
    let dados;

    if (tipo === "Fornecedor") {
      let fornecedorID = baylitInfo.id;
      dados = await getGraphsFornecedor(fornecedorID, filtro, token);
      if (dados.lenght === 0) {
      }
    }

    let grafico1Fnew = [["Dia", "Vendas"]];
    for (let dia of dados["vendas/dia"]) {
      grafico1Fnew.push([dia.dia, dia.num_vendas]);
    }
    if (grafico1Fnew.length == 1) {
      grafico1Fnew.push([0, 0]);
    }
    // console.log(grafico1Fnew);

    let grafico2Fnew = [["Armazenamento", "Produto"]];
    for (let produto of dados["consumo_armazenamento/produto"]) {
      grafico2Fnew.push([produto.produto.nome, produto.consumo_armazenamento]);
    }
    if (grafico2Fnew.length == 1) {
      grafico2Fnew.push([0, 0]);
    }
    // console.log(grafico2Fnew);

    let grafico3Fnew = [["Duracao de Armazenamento", "Produto"]];
    for (let produto of dados["duracao_armazenamento/produto"]) {
      grafico3Fnew.push([produto.produto.nome, produto.duracao_armazenamento]);
    }
    if (grafico3Fnew.length == 1) {
      grafico3Fnew.push([0, 0]);
    }
    // console.log(grafico3Fnew);

    let grafico4Fnew = [["Classificacao de Armazenamento", "Produto"]];
    for (let produto of dados["classificacao_armazenamento/produto"]) {
      grafico4Fnew.push([
        produto.produto.nome,
        produto.classificacao_armazenamento,
      ]);
    }
    if (grafico4Fnew.length == 1) {
      grafico4Fnew.push([0, 0]);
    }
    // console.log(grafico4Fnew);

    let grafico5Fnew = [["Vendas", "Cliente"]];
    for (let cliente of dados["vendas/cliente"]) {
      grafico5Fnew.push([cliente.cliente.nome, cliente.num_vendas]);
    }
    if (grafico5Fnew.length == 1) {
      grafico5Fnew.push([0, 0]);
    }
    // console.log(grafico5Fnew);

    this.setState({
      grafico1F: grafico1Fnew,
      grafico2F: grafico2Fnew,
      grafico3F: grafico3Fnew,
      grafico4F: grafico4Fnew,
      grafico5F: grafico5Fnew,
    });

    this.createGraphs();
  }

  createGraphs() {
    let data = JSON.parse(localStorage.getItem("baylitInfo"));

    if (data != null) {
      let tipo = data.tipo;
      let a;
      if (tipo == "Transportador") {
        a = (
          <div className="main_graphs">
            <div className="filtro_grafico">
              <button
                className="botoesGraficos"
                onClick={() => {
                  this.handlerInformacaoT("semana");
                }}
                id="botao_transportador_semana_g1"
              >
                Semana
              </button>
              <button
                className="botoesGraficos"
                id="botao_transportador_mes_g1"
                onClick={() => {
                  this.handlerInformacaoT("mes");
                }}
              >
                Mes
              </button>
              <button
                className="botoesGraficos"
                id="botao_transportador_ano_g1"
                onClick={() => {
                  this.handlerInformacaoT("ano");
                }}
              >
                Ano
              </button>
              <button
                className="botoesGraficos"
                id="botao_transportador_5anos_g1"
                onClick={() => {
                  this.handlerInformacaoT("5 anos");
                }}
              >
                5 anos
              </button>
            </div>
            <div className="graph1" id="teste">
              <p className="Title_Graphs">
                Transportes efetuados em função do Tempo
              </p>
              {/* Gráfico fica aqui no lugar deste comentário , basta copiar abaixo */}
              <Chart
                chartType="LineChart"
                data={this.state.grafico1T} /* options={options} */
              />
              {/* ------------------------------------------------------------------*/}
              <div className="infoGraphs">
                <p className="text_infographs">
                  Através da análise deste gráfico poderá perceber como estão os
                  seus transportes em função do tempo
                </p>
              </div>
            </div>
            <div className="graph1">
              <p className="Title_Graphs">Consumo em função do Tempo</p>

              <Chart chartType="ScatterChart" data={this.state.grafico2T} />
              <div className="infoGraphs">
                <p className="text_infographs">
                  Através da análise deste gráfico poderá perceber como estão os
                  seus consumos em função do tempo.
                </p>
              </div>
            </div>
            <div className="graph1">
              <p className="Title_Graphs">Emissão em função do Tempo</p>

              {/* <Chart
                chartType="ScatterChart"
                data={[
                  ["Age", "Weight"],
                  [1, 2],
                  [2, 4],
                  [3, 6],
                  [4, 5.5],
                  [8, 12],
                ]}
                legendToggle
              /> */}
              <Chart chartType="ScatterChart" data={this.state.grafico3T} />
              <div className="infoGraphs">
                <p className="text_infographs">
                  Através da análise deste gráfico poderá perceber como estão as
                  suas emissões em função do tempo.
                </p>
              </div>
            </div>
            <div className="graph1">
              <p className="Title_Graphs">
                Classificação em função dos Veículos
              </p>

              <Chart chartType="LineChart" data={this.state.grafico4T} />
              <div className="infoGraphs">
                <p className="text_infographs">
                  Através da análise deste gráfico poderá perceber como estão
                  classificados os seus veículos ao longo do tempo
                </p>
              </div>
            </div>
          </div>
        );
      } else if (tipo == "Fornecedor") {
        a = (
          <div className="main_graphs">
            <div className="filtro_grafico">
              <button
                className="botoesGraficos"
                onClick={() => {
                  this.handlerInformacaoF("semana");
                }}
              >
                Semana
              </button>
              <button
                className="botoesGraficos"
                onClick={() => {
                  this.handlerInformacaoF("mes");
                }}
              >
                Mes
              </button>
              <button
                className="botoesGraficos"
                onClick={() => {
                  this.handlerInformacaoF("ano");
                }}
              >
                Ano
              </button>
              <button
                className="botoesGraficos"
                onClick={() => {
                  this.handlerInformacaoF("5 anos");
                }}
              >
                5 Anos
              </button>
            </div>
            <div className="graph">
              <p className="Title_Graphs">Vendas por Dia</p>

              <Chart
                id="grafico1F"
                chartType="ScatterChart"
                data={this.state.grafico1F}
              />

              <div className="infoGraphs">
                <p className="text_infographs">
                  Através da análise deste gráfico poderá perceber como estão a
                  correr as suas vendas em função do tempo.
                </p>
              </div>
            </div>
            <div className="graph">
              <p className="Title_Graphs">
                Consumo de Armazenamento por Produto
              </p>

              <Chart chartType="ScatterChart" data={this.state.grafico2F} />
              <div className="infoGraphs">
                <p className="text_infographs">
                  Através da análise deste gráfico poderá perceber o consumo de
                  armazenamento de cada produto.
                </p>
              </div>
            </div>
            <div className="graph">
              <p className="Title_Graphs">
                Duração de Armazenamento por Produto
              </p>

              <Chart chartType="ScatterChart" data={this.state.grafico3F} />
              <div className="infoGraphs">
                <p className="text_infographs">
                  Através da análise deste gráfico poderá perceber a duração de
                  armazenamento de cada produto.
                </p>
                <p>
                  Através da análise deste gráfico poderá ver a classificacao de
                  armazenamento de cada produto.
                </p>
              </div>
            </div>
            <div className="graph">
              <p className="Title_Graphs">
                Classificação de Armazenamento por Produto
              </p>

              <Chart chartType="ScatterChart" data={this.state.grafico4F} />

              <div className="infoGraphs">
                <p className="text_infographs" id="nivel_ecologico_graphs">
                  Através da análise deste gráfico poderá ver a classificacao de
                  armazenamento de cada produto.
                </p>
              </div>
            </div>
            <div className="graph">
              <p className="Title_Graphs">Vendas por Cliente</p>

              <Chart chartType="ScatterChart" data={this.state.grafico5F} />
              <div className="infoGraphs">
                <p className="text_infographs" id="nivel_ecologico_graphs">
                  {" "}
                  Através da análise deste gráfico poderá ver como estão as suas
                  vendas
                </p>
              </div>
            </div>
          </div>
        );
      }
      ReactDOM.render(a, document.getElementById("receive_div"));
    }
  }
  async componentDidMount() {
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    if (data != null) {
      let tipo = data.tipo;
      if (tipo == "Transportador") {
        this.handlerInformacaoT("semana");
      } else if (tipo == "Fornecedor") {
        this.handlerInformacaoF("semana");
      }
    }
    this.createGraphs();
  }

  render() {
    return (
      <div>
        <div id="receive_div"></div>
        {/* <button id="chartsToPDF" onClick={this.downloadPDF}>
          Download de Relatórios de Sustentabilidade
        </button> */}
      </div>
    );
  }
}

export default Sustainability;
