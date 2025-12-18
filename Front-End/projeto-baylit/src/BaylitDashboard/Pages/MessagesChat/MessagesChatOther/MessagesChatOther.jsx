import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./MessagesChatOther.css";

class MessagesChatOther extends Component {
  state = {};

  render() {
    return (
      <div className="messagesChatOther">
        <p className="messagesChatOtherMsg">A amizade consegue ser tão complexa...
            Deixa uns desanimados, outros bem felizes...
            É a alimentação dos fracos
            É o reino dos fortes

            Faz-nos cometer erros
            Os fracos deixam se ir abaixo
            Os fortes erguem sempre a cabeça
            os assim assim assumem-os

            Sem pensar conquistamos
            O mundo geral
            e construímos o nosso pequeno lugar
            deixando brilhar cada estrelinha

            Estrelinhas...
            Doces, sensíveis, frias, ternurentas...
            Mas sempre presentes em qualquer parte
            Os donos da amizade...
        </p>
      </div>
    );
  }
}

export default MessagesChatOther;