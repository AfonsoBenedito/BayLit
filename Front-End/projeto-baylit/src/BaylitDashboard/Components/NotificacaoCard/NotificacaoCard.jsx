import React, { Component } from "react";
import ReactDOM from "react-dom"

import "../NotificacaoCard/NotificacaoCard.css";

class NotificacaoCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mensagem: this.props.mensagem,
      caminho: this.props.caminho,
      vista: this.props.vista
    };

    this.refVista = React.createRef()

    this.mudarVista = this.mudarVista.bind(this)
  }

  mudarVista(){

    if (this.state.vista){
      ReactDOM.render(<i className={"bi bi-check-all viewMessage"}></i>, this.refVista.current)
    } else {
      ReactDOM.render(<i className={"bi bi-check viewMessage"}></i>, this.refVista.current)
    }
  }

  componentDidMount(){
    this.mudarVista()
  }

  render() {
    return (
      <div className="mainNotificacaoCard">
        <a href={this.state.caminho} className="toLink">
          <div className="mainNotificacaoContent">
            <p id="mensagemNotificacao">
              {this.state.mensagem}
            </p>
            <div className="iconViewMessageDiv" ref={this.refVista}>
              {/* <i className={"bi bi-check viewMessage"}></i> */}
            </div>
          </div>
        </a>
      </div>
    );
  }
}
export default NotificacaoCard;
