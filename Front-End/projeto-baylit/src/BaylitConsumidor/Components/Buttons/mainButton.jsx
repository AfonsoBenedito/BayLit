import React, { Component } from "react";
import "./mainButton.css";

class MainButton extends Component {
  state = {
    name: this.props.name,
    theme: this.props.theme,
  };

  render() {
    var theme = styleButtonColors.dark;
    // if (this.state.theme == "dark") {
    //   theme = styleButtonColors.dark;

    if (this.state.theme == "light") {
      theme = styleButtonColors.light;
    }

    const name = this.state.name;

    return (
      <button className="mainButton" style={theme}>
        {name}
      </button>
    );
  }
}

const styleButtonColors = {
  dark: {
    backgroundColor: "black",
    color: "white",
  },
  light: {
    backgroundColor: "white",
    color: "black",
  },
};

export default MainButton;
