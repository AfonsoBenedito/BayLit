import React, { Component } from "react";
import "./ExpandButton.css";

class ExpandButton extends Component {
  state = {
    class: this.props.class,
    id: this.props.id,
    name: this.props.name,
    theme: this.props.theme,

    functionExpandMinimize: this.props.expandMinimizePromotions,
  };

  render() {
    var theme = styleButtonColors.dark;

    if (this.state.theme == "light") {
      theme = styleButtonColors.light;
    }

    const name = this.state.name;

    return (
      <button
        id={this.state.id}
        className="expandButton"
        style={theme}
        onClick={() => {
          this.state.functionExpandMinimize();
        }}
      >
        {name}
      </button>
    );
  }
}

const styleButtonColors = {
  dark: {
    // border: "1px solid black",
    color: "black",
  },
  light: {
    // border: "1px solid rgb(164, 164, 164)",
    color: "white",
  },
};

export default ExpandButton;
