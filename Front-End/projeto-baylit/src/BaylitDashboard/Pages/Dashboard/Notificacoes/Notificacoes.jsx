import React, { Component } from "react";
import ReactDOM from "react-dom";
import NotificacaoCard from "../../../Components/NotificacaoCard/NotificacaoCard";
import "./Notificacoes.css";
import { GetNotificacoesUtilizador } from "../../../../Helpers/NotificacoesHelper";
import SadSmile from "../../../Images/SadSmile.png";
import SadSmileWhite from "../../../Images/SadSmileWhite.png";
import { alterarVistaNotificacoes, getNotificacoesUtilizador } from "../../../../Helpers/UserHelper";

class Notificacoes extends Component {
  constructor(props) {
    super(props);

    this.refNotificacoes = React.createRef();
    this.refZero = React.createRef()
  }


  async getNotificacoes(){

    let info = JSON.parse(localStorage.getItem('baylitInfo'))

    let notificacoes = await getNotificacoesUtilizador(info.id, info.token)

    console.log(notificacoes)

    let htmlAppend = []

    if (notificacoes != false){

      if (notificacoes.length != 0){

        let notificacoesAdd = []

        for (let i = 0; i < notificacoes.length; i++){

          notificacoesAdd.push(notificacoes[i]._id)

          htmlAppend.push(<NotificacaoCard mensagem={notificacoes[i].mensagem} caminho={notificacoes[i].link} vista={notificacoes[i].vista} />)

        }

        await alterarVistaNotificacoes(info.id, info.token, notificacoesAdd)

        ReactDOM.render(htmlAppend, this.refNotificacoes.current)

      } else {
        htmlAppend.push(<div className="zeroNotificaçõesDiv">
                          <div className="zeroNotificationsImageDiv">
                            <img className="zeroNotificationsImage" src={SadSmileWhite}></img>
                          </div>
                          <h4 id="zeroNotificationText">Zero Notificações</h4>
                        </div>)

        ReactDOM.render(htmlAppend, this.refZero.current)
      }

    } else {
      htmlAppend.push(<div className="zeroNotificaçõesDiv">
                          <div className="zeroNotificationsImageDiv">
                            <img className="zeroNotificationsImage" src={SadSmileWhite}></img>
                          </div>
                          <h4 id="zeroNotificationText">Zero Notificações</h4>
                        </div>)
      ReactDOM.render(htmlAppend, this.refZero.current)
    }


  }

  changeNotificacoesInside(){

    document.getElementById("btnPromotions").style.backgroundColor =
      "rgba(96, 96, 96, 0.7)";
    document.getElementById("btnPerfilCompany").style.backgroundColor =
      "transparent";
    document.getElementById("btnSustainability").style.backgroundColor =
      "transparent";
  }

  async componentDidMount() {
    this.changeNotificacoesInside();
    await this.getNotificacoes()
  }

  render() {
    return (
      <div>
        <div ref={this.refZero}>
          {/* <div className="zeroNotificaçõesDiv">
            <div className="zeroNotificationsImageDiv">
              <img className="zeroNotificationsImage" src={SadSmileWhite}></img>
            </div>
            <h4 id="zeroNotificationText">Zero Notificações</h4>
          </div> */}
        </div>
        
        
        <div className="mainC" ref={this.refNotificacoes}>
          {/* <NotificacaoCard />
          <NotificacaoCard /> */}
        </div>
      </div>
    );
  }
}

export default Notificacoes;
