import React, { Component } from "react";
import "./AddSaveButtonSede.css";

class AddSaveButtonSede extends Component {
  state = {
    name: this.props.name,
    theme: this.props.theme,

    addSaveButtonWarehouse: this.props.addSaveButtonWarehouse,
  };

  render() {
    var theme = styleButtonColors.dark;

    if (this.state.theme == "light") {
      theme = styleButtonColors.light;
    }

    const name = this.state.name;

    return (
      <button className="addSaveButtonWarehouse" style={theme}
      onClick={() => {
        this.state.addSaveButtonWarehouse();
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

export default AddSaveButtonSede;
