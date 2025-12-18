import React, { Component } from "react";
import "./AddSpecificProduct.css";

class AddSpecificProduct extends Component {
  state = {
    name: this.props.name,
    theme: this.props.theme,

    addSpecificProduct: this.props.addSpecificProduct,
  };

  render() {
    var theme = styleButtonColors.dark;

    if (this.state.theme == "light") {
      theme = styleButtonColors.light;
    }

    const name = this.state.name;

    return (
      <button className="addSpecificProductButton" style={theme}
      onClick={() => {
        this.state.addSpecificProduct();
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

export default AddSpecificProduct;
