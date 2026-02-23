import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./WarehouseProducts.css";
import WarehouseProductsCard from "./WarehouseProductsCard/WarehouseProductsCard";
import AddProduct from "../../Components/AddProduct/AddProduct";
import CloseDivButton from "../../Components/CloseDivButton/CloseDivButton";
import AddSaveButtonProduct from "../../Components/AddSaveButtonProduct/AddSaveButtonProduct";

import ReactDOM from "react-dom";
import { getProdutoEspecifico, getProdutosByFornecedor } from "../../../Helpers/FornecedorHelper";
import {
  getCategoria,
  getCategoriaByName,
  getSubCategoriaByName,
} from "../../../Helpers/CategoryHelper";
import { getSubCategoria } from "../../../Helpers/CategoryHelper";
import { getCategorias } from "../../../Helpers/CategoryHelper";
import { getSubCategoriasByCategoria } from "../../../Helpers/CategoryHelper";
import { adicionarProduto, getArmazemById, getProduto } from "../../../Helpers/FornecedorHelper";
import { deleteProduto } from "../../../Helpers/FornecedorHelper";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import { AuthVerificationDashboard } from "../../../Helpers/AuthVerification";

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class WarehouseProducts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      armazemId: this.props.params.idArmazem,
      deleteId: null
    };

    this.refProduto = React.createRef();
    this.refCategorias = React.createRef();
    this.refSubCategorias = React.createRef();

    this.addSubCategoriesToSelect = this.addSubCategoriesToSelect.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
    this.removerProdutoDefinitivo = this.removerProdutoDefinitivo.bind(this);
    
    
  }

  async addCategoriesToSelect() {
    let allCategorias = await getCategorias();
    if (allCategorias != false) {
      let listOfCategorias = [];
      for (let categoria in allCategorias) {
        let nome = allCategorias[categoria].nome;
        listOfCategorias.push(
          <option
            className="optionColor"
            id={allCategorias[categoria]._id}
            value={nome}
          >
            {nome}
          </option>
        );
      }
      ReactDOM.render(listOfCategorias, this.refCategorias.current);
    }
  }

  async addSubCategoriesToSelect() {
    let options = document.getElementById("addProdutoInputCategoria").value;
    // let catID = options[selectedIndex].id;
    let categoria = await getCategoriaByName(options);
    let categoriaID = categoria._id;
    let allSubCategorias = await getSubCategoriasByCategoria(categoriaID);
    // let allSubCategorias = await getSubCategoriasByCategoria(this.state.categoriaSelecionada);
    if (allSubCategorias != false) {
      let listOfSubCategorias = [];
      for (let subcategoria in allSubCategorias) {
        let nome = allSubCategorias[subcategoria].nome;
        listOfSubCategorias.push(
          <option className="optionColor" value={nome}>
            {nome}
          </option>
        );
      }
      ReactDOM.render(listOfSubCategorias, this.refSubCategorias.current);
    }
  }

  async displayProducts() {
    let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));
    let fornecedorID = baylitInfo.id;
    let token = baylitInfo.token;
    let id_armazem = this.state.armazemId;
    let armazem = await getArmazemById(fornecedorID, token, id_armazem);
    let inventario = armazem[0].inventario;

    //MUDAR PARA await getProdutosByArmazém(armazemID);
    if (inventario != false) {
      let listOfProducts = [];
      for (let produto in inventario) {
        let quantidade = inventario[produto].quantidade;
        let produtoEspecificoId = inventario[produto].produto;
        let produtoEspecifico = await getProdutoEspecifico(produtoEspecificoId);

        if(produtoEspecifico){
          let especificidade = produtoEspecifico.especificidade;
          let produtoId = produtoEspecifico.produto;
          let produtoGeral = await getProduto(produtoId);
          let foto = produtoGeral.fotografia;
          listOfProducts.push(
            <WarehouseProductsCard
              especificidade = {especificidade}
              foto = {foto}
              quantidade = {quantidade}
              backgroundCard="promotionNext"
            />
          );
        }
        // listOfProducts.push(<Link exact="true" to="/SpecificProduct"><ProductsCard backgroundCard="promotionAtive" removeProduct={this.removeProduct}/></Link>);
      }
      ReactDOM.render(listOfProducts, this.refProduto.current);
    }
  }

  addProduct() {
    var addProductDiv = document.getElementById("addProductDiv");

    if (addProductDiv.style.display === "block") {
      addProductDiv.style.display = "none";
    } else {
      addProductDiv.style.display = "block";
    }
  }

  async closeAPDivButton() {
    var addProductDiv = document.getElementById("addProductDiv");

    if (addProductDiv.style.display === "none") {
      addProductDiv.style.display = "block";
    } else {
      addProductDiv.style.display = "none";
    }

    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    if (data != null) {
      let fornecedorID = data.id;
      let fornecedorToken = data.token;
      let form = new FormData(document.getElementById("addProductForm"));

      let nome = form.get("addProdutoInputNome");

      let categoria = form.get("addProdutoInputCategoria");
      let categoriaByName = await getCategoriaByName(categoria);
      let categoriaID = categoriaByName._id;

      let subcategoria = form.get("addProdutoInputSubCategoria");
      let subcategoriaByName = await getSubCategoriaByName(
        categoriaID,
        subcategoria
      );
      let subcategoriaID = subcategoriaByName._id;

      let adicionalInfo = form.get("addProdutoInputAdicionalInfo");
      let foto = document.getElementById("addProdutoInputFoto").files[0];
      // let foto = form.get("photo_from_user");

      let res = await adicionarProduto(
        fornecedorID,
        fornecedorToken,
        nome,
        categoriaID,
        subcategoriaID,
        adicionalInfo,
        foto
      );

      if (res != false) {
        document.getElementById("productInfo").innerHTML =
          "Produto foi bem adicionado";
        document.getElementById("productInfoError").style.display = "none";
        document.getElementById("productInfo").style.display = "block";
        // await this.displayProducts();
        window.location.href = "/Products";
      } else {
        document.getElementById("productInfoError").innerHTML =
          "Armazém não foi bem adicionado";
        document.getElementById("productInfo").style.display = "none";
        document.getElementById("productInfoError").style.display = "block";
      }
    }
  }

  removeProduct(e) {
    var removeProductDiv = document.getElementById("removeProductDiv");
    this.setState({
      deleteId: e.nativeEvent.srcElement.id
    });
    if (removeProductDiv.style.display === "block") {
      removeProductDiv.style.display = "none";
    } else {
      removeProductDiv.style.display = "block";
    }
  }

  closeRPDivButton() {
    var removeProductDiv = document.getElementById("removeProductDiv");

    if (removeProductDiv.style.display === "none") {
      removeProductDiv.style.display = "block";
    } else {
      removeProductDiv.style.display = "none";
    }
  }

  async removerProdutoDefinitivo() {
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    // let produto = document.getElementById("removeProductDivOptionYes");
    let idProduto = this.state.deleteId;
    if (data != null) {
      let fornecedorToken = data.token;
      let a = await deleteProduto(fornecedorToken, idProduto);
      window.location.href = "/dashboard/Products";
    }
  }

  async componentDidMount() {
    await AuthVerificationDashboard();
    await this.displayProducts();
    await this.addCategoriesToSelect();
    await this.addSubCategoriesToSelect();
  }

  render() {
    return (
      <div className="mainProducts">
        <div className="topBlockProducts">
          <h2 className="mainPath">Produtos do Armazém</h2>

          <AddProduct
            id="addProductMainButton"
            name="Adicionar Produto"
            theme="light"
            addProduct={this.addProduct}
          />

          <div className="addProductDiv" id="addProductDiv">
            <form id="addProductForm">
              <p className="addProdutoP">Nome do produto</p>
              <input
                id="addProdutoInputNome"
                className="addProdutoInput"
                type="text"
                placeholder="Nome do Produto"
                name="addProdutoInputNome"
              />
              <p className="addProdutoP">Categoria</p>
              <select
                onChange={this.addSubCategoriesToSelect}
                ref={this.refCategorias}
                id="addProdutoInputCategoria"
                className="addProdutoInput"
                type="text"
                placeholder="Categoria"
                name="addProdutoInputCategoria"
              ></select>
              <p className="addProdutoP">Sub-Categoria</p>
              <select
                ref={this.refSubCategorias}
                id="addProdutoInputSubCategoria"
                className="addProdutoInput"
                type="text"
                placeholder="Sub-Categoria"
                name="addProdutoInputSubCategoria"
              ></select>
              <p className="addProdutoP">Informação adicional</p>
              <input
                id="addProdutoInputAdicionalInfo"
                className="addProdutoInput"
                type="text"
                placeholder="Informação adicional"
                name="addProdutoInputAdicionalInfo"
              />
              <p className="addProdutoP">Foto</p>

              <input
                id="addProdutoInputFoto"
                type="file"
                name="photo_from_user"
                className="photo_from_user"
                accept="image/png, image/gif, image/jpeg"
              />
            </form>
            <AddSaveButtonProduct
              name="Adicionar"
              theme="light"
              addSaveButtonProduct={this.closeAPDivButton}
            />
          </div>
          <p id="productInfo"></p>
          <p id="productInfoError"></p>
          {/* <button className="addEmployee">
            Adicionar funcionário
          </button> */}
          {/* <Link className="barLink" exact="true" to="/SpecificProduct"> */}
          <div ref={this.refProduto} className="productCardDiv">
            {/* <ProductsCard backgroundCard="promotionAtive" removeProduct={this.removeProduct}/>
            <ProductsCard backgroundCard="promotionAtive" removeProduct={this.removeProduct}/>
            <ProductsCard backgroundCard="promotionAtive" removeProduct={this.removeProduct}/>
            <ProductsCard backgroundCard="promotionAtive" removeProduct={this.removeProduct}/>
            <ProductsCard backgroundCard="promotionAtive" removeProduct={this.removeProduct}/>
            <ProductsCard backgroundCard="promotionAtive" removeProduct={this.removeProduct}/>
            <ProductsCard backgroundCard="promotionAtive" removeProduct={this.removeProduct}/>
            <ProductsCard backgroundCard="promotionAtive" removeProduct={this.removeProduct}/>
            <ProductsCard backgroundCard="promotionAtive" removeProduct={this.removeProduct}/>
            <ProductsCard backgroundCard="promotionAtive" removeProduct={this.removeProduct}/>
            <ProductsCard backgroundCard="promotionAtive" removeProduct={this.removeProduct}/>
            <ProductsCard backgroundCard="promotionAtive" removeProduct={this.removeProduct}/>
            <ProductsCard backgroundCard="promotionAtive" removeProduct={this.removeProduct}/>
            <ProductsCard backgroundCard="promotionAtive" removeProduct={this.removeProduct}/> */}
          </div>
          {/* </Link> */}

          <div className="removeProductDiv" id="removeProductDiv">
            <CloseDivButton
              name="X"
              theme="light"
              closeDivButton={this.closeRPDivButton}
            />
            <p className="removeProductQuestion">
              Tem a certeza que pretende remover o Produto?
            </p>
            <button
              className="removeProductDivOptionYes"
              onClick={async () => {await this.removerProdutoDefinitivo()}}
            >
              Sim
            </button>
            <button
              className="removeProductDivOptionNo"
              onClick={this.closeRPDivButton}
            >
              Não
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(WarehouseProducts);
