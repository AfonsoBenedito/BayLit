import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./Products.css";
import ProductsCard from "./ProductsCard/ProductsCard";
import AddProduct from "../../Components/AddProduct/AddProduct";
import CloseDivButton from "../../Components/CloseDivButton/CloseDivButton";
import AddSaveButtonProduct from "../../Components/AddSaveButtonProduct/AddSaveButtonProduct";

import ReactDOM from "react-dom";
import { getProdutosByFornecedor } from "../../../Helpers/FornecedorHelper";
import {
  getCategoria,
  getCategoriaByName,
  getSubCategoriaByName,
  getRecursos,
  getTiposPoluicao
} from "../../../Helpers/CategoryHelper";
import { getSubCategoria } from "../../../Helpers/CategoryHelper";
import { getCategorias } from "../../../Helpers/CategoryHelper";
import { getSubCategoriasByCategoria } from "../../../Helpers/CategoryHelper";
import { adicionarProduto } from "../../../Helpers/FornecedorHelper";
import { deleteProduto } from "../../../Helpers/FornecedorHelper";
import { Link } from "react-router-dom";

class Products extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deleteId: null,
    };

    this.refProduto = React.createRef();
    this.refCategorias = React.createRef();
    this.refSubCategorias = React.createRef();
    this.refRecursosTipo = React.createRef();
    this.refRecursos = React.createRef();
    this.refProducaoTipo = React.createRef();
    this.refPoluicao = React.createRef();
    this.refPoluicaoNivel = React.createRef();
    this.refListRecursos = React.createRef();

    this.addSubCategoriesToSelect = this.addSubCategoriesToSelect.bind(this);
    this.addRecursosToSelect = this.addRecursosToSelect.bind(this);
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

  async addTipoProducaoToSelect() {
    let tiposProducao = ["Orgânica", "Biológica", "Sintética"]
    
    let listOfTipos = [];
    for (let tipo of tiposProducao) {
      let nome = tipo;
      listOfTipos.push(
        <option
          className="optionColor"
          value={nome}
        >
          {nome}
        </option>
      );
    }
    ReactDOM.render(listOfTipos, this.refProducaoTipo.current);
  }
  
  async addTiposRecursoToSelect() {
    let tiposRecurso = await getRecursos();
    if (tiposRecurso != false) {
      let listOfTipos = [];
      for (let tipo in tiposRecurso) {
        let nome = tipo;
        listOfTipos.push(
          <option
            className="optionColor"
            value={nome}
          >
            {nome}
          </option>
        );
      }
      ReactDOM.render(listOfTipos, this.refRecursosTipo.current);
    }
  }

  async addRecursosToSelect() {
    let options = document.getElementById("addProducaoInputTipoRecursos").value;
    // let catID = options[selectedIndex].id;
    let allRecursosTipos = await getRecursos();
    let allRecursos = allRecursosTipos[options]
    // let allSubCategorias = await getSubCategoriasByCategoria(this.state.categoriaSelecionada);
    if (allRecursos != false) {
      let listOfRecursos = [];
      for (let recurso in allRecursos) {
        let nome = recurso;
        listOfRecursos.push(
          <option className="optionColor" value={nome}>
            {nome}
          </option>
        );
      }
      ReactDOM.render(listOfRecursos, this.refRecursos.current);
    }
  }

  async addRecursos(e) {
    e.preventDefault()
    let recurso = document.getElementById("addProducaoInputRecursos").value;
    let quantidade = document.getElementById("addProducaoInputQuantidadeRecursos").value;
    // let catID = options[selectedIndex].id;
    
    let novos_recursos
    if (this.refListRecursos) {
      novos_recursos = this.refListRecursos.state + "<p>" + recurso + " – " + quantidade + "</p>"
    } else {
      novos_recursos = "<p>" + recurso + " – " + quantidade + "</p>"
    }
    
    ReactDOM.render(novos_recursos, this.refListRecursos.state);
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

  async addTiposPoluicaoToSelect() {
    let tiposPoluicao = await getTiposPoluicao();
    if (tiposPoluicao != false) {
      let listOfTipos = [];
      for (let tipo of tiposPoluicao) {
        let nome = tipo;
        listOfTipos.push(
          <option
            className="optionColor"
            value={nome}
          >
            {nome}
          </option>
        );
      }
      ReactDOM.render(listOfTipos, this.refPoluicao.current);
    }
  }

  async addNiveisPoluicaoToSelect() {
    let tiposPoluicao = ["Residual", "Marginal", "Moderada", "Severa", "Critica"]
    if (tiposPoluicao != false) {
      let listOfTipos = [];
      for (let tipo of tiposPoluicao) {
        let nome = tipo;
        listOfTipos.push(
          <option
            className="optionColor"
            value={nome}
          >
            {nome}
          </option>
        );
      }
      ReactDOM.render(listOfTipos, this.refPoluicaoNivel.current);
    }
  }

  async displayProducts() {
    let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));
    let fornecedorID = baylitInfo.id;
    let produtosResultado = await getProdutosByFornecedor(fornecedorID);
    if (produtosResultado != false) {
      let listOfProducts = [];
      for (let produto in produtosResultado) {
        let nome = produtosResultado[produto].nome;
        let informacao_adicional = produtosResultado[produto].informacao_adicional;

        let categoriaID = produtosResultado[produto].categoria;
        let categoria = await getCategoria(categoriaID);
        let categoriaNome = categoria.nome;

        let subcategoriaID = produtosResultado[produto].subcategoria;
        let subcategoria = await getSubCategoria(subcategoriaID);
        let subcategoriaNome = subcategoria.nome;

        let productId = produtosResultado[produto]._id;
        let foto = produtosResultado[produto].fotografia;
        // let descricao = produtosResultado[produto].nome;
        // console.log(nome);
        listOfProducts.push(
          <ProductsCard
            // descricao = {descricao}
            productId={productId}
            informacao_adicional={informacao_adicional}
            nome={nome}
            categoria={categoriaNome}
            subcategoria={subcategoriaNome}
            foto={foto}
            backgroundCard="promotionNext"
            removeProduct={this.removeProduct}
            idClose={productId}
          />
        );
        // listOfProducts.push(<Link exact="true" to="/SpecificProduct"><ProductsCard backgroundCard="promotionAtive" removeProduct={this.removeProduct}/></Link>);
      }
      ReactDOM.render(listOfProducts, this.refProduto.current);
    }
  }

  addProduct() {
    var addProductDiv = document.getElementById("addProductDiv");
    var addProducaoDiv = document.getElementById("addProducaoDiv");
    var addLocalDiv = document.getElementById("addLocalProducaoDiv");
    //console.log(addProductDiv.style.display);

    if (addProductDiv.style.display === "block") {
      addProductDiv.style.display = "none";
      addProducaoDiv.style.display = "none";
      addLocalDiv.style.display = "none";
    } else {
      addProductDiv.style.display = "block";
      addProducaoDiv.style.display = "block";
      addLocalDiv.style.display = "block";
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
      deleteId: e.nativeEvent.srcElement.id,
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
    // console.log(produto);
    if (data != null) {
      let fornecedorToken = data.token;
      let a = await deleteProduto(fornecedorToken, idProduto);
      window.location.href = "/dashboard/Products";
    }
  }

  async componentDidMount() {
    await this.displayProducts();
    await this.addCategoriesToSelect();
    await this.addSubCategoriesToSelect();
    await this.addTiposRecursoToSelect();
    await this.addRecursosToSelect();
    await this.addTipoProducaoToSelect();
    await this.addTiposPoluicaoToSelect();
    await this.addNiveisPoluicaoToSelect();
  }

  render() {
    return (
      <div className="mainProducts">
        <div className="topBlockProducts">
          <h2 className="mainPath">Produtos</h2>

          <AddProduct
            id="addProductMainButton"
            name="Adicionar Produto"
            theme="light"
            addProduct={this.addProduct}
          />

          <div className="addForms">
            <div className="addProductDiv" id="addProductDiv">
              <h3>Produto</h3>
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
                  multiple="multiple"
                />
              </form>
            </div>
            <p id="productInfo"></p>
            <p id="productInfoError"></p>

            <div className="addProducaoDiv" id="addProducaoDiv">
              <h3>Produção</h3>
              <form id="addProducaoForm">
                <p className="addProducaoP">Tipo</p>
                <select
                  ref={this.refProducaoTipo}
                  id="addProducaoInputTipo"
                  className="addProducaoInput"
                  type="text"
                  placeholder="Tipo de Produção (Orgânica, Biológica ou Intensiva)"
                  name="addProducaoInputTipo"
                ></select>
                <p className="addProducaoP">Recursos</p>
                <select
                  onChange={this.addRecursosToSelect}
                  ref={this.refRecursosTipo}
                  id="addProducaoInputTipoRecursos"
                  className="addProducaoInput"
                  type="text"
                  placeholder="Tipo de Recurso"
                  name="addProducaoInputTipoRecursos"
                ></select>
                <select
                  ref={this.refRecursos}
                  id="addProducaoInputRecursos"
                  className="addProducaoInput"
                  type="text"
                  placeholder="Recurso"
                  name="addProducaoInputRecursos"
                ></select>
                <input
                  id="addProducaoInputQuantidadeRecursos"
                  className="addProducaoInput"
                  type="text"
                  placeholder="Quantidade do Recurso utilizado"
                  name="addProducaoInputQuantidadeRecursos"
                />
                <p>Unidade de medida: g</p>
                <button onClick={this.addRecursos}>Adiciona Recurso</button>
                <hr />
                <div className="listRecursos" ref={this.refListRecursos}></div>
                <p className="addProducaoP">Poluição</p>
                <select
                  ref={this.refPoluicao}
                  id="addProducaoInputPoluicao"
                  className="addProducaoInput"
                  type="text"
                  placeholder="Tipo de Poluição"
                  name="addProducaoInputPoluicao"
                ></select>
                <select
                  ref={this.refPoluicaoNivel}
                  id="addProducaoInputPoluicao"
                  className="addProducaoInput"
                  type="text"
                  placeholder="Nivel de Poluição"
                  name="addProducaoInputPoluicao"
                ></select>
                <button onClick={this.addPoluicao}>Adiciona Poluição</button>
                <hr />

              </form>
            </div>
            <div className="addLocalProducaoDiv" id="addLocalProducaoDiv">
              <h3>Local de Produção</h3>
              <form id="addLocalForm">
                <p className="addLocalP">Morada</p>
                <input
                  id="addLocalInputMorada"
                  className="addLocalInput"
                  type="text"
                  placeholder="Morada"
                  name="addLocalInputMorada"
                />
                <p className="addLocalP">Localidade</p>
                <input
                  id="addLocalInputLocalidade"
                  className="addLocalInput"
                  type="text"
                  placeholder="Localidade"
                  name="addLocalInputLocalidade"
                />
                <p className="addLocalP">País</p>
                <input
                  id="addLocalInputPais"
                  className="addLocalInput"
                  type="text"
                  placeholder="País"
                  name="addLocalInputPais"
                />
                <p className="addLocalP">Cód. Postal</p>
                <input
                  id="addLocalInputPostal"
                  className="addLocalInput"
                  type="text"
                  placeholder="Código Postal"
                  name="addLocalInputPostal"
                />
              </form>
            </div>
          </div>
          <AddSaveButtonProduct
              name="Adicionar"
              theme="light"
              addSaveButtonProduct={this.closeAPDivButton}
            />



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
              onClick={async () => {
                await this.removerProdutoDefinitivo();
              }}
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

export default Products;
