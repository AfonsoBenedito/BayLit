// import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "./Standards/Text.css";
import "./Standards/Icons.css";
import "./Standards/Scrollbar.css";
import "./Standards/Colors.css";
import "./Standards/Sizes.css"

import "./AppConsumidor.css"

import Header from "./Components/Header/Header";
import SideMenu from "./Components/SideMenu/SideMenu";
import Login from "./Components/Login/Login";
import FooterBaylit from "./Components/FooterBaylit/FooterBaylit"

import {AuthVerification} from "../Helpers/AuthVerification";

// Lazy load components below the fold for better initial load performance
import Home from "./Pages/Home/Home";
import Shop from "./Pages/Shop/Shop";
import SignUp from "./Pages/SignUp/SignUp";
import ShoppingCar from "./Pages/ShoppingCar/ShoppingCar";
import Perfil from "./Pages/Perfil/Perfil";
import ProductPage from "./Pages/ProductPage/ProductPage";
import TestePage from "./Pages/TestePage/TestePage";
import Compare from "./Pages/Compare/Compare";
import Pesquisa from "./Pages/Pesquisa/Pesquisa";
import Sustentabilidade from "./Pages/Sustentabilidade/Sustentabilidade";
import FAQ from "./Pages/FAQ/FAQ";
import AboutUs from "./Pages/AboutUs/AboutUs";

import ConfirmEmail from "./Pages/Redirecionamentos/confirmEmail";
import ConfirmPagamento from "./Pages/Redirecionamentos/pagamentoConfirmado";

class AppConsumidor extends Component {

  constructor(props){
    super(props);
    // AuthVerification();

    this.state = {
    }
  }

  openSideMenu = () => {
    document.body.style.overflowY = "hidden";
    document.getElementById("sideMenu").style.display = "block";
  };

  closeSideMenu = () => {
    document.getElementById("sideMenu").style.display = "none";
    document.body.style.overflowY = "visible";
  };

  openLogin = () => {
    document.body.style.overflowY = "hidden";
    document.getElementById("mainLogin").style.display = "block";
  };
  closeLogin = () => {
    document.getElementById("mainLogin").style.display = "none";
    document.body.style.overflowY = "visible";
  };

  authVerification = () => {
    if (localStorage.getItem("authenticationValue") == "true") {
      document.getElementById("btnOpenLogin").style.backgroundColor = "red";
    } else {
      document.getElementById("btnOpenLogin").style.backgroundColor = "green";
    }

    // console.log("login true");
    // return null;
  };

  async componentDidMount(){
    await AuthVerification();
  }

  changePopUpFotos = (tipoFunction, listaSource) =>{
    this.setState({
      popUpFotosEstadoDisplay: "initial",
      popUpFotosSource: listaSource
    })
  }


  render() {
    // window.onload = AuthVerification;
    return (
      <div className="AppConsumidor">
        {/* <AuthVerification /> */}
        
          <Header openSideMenu={this.openSideMenu} openLogin={this.openLogin} />
          <Login closeLogin={this.closeLogin} />
          <SideMenu id="sideMenu" openLogin={this.openLogin} closeSideMenu={this.closeSideMenu} />

          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route exact path="/Shop/*" element={<Shop />}></Route>
            <Route exact path="/signup" element={<SignUp />}></Route>
            <Route exact path="/shoppingcar/*" element={<ShoppingCar />}></Route>
            <Route exact path="/perfil/*" element={<Perfil />}></Route>
            <Route exact path="/compare" element={<Compare />}></Route>
            <Route exact path="/pesquisa" element={<Pesquisa />}></Route>
            <Route exact path="/sustentabilidade" element={<Sustentabilidade />}></Route>
            <Route exact path="/faq" element={<FAQ />}></Route>
            <Route exact path="/aboutus" element={<AboutUs />}></Route>
            <Route exact path="/teste" element={<TestePage />}></Route>
            <Route exact path="/confirm" element={<ConfirmEmail />}></Route>
            <Route exact path="/Sucess" element={<ConfirmPagamento />}></Route>
          </Routes>

          <FooterBaylit />
          {/* {this.authVerification} */}
       
      </div>
    );
  }
}

export default AppConsumidor;