import React, { Component } from "react";
import "./SpecificPopUpRange.css";

class SpecificPopUpRange extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listaAtributos: this.props.listaAtributos,

      min: this.props.listaAtributos[0],
      max: this.props.listaAtributos[1],

      left: this.props.listaAtributos[0],
      right: this.props.listaAtributos[1],

      widthOfSelected: 100,
      leftOfSelected: 0,

      tipoMedida: this.props.tipoMedida,
      nomeAtributo: this.props.nomeAtributo,

      verificarFiltros: this.props.verificarFiltros,
    };

    this.inputLeft = React.createRef();
    this.inputRight = React.createRef();

    this.changeInfoStorage = this.changeInfoStorage.bind(this);

    // this.thumbLeft = React.createRef();
    // this.thumbRight = React.createRef();
    // this.range = React.createRef();
  }

  calculateWidth() {
    let toWidth =
      ((this.inputRight.current.value - this.inputLeft.current.value) * 100) /
      (this.state.max - this.state.min);

    let toLeft =
      ((this.inputLeft.current.value - this.state.min) * 100) /
      (this.state.max - this.state.min);

    this.setState({ widthOfSelected: toWidth, leftOfSelected: toLeft });
  }

  setLeft() {
    this.setState({ left: this.inputLeft.current.value });
    // console.log(this.state.min);
    // console.log(this.inputLeft.current.value);
    let valueForWidth =
      ((this.state.max - this.inputLeft.current.value) * 100) /
      (this.state.max - this.state.min);

    this.inputRight.current.style.width = valueForWidth + "%";

    this.inputRight.current.min = this.inputLeft.current.value;

    this.calculateWidth();

    this.changeInfoStorage("menor", this.inputLeft.current.value);
  }

  setRight() {
    this.setState({ right: this.inputRight.current.value });

    let valueForWidth =
      ((this.inputRight.current.value - this.state.min) * 100) /
      (this.state.max - this.state.min);

    this.inputLeft.current.style.width = valueForWidth + "%";

    this.inputLeft.current.max = this.inputRight.current.value;

    this.calculateWidth();

    this.changeInfoStorage("maior", this.inputRight.current.value);
  }

  componentDidMount() {
    this.inputLeft.current.value = this.state.min;
    this.inputRight.current.value = this.state.max;
  }

  changeInfoStorage(lugar, valor) {
    let listaHelp = [];

    let filtros = JSON.parse(sessionStorage.getItem("baylitFiltros")).filtros;

    for (let i = 0; i < filtros.length; i++) {
      if (filtros[i].atributo == this.state.nomeAtributo) {
        if (filtros[i].valores.length == 0) {
          if (lugar == "menor") {
            for (let k = valor; k <= this.state.max; k++) {
              listaHelp.push(k.toString() + this.state.tipoMedida);
            }

            filtros[i].valores = listaHelp;
          } else if (lugar == "maior") {
            for (let k = this.state.min; k <= valor; k++) {
              listaHelp.push(k.toString() + this.state.tipoMedida);
            }

            filtros[i].valores = listaHelp;
          }
        } else {
          if (lugar == "menor") {
            for (let k = valor; k <= this.state.right; k++) {
              listaHelp.push(k.toString() + this.state.tipoMedida);
            }

            filtros[i].valores = listaHelp;
          } else if (lugar == "maior") {
            for (let k = this.state.left; k <= valor; k++) {
              listaHelp.push(k.toString() + this.state.tipoMedida);
            }

            filtros[i].valores = listaHelp;
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
      <div className="mainSpecificPopUpRange">
        <div className="numberOfRange">
          <span>{this.state.left}</span> {this.state.tipoMedida.toUpperCase()} -{" "}
          <span>{this.state.right}</span> {this.state.tipoMedida.toUpperCase()}
        </div>
        <div className="divForFiltersRange">
          <div className="middleLineRange">
            <div
              className="intervalSelectedLine"
              style={{
                width: this.state.widthOfSelected + "%",
                left: this.state.leftOfSelected + "%",
              }}
            ></div>
          </div>
          <input
            type="range"
            id="rangeInputLeft"
            ref={this.inputLeft}
            onChange={() => {
              this.setLeft();
              this.state.verificarFiltros();
            }}
            min={this.state.min}
            max={this.state.max}
            // value="25"
          />
          <input
            type="range"
            id="rangeInputRight"
            ref={this.inputRight}
            onChange={() => {
              this.setRight();
              this.state.verificarFiltros();
            }}
            min={this.state.min}
            max={this.state.max}
            // value="75"
          />
        </div>

        <div className="redefineButton">
          <i class="bi bi-arrow-clockwise"></i>
          <h6>Redefinir</h6>
        </div>
      </div>
    );
  }
}

export default SpecificPopUpRange;
