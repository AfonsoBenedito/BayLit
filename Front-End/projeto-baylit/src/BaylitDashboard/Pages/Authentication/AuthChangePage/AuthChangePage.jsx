import React, { Component } from "react";
import "./AuthChangePage.css";

class AuthChangePageButton extends Component {
  state = {
    name: this.props.name,
  };

  render() {
    const name = this.state.name;

    return <button className="authChangePageButton">{name}</button>;
  }
}

export default AuthChangePageButton;
