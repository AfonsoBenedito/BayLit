import React, { Component } from "react";
import "./MobileNav.css";
import LogoBaylit from "../../Images/logo_baylit_white.png";

class MobileNav extends Component {
  state = {
    openNavMobile: this.props.openNavMobile,
  };
  render() {
    return (
      <div id="mobileNav">
        <img id="logoMobileNav" src={LogoBaylit} />
        <div id="buttonsMobileNav">
          <i className="bi bi-box-seam"></i>
          <i className="bi bi-grid"></i>
          <i
            id="openMobileNav"
            className="bi bi-list"
            onClick={() => {
              this.state.openNavMobile();
            }}
          ></i>
        </div>
      </div>
    );
  }
}

export default MobileNav;
