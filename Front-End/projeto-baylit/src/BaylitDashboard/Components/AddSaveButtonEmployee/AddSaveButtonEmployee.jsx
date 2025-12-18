import React, { Component } from "react";
import "./AddSaveButtonEmployee.css";

class AddSaveButtonEmployee extends Component {
  state = {
    name: this.props.name,
    theme: this.props.theme,

    addSaveButtonEmployee: this.props.addSaveButtonEmployee,
  };

  render() {
    var theme = styleButtonColors.dark;

    if (this.state.theme == "light") {
      theme = styleButtonColors.light;
    }

    const name = this.state.name;

    return (
      <button className="addSaveButtonEmployee" style={theme}
      onClick={() => {
        this.state.addSaveButtonEmployee();
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

export default AddSaveButtonEmployee;
