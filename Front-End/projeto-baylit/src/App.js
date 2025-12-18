// import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AppAmin from "./BaylitAdmin/AppAdmin";


import AppConsumidor from "./BaylitConsumidor/AppConsumidor";
import AppDashboard from "./BaylitDashboard/AppDashboard";

class App extends Component {

  // constructor(props){
  //   super(props);
  //   AuthVerification();
  // }
  state = {};

  




  render() {
    // window.onload = AuthVerification;
    return (
      <div className="App">
        <Router>
          <Routes>
            <Route path="/*" element={<AppConsumidor />}></Route>
            <Route path="/dashboard/*" element={<AppDashboard />}></Route>
            <Route path="/admin/*" element={<AppAmin />}></Route>
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
