import React, { Component } from "react";
import "./SignUpChoise.css";
import SignUpFornecedor from "../SignUpFornecedor/SignUpFornecedor";
import SignUpTransportador from "../SignUpTransportador/SignUpTransportador";
import WordBaylit from "../../../Images/word_baylit_white.png";
import { Link, Route, Routes } from "react-router-dom";

class SignUpChoise extends Component {
  state = {
    removeSignInBtn: this.props.removeSignInBtn,
  };
  render() {
    //this.state.removeSignInBtn();
    return (
      <>
        <img className="imageBaylitSignIn" src={WordBaylit} alt="" />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h2 className="titleSignIn">Quem és tu?</h2>
                <div className="mainSignIn">
                  <Link to="/dashboard/Authentication/SignUp/Fornecedor">
                    <div className="mainFornecedor">
                      <div id="fornecedorInfo">
                        {/*<i class="bi bi-building iconeFornecedor"></i>*/}
                        <h4>Fornecedor</h4>
                        {/* <i class="bi bi-arrow-right-circle-fill iconeSetaF"></i> */}
                      </div>
                    </div>
                  </Link>
                  <Link to="/dashboard/Authentication/SignUp/Transportador">
                    <div className="mainTransportador">
                      <div id="transportadorInfo">
                        {/*<i class="bi bi-truck iconeTransportador"></i>*/}
                        <h4>Transportador</h4>
                        {/*<i class="bi bi-arrow-right-circle-fill iconeSetaT"></i>*/}
                      </div>
                    </div>
                  </Link>
                </div>
              </>
            }
          />
          <Route path="/Fornecedor" element={<SignUpFornecedor />} />

          <Route path="/Transportador" element={<SignUpTransportador />} />
        </Routes>
      </>
    );
  }
}

export default SignUpChoise;
