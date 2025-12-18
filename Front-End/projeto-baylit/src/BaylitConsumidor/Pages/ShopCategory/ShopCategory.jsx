import React, { Component } from "react";
import "./ShopCategory.css";
import FilterButton from "../../Components/FilterButton/FilterButton";
import { withRouter } from "react-router";
import { useParams } from "react-router-dom";

import ReactDOM from "react-dom";

import Product from "../../Components/Product/Product";
import AllFiltersButtons from "../../Components/AllFilterButtons/AllFilterButtons";
import {
  getCadeiaByProduto,
  getProdutosByCategoria,
} from "../../../Helpers/ProdutoHelper";
import {
  getCategoria,
  getSubCategoriasByCategoria,
  getAtributo,
  getSubCategoria,
} from "../../../Helpers/CategoryHelper";

import { pesquisa } from "../../../Helpers/ProdutoHelper";

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class ShopCategory extends Component {
  constructor(props) {
    super(props);

    console.log(this.props.params);
    let { categoryId, subcategoryId } = this.props.params;

    this.state = {
      categoryName: "",
      allSubCategories: [],
      allFilters: [],

      categoryId: categoryId,
      categoryName: "CategoriaNome",

      subcategoryId: subcategoryId,
      subcategoryName: "SubcategoriaNome",
      subcategoriaAtributos: null,

      filtrosNome: [],
      atributosTudo: [],
    };

    this.refSubcategorias = React.createRef();
    this.refFiltros = React.createRef();
    this.refLocalSubcategorias = React.createRef();
    this.refTitulo = React.createRef();

    this.refProdutos = React.createRef();

    this.verificarFiltros = this.verificarFiltros.bind(this);
  }

  showAllSubCategories = () => {
    document.getElementById("showAllSubCategories").style.display = "none";
    document.getElementById("hiddenAllSubCategories").style.display =
      "inline-block";

    document.getElementsByClassName("gridSubcategories")[0].style.height =
      "fit-content";
  };

  hideAllSubCategories = () => {
    document.getElementById("showAllSubCategories").style.display =
      "inline-block";
    document.getElementById("hiddenAllSubCategories").style.display = "none";

    document.getElementsByClassName("gridSubcategories")[0].style.height =
      "var(--heightGrid)";
  };

  async getCategoryInfo() {
    let categoria = await getCategoria(this.state.categoryId);

    this.setState({
      categoryName: categoria.nome,
    });

    document.getElementById("categoryPath").innerHTML =
      "> <a className='toLink' href='/Shop/" +
      this.state.categoryId +
      "'>" +
      categoria.nome +
      "</a>";

    ReactDOM.render(this.state.categoryName, this.refTitulo.current);
  }

  async getSubcategoryInfo() {
    let categoria = await getCategoria(this.state.categoryId);
    let subcategoria = await getSubCategoria(this.state.subcategoryId);

    this.setState({
      categoryName: categoria.nome,
      subcategoryName: subcategoria.nome,
      subcategoriaAtributos: subcategoria.atributos,
    });

    document.getElementById("categoryPath").innerHTML =
      "> <a className='toLink' href='/Shop/" +
      this.state.categoryId +
      "'>" +
      categoria.nome +
      "</a> > <a className='toLink' href='/Shop/" +
      this.state.categoryId +
      "/" +
      this.state.subcategoryId +
      "'>" +
      subcategoria.nome +
      "</a>";

    ReactDOM.render(this.state.subcategoryName, this.refTitulo.current);
  }

  async displaySubcategorias() {
    let subcategorias = await getSubCategoriasByCategoria(
      this.state.categoryId
    );

    let subcategoriasDisplay = [];

    //console.log(subcategorias)

    for (let i = 0; i < subcategorias.length; i++) {
      let subcategoria = subcategorias[i];
      //console.log(subcategoria)

      let tempHref = "/Shop/" + this.state.categoryId + "/" + subcategoria._id;
      let tempDisplay = (
        <a className="toLink" href={tempHref}>
          <div class="blockCategoryImageSC"><img src={subcategoria.fotografia} alt="" /></div>
          <h6>{subcategoria.nome}</h6>
        </a>
      );

      subcategoriasDisplay.push(tempDisplay);
    }

    ReactDOM.render(subcategoriasDisplay, this.refSubcategorias.current);
  }

  async displayFiltrosCategoria() {
    let subcategorias = await getSubCategoriasByCategoria(
      this.state.categoryId
    );

    let filtrosNome = [];

    let filtros = {};

    let atributosSubcategoria = [];

    for (let i = 0; i < subcategorias.length; i++) {
      let subcategoria = subcategorias[i];

      for (let k = 0; k < subcategoria.atributos.length; k++) {
        let atributo = await getAtributo(subcategoria.atributos[k]);

        // console.log(atributo)

        if (!filtrosNome.includes(atributo.nome)) {
          //Criar Filtro
          filtros[atributo.nome] = atributo.valores;

          filtrosNome.push(atributo.nome);

          atributosSubcategoria.push(atributo);
        }
      }
    }

    this.setState({
      filtrosNome: filtrosNome,
      atributosTudo: atributosSubcategoria,
    });

    this.startStorageFiltros();
    // console.log(filtros)

    ReactDOM.render(
      <form id="filtrosForms">
        <AllFiltersButtons
          filters={filtros}
          verificarFiltros={this.verificarFiltros}
        />
      </form>,
      this.refFiltros.current
    );
  }

  async verificarFiltros() {
    console.log("ehehehhehe");
    let filtrosStorage = JSON.parse(
      sessionStorage.getItem("baylitFiltros")
    ).filtros;

    let filtrosPesquisa = [];

    for (let i = 0; i < filtrosStorage.length; i++) {
      if (filtrosStorage[i].atributo == this.state.atributosTudo[i].nome) {
        if (filtrosStorage[i].valores.length != 0) {
          filtrosPesquisa.push({
            atributo: this.state.atributosTudo[i]._id,
            valores: filtrosStorage[i].valores,
          });
        }
      }
    }

    let produtos;

    if (this.state.subcategoryId) {
      produtos = await pesquisa(
        null,
        this.state.subcategoryId,
        null,
        null,
        null,
        filtrosPesquisa
      );
    } else {
      produtos = await pesquisa(
        this.state.categoryId,
        null,
        null,
        null,
        null,
        filtrosPesquisa
      );
    }

    let produtosAppend = [];

    for (let i = 0; i < produtos.length; i++) {
      let subcategoria = await getSubCategoria(produtos[i].subcategoria);

      let produtoTemp = (
        <Product
          srcProduct={produtos[i].fotografia[0]}
          nivelSustentabilidade={Math.round(produtos[i].cadeia.rating)}
          nivelProducao={Math.round(produtos[i].cadeia.producao.classificacao)}
          nivelArmazenamento={Math.round(produtos[i].cadeia.armazenamento.classificacao)}
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

    ReactDOM.render(produtosAppend, this.refProdutos.current);
  }

  async displayFiltrosSubcategoria() {
    let filtros = {};
    let filtrosNome = [];

    let atributosSubcategoria = [];

    for (let i = 0; i < this.state.subcategoriaAtributos.length; i++) {
      let atributo = await getAtributo(this.state.subcategoriaAtributos[i]);

      atributosSubcategoria.push(atributo);

      filtros[atributo.nome] = atributo.valores;

      filtrosNome.push(atributo.nome);
    }

    this.setState({
      filtrosNome: filtrosNome,
      atributosTudo: atributosSubcategoria,
    });

    this.startStorageFiltros();

    ReactDOM.render(
      <AllFiltersButtons
        filters={filtros}
        verificarFiltros={this.verificarFiltros}
      />,
      this.refFiltros.current
    );
  }

  // async displayProducts(){
  //   let produtos = await getProdutosByCategoria(this.state.categoryId)
  //   if (produtos != false){

  //     let produtosAppend = []

  //     for (let produto in produtos){

  //       let cadeia = await getCadeiaByProduto(produto._id)

  //       produtosAppend.push(<Product srcProduct={produto.fotografia[0]} descProduct={produto.informacao_adicional}/>)

  //     }

  //   } else {
  //     console.log("Erro de Display")
  //   }
  // }

  async displayPaginaCategoria() {
    ReactDOM.render(
      <div>
        <div ref={this.refSubcategorias} class="gridSubcategories"></div>

        <div className="toAlignShowHide">
          <div
            class="toActiveFunction"
            onClick={() => {
              this.showAllSubCategories();
            }}
          >
            <FilterButton
              id="showAllSubCategories"
              addClass=""
              name="Ver mais"
              leftIcon="bi bi-eye"
            />
          </div>
          <div
            class="toActiveFunction"
            onClick={() => {
              this.hideAllSubCategories();
            }}
          >
            <FilterButton
              id="hiddenAllSubCategories"
              addClass=""
              name="Ver menos"
              leftIcon="bi bi-eye-slash"
            />
          </div>
        </div>
      </div>,
      this.refLocalSubcategorias.current
    );
  }

  async displayProdutosInicial(pesquisaTipo, id) {
    let produtos;

    if (pesquisaTipo == "Categorias") {
      produtos = await pesquisa(id, null, null, null, null, null);
    } else if (pesquisaTipo == "Subcategorias") {
      produtos = await pesquisa(null, id, null, null, null, null);
    }

    let produtosAppend = [];

    for (let i = 0; i < produtos.length; i++) {
      let subcategoria = await getSubCategoria(produtos[i].subcategoria);

      let produtoTemp = (
        <Product
          srcProduct={produtos[i].fotografia[0]}
          nivelSustentabilidade={Math.round(produtos[i].cadeia.rating)}
          nivelProducao={Math.round(produtos[i].cadeia.producao.classificacao)}
          nivelArmazenamento={Math.round(produtos[i].cadeia.armazenamento.classificacao)}
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

    ReactDOM.render(produtosAppend, this.refProdutos.current);
  }

  startStorageFiltros() {
    sessionStorage.removeItem("baylitFiltros");

    // console.log(this.state.filtros)

    let filtrosAppend = [];

    for (let i = 0; i < this.state.filtrosNome.length; i++) {
      filtrosAppend.push({
        atributo: this.state.filtrosNome[i],
        valores: [],
      });
    }

    let filtrosIniciais = {
      filtros: filtrosAppend,
    };

    sessionStorage.setItem("baylitFiltros", JSON.stringify(filtrosIniciais));
  }

  async componentDidMount() {
    //document.getElementById("categoryPath").innerText = "> Categoria";

    // this.startStorageFiltros()

    if (this.state.subcategoryId) {
      await this.getSubcategoryInfo();

      await this.displayFiltrosSubcategoria();

      await this.displayProdutosInicial(
        "Subcategorias",
        this.state.subcategoryId
      );
    } else {
      this.displayPaginaCategoria();

      await this.displaySubcategorias();

      await this.getCategoryInfo();

      await this.displayFiltrosCategoria();

      await this.displayProdutosInicial("Categorias", this.state.categoryId);
    }

    // this.startStorageFiltros()
  }

  render() {
    return (
      <>
        <h1 class="titleSectionShop" ref={this.refTitulo}></h1>

        <div ref={this.refLocalSubcategorias}></div>

        {/* <div ref={this.refSubcategorias} class="gridSubcategories">
          
        </div>

        <div className="toAlignShowHide">
          <div
            class="toActiveFunction"
            onClick={() => {
              this.showAllSubCategories();
            }}
          >
            <FilterButton
              id="showAllSubCategories"
              addClass=""
              name="Ver mais"
              leftIcon="bi bi-eye"
            />
          </div>
          <div
            class="toActiveFunction"
            onClick={() => {
              this.hideAllSubCategories();
            }}
          >
            <FilterButton
              id="hiddenAllSubCategories"
              addClass=""
              name="Ver menos"
              leftIcon="bi bi-eye-slash"
            />
          </div>
        </div> */}
        <div class="separateLine" />
        {/* <button
          onClick={async () => {
            await this.verificarFiltros();
          }}
        >
          {" "}
          Pesquisar{" "}
        </button> */}
        <div ref={this.refFiltros} className="toAlignFilters">
          {/* <AllFiltersButtons /> */}
        </div>
        <div ref={this.refProdutos} className="productsDisplayer">
          {/* <Product />
          <Product />
          <Product />
          <Product />
          <Product />
          <Product />
          <Product />
          <Product />
          <Product />
          <Product /> */}
        </div>
      </>
    );
  }
}

// export default ShopCategory;
export default withParams(ShopCategory);
