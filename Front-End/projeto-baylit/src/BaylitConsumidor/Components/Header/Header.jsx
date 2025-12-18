import React, { Component } from "react";
import MainNav from "./MainNav/MainNav";
import BottomNav from "./BottomNav/BottomNav";

class Header extends Component {
  state = {
    openSideMenu: this.props.openSideMenu,
    openLogin: this.props.openLogin,
  };

  render() {
    return (
      <header>
        <MainNav
          openSideMenu={this.state.openSideMenu}
          openLogin={this.state.openLogin}
        />
        <BottomNav />
      </header>
    );
  }
}

export default Header;
