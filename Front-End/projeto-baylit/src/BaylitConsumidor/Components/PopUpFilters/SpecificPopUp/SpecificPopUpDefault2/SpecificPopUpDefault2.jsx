import React, { Component } from "react";

import "./SpecificPopUpDefault2.css";

class SpecificPopUpEstacao extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listaAtributos: this.props.listaAtributos,
      nomeAtributo: this.props.nomeAtributo,
      verificarFiltros: this.props.verificarFiltros,
    };

    this.changeInfoStorage = this.changeInfoStorage.bind(this);
  }

  createInputEstacao() {
    let inputDivs = [];
    for (let i = 0; i < this.state.listaAtributos.length; i++) {
      let nomeDefault2 = this.state.listaAtributos[i];

      let toAdd = (
        <label class="containerDefault2">
          <input
            type="checkbox"
            name={nomeDefault2}
            onChange={(e) => {
              this.changeInfoStorage(e);
              this.state.verificarFiltros();
            }}
          />
          <div class="checkmarkDefault2">
            <h5>{nomeDefault2}</h5>
          </div>
        </label>
      );

      inputDivs.push(toAdd);
    }

    return inputDivs;
  }

  changeInfoStorage(e) {
    let elemento = e.nativeEvent.srcElement;

    let name = elemento.name;
    let checked = elemento.checked;

    let filtros = JSON.parse(sessionStorage.getItem("baylitFiltros")).filtros;

    for (let i = 0; i < filtros.length; i++) {
      if (filtros[i].atributo == this.state.nomeAtributo) {
        if (checked) {
          filtros[i].valores.push(name);
        } else {
          let index = filtros[i].valores.indexOf(name);

          if (index != -1) {
            filtros[i].valores.splice(index, 1);
          }
        }
      }
    }

    let novaStorage = {
      filtros: filtros,
    };

    sessionStorage.setItem("baylitFiltros", JSON.stringify(novaStorage));
  }

  render() {
    return (
      <div className="mainSpecificPopUpDefault2">
        {/* {this.state.listaAtributos} */}
        <div className="divForFiltersDefault2">{this.createInputEstacao()}</div>

        <div className="redefineButton">
          <i class="bi bi-arrow-clockwise"></i>
          <h6>Redefinir</h6>
        </div>
      </div>
    );
  }
}

export default SpecificPopUpEstacao;
