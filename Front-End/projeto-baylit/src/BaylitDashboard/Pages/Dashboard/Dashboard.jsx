import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./Dashboard.css";

import NavDashboard from "./NavDashboard/NavDashboard";
import CompanyPerfil from "./CompanyPerfil/CompanyPerfil";
import Promotions from "./Promotions/Promotions";
import Sustainability from "./Sustainability/Sustainability";
import { AuthVerificationDashboard } from "../../../Helpers/AuthVerification";
import Notificacoes from "./Notificacoes/Notificacoes";

class Dashboard extends Component {
  state = {};

  async componentDidMount() {
    await AuthVerificationDashboard();
  }

  render() {
    return (
      <div className="mainDashboard">
        <div className="topBlockDashboard">
          <h2 className="mainPath">Dashboard</h2>
          <NavDashboard
          // changePerfilCompany={this.changePerfilCompany}
          // // changePromotions={this.changePromotions}
          // changeNotificacao={this.changeNotificacao}
          // changeSustainability={this.changeSustainability}
          />
          <Routes>
            <Route path="/PerfilCompany" element={<CompanyPerfil />}></Route>
            {/* <Route path="/Promotions" element={<Promotions />}></Route> */}
            <Route path="/Notificacoes" element={<Notificacoes />}></Route>
            <Route
              path="/"
              element={<Navigate replace to="PerfilCompany" />}
            ></Route>
            <Route path="/Sustainability" element={<Sustainability />}></Route>
          </Routes>
          {/* <CompanyPerfil /> */}
        </div>
      </div>
    );
  }
}

export default Dashboard;
