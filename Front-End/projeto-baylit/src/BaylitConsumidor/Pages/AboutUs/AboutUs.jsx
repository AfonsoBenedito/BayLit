import React, { Component } from "react";

import "./AboutUs.css";

import BackgroundImage from "../../Images/AboutUs/teamBaylitSobreNos.jpg";

import Tiago3D from "../../Images/AboutUs/Tiago3D.png";
import Tomas3D from "../../Images/AboutUs/Tomas3D.png";
import Telles3D from "../../Images/AboutUs/Telles3D.png";
import Renato3D from "../../Images/AboutUs/Renato3D.png";
import Afonsinho3D from "../../Images/AboutUs/Afonsinho3D.png";
import Ventura3D from "../../Images/AboutUs/Ventura3D.png";

class AboutUs extends Component {
  state = {};
  render() {
    return (
      <div className="mainAboutUs">
        <div className="blockTitleAboutUs">
          <img src={BackgroundImage} alt="" />
          <h5 className="subTitleAboutUs">Conhece a</h5>
          <h1 className="titleAboutUs">Equipa Baylit</h1>
        </div>

        <h1 className="tituloMembros">Membros</h1>
        <div className="teamBaylitAboutUs">
          <div className="teamMemberAboutUs">
            <div className="imgTeamMemberAboutUs">
              <img src={Tiago3D} alt="" />
            </div>
            <h3>Tiago Teodoro</h3>
            <p>Back-end</p>
          </div>
          <div className="teamMemberAboutUs">
            <div className="imgTeamMemberAboutUs">
              <img src={Tomas3D} alt="" />
            </div>
            <h3>Tomás Ndlate</h3>
            <p>Front-end</p>
          </div>
          <div className="teamMemberAboutUs">
            <div className="imgTeamMemberAboutUs">
              <img src={Telles3D} alt="" />
            </div>
            <h3>Afonso Telles</h3>
            <p>Back-end</p>
          </div>
          <div className="teamMemberAboutUs">
            <div className="imgTeamMemberAboutUs">
              <img src={Renato3D} alt="" />
            </div>
            <h3>Renato Ramires</h3>
            <p>Front-end</p>
          </div>
          <div className="teamMemberAboutUs">
            <div className="imgTeamMemberAboutUs">
              <img src={Afonsinho3D} alt="" />
            </div>
            <h3>Afonso Benedito</h3>
            <p>Back-end</p>
          </div>
          <div className="teamMemberAboutUs">
            <div className="imgTeamMemberAboutUs">
              <img src={Ventura3D} alt="" />
            </div>
            <h3>Gonçalo Ventura</h3>
            <p>Front-end</p>
          </div>
        </div>
      </div>
    );
  }
}

export default AboutUs;
