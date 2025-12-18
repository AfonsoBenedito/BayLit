import React, { Component } from "react";
import "./AuthSignUpButton.css";

class AuthSignUpButton extends Component {
  state = {
    name: this.props.name,
  };

  render() {
    const name = this.state.name;

    return <button className="authSignUpButton">{name}</button>;
  }
}

export default AuthSignUpButton;
