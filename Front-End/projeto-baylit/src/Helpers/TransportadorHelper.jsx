import apiInfo from "../apiInfo.json";

import {adicionarLocal} from "./FornecedorHelper"


async function adicionarSede(id_transportador, token, morada, codigo_postal, localidade, pais){

  let sede = await adicionarLocal(id_transportador, token, "sede", morada, codigo_postal, localidade, pais)

  console.log(sede);
  return sede
}

async function getMeioTransporteByTransportador(id_transportador){

    let result = false;

    await fetch(
        apiInfo.apiLink + "/utilizador/transportador/meio_transporte?transportador=" + id_transportador
      )
        .then((response) => response.json())
        .then((data) => {
          result = data.data
        });

    return result;

}

async function getMeioTransporteById(id_meiotransporte){

    let result = false;

    await fetch(
        apiInfo.apiLink + "/utilizador/transportador/meio_transporte?meio_transporte=" + id_meiotransporte
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.code==200){
            result = data.data
          }
        });

    return result;

}

async function getMeioTransporteBySede(sede){

    let result = false;

    await fetch(
        apiInfo.apiLink + "/utilizador/transportador/meio_transporte?sede=" + sede
      )
        .then((response) => response.json())
        .then((data) => {
          result = data.data
        });

    return result;

}

async function adicionarMeioTransporte(id_transportador, token, marca, modelo, tipo, id_sede){


    let result = false

    await fetch(
        apiInfo.apiLink + "/utilizador/transportador/meio_transporte",
        {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + token
        },
        body: JSON.stringify({
            transportador: id_transportador,
            marca: marca,
            modelo: modelo,
            tipo: tipo,
            sede: id_sede
        })
        }
    )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        if (data.code == 200){
            result = data.data
        }
        
        });

    return result;

}

async function apagarMeioTransporte(token, id_meio_transporte){

  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador/transportador/meio_transporte", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      meio_transporte: id_meio_transporte
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(200);
      if (data.code == 200) {
        result = data.data;
      }
    });

    return result

}

async function getSedesByTransportador(id_transportador, token){

  let result = false;

  await fetch(
    apiInfo.apiLink +
      "/utilizador/local?utilizador=" +
      id_transportador,
      {
        headers: {
          Authorization: "Bearer " + token,
        }
      }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200){
        result = data.data;
      }
      
    });

  return result; 

}

async function adicionarCondutor(id_transportador, token, nome, idade){

  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador/transportador/condutor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      transportador: id_transportador,
      nome: nome,
      idade: idade
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.code == 200) {
        result = data.data;
      }
    });

    return result

}

async function getCondutoresByTransportador(id_transportador){

  let result = false;

  await fetch(
    apiInfo.apiLink +
      "/utilizador/transportador/condutor?transportador=" +
      id_transportador
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200){
        result = data.data;
      }
      
    });

  return result;

}

async function deleteCondutor(id_transportador, token, id_condutor){

  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador/transportador/condutor", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      transportador: id_transportador,
      condutor: id_condutor
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = data.data;
      }
    });

    return result

}

export {adicionarMeioTransporte, adicionarSede, getMeioTransporteByTransportador, getMeioTransporteById, getMeioTransporteBySede, apagarMeioTransporte, deleteCondutor, getCondutoresByTransportador, adicionarCondutor, getSedesByTransportador}