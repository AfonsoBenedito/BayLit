import React, { Component } from "react";
import "./ProductsCard.css";
import { Link } from "react-router-dom";

class ProductsCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      // nomeProduto: this.props.nomeProduto,
      // srcPhotoProduto: this.props.srcPhotoProduto,
      // dataInicio: this.props.dataInicio,
      // dataFim: this.props.dataFim,
      productId: this.props.productId,
      nome: this.props.nome,
      informacao_adicional: this.props.informacao_adicional,
      descricao: this.props.descricao,
      categoria: this.props.categoria,
      subcategoria: this.props.subcategoria,
      backgroundCard: this.props.backgroundCard,
      idClose: this.props.idClose,
      foto: this.props.foto,
  
      removeProduct: this.props.removeProduct,
    };
  }

  
  render() {
    return (
      <div className={"mainProductCard " + this.state.backgroundCard}>
        <div className="detailsProductCard">
          <a href={"/dashboard/SpecificProduct/" + this.state.productId}>
          <div className="photoNameProduct">
            <div className="photoProduct">
              <img className="photoProductImage"src={this.state.foto}></img>
            </div>
            <h4 className="nameProduct">{this.state.nome}</h4>
          </div>
          </a>
          {/* <i className="bi bi-three-dots"></i> */}
          {/* <button className="employeeCardButton"> */}
          <i id={this.state.idClose} class="bi bi-x-circle closeProductCardButton"
          onClick={(e) => {
          this.state.removeProduct(e);
          }}></i>
          {/* <p id="removeItemProductsCardA">{this.state.idClose}</p> */}
        </div>
        <hr />
        <div className="aboutProductCard">
          <h6 className="aboutProductCardH">Categoria: {this.state.categoria}</h6>
          <h6 className="aboutProductCardH">Sub-Categoria: {this.state.subcategoria}</h6>
          <p className="aboutProductCardP">Descrição</p>
          <h6 className="aboutProductCardHS">{this.state.informacao_adicional}</h6>
          {/* <h6>{this.props.descricao}</h6> */}
        </div>
      </div>
    );
  }
}

export default ProductsCard;
