import React, { Component } from "react";
import "./AddSaveButtonSpecificProduct.css";

class AddSaveButtonSpecificProduct extends Component {
  state = {
    name: this.props.name,
    theme: this.props.theme,

    addSaveButtonSpecificProduct: this.props.addSaveButtonSpecificProduct,
  };

  render() {
    var theme = styleButtonColors.dark;

    if (this.state.theme == "light") {
      theme = styleButtonColors.light;
    }

    const name = this.state.name;

    return (
      <button className="addSaveButtonSpecificProduct" style={theme}
      onClick={() => {
        this.state.addSaveButtonSpecificProduct();
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

export default AddSaveButtonSpecificProduct;
