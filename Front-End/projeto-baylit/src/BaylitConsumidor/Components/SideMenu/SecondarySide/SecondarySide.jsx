import React, { Component } from "react";

import ReactDOM from "react-dom"

import { getNotificacoesUtilizador } from "../../../../Helpers/UserHelper";

class SecondarySide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goBackSideBar: this.props.goBackSideBar,
      mainContentId: this.props.mainContentId,
      id: this.props.id,
      className: this.props.className,
      backPath: this.props.backPath,
      categoryName: this.props.categoryName,
      subCategoryNamesList: this.props.subCategoryNamesList,
      finalIdList: this.props.finalIdList,
    };

    this.refNotificacoes = React.createRef()

    this.getNotificacoes = this.getNotificacoes.bind(this)
  }

  async getNotificacoes(){
    let info = JSON.parse(localStorage.getItem('baylitInfo'))

    if (info && info.logged == "true"){

    
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


        ReactDOM.render(htmlAppend,document.getElementById('refNotificacoes'))
      }

    }
    
  }

  userPerfilButton(name) {
    return (
      <a href="/perfil">
        <li className="perfilSideBar">
          <div className="userSideBar">
            <div className="imagemUserSideBar"></div>
            <h5>{name}</h5>
          </div>
          <i className="bi bi-chevron-right"></i>
        </li>
      </a>
    );
  }

  mainLiButton(name, rightArrow) {
    let returnMainLi;

    returnMainLi = (
      <li className="mainButtonsSideBar">
        <h2>{name}</h2>
      </li>
    );

    return returnMainLi;
  }

  backSecondaryButton(name, icon) {
    return (
      <li
        className="secondaryButtonsSideBar"
        onClick={() => {
          this.state.goBackSideBar(this.state.id, this.state.mainContentId);
        }}
      >
        <i className={icon}></i>
        <h5>{name}</h5>
      </li>
    );
  }

  secondaryButton(name, pathLink) {
    if (name == "Notificações") {
      return (
        <a href={pathLink} className="toLink">
          <li className="secondaryButtonsSideBar">
            {/* <i className={icon}></i> */}
            <h5>
              {name}
              <div id="refNotificacoes">
                {/* <div className="notificacaoMainSide">
                  <span>10</span>
                </div> */}
              </div>
            </h5>
          </li>
        </a>
      );
    } else {
      return (
        <a href={pathLink} className="toLink">
          <li className="secondaryButtonsSideBar">
            {/* <i className={icon}></i> */}
            <h5>{name}</h5>
          </li>
        </a>
      );
    }
  }

  allSecondaryButtons() {
    var mainDiv = [];

    for (let i = 0; i < this.state.subCategoryNamesList.length; i++) {
      mainDiv.push(
        this.secondaryButton(
          this.state.subCategoryNamesList[i],
          this.state.finalIdList[i]
        )
      );
    }
    return mainDiv;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props !== prevProps) {
      this.setState({
        subCategoryNamesList: this.props.subCategoryNamesList,
        finalIdList: this.props.finalIdList,
      });
    }
  }

  async componentDidMount(){
    await this.getNotificacoes()
  }

  render() {
    return (
      <div id={this.state.id} className={this.state.className}>
        {this.backSecondaryButton(
          this.state.backPath,
          "bi bi-chevron-left backIcon"
        )}
        {/* <hr /> */}
        {/* {this.mainLiButton(this.state.categoryName, false)} */}
        <hr />
        {this.allSecondaryButtons()}
      </div>
    );
  }
}

export default SecondarySide;
