import React, { Component } from "react";
import { getCadeiaByProduto } from "../../../../Helpers/ProdutoHelper";
import { getUsersShoppingCart } from "../../../../Helpers/UserHelper";
import "./Carrinho.css";

import ResumeShoppingCar from "./../ResumeShoppingCar/ResumeShoppingCar";

import ReactDOM from "react-dom";

import ProductCarrinho from "./ProductCarrinho/ProductCarrinho";

class StepOneShoppingCar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      idCarrinho: null,
    };

    this.refProdutos = React.createRef();

    this.checkValidity = this.checkValidity.bind(this);
  }

  async displayProducts() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    console.log("PEDIU");
    //GET CARRINHO
    let carrinho = await getUsersShoppingCart(info.id, info.token);

    console.log("VOLTOU");

    console.log(carrinho);

    this.setState({
      idCarrinho: carrinho._id,
    });

    let produtosAppend = [];

    for (let i = 0; i < carrinho.produtos.length; i++) {
      let cadeia = await getCadeiaByProduto(
        carrinho.produtos[i].produto.produto
      );

      console.log(carrinho.produtos);

      let nome = cadeia.nome;
      let precoSingular = carrinho.produtos[i].produto.preco.toFixed(2);
      let quantidade = carrinho.produtos[i].quantidade;
      let rating = Math.round(cadeia.cadeia.rating);
      let precoQuantidade = (precoSingular * quantidade).toFixed(2);
      let descricao = cadeia.informacao_adicional;
      let listaAtributos = carrinho.produtos[i].produto.especificidade;
      let fotografia = cadeia.fotografia[0];
      let idSpecific = carrinho.produtos[i].produto._id;

      produtosAppend.unshift(
        <ProductCarrinho
          idSpecific={idSpecific}
          idProduct={carrinho.produtos[i].produto.produto}
          nomeProduto={nome}
          descricaoProduto={descricao}
          nivelSustentabilidade={rating}
          precoUnidade={precoSingular}
          precoTotal={precoQuantidade}
          quantidade={quantidade}
          listaAtributos={listaAtributos}
          srcProduct={fotografia}
        />
      );
    }

    produtosAppend = produtosAppend.sort((a, b) => (a.props.idProduct > b.props.idProduct) ? 1 : -1)

    ReactDOM.render(produtosAppend, this.refProdutos.current);
  }

  checkValidity() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    if (info.tipo == "Consumidor" && info.logged == "true"){
      window.location.href = "/ShoppingCar/" + this.state.idCarrinho;
    } else {
      //Adicionar display de precisar de fazer Login ou abrir o popUp do Login
      console.log("Precisa de fazer Login")
    }

    
  }

  async componentDidMount() {
    await this.displayProducts();
  }

  render() {
    return (
      <div className="blocoGeralarrinho">
        <div className="blockCarAllSections">
          <h2 className="titleBlockGridShoppingCar">Carrinho X produtos</h2>
          <div ref={this.refProdutos} className="spaceProductsShoppingCar">
            {/* <ProductCarrinho />
            <ProductCarrinho />
            <ProductCarrinho />
            <ProductCarrinho /> */}
          </div>
        </div>
        <div id="blockResume">
          <h2 className="titleBlockGridShoppingCar">Resumo</h2>
          <ResumeShoppingCar
            page="carrinho"
            idCarrinho={this.state.idCarrinho}
            paginaSeguinte={this.checkValidity}
          />
        </div>
      </div>
    );
  }
}

export default StepOneShoppingCar;