import React, { Component } from "react";
import "./SignButton.css";

class SignButton extends Component {
  state = {
    name: this.props.name,
    theme: this.props.theme,
    id: this.props.id,
  };

  render() {
    var theme = styleButtonColors.dark;

    if (this.state.theme == "lightIn") {
      theme = styleButtonColors.lightIn;
    } else if (this.state.theme == "lightUp") {
      theme = styleButtonColors.lightUp;
    }

    const name = this.state.name;

    return (
      <button id={this.state.id} className="signButton" style={theme}>
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
  lightIn: {
    border: "1px solid rgb(0,0,0,0)",
    color: "white",
  },
  lightUp: {
    border: "1px solid white",
    color: "white",
  },
};

export default SignButton;
