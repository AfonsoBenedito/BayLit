import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./Messages.css";


class Messages extends Component {
  state = {};

  render() {
    return (
      <div className="mainMessages">
        <div className="topBlockMessages">
            <h2 className="mainPath">Mensagens</h2>
            
            <div>
              <input className="messagesSearch" placeholder="Procura mensagens"></input>
            </div>

            <div className="messageDivision"></div>
            <div className="messagesDiv">
              <div className="messageChat">
                <div className="messagePersonPhoto"></div>
                <p className="messagePersonName">Geremias Coentrão</p>
                <p className="messagePersonmessage">Vimos por este meio informar que Tomas Ndlate, CEO da empresa, garantiu vaga no Big Brother famosos! Parabéns.</p>
                <p className="messageDate">09/09/2022</p>
              </div>
              <div className="messageChat">
                <div className="messagePersonPhoto"></div>
                <p className="messagePersonName">Atanásio Patrício</p>
                <p className="messagePersonmessage">Informo que a encomenda de nites para o Ventura foi entregue hoje pela madrugada, obrigado!</p>
                <p className="messageDate">09/09/2022</p>
              </div>
              <div className="messageChat">
                <div className="messagePersonPhoto"></div>
                <p className="messagePersonName">Afonso Manuel Mexia Telles da Silva</p>
                <p className="messagePersonmessage">Quero jola...</p>
                <p className="messageDate">09/09/2022</p>
              </div>
              <div className="messageChat">
                <div className="messagePersonPhoto"></div>
                <p className="messagePersonName">AxoTelio e Companhia</p>
                <p className="messagePersonmessage">Queria divulgar o meu serviço de explicações de contabilidade, tem interesse?</p>
                <p className="messageDate">09/09/2022</p>
              </div>
              <div className="messageChat">
                <div className="messagePersonPhoto"></div>
                <p className="messagePersonName">Hamburgaria do Bairro</p>
                <p className="messagePersonmessage">Ganhaste 1000€ maluco, parabéns!</p>
                <p className="messageDate">09/09/2022</p>
              </div>
            </div>
            {/* <div className="messagesDiv">
              <div className="messageChat"></div>
              <div className="messageChat"></div>
              <div className="messageChat"></div>
              <div className="messageChat"></div>
              <div className="messageChat"></div>
              <div className="messageChat"></div>
              <div className="messageChat"></div>
              <div className="messageChat"></div>
            </div> */}
        </div>
      </div>
    );
  }
}

export default Messages;