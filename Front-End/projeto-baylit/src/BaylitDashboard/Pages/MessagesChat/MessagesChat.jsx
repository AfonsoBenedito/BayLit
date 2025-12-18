import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./MessagesChat.css";
import productImage from '../../Images/productImage.png';
import MessagesChatOwner from "./MessagesChatOwner/MessagesChatOwner";
import MessagesChatOther from "./MessagesChatOther/MessagesChatOther";

class MessagesChat extends Component {
  state = {};

  render() {
    return (
      <div className="mainMessagesChat">
        <div className="topBlockMessagesChat">
            <h2 className="mainPath">Messages Chat</h2>
        </div>
        <div className="bottomBlockMessagesChat">
            <div className="messagesChatOtherDiv">
                <div className="messagesChatOtherProfilePic">
                    <img className="messagesChatOtherProfilePicSrc" src={productImage}></img>
                </div>
                <div className="messagesChatOtherProfileInfo">
                    <p className="messagesChatOtherProfileI1">Nome da persona muita maluca</p>
                    <p className="messagesChatOtherProfileI2">Tipo de perfil (Admin, etc..)</p>
                </div>
            </div>
            <div className="messagesChatDisplayDiv">
                <MessagesChatOwner/>
                <MessagesChatOther/>
            </div>

            <div className="messagesChatWriteDiv">
                <input className="messagesChatWriteInput" placeholder="Escreva uma mensagem..." type="text"></input>
                <div className="messagesChatWriteButton">
                    <i class="bi bi-send-fill messageChatSendIcon"></i>
                </div>
            </div>
        </div>
      </div>
    );
  }
}

export default MessagesChat;