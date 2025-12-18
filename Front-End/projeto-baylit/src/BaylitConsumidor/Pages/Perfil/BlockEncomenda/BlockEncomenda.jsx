import React, { Component } from "react";

import { getLeaf } from "../../../Components/LeafSVG";
import "./BlockEncomenda.css";

import ReactDOM from "react-dom";

import { useParams } from "react-router-dom";
import { cancelarEncomenda, getEncomendaById } from "../../../../Helpers/EncomendasHelper";
import {
  getCadeiaByProduto,
  getLocalById,
  getProduto,
  getProdutoByEspecifico,
  getProdutoEspecifico,
} from "../../../../Helpers/ProdutoHelper";
import EncomendasPage from "../BlockPerfil/EncomendasPage/EncomendasPage";
import { getSubCategoria } from "../../../../Helpers/CategoryHelper";

function withSearch(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class BlockEncomenda extends Component {
  constructor(props) {
    super(props);

    let { idEncomenda } = this.props.params;
    this.cancelarEncomendaDisapear = this.cancelarEncomendaDisapear.bind(this);
    this.state = {
      idEncomenda: idEncomenda,
      dataEncomenda: "50/28/8888",
      dataEntrega: "50/28/8888",
      prazoCancelamento: "50/28/8888",
      localidadeMorada: "Lisboa",
      paisMorada: "Portugal",
      ruaMorada: "Rua LA LA LA Eu Sei Cantar n967 2dto",
      codPostalMorada: "1010-034",
      nomeTransporte: "Manuel Acácio B.F.",
      distTransporte: "200KM",
      consumoItemTransporte: "12.2L",
      emissaoItemTransporte: "120g",
      classificacaoTransporte: "3.3",
      estadoEncomenda: "",

      //   IMPORTANTE --> CHAVE DO DICIONARIO SÃO NUMERO INCREMENTADOS
      listaProdutos: {
        0: {
          src: "",
          nome: "Nome produto muito logondxahh ",
          subcategoria: "Subcategoria",
          atributos: ["Azul, L"],
          sustentabilidade: "3.6",
          quantidade: "10",
          precoTotal: "300",
        },
        1: {
          src: "",
          nome: "Nome produto2 dhhdwh",
          subcategoria: "Subcategoria",
          atributos: ["Amarelo, XXS"],
          sustentabilidade: "2.2",
          quantidade: "3",
          precoTotal: "10.99",
        },
      },
    };

    this.refPageEncomenda = React.createRef();
  }

  async getEncomendaInfo() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let result = await getEncomendaById(
      info.id,
      info.token,
      this.state.idEncomenda
    );

    let local = await getLocalById(
      info.id,
      info.token,
      result.local_entrega._id
    );

    // console.log(result);
    // console.log(result.produtos);

    local = local.local;

    let resListaProdutos = {};

    for (let i = 0; i < result.produtos.length; i++) {
      let produto = await getProdutoByEspecifico(result.produtos[i].produto);

      let produtoEspecifico = await getProdutoEspecifico(
        result.produtos[i].produto
      );

      let subcategoria = await getSubCategoria(produto.subcategoria);

      let cadeia = await getCadeiaByProduto(produto._id);

      // console.log(result);
      // console.log(local);
      // console.log(produto);
      // console.log(produtoEspecifico);
      // console.log(subcategoria);
      // console.log(cadeia);

      let valores = [];

      for (let k = 0; k < produtoEspecifico.especificidade.length; k++) {
        valores.push(produtoEspecifico.especificidade[k].valor + " ");
      }

      resListaProdutos[i] = {
        id: produto._id,
        src: produto.fotografia[0],
        nome: produto.nome,
        subcategoria: subcategoria.nome,
        sustentabilidade: cadeia.cadeia.rating,
        quantidade: result.produtos[i].quantidade,
        atributos: valores,
        precoTotal: cadeia.preco * result.produtos[i].quantidade,
      };
    }

    this.setState({
      dataEncomenda: result.data_encomenda,
      dataEntrega: result.data_entrega.slice(0, 10),
      prazoCancelamento: result.prazo_cancelamento,
      localidadeMorada: local.localidade,
      paisMorada: local.pais,
      ruaMorada: local.morada,
      codPostalMorada: local.cod_postal,
      nomeTransporte: result.transportador.nome,
      distTransporte: result.transporte.distancia,
      classificacaoTransporte: result.transporte.classificacao,
      estadoEncomenda: result.estado,

      listaProdutos: resListaProdutos,
    });

    // console.log(resListaProdutos);
  }

  createProdutos = () => {
    let result = [];

    let sizeOfPruducts = Object.keys(this.state.listaProdutos).length;
    // console.log(this.state.listaProdutos);
    for (let i = 0; i < sizeOfPruducts; i++) {
      result.push(
        <div class="produtoEncomenda">
          <div class="fotoProductEncomenda">
            <a href={"/Shop/Product/" + this.state.listaProdutos[i].id}><img src={this.state.listaProdutos[i].src} alt="produto baylit" loading="lazy" /></a>
          </div>
          <div class="nomeProductEncomenda">
          <a href={"/Shop/Product/" + this.state.listaProdutos[i].id}><h4>{this.state.listaProdutos[i].nome}</h4></a>
            <h5>{this.state.listaProdutos[i].subcategoria}</h5>
          </div>
          <div class="atributosProductEncomenda">
            <h4>{this.state.listaProdutos[i].atributos}</h4>
          </div>
          <div class="nivelProductEncomenda">
            <h5>Sustentabilidade</h5>
            <h4>{this.state.listaProdutos[i].sustentabilidade}</h4>
          </div>
          <div class="quantidadeProductEncomenda">
            <h5>Quantidade</h5>
            <h4>{this.state.listaProdutos[i].quantidade}</h4>
          </div>
          <div class="precoProductEncomenda">
            <h5>Preço total</h5>
            <h4>{this.state.listaProdutos[i].precoTotal}€</h4>
          </div>
        </div>
      );
    }

    return result;
  };

  createPage() {
    let result = (
      <div className="mainBlockEncomenda">
        <div className="pathEncomendas">
          <span className="backPathEncomendas">
            <a href="/perfil">Encomendas</a>
          </span>
          <span className="divisaoPath">{">"}</span>
          <span>{this.state.idEncomenda}</span>
        </div>
        <div class="bodyEncomendaMail">
          <h1 class="tituloEncomendaMail">
            <span className="estadoEncomendaPage">
              {this.state.estadoEncomenda}{" "}
            </span>
            <i class="bi bi-box-seam"></i>
            <span class="upperTitulo">Encomenda </span>
            <span className="idEncomenda">{this.state.idEncomenda}</span>
          </h1>
          <div class="datasEncomenda">
            <div class="dataEspecificaEncomenda">
              <div className="toAlignDatasEncomenda">
                <i class="bi bi-calendar2-check"></i>
                <h5>Data encomenda</h5>
                <h4>{this.state.dataEncomenda}</h4>
              </div>
            </div>
            <div class="dataEspecificaEncomenda">
              <div className="toAlignDatasEncomenda">
                <i class="bi bi-calendar3-range"></i>
                <h5>Data entrega</h5>
                <h4>{this.state.dataEntrega}</h4>
              </div>
            </div>
            <div class="dataEspecificaEncomenda">
              <div className="toAlignDatasEncomenda">
                <i class="bi bi-x-octagon"></i>
                <h5>Prazo de cancelamento</h5>
                <h4>{this.state.prazoCancelamento}</h4>
              </div>
            </div>
            <div id="cancelarEncomendaButton" class="dataEspecificaEncomenda">
              <div className="toAlignDatasEncomenda" onClick={async () => {await this.cancelEncomenda()}}>
                <i class="bi bi-x-octagon"></i>
                <h5>Cancelar Encomenda</h5>
              </div>
            </div>
          </div>
          <div class="paddingEncomenda">
            <div class="detailsGeralEncomenda">
              <h6>Local de entrega</h6>
              <h5>
                {this.state.localidadeMorada}, {this.state.paisMorada}
              </h5>
              <h5>{this.state.ruaMorada}</h5>
              <h5>{this.state.codPostalMorada}</h5>
            </div>
          </div>
          <div class="paddingEncomenda">
            <div class="detailsGeralEncomenda">
              <h6>Transportador</h6>
              <h5>{this.state.nomeTransporte}</h5>
            </div>
            <div class="detailsTransporteEncomenda">
              <div class="detailTransporte">
                <h6>Distancia total de transporte</h6>
                <h5>{this.state.distTransporte}</h5>
              </div>
              {/* <div class="detailTransporte">
            <h6>Consumo por item</h6>
            <h5>{this.state.consumoItemTransporte}</h5>
          </div>
          <div class="detailTransporte">
            <h6>Emissão por item</h6>
            <h5>{this.state.emissaoItemTransporte}</h5>
          </div> */}
              <div class="detailTransporte">
                <h6>Classificação do transporte</h6>
                <h5>
                  {this.state.classificacaoTransporte} {getLeaf()}
                </h5>
              </div>
            </div>
          </div>
          <div class="paddingEncomenda">
            <div class="detailsGeralEncomenda">
              <h6>Produtos</h6>
            </div>
            <div class="displayerProdutosEncomendas">
              {this.createProdutos()}
            </div>
          </div>
        </div>
      </div>
    );

    ReactDOM.render(result, this.refPageEncomenda.current);
  }

  async cancelEncomenda(){

    let info = JSON.parse(localStorage.getItem('baylitInfo'))


    //Verificar caso o prazo ainda seja valido

    let res = await cancelarEncomenda(info.id, info.token, this.state.idEncomenda)

    if (res){
      console.log("Encomenda Cancelada com sucesso")
      window.location.href = "/Perfil/Encomendas/" + this.state.idEncomenda
    } else {
      console.log("Erro ao cancelar Encomenda")
    }
  }

  cancelarEncomendaDisapear(){
    let cancelarEncomendaButton = document.getElementById("cancelarEncomendaButton");
    let estado = this.state.estadoEncomenda;
    console.log(estado);
    if(this.state.estadoEncomenda == "Cancelada"){
      console.log("Entrei!!!!");
      cancelarEncomendaButton.style.display = "none";
    }
  }

  async componentDidMount() {
    await this.getEncomendaInfo();
    this.createPage();
    this.cancelarEncomendaDisapear();
  }

  render() {
    return <div ref={this.refPageEncomenda}></div>;
  }
}

export default withSearch(BlockEncomenda);
