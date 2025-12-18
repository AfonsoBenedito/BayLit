import React, { Component } from "react";
import "./SpecificPopUpDefault.css";

class SpecificPopUpDefault extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listaAtributos: this.props.listaAtributos,
      nomeAtributo: this.props.nomeAtributo,
      verificarFiltros: this.props.verificarFiltros,
    };

    this.changeInfoStorage = this.changeInfoStorage.bind(this);
  }

  createInputColors() {
    let inputDivs = [];

    for (let i = 0; i < this.state.listaAtributos.length; i++) {
      let nomeDefault = this.state.listaAtributos[i];

      let toAdd = (
        <label class="containerDefault">
          {nomeDefault}
          {/* <span class="numberProcuctsSelectDefault">10 800*</span> */}
          <input
            type="checkbox"
            name={nomeDefault}
            onChange={(e) => {
              this.changeInfoStorage(e);
              this.state.verificarFiltros();
            }}
          />
          <span class="checkmarkDefault"></span>
        </label>
      );

      inputDivs.push(toAdd);
    }

    return inputDivs;
  }

  changeInfoStorage(e) {
    console.log(e)
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
      <div className="mainSpecificPopUpDefault">
        {/* {this.state.listaAtributos} */}
        <div className="divForFiltersDefault">{this.createInputColors()}</div>

        <div className="redefineButton">
          <i class="bi bi-arrow-clockwise"></i>
          <h6>Redefinir</h6>
        </div>
      </div>
    );
  }
}

export default SpecificPopUpDefault;
