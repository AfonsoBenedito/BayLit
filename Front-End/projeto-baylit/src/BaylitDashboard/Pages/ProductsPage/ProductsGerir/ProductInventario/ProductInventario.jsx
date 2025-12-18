import React, { Component } from "react";
import {
  alterarPrecoEspecifico,
  getProduto,
  getProdutoByEspecifico,
  getProdutoEspecificoByProduto,
} from "../../../../../Helpers/ProdutoHelper";

import "./ProductInventario.css";
import ShowInventario from "./ShowInventario/ShowInventario";

import ReactDOM from "react-dom";
import {
  getAtributo,
  getAtributoBySubcategoria,
  getSubCategoria,
} from "../../../../../Helpers/CategoryHelper";
import {
  adicionarProdutoEspecifico,
  getArmazensByFornecedor,
  getItemsByEspecifico,
} from "../../../../../Helpers/FornecedorHelper";

class ProductInventario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productId: this.props.idProduto,
      atributosEspecifico: []
    };

    this.refInventario = React.createRef();
    this.refPopUpEspecifico = React.createRef();

    this.refArmazensInv = React.createRef()
  }

  openArmazens(num) {
    document.getElementsByClassName("produtoEspecificoArmazens")[
      num
    ].style.display = "block";
    document.getElementsByClassName("openArmazens")[num].style.display = "none";
    document.getElementsByClassName("closeArmazens")[num].style.display =
      "initial";
  }

  closeArmazens(num) {
    document.getElementsByClassName("produtoEspecificoArmazens")[
      num
    ].style.display = "none";
    document.getElementsByClassName("closeArmazens")[num].style.display =
      "none";
    document.getElementsByClassName("openArmazens")[num].style.display =
      "initial";
  }

  openPopUpAddArmazem(indexProd, productId) {
    document.getElementsByClassName("popUpInventarioAdd")[
      indexProd
    ].style.display = "grid";
    document.getElementsByClassName("closeArmazemProduto")[
      indexProd
    ].style.display = "inline-block";
    document.getElementsByClassName("addArmazemProduto")[
      indexProd
    ].style.display = "none";
  }

  closePopUpAddArmazem(indexProd, productId) {
    document.getElementsByClassName("popUpInventarioAdd")[
      indexProd
    ].style.display = "none";
    document.getElementsByClassName("closeArmazemProduto")[
      indexProd
    ].style.display = "none";
    document.getElementsByClassName("addArmazemProduto")[
      indexProd
    ].style.display = "inline-block";
  }

  async createProdutoEspecifico() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let result = [];

    let especificos = await getProdutoEspecificoByProduto(this.state.productId);

    if (especificos == false){
      especificos = []
    }

    let produto = await getProduto(this.state.productId);

    let atributosBuscados = await getAtributoBySubcategoria(
      produto.subcategoria
    );

    let armazensBuscados = await getArmazensByFornecedor(info.id, info.token);

    console.log(armazensBuscados);

    // let atributos = await getAtributoBySubcategoria(this.state.subcategoria)

    console.log(especificos);
    console.log(atributosBuscados);

    // PRODUTOS
    for (let i = 0; i < especificos.length; i++) {
      // ATRIBUTOS

      let atributos = [];
      for (let k = 0; k < especificos[i].especificidade.length; k++) {
        atributos.push(
          <div className="cellProdutoEspecificoInventario">
            <h4>{atributosBuscados[k].nome}</h4>
            <h5>{especificos[i].especificidade[k].valor}</h5>
          </div>
        );
      }

      // let items = await getItemsByEspecifico(info.id, info.token,especificos[i]._id)
      // console.log(items)

      // ARMAZENS
      let armazens = [];
      for (let j = 0; j < armazensBuscados.length; j++) {
        for (let p = 0; p < armazensBuscados[j].inventario.length; p++) {
          if (armazensBuscados[j].inventario[p].produto == especificos[i]._id) {
            armazens.push(
              <div className="armazemProdutoInventario">
                <h4>{armazensBuscados[j].localizacao.local.localidade}</h4>
                <input
                  type="number"
                  placeholder={armazensBuscados[j].inventario[p].quantidade}
                />
              </div>
            );
          }
        }
      }

      

      


      armazens.push(
        <>
        <ShowInventario idEspecifico={especificos[i]._id}></ShowInventario>
          {/* <div className="popUpInventarioAdd">
            <div className="cellPopUpInventario">
              <h6>Armazem</h6>
              <select name={"armazem" + especificos[i]._id} id="">
                {optionsArmazens}
              </select>
            </div>
            <div className="cellPopUpInventario">
              <h6>Quantidade</h6>
              <input type="number" placeholder="Quantidade" name={"quantidade" + especificos[i]._id}/>
            </div>
            <div className="cellPopUpInventario">
              <h6>Desperdicio</h6>
              <input type="number" placeholder="Quantidade desperdiçada" name={"desperdicio" + especificos[i]._id} />
            </div>
            <div className="cellPopUpInventario">
              <h6>Tipo transporte</h6>
              <select id="" name={"tipo_transporte" + especificos[i]._id}>
              </select>
            </div>
            <div className="cellPopUpInventario">
              <h6>Marca transporte</h6>
              <select id="" name={"marca_transporte" + especificos[i]._id}>
              </select>
            </div>
            <div className="cellPopUpInventario">
              <h6>Modelo transporte</h6>
              <select id="" name={"modelo_transporte" + especificos[i]._id}>
                <option value="teste">teste</option>
              </select>
            </div>
            <div className="cellPopUpInventario">
              <h5>Adicionar Inventário</h5>
            </div>
          </div> */}
          <span
            class="addArmazemProduto"
            onClick={() => {
              this.openPopUpAddArmazem(i, this.state.productId);
            }}
          >
            Adicionar inventário
          </span>
          <span
            class="closeArmazemProduto"
            onClick={() => {
              this.closePopUpAddArmazem(i, this.state.productId);
            }}
          >
            Fechar inventário
          </span>
        </>
      );

      result.push(
        <div className="allBlockProdutoEspecifico">
          <div className="produtoEspecificoInventario">
            {atributos}
            <div className="cellProdutoEspecificoInventario priceEspecificoInventario">
              <h4>Preço</h4>
              <input
                type="number"
                min="0.00"
                step="0.01"
                name={"preco" + especificos[i]._id}
                placeholder={especificos[i].preco}
              />
            </div>
            <div
              className="alterarPrecoBtnGerir"
              onClick={async () => {
                await this.alterarPreco(
                  especificos[i]._id,
                  "preco" + especificos[i]._id
                );
              }}
            >
              {" "}
              Alterar Preço{" "}
            </div>
            <div className="cellInventarioStock">
              <h3
                className="openArmazens"
                onClick={() => {
                  this.openArmazens(i);
                }}
              >
                Mostrar
                <br />
                Inventários
              </h3>
              <h3
                className="closeArmazens"
                onClick={() => {
                  this.closeArmazens(i);
                }}
              >
                Esconder
                <br />
                Inventários
              </h3>
            </div>
          </div>
          <div className="produtoEspecificoArmazens">{armazens}</div>
        </div>
      );
    }

    ReactDOM.render(
      [
        <div
          ref={this.refPopUpEspecifico}
          className="popUpAddProductEspecificoInventario"
        >
          <div
            className="backgroundPopUpAddProductEspecificoInventario"
            onClick={() => {
              this.closePopUpEspecifico();
            }}
          ></div>
          <div className="frentePopUpAddProductEspecificoInventario">
            <h3>Adicionar produto especifico</h3>
            <div className="cellFrentePopUpEspecifico">
              {await this.createAtributosInputs()}
            </div>
            <div className="cellFrentePopUpEspecifico" onClick={async () => {await this.finalizarInserirEspecifico()}}>
              <h2 className="saveProdutoEspecifico">
                Guardar produto especifico
              </h2>
            </div>
          </div>
        </div>,
        <span
          className="addProdutoEspecificoInventario"
          onClick={() => {
            this.openPopUpEspecifico();
          }}
        >
          Adicionar inventário produto especifico
        </span>,
        result,
      ],
      this.refInventario.current
    );
    // return result;
  }

  async alterarPreco(id_especifico, nameInput) {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    console.log(nameInput);

    let preco = document.getElementsByName(nameInput)[0].value;

    let res = false;

    if (preco != "" && preco != 0) {
      res = await alterarPrecoEspecifico(info.token, id_especifico, preco);
    }

    if (res != false) {
      console.log("Preço Trocado com sucesso");
    } else {
      console.log("Erro ao alterar Preço");
    }
  }

  async createAtributosInputs() {

    console.log("oi")

    let produto = await getProduto(this.state.productId)
    let subcategoria = await getSubCategoria(produto.subcategoria)

    console.log(subcategoria)
    let result = [];

    result.push(
      <div className="inputBlockProductEspecificoCell">
        <h6>Preço</h6>
        <input type="number" placeholder="Preço" name="PrecoInserir" required defaultValue="5.00" min="0.01" step="0.01" />
      </div>
    );

    for (let i = 0; i < subcategoria.atributos.length; i++) {
      let atributo = await getAtributo(subcategoria.atributos[i])
      // console.log(atributo)

      let resultValores = []

      for (let k = 0; k < atributo.valores.length; k++){
        resultValores.push(<option value={atributo.valores[k]}>{atributo.valores[k]}</option>)
      }

      let atributosEspecifico = this.state.atributosEspecifico

      atributosEspecifico.push(atributo._id)

      result.push(
        <div className="inputBlockProductEspecificoCell">
          <h6>{atributo.nome}</h6>
          <select name={atributo._id} id="">
            {resultValores}
          </select>
        </div>
      );
    }

    return result;
  }

  async finalizarInserirEspecifico(){

    let info = JSON.parse(localStorage.getItem('baylitInfo'))

    let atributosEspecifico = this.state.atributosEspecifico

    let caracteristicas = []

    for (let i = 0; i < atributosEspecifico.length; i++){

      // console.log(document.getElementsByName(atributosEspecifico[i])[0].value)

      caracteristicas.push({atributo:atributosEspecifico[i], valor:document.getElementsByName(atributosEspecifico[i])[0].value})

    }

    let preco = document.getElementsByName('PrecoInserir')[0].value

    // console.log(caracteristicas)
    // console.log(preco)

    let res = await adicionarProdutoEspecifico(info.id, info.token, this.state.productId, preco, caracteristicas)

    console.log(res)
    if (res != false){
      window.location.reload()
    } else {
      console.log("Deu erro ao Adicionar Produto Especifico")
    }

  }

  openPopUpEspecifico() {
    this.refPopUpEspecifico.current.style.display = "initial";
  }

  closePopUpEspecifico() {
    this.refPopUpEspecifico.current.style.display = "none";
  }

  async componentDidMount() {
    await this.createProdutoEspecifico();
  }

  render() {
    return (
      <div ref={this.refInventario} className="mainProductInventario"></div>
    );
  }
}

export default ProductInventario;
