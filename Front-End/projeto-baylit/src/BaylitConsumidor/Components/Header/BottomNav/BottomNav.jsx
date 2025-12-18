import React, { Component } from "react";
import { useEffect } from "react";
import "./BottomNav.css";

class BottomNav extends Component {
  state = {
    count: 100,
  };

  // Teste = () => {
  //   document.getElementsByClassName("secondaryBottom")[0].style.left = "-100%";
  // };

  // Teste_2 = () => {
  //   this.setState({
  //     count: 9,
  //   });
  // };

  render() {
    const { count } = this.state;
    return (
      <div className="mainBottom">
        <div className="secondaryBottom">
          <h6 onClick={this.Teste_2}>
            <a href="/faq">
              <span className="spanTextColor">Saber mais</span>
            </a>
          </h6>
          <h6>
            Texto 2. <span>Saber mais</span>
          </h6>
          <h6>
            Texto 3. <span>Saber mais</span>
          </h6>
        </div>
      </div>
    );
  }
}

export default BottomNav;
