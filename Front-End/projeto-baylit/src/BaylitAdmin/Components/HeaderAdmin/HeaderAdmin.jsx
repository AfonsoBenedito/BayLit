import React, { Component } from "react";

import LogoBaylit from "../../Images/logo_baylit_black.svg";

import "./HeaderAdmin.css";

class HeaderAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.myRefTerminar = React.createRef();
  }

  endSession() {
    localStorage.removeItem("baylitInfo");
    window.location = "/Admin/login";
  }

  componentDidMount() {
    let info = JSON.parse(localStorage.getItem("baylitInfo"));
  }

  render() {
    return (
      <nav className="mainHeaderAdmin">
        <div className="sizeMainHeaderAdmin">
          <div className="headerAdminLogo">
            <img src={LogoBaylit} alt="Logotipo Baylit" />
          </div>
          {/* <div className="headerAdminBtns">
            <a href="">
              <h5>Utilizadores</h5>
            </a>
            <a href="">
              <h5>Produtos</h5>
            </a>
          </div> */}
          <div
            ref={this.myRefTerminar}
            id="terminarAdmin"
            className="headerAdminLeave"
            onClick={this.endSession}
          >
            <h6>Terminar sessão</h6>
            <i class="bi bi-box-arrow-in-right"></i>
          </div>
        </div>
      </nav>
    );
  }
}

export default HeaderAdmin;
