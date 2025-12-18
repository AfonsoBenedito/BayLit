import React, { Component } from "react";
import "./CompleteFilter.css";
import FilterButton from "../../FilterButton/FilterButton";
import SpecificPopUpDefault from "../SpecificPopUp/SpecificPopUpDefault/SpecificPopUpDefault";
import SpecificPopUpCor from "../SpecificPopUp/SpecificPopUpCor/SpecificPopUpCor";
import SpecificPopUpDefault2 from "../SpecificPopUp/SpecificPopUpDefault2/SpecificPopUpDefault2";
import SpecificPopUpRange from "../SpecificPopUp/SpecificPopUpRange/SpecificPopUpRange";

class PopUpFilterDefault extends Component {
  constructor(props) {
    super(props);
    this.myRefBtnFilter = React.createRef();
    this.myRefFilter = React.createRef();
    this.myRefBackFilter = React.createRef();

    this.state = {
      openCloseIcon: "bi bi-caret-down-fill",

      nameButton: this.props.nameButton,
      tipoPopUp: this.props.tipoPopUp,
      listaAtributos: this.props.listaAtributos,
      tipoMedida: this.props.tipoMedida,
      verificarFiltros: this.props.verificarFiltros,
    };
  }
  openPopUpFilter() {
    this.myRefFilter.current.style.display = "initial";
    this.myRefBackFilter.current.style.display = "initial";
    this.setState({ openCloseIcon: "bi bi-caret-up-fill" });

    let xDiv = this.myRefBtnFilter.current.getBoundingClientRect().x;
    let sizeScreen = window.innerWidth;

    //Se passar a metade
    if (xDiv > sizeScreen / 2 - 100) {
      this.myRefFilter.current.style.float = "right";
      this.myRefFilter.current.style.right = "0";
      this.myRefFilter.current.style.left = "auto";
    }
  }
  closePopUpFilter() {
    this.myRefFilter.current.style.display = "none";
    this.myRefBackFilter.current.style.display = "none";
    this.setState({ openCloseIcon: "bi bi-caret-down-fill" });
  }

  createPopUp() {
    // TIPOS POP-UP
    //
    // popUpCor
    // popUpRange
    // popUpTamanho
    // popUpDefault
    //   falat estação/desporto/marcas
    if (this.state.tipoPopUp == "popUpCor") {
      return (
        <SpecificPopUpCor
          verificarFiltros={this.state.verificarFiltros}
          listaAtributos={this.state.listaAtributos}
          nomeAtributo={this.state.nameButton}
        />
      );
    } else if (this.state.tipoPopUp == "popUpRange") {
      //console.log("asasdasdads");
      //console.log(this.state.tipoMedida);
      return (
        <SpecificPopUpRange
          verificarFiltros={this.state.verificarFiltros}
          listaAtributos={this.state.listaAtributos}
          tipoMedida={this.state.tipoMedida}
          nomeAtributo={this.state.nameButton}
        />
      );
    } else if (this.state.tipoPopUp == "popUpDefault2") {
      return (
        <SpecificPopUpDefault2
          verificarFiltros={this.state.verificarFiltros}
          listaAtributos={this.state.listaAtributos}
          nomeAtributo={this.state.nameButton}
        />
      );
    } else if (this.state.tipoPopUp == "popUpDefault") {
      return (
        <SpecificPopUpDefault
          verificarFiltros={this.state.verificarFiltros}
          listaAtributos={this.state.listaAtributos}
          nomeAtributo={this.state.nameButton}
        />
      );
    } else {
      alert(
        "Não existe este tipo de popUp - PopUpFilterDefault.jsx createPopUp()"
      );
    }
  }

  render() {
    return (
      <>
        <div
          ref={this.myRefBtnFilter}
          onClick={() => {
            this.openPopUpFilter();
          }}
        >
          <FilterButton
            verificarFiltros={this.state.verificarFiltros}
            // id={this.state.idButton}
            // addClass={this.state.addClassButton}
            name={this.state.nameButton}
            rightIcon={this.state.openCloseIcon}
            // leftIcon=""
          />
        </div>
        <div
          className="backToCloseFilter"
          ref={this.myRefBackFilter}
          onClick={() => {
            this.closePopUpFilter();
          }}
        ></div>
        <div className="mainPopUpFilter" ref={this.myRefFilter}>
          {this.createPopUp()}
        </div>
      </>
    );
  }
}

export default PopUpFilterDefault;
