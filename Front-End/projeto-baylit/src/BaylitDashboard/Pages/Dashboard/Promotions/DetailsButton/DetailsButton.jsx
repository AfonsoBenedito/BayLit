import React, { Component } from "react";
import "./DetailsButton.css";

class DetailsButton extends Component {
  state = {
    colorCircle: this.props.colorCircle,
    name: this.props.name,
  };
  styleCircle = "backgroundColor:" + this.state.colorCircle;
  render() {
    if (this.state.colorCircle) {
      return (
        <div className="detailsButton">
          <div
            className="colorCircle"
            style={{ backgroundColor: this.state.colorCircle }}
          ></div>
          <div className="textDetails">{this.state.name}</div>
        </div>
      );
    } else {
      return (
        <div className="detailsButton">
          <div className="textDetails">{this.state.name}</div>
        </div>
      );
    }
  }
}

export default DetailsButton;
