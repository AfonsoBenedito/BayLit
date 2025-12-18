import React, { Component } from "react";
import "./AddProduct.css";

class AddProduct extends Component {
  state = {
    name: this.props.name,
    theme: this.props.theme,

    addProduct: this.props.addProduct,
  };

  render() {
    var theme = styleButtonColors.dark;

    if (this.state.theme == "light") {
      theme = styleButtonColors.light;
    }

    const name = this.state.name;

    return (
      <button className="addProductButton" style={theme}
      onClick={() => {
        this.state.addProduct();
      }}>
        {name}
      </button>
    );
  }
}

const styleButtonColors = {
  dark: {
    border: "1px solid black",
    color: "black",
  },
  light: {
    border: "1px solid rgb(164, 164, 164)",
    color: "white",
  },
};

export default AddProduct;
