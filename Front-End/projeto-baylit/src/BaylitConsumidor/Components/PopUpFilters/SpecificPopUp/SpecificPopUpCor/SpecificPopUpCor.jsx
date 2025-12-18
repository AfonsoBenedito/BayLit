import React, { Component } from "react";
import "./SpecificPopUpCor.css";

class SpecificPopUpCor extends Component {
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
      let corId;
      let nomeCor = this.state.listaAtributos[i];
      switch (nomeCor) {
        case "Azul":
          corId = "rgb(39, 121, 169)";
          break;
        case "Amarelo":
          corId = "rgb(221, 225, 86)";
          break;
        case "Branco":
          corId = "white";
          break;
        case "Beje":
          corId = "rgb(232, 208, 162)";
          break;
        case "Cinzento":
          corId = "rgb(170, 170, 170)";
          break;
        case "Dourado":
          corId = "rgb(173, 152, 73)";
          break;
        case "Laranja":
          corId = "rgb(196, 124, 60)";
          break;
        case "Prateado":
          corId = "rgb(201, 201, 192)";
          break;
        case "Preto":
          corId = "black";
          break;
        case "Rosa":
          corId = "pink";
          break;
        case "Roxo":
          corId = "rgb(125, 60, 117)";
          break;
        case "Verde":
          corId = "rgb(46, 135, 74)";
          break;
        case "Vermelho":
          corId = "rgb(158, 54, 58)";
          break;
        default:
          corId = "var(--secondaryColor)";
      }

      let toAdd = (
        <label class="containerCor">
          {nomeCor}
          {/* <span class="numberProcuctsSelectCor">10 800*</span> */}
          <input
            type="checkbox"
            name={nomeCor}
            onChange={(e) => {
              this.changeInfoStorage(e);
              this.state.verificarFiltros();
            }}
          />
          <span class="checkmarkCor" style={{ backgroundColor: corId }}></span>
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
      <div className="mainSpecificPopUpCor">
        {/* {this.state.listaAtributos} */}
        <div className="divForFiltersCor">{this.createInputColors()}</div>

        <div className="redefineButton">
          <i class="bi bi-arrow-clockwise"></i>
          <h6>Redefinir</h6>
        </div>
      </div>
    );
  }
}

export default SpecificPopUpCor;
