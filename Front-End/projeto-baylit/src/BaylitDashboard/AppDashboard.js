import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import Authentication from "./Pages/Authentication/Authentication";

import MainNav from "./Components/MainNav/MainNav";
import MobileNav from "./Components/MobileNav/MobileNav";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Employees from "./Pages/Employees/Employees";
import Products from "./Pages/Products/Products";
import Warehouses from "./Pages/Warehouses/Warehouses";
import Orders from "./Pages/Orders/Orders";
import Reports from "./Pages/Reports/Reports";
import Messages from "./Pages/Messages/Messages";
import Definitions from "./Pages/Definitions/Definitions";
import Support from "./Pages/Support/Support";
import SpecificProductPage from "./Pages/SpecificProduct/SpecificProductPage";
import MessagesChat from "./Pages/MessagesChat/MessagesChat";
import WarehouseProducts from "./Pages/WarehouseProducts/WarehouseProducts";
import Transportes from "./Pages/Transportes/Transportes";
import TestePage from "./Pages/TestePage/TestePage";
import Sedes from "./Pages/Sedes/Sedes";
import Condutores from "./Pages/Condutores/Condutores";
import Servicos from "./Pages/Serviços/Servicos";
import ServicoIndividual from "./Pages/ServiçoIndividual/ServicoIndividual";

import AddProduct from "./Pages/Products/AddProducts";

import "./AppDashboard.css";
import "./Standards/Text.css";
import "./Standards/Scrollbar.css";
import "./Standards/Colors.css";
import ProductsPage from "./Pages/ProductsPage/ProductsPage";

class AppDashboard extends Component {
  state = {};

  displayNavMobile() {
    document.getElementById("mainNav").classList.remove("mainNav");
  }

  undisplayNavMobile() {
    document.getElementById("mainNav").classList.add("mainNav");
  }

  // handlerHideSiteAuthentication(){
  //   document.getElementById("mainNav").style.display = "none";
  // }

  render() {
    return (
      <div className="AppDashboard">
          {/* <Routes>
            <Route exact path="/" element={<Authentication />} />
          </Routes> */}
          {/* <MobileNav openNavMobile={this.displayNavMobile} />
          <MainNav closeNavMobile={this.undisplayNavMobile} /> */}
          <Routes>
            <Route
              index
              path="/authentication/*"
              element={<Authentication />}
            />

            <Route
              path="/"
              element={
                <>
                  {/* <RouteAuthentication />  ESTE É QUE VAI INCLUIR O OUTLET SE NÃO REDIRECIONA PARA O AUTENTICATION */}
                  <MobileNav openNavMobile={this.displayNavMobile} />
                  <MainNav closeNavMobile={this.undisplayNavMobile} />
                </>
              }
            >
              {/* <Route exact path="/" element={<Authentication handlerHideSite={this.handlerHideSiteAuthentication} />} /> */}
              <Route path="/*" element={<Dashboard />} />
              <Route path="*" element={<Navigate replace to="Dashboard" />} />
              <Route index element={<Navigate replace to="PerfilCompany" />} /> 

              <Route index path="Employees" element={<Employees />} />
              <Route index path="Products/*" element={<ProductsPage />} />
              <Route
                index
                path="SpecificProduct"
                element={<SpecificProductPage />}
              />
              <Route index path="/SpecificProduct/:idProduto" element={<SpecificProductPage />} />
              <Route index path="Warehouses" element={<Warehouses />} />
              <Route index path="Sedes" element={<Sedes />} />
              <Route index path="Condutores" element={<Condutores />} />
              <Route index path="Transportes" element={<Transportes />} />
              <Route index path="/Warehouses/:idArmazem" element={<WarehouseProducts />} />
              <Route index path="Orders" element={<Orders />} />
              <Route index path="Servicos" element={<Servicos />} />
              <Route index path="/Servico/:idServico" element={<ServicoIndividual />} />
              <Route index path="Reports" element={<Reports />} />
              {/* <Route index path="Messages" element={<Messages />} />
              <Route index path="MessagesChat" element={<MessagesChat />} /> */}
              <Route index path="Definitions" element={<Definitions />} />
              <Route index path="Support" element={<Support />} />
              <Route index path="/AddProduct" element={<AddProduct />}/>
            </Route>
            {/* <Route index path="/teste" element={<TestePage />} /> */}

            {/* <Route path="/" element={<Navigate replace to="authentication" />} /> */}
          </Routes>
      </div>
    );
  }
}

export default AppDashboard;