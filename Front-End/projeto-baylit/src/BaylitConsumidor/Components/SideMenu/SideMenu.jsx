import React, { Component, Children } from "react";
import ReactDOM from "react-dom";
import "./SideMenu.css";
import MainSide from "./MainSide/MainSide";
import SecondarySide from "./SecondarySide/SecondarySide";
import { getCategorias } from "../../../Helpers/CategoryHelper";
// import DisplaySideBarMenu from "./displaySideBarMenu/DisplaySideBarMenu";
// import "./displaySideBarMenu/DisplaySideBarMenu.css";
// import LogoBaylit from "../../Images/logo_baylit_black.svg";

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      closeSideMenu: this.props.closeSideMenu,

      openLogin: this.props.openLogin,

      categoryNames: [],
      finalIdList: [],
    };
  }

  expandSideBar = (selfContentId, nextContentId) => {
    document.getElementById(selfContentId).style.left = "-100%";
    document.getElementById(nextContentId).style.left = "0";
  };

  goBackSideBar = (selfContentId, mainContentId) => {
    document.getElementById(selfContentId).style.left = "100%";
    document.getElementById(mainContentId).style.left = "0";
  };

  async getCategoryNames() {
    let categorias = await getCategorias();

    let finalList = [];
    let finalIdList = [];

    for (let i = 0; i < categorias.length; i++) {
      finalList.push(categorias[i].nome);
      finalIdList.push("/shop/" + categorias[i]._id);
      // console.log(categorias[i]._id);
    }

    this.setState({
      categoryNames: finalList,
      finalIdList: finalIdList,
    });
  }

  async componentDidMount() {
    await this.getCategoryNames();
  }

  render() {
    return (
      <div id={this.state.id} className="fullSideMenu">
        <div
          id="backgroundSideBar"
          onClick={() => {
            this.state.closeSideMenu();
          }}
        ></div>
        <div id="mainSideBarMenu">
          {/* TUDO */}
          {/* <DisplaySideBarMenu verifyType="main" /> */}
          <MainSide
            id="mainContentSideBar"
            className="mainDisplaySideBarMenu"
            expandFunction={this.expandSideBar}
            perfilContentId="perfilContentSideBar"
            shopContentId="shopContentSideBar"
            promotionContentId="promotionContentSideBar"
            openLogin={this.state.openLogin}
            goBackSideBar={this.goBackSideBar}
          />

          {/* INSIDE PERFIL */}
          <SecondarySide
            goBackSideBar={this.goBackSideBar}
            mainContentId="mainContentSideBar"
            id="perfilContentSideBar"
            className="mainDisplaySideBarMenu"
            backPath="Tudo"
            categoryName="Tomás Ndlate"
            subCategoryNamesList={[
              "Perfil",
              "Notificações",
              "Favoritos",
              "Encomendas",
              "Definições de conta",
              "Terminar sessão",
            ]}
            finalIdList={[
              "/perfil",
              "perfil/encomendas",
              "/",
              "/perfil/favoritos",
              "/perfil/dados",
              "/perfil/logout",
            ]}
          />

          {/* INSIDE LOJA */}
          <SecondarySide
            goBackSideBar={this.goBackSideBar}
            mainContentId="mainContentSideBar"
            id="shopContentSideBar"
            className="mainDisplaySideBarMenu"
            backPath="Tudo"
            categoryName="Loja"
            subCategoryNamesList={this.state.categoryNames}
            finalIdList={this.state.finalIdList}
          />
          {/* <h1>{this.}</h1> */}

          {/* INSIDE LOJA */}
          {/* <SecondarySide
            goBackSideBar={this.goBackSideBar}
            mainContentId="mainContentSideBar"
            id="promotionContentSideBar"
            className="mainDisplaySideBarMenu"
            backPath="Tudo"
            categoryName="Promoções"
            subCategoryNamesList={["testeeee"]}
          /> */}
        </div>
      </div>
    );
  }
}

export default SideMenu;
