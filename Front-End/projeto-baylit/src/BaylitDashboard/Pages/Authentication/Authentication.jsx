import React, { Component } from "react";
import { Link, Route, Routes } from "react-router-dom";

import "./Authentication.css";
import WelcomeAuth from "./WelcomeAuth/WelcomeAuth";
import NavAuth from "./NavAuth/NavAuth";
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";
import SignUpChoise from "./SignUpChoise/SignUpChoise";
import SignUpFornecedor from "./SignUpFornecedor/SignUpFornecedor";
import SignUpTransportador from "./SignUpTransportador/SignUpTransportador";

class Authentication extends Component {
  state = {
    handlerHideSite: this.props.handlerHideSite,
  };

  loginFunction() {
    localStorage.setItem("authenticationValue", "true");

    window.location.href = "/";
  }

  logoutFunction() {
    localStorage.setItem("authenticationValue", "false");
  }

  removeSignInBtn() {
    if (document.getElementById("navAuthSignIn") != null) {
      document.getElementById("navAuthSignIn").style.display = "inline-block";
      document.getElementById("navAuthSignUp").style.display = "inline-block";
    }
  }

  removeSignUpBtn() {
    if (document.getElementById("navAuthSignUp") != null) {
      document.getElementById("navAuthSignUp").style.display = "none";
      document.getElementById("navAuthSignIn").style.display = "inline-block";
    }
  }

  visibleSignBtns() {
    if (document.getElementById("navAuthSignUp") != null) {
      document.getElementById("navAuthSignUp").style.display = "inline-block";
      document.getElementById("navAuthSignIn").style.display = "inline-block";
    }
  }

  render() {
    // this.state.handlerHideSite();
    return (
      <div>
        <NavAuth />
        <Routes>
          <Route
            path="/"
            element={<WelcomeAuth visibleSignBtns={this.visibleSignBtns} />}
          />
          <Route
            path="/signIn"
            element={<SignIn removeSignInBtn={this.removeSignInBtn} />}
          />
          <Route
            path="/signUp/*"
            element={<SignUpChoise removeSignUpBtn={this.removeSignUpBtn} />}
          />
        </Routes>

        {/* <SignUpChoise />
        <SignUpFornecedor /> */}
      </div>
    );
  }
}

export default Authentication;
