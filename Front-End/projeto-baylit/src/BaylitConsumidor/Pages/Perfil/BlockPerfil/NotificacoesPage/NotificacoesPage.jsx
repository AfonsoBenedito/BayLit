import React, { Component } from "react";
import ReactDOM from "react-dom";

import "./NotificacoesPage.css";

import { alterarVistaNotificacoes, getNotificacoesUtilizador } from "../../../../../Helpers/UserHelper";

class NotificacoesPage extends Component {
  constructor(props) {
    super(props);

    this.myNotificacoes = React.createRef();

    this.state = {
      notificacoes: []
    };

    this.alterarVista = this.alterarVista.bind(this)
  }

  async createNotificacao() {

    let info = JSON.parse(localStorage.getItem('baylitInfo'))

    let notificacoes = await getNotificacoesUtilizador(info.id, info.token)

    

    let result = [];

    if (notificacoes != false){

      

      let notificacoesAdd = []

      for (let i = notificacoes.length - 1; i >= 0; i--) {
        // console.log(notificacoes[i])

        notificacoesAdd.push(notificacoes[i]._id)

        let classVista = ""

        if (notificacoes[i].vista){
          classVista = "bi bi-check-all"
        } else {
          classVista = "bi bi-check"
        }

        result.push(
          <a href={notificacoes[i].link} className="toLink">
            <div className="blockNotificaco">
              {/* <h5>
                De: <span>Utilizador</span>
              </h5> */}
              <h6>
                Mensagem:{" "}
                <span>
                  {notificacoes[i].mensagem}
                </span>
              </h6>
              <div className="vistaNotificacao">
                {/* Se visto a classe é bi bi-check-all */}
                <i class={classVista}></i>
              </div>
            </div>
          </a>
        );
      }

      // console.log(notificacoesAdd)

      this.setState({
        notificacoes: notificacoesAdd
      })
  
      ReactDOM.render(result, this.myNotificacoes.current);

    } else {
      let toAdd = [
        <h5 className="emptyNotificacoesPage">
          Não tens nenhuma notificação.
        </h5>,
      ];
      ReactDOM.render(toAdd, this.myNotificacoes.current);
    }
    
  }

  async alterarVista(){

    // console.log(this.state.notificacoes)

    let info = JSON.parse(localStorage.getItem('baylitInfo'))

    if (this.state.notificacoes != []){

      await alterarVistaNotificacoes(info.id, info.token, this.state.notificacoes)

    }

  }

  async componentDidMount() {
    await this.createNotificacao();
    await this.alterarVista()
  }
  render() {
    return (
      <div ref={this.myNotificacoes} className="mainNotificacoesPage"></div>
    );
  }
}

export default NotificacoesPage;
