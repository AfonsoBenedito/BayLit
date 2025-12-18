import React, { Component } from "react";
import "./NavAuth.css";

import { Link } from "react-router-dom";
import SignButton from "../SignButton/SignButton";
import LogoBaylit from "../../../Images/logo_baylit_white.png";

class NavAuth extends Component {
  state = {};

  render() {
    return (
      <div id="navAuthentication">
        <div id="forBackNavAuth"></div>
        <div className="leftBlockNavAuth">
          <Link to="">
            <img id="logoNavAuth" src={LogoBaylit} alt="" />
          </Link>
          {/* <div class="buttonsNavAuth">
                <h5>Empresas</h5>
                <h5>Equipa baylit</h5>
              </div> */}
        </div>
        <div className="rightBlockNavAuth">
          <Link to="signIn">
            <SignButton id="navAuthSignIn" name="Login" theme="lightIn" />
          </Link>
          <Link to="signUp">
            <SignButton id="navAuthSignUp" name="Registo" theme="lightUp" />
          </Link>
        </div>
      </div>
    );
  }
}

export default NavAuth;
