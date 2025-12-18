import React, { Component } from "react";
import "./AddSede.css";

class AddSede extends Component {
  state = {
    name: this.props.name,
    theme: this.props.theme,

    addWarehouse: this.props.addWarehouse,
  };

  render() {
    var theme = styleButtonColors.dark;

    if (this.state.theme == "light") {
      theme = styleButtonColors.light;
    }

    const name = this.state.name;

    return (
      <button className="addWarehouseButton" style={theme}
      onClick={() => {
        this.state.addWarehouse();
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

export default AddSede;
