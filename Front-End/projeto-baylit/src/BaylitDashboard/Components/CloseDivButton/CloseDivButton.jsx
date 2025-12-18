import React, { Component } from "react";
import "./CloseDivButton.css";

class CloseDivButton extends Component {
  state = {
    name: this.props.name,
    theme: this.props.theme,

    closeDivButton: this.props.closeDivButton,
  };

  render() {
    var theme = styleButtonColors.dark;

    if (this.state.theme == "light") {
      theme = styleButtonColors.light;
    }

    const name = this.state.name;

    return (
      <button className="closeDivButton" style={theme}
      onClick={() => {
        this.state.closeDivButton();
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

export default CloseDivButton;
