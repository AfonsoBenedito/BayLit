import React from "react";
import apiInfo from "../apiInfo.json";

async function AuthVerification() {
  //console.log("Check Integrity");

  let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));

  let tiposPossiveis = [
    "Consumidor",
    "NaoAutenticado",
  ];

  let tiposRedirect = [
    "Fornecedor",
    "Transportador",
    "Administrador"
  ]

  let tiposLogged = ["true", "false"];

  if (baylitInfo != null) {
    let token = baylitInfo.token;
    let id = baylitInfo.id;
    let tipo = baylitInfo.tipo;
    let logged = baylitInfo.logged;

    if ( token != null && id != null && tiposPossiveis.includes(tipo) && tiposLogged.includes(logged) ) {
      
      if (await verifyToken(token)){
        return true
      }

    } else if (token != null && id != null && tiposRedirect.includes(tipo) && tiposLogged.includes(logged)){

      if (tipo == "Administrador"){

        window.location.href = "/Admin"

      } else {

        window.location.href = "/Dashboard"

      }
      

    }
  }

  //console.log("Nao Autenticado");

  const requestOptions = {
    method: "POST",
  };

  let toStorage = {};

  await fetch(
    apiInfo.apiLink + "/auth/register/nao_autenticado",
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 201) {
        toStorage = {
          token: data.data.auth_token,
          id: data.data.user.id,
          logged: "false",
          tipo: data.data.user.tipo,
        };

        localStorage.setItem("baylitInfo", JSON.stringify(toStorage));
        window.location.href = "/"
        
      } else {
      }
    });
  // return <h1>ola</h1>;
}

async function AuthVerificationDashboard(){
  let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));

  let tiposPossiveis = [
    "Fornecedor",
    "Transportador",
  ];
  let tiposLogged = ["true", "false"];

  if (baylitInfo != null) {
    let token = baylitInfo.token;
    let id = baylitInfo.id;
    let tipo = baylitInfo.tipo;
    let logged = baylitInfo.logged;

    if ( token != null && id != null && tiposPossiveis.includes(tipo) && tiposLogged.includes(logged)) {

      if (await verifyToken(token)){
        return true
      }

    } else if (token != null && id != null && tipo == "Administrador" && tiposLogged.includes(logged)){

      window.location.href = "/Admin"

    }
  }

  localStorage.removeItem('baylitInfo')

  window.location.href = "/Dashboard/Authentication"

}

async function AuthVerificationAdmin(){
  let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));


  let tiposLogged = ["true"];

  if (baylitInfo != null) {
    let token = baylitInfo.token;
    let tipo = baylitInfo.tipo
    let logged = baylitInfo.logged;

    if ( token != null && tiposLogged.includes(logged) && tipo == "Administrador") {

      if (await verifyToken(token)){
        return true
      }

    }
  }

  localStorage.removeItem('baylitInfo')

  window.location.href = "/Admin/Login"
}

function verifyConsumidor(){
  //REDIRECIONA PARA A HOME (SERVE PARA BLOQUEAR PÁGINAS UNICAS PARA O CONSUMIDOR)

  let info = JSON.parse(localStorage.getItem('baylitInfo'))

  if (info.tipo != 'Consumidor'){
    window.location.href = "/"
  }
}

function verifyLoggedAndConsumidor(){
  let info = JSON.parse(localStorage.getItem('baylitInfo'))

  if (info){
    if (info.tipo == "Consumidor"){
      return true
    }
  }

  return false
}

async function verifyToken(){

  let info = JSON.parse(localStorage.getItem('baylitInfo'))

  let result = false;

  if (info){

    await fetch(
      apiInfo.apiLink + "/auth/login/verify_token",
      {
        method:"POST",
        headers: {
          Authorization: "Bearer " + info.token
        }
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.code == 200){
          result = true
        }
      });
  
    return result;

  }
  

}

export {AuthVerification, verifyConsumidor, verifyLoggedAndConsumidor, verifyToken, AuthVerificationDashboard, AuthVerificationAdmin}
