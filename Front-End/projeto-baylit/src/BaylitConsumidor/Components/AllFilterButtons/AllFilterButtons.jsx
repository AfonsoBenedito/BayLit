import React, { Component } from "react";
import "./AllFilterButtons.css";
import FilterButton from "../FilterButton/FilterButton";
import CompleteFilter from "../PopUpFilters/CompleteFilter/CompleteFilter";

class AllFiltersButtons extends Component {
  filtros = {
    Cor: ["Azul", "Amarelo"],
    "Tamanho do Calçado": [
      "32,2 kg",
      "33",
      "34",
      "35",
      "36",
      "32",
      "33",
      "34",
      "35",
      "36",
    ],
    "Tamanho da Roupa": ["XXS", "XS", "S", "M", "L", "XXL", "XXXL"],
    normal: ["palavra", "palavra1", "palavra2"],
    Idade: ["2", "90"],
    "Peso do Computador": ["32 kg", "33 kg", "90 kg", "35 kg", "36 kg"],
    nosrmal: ["palavra", "palavra1", "palavra2"],
    csor: ["Azul", "Amarelo"],
    Estação: ["Primavera", "Verão", "Outono", "Inverno", "Multi-Estação"],
    norsmal: [
      "palavra",
      "palavra1",
      "palavra2",
      "palavra",
      "palavra1",
      "palavra2",
      "palavra",
      "palavra1",
      "palavra2",
      "palavra",
      "palavra1",
      "palavra2",
    ],
  };

  constructor(props) {
    super(props);

    this.myRefOpenFilters = React.createRef();
    this.myRefAllFilters = React.createRef();

    this.myRefOpenFiltersH6 = React.createRef();

    this.state = {
      filters: this.props.filters,

      classBtnOpenClose: "bi bi-caret-down-fill",
      changeOnClickFunction: this.openAllFilters,

      classBtnRedefine: "redefineAllFiltersClosed",
      classBtnShowFilters: "expandAllFiltersClosed",

      verificarFiltros: this.props.verificarFiltros,
    };
  }

  createPopUp(nameButton, tipoPopUp, listaAtributos) {
    let justTipoMedida = "";
    if (tipoPopUp == "popUpRange") {
      let toMinMaxNumbers = [];

      if (listaAtributos.length > 0) {
        justTipoMedida = listaAtributos[0].replace(/[0-9]/g, "");
      }
      for (let i = 0; i < listaAtributos.length; i++) {
        let justNumber = listaAtributos[i].replace(/[^\d.-]/g, "");
        toMinMaxNumbers.push(parseInt(justNumber));
      }

      let max = Math.max.apply(null, toMinMaxNumbers);
      let min = Math.min.apply(null, toMinMaxNumbers);

      listaAtributos = [min, max];
      //console.log(justTipoMedida);
    }

    return (
      <CompleteFilter
        nameButton={nameButton}
        tipoPopUp={tipoPopUp}
        listaAtributos={listaAtributos}
        tipoMedida={justTipoMedida}
        verificarFiltros={this.state.verificarFiltros}
      />
    );
  }

  createFiltersNeeded() {
    let filters = this.state.filters;
    let filtersKeys = Object.keys(filters);
    //console.log(filtersKeys);

    let filterDiv = [];

    // console.log(filtersKeys.length);

    for (let i = 0; i < filtersKeys.length; i++) {
      let chave = filtersKeys[i];
      //   let rightIcon;
      //console.log("aquii");
      let filterApply;

      // TIPOS POP-UP
      //
      // popUpCor
      // popUpRange
      // popUpTamanho
      // popUpDefault
      //   falat estação/desporto/marcas

      switch (chave) {
        case "Cor":
          filterApply = (
            <div className="filterAndPopUp">
              {this.createPopUp(chave, "popUpCor", filters[chave])}
            </div>
          );
          break;
        case "Tamanho do Calçado":
        case "Tamanho da Roupa":
        case "Estação":
          filterApply = (
            <div className="filterAndPopUp">
              {this.createPopUp(chave, "popUpDefault2", filters[chave])}
            </div>
          );
          break;

        case "Idade":
        case "Peso do Computador":
          filterApply = (
            <div className="filterAndPopUp">
              {this.createPopUp(chave, "popUpRange", filters[chave])}
            </div>
          );
          break;

        default:
          filterApply = (
            <div className="filterAndPopUp">
              {this.createPopUp(chave, "popUpDefault", filters[chave])}
            </div>
          );
          break;
      }

      filterDiv.push(filterApply);
    }

    return filterDiv;
  }

  openAllFilters = () => {
    this.myRefAllFilters.current.style.height = "fit-content";
    this.myRefAllFilters.current.style.paddingRight = "0";

    this.myRefOpenFiltersH6.current.innerHTML = "Ver menos";

    this.setState({
      changeOnClickFunction: this.closeAllFilters,
      classBtnOpenClose: "bi bi-caret-up-fill",
      classBtnRedefine: "",
      classBtnShowFilters: "",
    });
  };

  closeAllFilters = () => {
    this.myRefAllFilters.current.style.height = "40px";
    this.myRefAllFilters.current.style.paddingRight = "200px";

    this.myRefOpenFiltersH6.current.innerHTML = "Ver mais";

    this.setState({
      changeOnClickFunction: this.openAllFilters,
      classBtnOpenClose: "bi bi-caret-down-fill",
      classBtnRedefine: "redefineAllFiltersClosed",
      classBtnShowFilters: "expandAllFiltersClosed",
    });
  };

  render() {
    return (
      <div ref={this.myRefAllFilters} className="mainAllFilterButtons">
        {this.createFiltersNeeded()}
        <div className={"redefineAllFilters " + this.state.classBtnRedefine}>
          <i class="bi bi-arrow-clockwise"></i>
          <h6>Redefinir tudo</h6>
        </div>
        <div
          ref={this.myRefOpenFilters}
          className={"expandAllFilters " + this.state.classBtnShowFilters}
          onClick={() => {
            this.state.changeOnClickFunction();
          }}
        >
          <h6 ref={this.myRefOpenFiltersH6}>Ver mais</h6>
          <i class={this.state.classBtnOpenClose}></i>
        </div>
        <div className="hideOverflowFilters"></div>
      </div>
    );
  }
}

export default AllFiltersButtons;
