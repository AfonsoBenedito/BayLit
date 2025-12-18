import React, { Component } from "react";

import "./FAQComponent.css";

class FAQComponent extends Component {
  constructor(props) {
    super(props);

    this.myRefTexto = React.createRef();

    this.state = {
      titulo: this.props.titulo,
      texto: this.props.texto,
      classIcon: "bi bi-chevron-right",
      actualFuntion: "open",
    };
  }

  changeFAQDisplay(tipo) {
    if (tipo == "open") {
      this.myRefTexto.current.style.display = "block";

      this.setState({
        classIcon: "bi bi-chevron-down",
        actualFuntion: "close",
      });
    } else if (tipo == "close") {
      this.myRefTexto.current.style.display = "none";

      this.setState({
        classIcon: "bi bi-chevron-right",
        actualFuntion: "open",
      });
    }
  }

  render() {
    return (
      <div className="mainFAQComponent">
        <div
          className="headerFAQComponent"
          onClick={() => {
            this.changeFAQDisplay(this.state.actualFuntion);
          }}
        >
          <h4>{this.state.titulo}</h4>
          <i class={this.state.classIcon}></i>
        </div>
        <p ref={this.myRefTexto}>{this.state.texto}</p>
      </div>
    );
  }
}

export default FAQComponent;
