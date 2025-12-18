import apiInfo from "../apiInfo.json";

import {getUtilizadorByEmail} from "./UserHelper"

async function RegistoFornecedor(
  nome,
  email,
  password,
  morada,
  nif,
  telemovel
) {
  let result = false;

  let body = JSON.stringify({
    nome: nome,
    email: email,
    password: password,
    morada: morada,
    nif: nif,
    telemovel: telemovel,
  });

  await fetch(apiInfo.apiLink + "/auth/register/fornecedor", {
    method: "POST",
    body: body,
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 201) {
        // localStorage.clear();

        // let toStorage = {
        //   token: data.data.auth_token,
        //   id: data.data.user.id,
        //   logged: "true",
        //   tipo: data.data.user.tipo,
        // };

        // localStorage.setItem("baylitInfo", JSON.stringify(toStorage));

        result = true;
      } else {
        result = data.message;
      }
    });

  return result;
}

async function RegistoTransportador(
  nome,
  email,
  password,
  morada,
  nif,
  telemovel,
  portes
) {
  let result = false;

  let body = JSON.stringify({
    nome: nome,
    email: email,
    password: password,
    morada: morada,
    nif: nif,
    telemovel: telemovel,
    portes_encomenda: portes
  });

  await fetch(apiInfo.apiLink + "/auth/register/transportador", {
    method: "POST",
    body: body,
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 201) {
        // localStorage.clear();

        // let toStorage = {
        //   token: data.data.auth_token,
        //   id: data.data.user.id,
        //   logged: "true",
        //   tipo: data.data.user.tipo,
        // };

        // localStorage.setItem("baylitInfo", JSON.stringify(toStorage));

        result = true;
      } else {
        result = data.message;
      }
    });

  return result;
}

async function Login(email, password) {
  let result = false;

  let body = JSON.stringify({
    email,
    password,
  });

  await fetch(apiInfo.apiLink + "/auth/login", {
    method: "POST",
    body: body,
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        if (
          data.data.user.tipo != "Fornecedor" &&
          data.data.user.tipo != "Transportador"
        ) {
          console.log("Não é aqui o login de consumidor");
        } else {
          localStorage.clear('baylitInfo');

          let toStorage = {
            token: data.data.auth_token,
            id: data.data.user.id,
            logged: "true",
            tipo: data.data.user.tipo,
          };

          localStorage.setItem("baylitInfo", JSON.stringify(toStorage));

          result = true;
        }
      } else {
        result = data.message;
      }
    });

  return result;
}

async function LoginAdmin(nome, password){

  let result = false;

  let body = JSON.stringify({
    nome,
    password,
  });

  await fetch(apiInfo.apiLink + "/auth/login", {
    method: "POST",
    body: body,
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        if (
          data.data.user.tipo != "Administrador"
        ) {
          console.log("Aqui é o Login de Administrador");
        } else {
          localStorage.clear();

          let toStorage = {
            token: data.data.auth_token,
            id: data.data.user.id,
            logged: "true",
            tipo: data.data.user.tipo,
          };

          localStorage.setItem("baylitInfo", JSON.stringify(toStorage));

          result = true;
        }
      } else {
        result = data.message;
      }
    });

  return result;

}

async function AutenticarGoogle(id_nao_autenticado, token, email_utilizador_google){

  let toStorage = {}

  let user = await getUtilizadorByEmail(email_utilizador_google, "Consumidor")

  if (user != false){
    console.log(id_nao_autenticado)
    console.log(user._id)
    console.log(token)

    await fetch("http://localhost:8080" + "/auth/google/carrinho", {
      method: "POST",
      body: JSON.stringify({
        id_nao_autenticado: id_nao_autenticado,
        id_utilizador: user._id
      }),
      headers: { 
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
       },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.code == 200 || data.code == 201) {
          
          toStorage = {
            token: data.data.auth_token,
            id: data.data.user.id,
            logged: "true",
            tipo: data.data.user.tipo,
          };
  
          localStorage.setItem("baylitInfo", JSON.stringify(toStorage));

          window.location.href = "/Shop"

        } else {
          console.log("Erro ao autenticar Carrinho")
        }
      });

  } else {
    console.log("Erro a buscar Utilizador")
  }

}

function Logout(){
  localStorage.removeItem('baylitInfo')
  window.location.href = '/'
}

export { RegistoFornecedor, RegistoTransportador, Login , LoginAdmin, AutenticarGoogle, Logout};
