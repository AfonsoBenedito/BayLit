import apiInfo from "../apiInfo.json";

async function GetNotificacoesUtilizador(id_utilizador) {
  let result = false;

  await fetch(apiInfo.apiLink + "utlizador/notificacoes?id=" + id_utilizador)
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = data.data[0];
      }
    });

  return result;
}

export { GetNotificacoesUtilizador };
