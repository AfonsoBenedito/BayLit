import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./WelcomeAuth.css";

import Logo3DBaylit from "../../../Images/logo3D_baylit_white.png";
import CarBaylit from "../../../Images/car_baylit.png";

import Tiago3D from "../../../Images/Team/Tiago3D.png";
import Tomas3D from "../../../Images/Team/Tomas3D.png";
import Telles3D from "../../../Images/Team/Telles3D.png";
import Renato3D from "../../../Images/Team/Renato3D.png";
import Afonsinho3D from "../../../Images/Team/Afonsinho3D.png";
import Ventura3D from "../../../Images/Team/Ventura3D.png";

import AuthSignUpButton from "../AuthSignUpButton/AuthSignUpButton";
import AuthChangePageButton from "../AuthChangePage/AuthChangePage";

import {getAllConsumidores, getAllFornecedores, getAllTransportadores} from "../../../../Helpers/UserHelper.jsx"
import {pesquisa} from "../../../../Helpers/ProdutoHelper.jsx"

class WelcomeAuth extends Component {
  state = {
    visibleSignBtns: this.props.visibleSignBtns,
    consumidoresS: null,
    fornecedoresS: null,
    transportadoresS: null,
    produtosS: 24,
  };

  async displayQuantities(){
    
    let a = await getAllConsumidores();
    let consumidoresSize = a.length;
    this.setState({
      consumidoresS: consumidoresSize,
    });

    let b = await getAllFornecedores();
    let fornecedoresSize = b.length;
    this.setState({
      fornecedoresS: fornecedoresSize,
    });

    let c = await getAllTransportadores();
    console.log(c);
    console.log(c.length);
    let transportadoresSize = c.length;
    this.setState({
      transportadoresS: transportadoresSize,
    });

    let d = await pesquisa(null, null, null, null, null, null); // Alterar para função que retorne todos os produtos.
    let produtosSize = d.length;
    this.setState({
      produtosS: produtosSize,
    });

  }

  async componentDidMount() {
    await this.displayQuantities();
  }

  render() {
    this.state.visibleSignBtns();
    return (
      <>
        <div className="mainAuthentication">
          <div class="backgroundEffect1"></div>
          <div class="backgroundEffect2"></div>
          <div class="backgroundEffect3"></div>

          <div className="apresentationBlock">
            <div className="apresentationTextBlock">
              <h1>Tem o maior controlo sobre a tua empresa</h1>
              <p>
                BAYLIT DASH permite-te gerir a tua empresa e poder vender mais
                facilmente os teus produtos. Torna-te o maior vendedor do mundo.
                Adere já!
              </p>
              <Link to="/Dashboard/Authentication/SignUp">
                <AuthSignUpButton name="Registar-me" />
              </Link>
              <Link to="/">
                <AuthChangePageButton name="Página de Consumidor" />
              </Link>
            </div>
            <div className="apresentationLogoBlock">
              <img src={Logo3DBaylit} alt="" />
            </div>
            <div className="apresentationDetailsBlock">
              <div id="detailBuyerAuth" className="detailBlockAuth">
                <h3>{this.state.consumidoresS}</h3>
                <p>Consumidores</p>
              </div>
              <div className="detailBlockAuth">
                <h3>{this.state.fornecedoresS}</h3>
                <p>Fornecedores</p>
              </div>
              <div className="detailBlockAuth">
                <h3>{this.state.transportadoresS}</h3>
                <p>Transportadoras</p>
              </div>
              <div id="detailProductAuth" className="detailBlockAuth">
                <h3>{this.state.produtosS}</h3>
                <p>Produtos</p>
              </div>
            </div>
          </div>
        </div>
        <div className="secondaryAuthentication">
          <div className="forRoundDiv"></div>
          <img src={CarBaylit} alt="" />
          <h1>BAYLIT TEAM</h1>
          <div className="teamBaylitAuth">
            <div className="teamMemberAuth">
              <div className="imgTeamMember">
                <img src={Tiago3D} alt="" />
              </div>
              <h3 className="teamMemberNameRule">Tiago Teodoro</h3>
              <p className="teamMemberNameRule">Back-end</p>
            </div>
            <div className="teamMemberAuth">
              <div className="imgTeamMember">
                <img src={Tomas3D} alt="" />
              </div>
              <h3 className="teamMemberNameRule">Tomás Ndlate</h3>
              <p className="teamMemberNameRule">Front-end</p>
            </div>
            <div className="teamMemberAuth">
              <div className="imgTeamMember">
                <img src={Telles3D} alt="" />
              </div>
              <h3 className="teamMemberNameRule">Afonso Telles</h3>
              <p className="teamMemberNameRule">Back-end</p>
            </div>
            <div className="teamMemberAuth">
              <div className="imgTeamMember">
                <img src={Renato3D} alt="" />
              </div>
              <h3 className="teamMemberNameRule">Renato Ramires</h3>
              <p className="teamMemberNameRule">Front-end</p>
            </div>
            <div className="teamMemberAuth">
              <div className="imgTeamMember">
                <img src={Afonsinho3D} alt="" />
              </div>
              <h3 className="teamMemberNameRule">Afonso Benedito</h3>
              <p className="teamMemberNameRule">Back-end</p>
            </div>
            <div className="teamMemberAuth">
              <div className="imgTeamMember">
                <img src={Ventura3D} alt="" />
              </div>
              <h3 className="teamMemberNameRule">Gonçalo Ventura</h3>
              <p className="teamMemberNameRule">Front-end</p>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default WelcomeAuth;
