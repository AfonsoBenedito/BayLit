import React, { Component } from "react";
import "./HeaderPopUpUser.css";

import { Logout } from "../../../../../Helpers/AuthenticationHelper";
import { getUserById, getNotificacoesUtilizador } from "../../../../../Helpers/UserHelper";

import ReactDOM from "react-dom"

class HeaderPopUpUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nome: "",
    };

    this.refNotificacoes = React.createRef()
  }

  async getNotificacoes(){
    let info = JSON.parse(localStorage.getItem('baylitInfo'))

    if (info.logged == "true"){

    
      let res = await getNotificacoesUtilizador(info.id, info.token)

      let cont = 0

      if (res != false){

        for (let i = 0; i < res.length; i++){
          if (res[i].vista == false){
            cont += 1
          }
        }
      }

      if (cont > 0){
      
        let htmlAppend = <div className="notificacaoMainSide">
                      <span>{cont}</span>
                    </div>;


        ReactDOM.render(htmlAppend,this.refNotificacoes.current)
      }

    }
    
  }

  async componentDidMount() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));

    let user = await getUserById(info.id, info.tipo);
    let nome = user.nome;

    this.setState({
      nome: nome,
    });

    await this.getNotificacoes()
  }

  render() {
    return (
      <div className="mainPopUpUser">
        <a href="/perfil">
          <h5>{this.state.nome}</h5>
        </a>
        <a href="/perfil">Perfil</a>
        <a href="/perfil/notificacoes">
          <span id="notificacaoPopUpText">Notificações</span>
          <div ref={this.refNotificacoes}>
            {/* <span id="notificacaoPopUp">
              <h6>10</h6>
            </span>{" "} */}
          </div>
        </a>
        <a href="/perfil/favoritos">Favoritos</a>
        <a href="/perfil">Encomendas</a>
        <a href="/perfil/dados">Definições</a>
        <a
          onClick={() => {
            Logout();
          }}
        >
          Terminar Sessão
        </a>
      </div>
    );
  }
}

export default HeaderPopUpUser;
