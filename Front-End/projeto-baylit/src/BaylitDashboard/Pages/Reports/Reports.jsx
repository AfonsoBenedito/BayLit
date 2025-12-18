import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./Reports.css";
import Sustainability from "../Dashboard/Sustainability/Sustainability";

import { AuthVerificationDashboard } from "../../../Helpers/AuthVerification";


class Reports extends Component {
  state = {};

  async componentDidMount(){
    await AuthVerificationDashboard();
  }

  render() {
    return (
      <div className="mainReports">
        <div className="topBlockReports">
          <h2 className="mainPath">Relatórios</h2>
          <Sustainability/>
            
        </div>
      </div>
    );
  }
}

export default Reports;