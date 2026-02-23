import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./SpecificProductPage.css";
import SpecificProduct from "./SpecificProduct/SpecificProduct";
import MainSpecificProduct from "./MainSpecificProduct/MainSpecificProduct";
import AddSpecificProduct from "../../Components/AddSpecificProduct/AddSpecificProduct";
import AddSaveButtonSpecificProduct from "../../Components/AddSaveButtonSpecificProduct/AddSaveButtonSpecificProduct";

import { getProdutoEspecificoByProduto } from "../../../Helpers/FornecedorHelper";
import { getProduto } from "../../../Helpers/FornecedorHelper";
import { getAtributo } from "../../../Helpers/CategoryHelper";
import { adicionarProdutoEspecifico } from "../../../Helpers/FornecedorHelper";
import { getAtributoBySubcategoria } from "../../../Helpers/CategoryHelper";

import { AuthVerificationDashboard } from "../../../Helpers/AuthVerification";

import { useParams } from "react-router-dom";

import ReactDOM from "react-dom";

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class SpecificProductPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productId: this.props.params.idProduto,
    };

    this.refProdutoEspecifico = React.createRef();
    this.refMainProduct = React.createRef();
    this.refFormProdutoEspecifico = React.createRef();

    this.displayMainSpecificProduct =
      this.displayMainSpecificProduct.bind(this);
    this.closeASPDivButton = this.closeASPDivButton.bind(this);
  }

  async displayMainSpecificProduct() {
    let produtosResultado = await getProduto(this.state.productId);
    let produtoNome = produtosResultado.nome;
    let mainProduct = [];

    mainProduct.push(<MainSpecificProduct nome={produtoNome} />);

    ReactDOM.render(mainProduct, this.refMainProduct.current);
  }

  async displaySpecificProducts() {
    let produtosResultado = await getProdutoEspecificoByProduto(
      this.state.productId
    );
    if (produtosResultado != false) {
      let listOfSpecificProducts = [];
      for (let produtoEspecifico in produtosResultado) {
        let preco = produtosResultado[produtoEspecifico].preco;
        let especificidade =
          produtosResultado[produtoEspecifico].especificidade;

        listOfSpecificProducts.push(
          <SpecificProduct
            preco={preco}
            especificidade={especificidade}
            backgroundCard="promotionNext"
            removeProduct={this.removeProduct}
          />
        );
      }
      ReactDOM.render(
        listOfSpecificProducts,
        this.refProdutoEspecifico.current
      );
    }
  }

  // async SpecificProductFormOptions(){

  // }

  async createSpecificProductForm() {
    let produtoResultado = await getProduto(this.state.productId);
    // console.log(produtoResultado);
    let produtoResultadoSubC = produtoResultado.subcategoria;
    // console.log(produtoResultadoSubC);

    let atributos = await getAtributoBySubcategoria(produtoResultadoSubC);
    // console.log(atributos);

    if (atributos != false) {
      let listOfAtributos = [];
      listOfAtributos.push(<p className="addSpecificProdutoP">Preço</p>);
      listOfAtributos.push(
        <input
          id="specificProductFormPreco"
          className="addSpecificProdutoInput"
          type="text"
          placeholder="Preço"
          name="specificProductFormPreco"
        />
      );

      for (let atributo in atributos) {
        // console.log(atributos[atributo]);
        let atributoNome = atributos[atributo].nome;
        // let ref = "refAtributo" + String(atributo);
        // this.ref = React.createRef();
        listOfAtributos.push(
          <p className="addSpecificProdutoP">{atributoNome}</p>
        );
        listOfAtributos.push(
          <input
            className="addSpecificProdutoInput"
            type="text"
            placeholder={atributoNome}
            name={atributoNome}
            id={atributoNome}
          ></input>
        );
      }

      // listOfAtributos.push(<p className="addSpecificProdutoP">Foto</p>);
      // listOfAtributos.push(
      //   <input
      //     type="file"
      //     name="photo_from_user"
      //     className="photo_from_user"
      //     accept="image/png, image/gif, image/jpeg"
      //   />
      // );
      ReactDOM.render(listOfAtributos, this.refFormProdutoEspecifico.current);
    }

    // let a = "AAAAAAA";
    // let listToRender = []
    // listToRender.push(a);
    // ReactDOM.render(listToRender, this.refAtributo0.current);
  }

  async closeASPDivButton() {
    var addSpecificProductFormDiv = document.getElementById(
      "addSpecificProductFormDiv"
    );

    if (addSpecificProductFormDiv.style.display === "none") {
      addSpecificProductFormDiv.style.display = "block";
    } else {
      addSpecificProductFormDiv.style.display = "none";
    }

    let data = JSON.parse(localStorage.getItem("baylitInfo"));

    if (data != null) {
      let fornecedorID = data.id;
      let fornecedorToken = data.token;
      let productId = this.state.productId;
      let form = new FormData(
        document.getElementById("addSpecificProductForm")
      );
      let preco = form.get("specificProductFormPreco");
      let produtosResultados = await getProduto(this.state.productId);
      let subcategoria = produtosResultados.subcategoria;
      let atributos = await getAtributoBySubcategoria(subcategoria);
      if (atributos != false) {
        let result = [];
        for (let atributoP in atributos) {
          let atributo = atributos[atributoP];
          let atributoID = atributo._id;
          // console.log(atributos[atributoP]);
          
          // let atributoValor = produtosResultado[atributoP].valor;
          let atributoList = await getAtributo(atributoID);
          let atributoNome = atributoList.nome;
          let atributoValor = form.get(atributoNome);
          let resultEste = { atributoID, atributoValor };
          result.push(resultEste);
        }
      

        await adicionarProdutoEspecifico(
          fornecedorID,
          fornecedorToken,
          productId,
          preco,
          result
        );
      }

      // NÃO APAGAR A LINHA A BAIXO! ESTÁ CORRETA!
    }
  }

  addSpecificProduct() {
    var addSpecificProductFormDiv = document.getElementById(
      "addSpecificProductFormDiv"
    );

    if (addSpecificProductFormDiv.style.display === "block") {
      addSpecificProductFormDiv.style.display = "none";
    } else {
      addSpecificProductFormDiv.style.display = "block";
    }
  }

  async componentDidMount() {
    await await AuthVerificationDashboard();

    await this.displaySpecificProducts();
    await this.displayMainSpecificProduct();
    await this.createSpecificProductForm();
  }

  render() {
    return (
      <div className="mainSpecificProductPage">
        <div className="topBlockSpecificProductPage">
          <h2 className="mainPath">Produto Específico</h2>
          <div ref={this.refMainProduct} className="mainSpecificProductBigDiv">
            {/* <MainSpecificProduct/> */}
          </div>
          <div className="addSpecificProductFormFDiv">
            <AddSpecificProduct
              name="Adicionar Produto Específico"
              theme="light"
              addSpecificProduct={this.addSpecificProduct}
            />
            <div
              id="addSpecificProductFormDiv"
              className="addSpecificProductFormDiv"
            >
              <form
                ref={this.refFormProdutoEspecifico}
                id="addSpecificProductForm"
              >
                <p className="addSpecificProdutoP">Preço</p>
                <input
                  id="specificProductFormPreco"
                  className="addSpecificProdutoInput"
                  type="text"
                  placeholder="Preço"
                  name="specificProductFormPreco"
                />
                <p className="addSpecificProdutoP">Características</p>
                <input
                  className="addSpecificProdutoInput"
                  type="text"
                  placeholder="Características"
                  name="mail"
                  id="mail"
                />
                {/* <p className="addSpecificProdutoP">Foto</p>
                <input
                  type="file"
                  name="photo_from_user"
                  className="photo_from_user"
                  accept="image/png, image/gif, image/jpeg"
                /> */}
              </form>
              <AddSaveButtonSpecificProduct
                name="Adicionar"
                theme="light"
                addSaveButtonSpecificProduct={this.closeASPDivButton}
              />
            </div>
          </div>

          <div
            ref={this.refProdutoEspecifico}
            className="specificProductsDiv"
          ></div>
        </div>
      </div>
    );
  }
}

export default withParams(SpecificProductPage);
