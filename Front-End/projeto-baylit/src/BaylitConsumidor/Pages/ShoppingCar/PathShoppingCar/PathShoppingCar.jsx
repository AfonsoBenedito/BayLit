import React, { Component } from "react";
import DadosEntrega from "../DadosEntrega/DadosEntrega";
import "./PathShoppingCar.css";

class PathShoppingCar extends Component {
  constructor(props) {
    super(props);

    this.myRefEstado1Circle = React.createRef();
    this.myRefEstado2Circle = React.createRef();
    this.myRefEstado3Circle = React.createRef();
    this.myRefEstado4Circle = React.createRef();

    this.myRefEstado2Line = React.createRef();
    this.myRefEstado3Line = React.createRef();
    this.myRefEstado4Line = React.createRef();

    let estadoPath = window.location.pathname.split("/").length;
    // let nameEstadoPath = estadoPath[estadoPath.length - 1];

    let numEstado;

    console.log(estadoPath);

    if (estadoPath == 2) {
      numEstado = 1;
    } else if (estadoPath == 3) {
      numEstado = 2;
    } else if (estadoPath == 4) {
      numEstado = 3;
    } else if (estadoPath == 5) {
      numEstado = 4;
    } else {
      numEstado = 1;
    }

    this.state = {
      estado: numEstado,
      estadoReal: this.props.estado,
      carrinho: "/ShoppingCar",
      dados: "/ShoppingCar",
      transporte: "/ShoppingCar",
      pagamento: "/ShoppingCar"
    };
    
    
  }

  displayPath = () => {
    if (this.state.estado == 1) {
      this.myRefEstado1Circle.current.style.backgroundColor = "black";
    } else if (this.state.estado == 2) {
      this.myRefEstado1Circle.current.style.backgroundColor = "black";
      this.myRefEstado2Circle.current.style.backgroundColor = "black";

      this.myRefEstado2Line.current.style.backgroundColor = "black";
    } else if (this.state.estado == 3) {
      this.myRefEstado1Circle.current.style.backgroundColor = "black";
      this.myRefEstado2Circle.current.style.backgroundColor = "black";
      this.myRefEstado3Circle.current.style.backgroundColor = "black";

      this.myRefEstado2Line.current.style.backgroundColor = "black";
      this.myRefEstado3Line.current.style.backgroundColor = "black";
    } else if (this.state.estado == 4) {
      this.myRefEstado1Circle.current.style.backgroundColor = "black";
      this.myRefEstado2Circle.current.style.backgroundColor = "black";
      this.myRefEstado3Circle.current.style.backgroundColor = "black";
      this.myRefEstado4Circle.current.style.backgroundColor = "black";

      this.myRefEstado2Line.current.style.backgroundColor = "black";
      this.myRefEstado3Line.current.style.backgroundColor = "black";
      this.myRefEstado4Line.current.style.backgroundColor = "black";
    }
  };

  componentDidMount() {
    this.displayPath();

    let nomeEstado = window.location.pathname.split("/");

    console.log(nomeEstado)

    for(let i=2; i<this.state.estado+1; i++){
      console.log(i);
      if (i==2){
        this.setState({
          dados: this.state.dados + nomeEstado[i] + "/"
        })    
      }

      if (i==3){
        this.setState({
          transporte: this.state.dados + nomeEstado[i] + "/"
        })    
      }

      if (i==4){
        this.setState({
          pagamento: this.state.transporte + nomeEstado[i] + "/"
        })    
      }
      
    }
    console.log(this.state.dados)
  }

  render() {
    return (
      <div className="blockPathShoppingCar">
        <div className="pathShoppingCar">
          <div ref={this.myRefEstado1Circle} className="circlePath">
            <h6>Carrinho</h6>
          </div>
        </div>

        <div className="pathShoppingCar">
          <div ref={this.myRefEstado2Line} className="linePath"></div>
          <a href={this.state.dados}>
          <div ref={this.myRefEstado2Circle} className="circlePath">
            <h6>Dados entrega</h6>
          </div>
          </a>
        </div>

        <div className="pathShoppingCar">
          <div ref={this.myRefEstado3Line} className="linePath"></div>
          <div ref={this.myRefEstado3Circle} className="circlePath">
            <h6>Escolher transporte</h6>
          </div>
        </div>

        <div className="pathShoppingCar">
          <div ref={this.myRefEstado4Line} className="linePath"></div>
          <div ref={this.myRefEstado4Circle} className="circlePath">
            <h6>Pagamento</h6>
          </div>
        </div>
      </div>
    );
  }
}

export default PathShoppingCar;
