import React, { Component } from "react";

import "./HistoriaBloco.css";

class HistoriaBlocoTransporte extends Component {
  constructor(props) {
    super(props);

    this.myRefProdutoProducaoSpan = React.createRef();
    this.myRefProdutoArmazenamentoSpan = React.createRef();
    this.myRefProdutoTransporteSpan = React.createRef();

    this.state = {
      producaoFunction: "open",
      producaoClass: "bi bi-caret-right-fill",
      armazenamentoFunction: "open",
      armazenamentoClass: "bi bi-caret-right-fill",
      transporteFunction: "open",
      transporteClass: "bi bi-caret-right-fill",
    };
  }

  changeText(tipo, mudanca) {
    if (tipo == "producao") {
      if (mudanca == "open") {
        this.setState({
          producaoFunction: "close",
          producaoClass: "bi bi-caret-down-fill",
        });
        this.myRefProdutoProducaoSpan.current.style.display = "block";
      } else if (mudanca == "close") {
        this.setState({
          producaoFunction: "open",
          producaoClass: "bi bi-caret-right-fill",
        });
        this.myRefProdutoProducaoSpan.current.style.display = "none";
      }
    } else if (tipo == "armazenamento") {
      if (mudanca == "open") {
        this.setState({
          armazenamentoFunction: "close",
          armazenamentoClass: "bi bi-caret-down-fill",
        });
        this.myRefProdutoArmazenamentoSpan.current.style.display = "block";
      } else if (mudanca == "close") {
        this.setState({
          armazenamentoFunction: "open",
          armazenamentoClass: "bi bi-caret-right-fill",
        });
        this.myRefProdutoArmazenamentoSpan.current.style.display = "none";
      }
    } else if (tipo == "transporte") {
      if (mudanca == "open") {
        this.setState({
          transporteFunction: "close",
          transporteClass: "bi bi-caret-down-fill",
        });
        this.myRefProdutoTransporteSpan.current.style.display = "block";
      } else if (mudanca == "close") {
        this.setState({
          transporteFunction: "open",
          transporteClass: "bi bi-caret-right-fill",
        });
        this.myRefProdutoTransporteSpan.current.style.display = "none";
      }
    }
  }
  render() {
    return (
      <div className="historiaProdutoSustabilidade">
        <div className="middleLineSustentabilidade"></div>
        <div className="cellHistoriaProduto nullDivHistoria"></div>
        <div className="cellHistoriaProduto">
          <div className="blockExtensaoCellHistoria">
            <div className="blockLineHistoria">
              <div className="lineHistoria"></div>
            </div>
            <div className="extensaoCellHistoria">
              <h5
                onClick={() => {
                  this.changeText("producao", this.state.producaoFunction);
                }}
              >
                Produção
                <i class={this.state.producaoClass}></i>
              </h5>
              <span ref={this.myRefProdutoProducaoSpan}>
                Retrieving the correct dimension of such an element can help
                make a precise decision on aligning other components. So, here
                we will discuss detecting the actual size, height, width of an
                HTML element. A visible contents location based on the viewports
                dimension can be figured out with the help of the HTML DOM
                property
              </span>
            </div>
          </div>
        </div>
        <div className="cellHistoriaProduto">
          <div className="blockExtensaoCellHistoria">
            <div className="extensaoCellHistoria">
              <h5
                onClick={() => {
                  this.changeText(
                    "armazenamento",
                    this.state.armazenamentoFunction
                  );
                }}
              >
                Armazenamento
                <i class={this.state.armazenamentoClass}></i>
              </h5>
              <span ref={this.myRefProdutoArmazenamentoSpan}>
                Retrieving the correct dimension of such an element can help
                make a precise decision on aligning other components. So, here
                we will discuss detecting the actual size, height, width of an
                HTML element. A visible contents location based on the viewports
                dimension can be figured out with the help of the HTML DOM
                property
              </span>
            </div>
            <div className="blockLineHistoria">
              <div className="lineHistoria"></div>
            </div>
          </div>
        </div>
        <div className="cellHistoriaProduto nullDivHistoria"></div>
        <div className="cellHistoriaProduto nullDivHistoria"></div>
        <div className="cellHistoriaProduto">
          <div className="blockExtensaoCellHistoria">
            <div className="blockLineHistoria">
              <div className="lineHistoria"></div>
            </div>
            <div className="extensaoCellHistoria">
              <h5
                onClick={() => {
                  this.changeText("transporte", this.state.transporteFunction);
                }}
              >
                Transporte de fabricante
                <i class={this.state.transporteClass}></i>
              </h5>
              <span ref={this.myRefProdutoTransporteSpan}>
                Retrieving the correct dimension of such an element can help
                make a precise decision on aligning other components. So, here
                we will discuss detecting the actual size, height, width of an
                HTML element. A visible contents location based on the viewports
                dimension can be figured out with the help of the HTML DOM
                property
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HistoriaBlocoTransporte;
