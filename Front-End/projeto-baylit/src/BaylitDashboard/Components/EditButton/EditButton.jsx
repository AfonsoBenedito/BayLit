import React, { Component } from "react";
import "./EditButton.css";

class EditButton extends Component {
  state = {
    name: this.props.name,
    theme: this.props.theme,

    functionEditProfile: this.props.functionEditProfile,
  };

  render() {
    var theme = styleButtonColors.dark;

    if (this.state.theme == "light") {
      theme = styleButtonColors.light;
    }

    const name = this.state.name;

    return (
      <button className="editButton" style={theme}
      onClick={() => {
        this.state.functionEditProfile();
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

export default EditButton;
