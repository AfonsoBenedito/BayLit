import React, { Component } from "react";

import {
  RegistoFornecedor,
  RegistoTransportador,
  Login,
} from "../../../Helpers/AuthenticationHelper";
import {
  getProduto,
  getProdutosByFornecedor,
  adicionarProduto,
  getArmazensByFornecedor,
  getArmazemById,
  adicionarArmazem,
} from "../../../Helpers/FornecedorHelper";
import { getFornecedor, getTransportador } from "../../../Helpers/UserHelper";

import "./TestePage.css";

class TestePage extends Component {
  async testeRegistoFornecedor() {
    let res = await RegistoFornecedor(
      "TEsteTelles",
      "testeTelles@gmail.com",
      "badPwd2.",
      "nao intressa",
      "432123456",
      "919161346"
    );
  }

  async testeRegistoTransportador() {
    let res = await RegistoTransportador(
      "TEsteTellesTranspor",
      "testeTellesTranspor@gmail.com",
      "badPwd2.",
      "nao intressa",
      "432123457",
      "917161346",
      "bla",
      12,
      12
    );
  }

  async testeLoginFornecedor() {
    let res = await Login("testeTelles@gmail.com", "badPwd2.");
  }

  async testeLoginTransportador() {
    let res = await Login("testeTellesTranspor@gmail.com", "badPwd2.");
  }

  async testeGetFornecedor() {
    let res = await getFornecedor("6287c62f374dd8165fe22201");
  }

  async testeGetTransportador() {
    let res = await getTransportador("6287c643374dd8165fe22209");
  }

  async testeGetProduto() {
    let res = await getProduto("6287ed147d1f370bdd68a760");
  }

  async testeGetProdutoByFornecedor() {
    let res = await getProdutosByFornecedor("62abe01ed7ced5ae4bd15826");
  }

  async testeAdicionarProduto() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    if (info.tipo == "Fornecedor") {
      let fotografia = document.getElementById("inputFileProduto").files[0];
      let res = await adicionarProduto(
        info.id,
        info.token,
        "Bola da Nike",
        "62b343f55ae92e48cd782b09",
        "62b343f55ae92e48cd782b17",
        "Bola de grande dimensao, novinha",
        fotografia
      );
    } else {
    }
  }

  async testeGetArmazemByFornecedor() {
    let res = await getArmazensByFornecedor("6287c62f374dd8165fe22201");
  }

  async testeGetArmazemById() {
    let res = await getArmazemById("629e7f328b19e275f7aeca14");
  }

  //Problema com o Local
  async testeAdicionarArmazem() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    if (info.tipo == "Fornecedor") {
      let res = await adicionarArmazem(info.id, info.token, "Lisboa", 20, 30);
    } else {
    }
  }

  async componentDidMount() {
    //await this.testeAdicionarProduto()
    // await this.testeGetArmazemById()
  }

  render() {
    return (
      <div>
        <div> Isto é a pagina de teste</div>
        <button onClick={this.testeRegistoFornecedor}>
          Testar Registo Fornecedor
        </button>
        <button onClick={this.testeRegistoTransportador}>
          Testar Registo Transportador
        </button>

        <button onClick={this.testeLoginFornecedor}>
          Testar Login Fornecedor
        </button>
        <button onClick={this.testeLoginTransportador}>
          Testar Login Transportador
        </button>

        <button onClick={this.testeGetFornecedor}>Testar Get Fornecedor</button>
        <button onClick={this.testeGetTransportador}>
          Testar Get Transportador
        </button>

        <div>
          <input type="file" id="inputFileProduto"></input>
        </div>
        <button onClick={this.testeAdicionarProduto}>
          {" "}
          Enviar AdicionarProduto
        </button>
      </div>
    );
  }
}

export default TestePage;
