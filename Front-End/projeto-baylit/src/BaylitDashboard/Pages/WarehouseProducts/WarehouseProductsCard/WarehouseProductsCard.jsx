import React, { Component } from "react";
import "./WarehouseProductsCard.css";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";

class WarehouseProductsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantidade: this.props.quantidade,
      backgroundCard: this.props.backgroundCard,
      foto: this.props.foto,
      especificidade: this.props.especificidade,
    };

    console.log(this.state.foto[0]);
    this.refAtributosCard = React.createRef();
  }

  async displayCardAtributos() {
    let listToAdd = [];
    // listToAdd.push(<p>Atributos:</p>);
    for (let atributo in this.state.especificidade) {
      let valor = this.state.especificidade[atributo].valor;
      // console.log(valor);
      listToAdd.push(<p className="aboutProductCardHS">{valor}</p>);
    }

    ReactDOM.render(listToAdd, this.refAtributosCard.current);
  }

  async componentDidMount() {
    await this.displayCardAtributos();
  }

  render() {
    return (
      <div className={"mainProductCard " + this.state.backgroundCard}>
        <div className="detailsProductCard">
          <a href={"/dashboard/SpecificProduct/" + this.state.productId}>
            <div className="photoNameProduct">
              <div className="photoProduct">
                <img
                  className="photoProductSrcImage"
                  src={this.state.foto[0]}
                ></img>
              </div>
              <h4 className="nameProduct">{this.state.nome}</h4>
            </div>
          </a>
          {/* <i className="bi bi-three-dots"></i> */}
          {/* <button className="employeeCardButton"> */}
          <i
            id={this.state.idClose}
            class="bi bi-x-circle closeProductCardButton"
            onClick={(e) => {
              this.state.removeProduct(e);
            }}
          ></i>
          {/* <p id="removeItemProductsCardA">{this.state.idClose}</p> */}
        </div>
        <hr />
        <div className="aboutProductCard">
          <div
            ref={this.refAtributosCard}
            className="atributosProductCard"
          ></div>
          <p aboutProductCardHSXL>Quantidade:</p>
          <h6 className="aboutProductCardHSXL">{this.state.quantidade}</h6>
          {/* <h6>{this.props.descricao}</h6> */}
        </div>
      </div>
    );
  }
}

export default WarehouseProductsCard;
