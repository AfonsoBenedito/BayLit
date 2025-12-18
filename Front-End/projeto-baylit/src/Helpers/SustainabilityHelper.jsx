import apiInfo from "../apiInfo.json";

async function getGraphsTransportador(id, espaco_temporal, token) {
  let relatorio = false;

  await fetch(
    apiInfo.apiLink +
      "/utilizador/transportador/relatorio?transportador=" +
      id +
      "&espaco_temporal=" +
      espaco_temporal,
    {
      headers: { Authorization: "Bearer " + token },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        relatorio = data.data;
      } else {
        console.log("Erro na conexão");
      }
    });

  return relatorio;
}

async function getGraphsFornecedor(id, espaco_temporal, token) {
  let relatorio = false;

  await fetch(
    apiInfo.apiLink +
      "/utilizador/fornecedor/relatorio?fornecedor=" +
      id +
      "&espaco_temporal=" +
      espaco_temporal,
    {
      headers: { Authorization: "Bearer " + token },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      if (data.code == 200) {
        relatorio = data.data;
      } else {
        console.log("Erro na conexão");
      }
    });

  return relatorio;
}

async function getGraphsAdministrador(token) {
  let relatorio = false;
  await fetch(apiInfo.apiLink + "/utilizador/administrador/relatorio", {
    headers: { Authorization: "Bearer " + token },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        relatorio = data.data;
      } else {
        console.log("Erro na conexão");
      }
    });

  return relatorio;
}

export { getGraphsTransportador, getGraphsFornecedor, getGraphsAdministrador };
