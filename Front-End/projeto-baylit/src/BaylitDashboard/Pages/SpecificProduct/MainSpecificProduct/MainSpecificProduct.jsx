import React, { Component } from "react";
import "./MainSpecificProduct.css";

import productImage from '../../../Images/productImage.png';

class MainSpecificProduct extends Component {
  constructor(props){
    super(props);
    this.state = {
      nome: this.props.nome
    };
  }

  
  render() {
    return (
      <div className="mainSpecificProductDiv">

          <img className="mainSpecificProductImageSrc" src={productImage}></img>
          <p className="mainSpecificProductName">{this.state.nome}</p>
          
        
      </div>
    );
  }
}

export default MainSpecificProduct;
