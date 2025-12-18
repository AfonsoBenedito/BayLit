import React, { Component } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

import "./ProductInserir.css";
import ProductInserirDetalhes from "./ProductInserirDetalhes/ProductInserirDetalhes";
import ProductInserirLocal from "./ProductInserirLocal/ProductInserirLocal";
import ProductInserirProducao from "./ProductInserirProducao/ProductInserirProducao";

class ProductInserir extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dadosDetalhes: {},
      dadosProducao: {},
      dadosLocal: {}
    };

    // this.changeState = this.changeState.bind(this)

    this.changeStateDetalhes = this.changeStateDetalhes.bind(this)
    this.changeStateProducao = this.changeStateProducao.bind(this)
    this.changeStateLocal = this.changeStateLocal.bind(this)

    this.getDadosDetalhes = this.getDadosDetalhes.bind(this)
    this.getDadosProducao = this.getDadosProducao.bind(this)

    this.myRefCircleDetalhes = React.createRef();
    this.myRefCircleProducao = React.createRef();
    this.myRefCircleLocal = React.createRef();
    this.myRefLeftLine = React.createRef();
    this.myRefRightLine = React.createRef();
  }

  changeStateDetalhes(value){

    this.setState({
      dadosDetalhes: value
    })

    console.log(this.state.dadosDetalhes)

  }

  changeStateProducao(value){

    this.setState({
      dadosProducao: value
    })

    console.log(this.state.dadosProducao)

  }

  changeStateLocal(value){

    this.setState({
      dadosLocal: value
    })

    console.log(this.state.dadosLocal)
  }

  getDadosDetalhes(){
    return this.state.dadosDetalhes
  }

  getDadosProducao(){
    return this.state.dadosProducao
  }

  editPath = (pathReal) => {
    let executePath;
    if (pathReal === "url") {
      let estadoPath = window.location.pathname.split("/");
      let urlPath = estadoPath[estadoPath.length - 1];
      if (urlPath === "inserir") {
        executePath = "detalhes";
      } else if (urlPath === "producao") {
        executePath = "producao";
      } else if (urlPath === "local") {
        executePath = "local";
      }
    } else {
      executePath = pathReal;
    }

    if (executePath === "detalhes") {
      this.myRefCircleDetalhes.current.style.backgroundColor =
        "rgb(212, 212, 212)";
      this.myRefCircleProducao.current.style.backgroundColor =
        "rgb(55, 55, 55)";
      this.myRefCircleLocal.current.style.backgroundColor = "rgb(55, 55, 55)";
      this.myRefLeftLine.current.style.backgroundColor =
        "rgba(212, 212, 212, 0.5)";
      this.myRefRightLine.current.style.backgroundColor =
        "rgba(212, 212, 212, 0.5)";
    } else if (executePath === "producao") {
      this.myRefCircleDetalhes.current.style.backgroundColor =
        "rgb(212, 212, 212)";
      this.myRefCircleProducao.current.style.backgroundColor =
        "rgb(212, 212, 212)";
      this.myRefCircleLocal.current.style.backgroundColor = "rgb(55, 55, 55)";
      this.myRefLeftLine.current.style.backgroundColor = "rgba(212, 212, 212)";
      this.myRefRightLine.current.style.backgroundColor =
        "rgba(212, 212, 212, 0.5)";
    } else if (executePath === "local") {
      this.myRefCircleDetalhes.current.style.backgroundColor =
        "rgb(212, 212, 212)";
      this.myRefCircleProducao.current.style.backgroundColor =
        "rgb(212, 212, 212)";
      this.myRefCircleLocal.current.style.backgroundColor =
        "rgb(212, 212, 212)";
      this.myRefLeftLine.current.style.backgroundColor = "rgba(212, 212, 212)";
      this.myRefRightLine.current.style.backgroundColor = "rgba(212, 212, 212)";
    }
  };

  componentDidMount() {
    this.editPath("url");
  }

  render() {
    return (
      <div className="mainProductsInserir">
        <div className="pathInserirProductFornecedor">
          <Link
            to="/dashboard/Products/inserir"
            className="toLink"
            onClick={() => {
              this.editPath("detalhes");
            }}
          >
            <div ref={this.myRefCircleDetalhes} className="circlePathInserir">
              <h6>Detalhes</h6>
            </div>
          </Link>
          <Link
            to="/dashboard/Products/inserir/producao"
            className="toLink"
            onClick={() => {
              this.editPath("producao");
            }}
          >
            <div ref={this.myRefCircleProducao} className="circlePathInserir">
              <h6>Produção</h6>
            </div>
          </Link>
          <Link
            to="/dashboard/Products/inserir/local"
            className="toLink"
            onClick={() => {
              this.editPath("local");
            }}
          >
            <div ref={this.myRefCircleLocal} className="circlePathInserir">
              <h6>Local produção</h6>
            </div>
          </Link>
          <div ref={this.myRefRightLine} className="rightLinePathInserir"></div>
          <div ref={this.myRefLeftLine} className="leftLinePathInserir"></div>
        </div>
        <Routes>
          <Route path="/" element={<ProductInserirDetalhes changeState={this.changeStateDetalhes}/>} />
          <Route path="/producao" element={<ProductInserirProducao changeState={this.changeStateProducao}/>} />
          <Route path="/local" element={<ProductInserirLocal changeState={this.changeStateLocal} buscarDetalhes={this.getDadosDetalhes} buscarProducao={this.getDadosProducao} />} />
        </Routes>
      </div>
    );
  }
}

export default ProductInserir;
