import apiInfo from "../apiInfo.json";
import { getProduto, getProdutoEspecifico } from "./ProdutoHelper";

async function getUserById(id, tipo) {
  let result = false;
  let linkTipo = "erro";
  switch (tipo) {
    case "Consumidor":
      linkTipo = "consumidor";
      break;
    case "Fornecedor":
      linkTipo = "fornecedor";
      break;
    case "Transportador":
      linkTipo = "transportador";
      break;
    case "Nao_Autenticado":
      linkTipo = "erro";
      break;
    case "Admininistrador":
      linkTipo = "erro";
      break;
  }
  if (linkTipo != "erro") {
    await fetch(apiInfo.apiLink + "/utilizador/" + linkTipo + "?id=" + id)
      .then((response) => response.json())
      .then((data) => {
        if (data.code == 200) {
          //console.log(data)
          result = data.data[0];
        } else {
          console.log("BAD ID");
        }
      });
  } else {
    console.log("Esse tipo de utilizador não é possivel procurar");
    return false;
  }

  return result;
}

async function getUtilizadorByEmail(email, tipo) {
  let result = false;
  let linkTipo = "erro";
  switch (tipo) {
    case "Consumidor":
      linkTipo = "consumidor";
      break;
    case "Fornecedor":
      linkTipo = "fornecedor";
      break;
    case "Transportador":
      linkTipo = "transportador";
      break;
    case "Nao_Autenticado":
      linkTipo = "erro";
      break;
    case "Admininistrador":
      linkTipo = "erro";
      break;
  }
  if (linkTipo != "erro") {
    await fetch(apiInfo.apiLink + "/utilizador/" + linkTipo + "?email=" + email)
      .then((response) => response.json())
      .then((data) => {
        if (data.code == 200) {
          //console.log(data)
          result = data.data[0];
        } else {
          console.log("BAD ID");
        }
      });
  } else {
    console.log("Esse tipo de utilizador não é possivel procurar");
    return false;
  }

  return result;
}

async function getUserFavoriteUsers(id, token) {
  let result = false;

  await fetch(
    apiInfo.apiLink + "/utilizador/favoritos/utilizador?utilizador=" + id,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      result = data.data;
    });

  return result;
}

async function getUserFavoriteProducts(id, token) {
  let result = false;
  await fetch(
    apiInfo.apiLink + "/utilizador/favoritos/produto?utilizador=" + id,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = data.data;
      }
    });

  if (result != false) {
    let produtos = [];
    for (let k = 0; k < result.favoritos.length; k++) {
      produtos.push(await getProduto(result.favoritos[k]));
    }
    result = produtos;
  }

  return result;
}

async function adicionarUserFavoriteProduct(id, token, id_produto) {
  let result = false;
  await fetch(apiInfo.apiLink + "/utilizador/favoritos/produto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      utilizador: id,
      favorito: id_produto,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      if (data.code == 200) {
        result = true;
      }
    });

  return result;
}

async function getUsersShoppingCartCadeia(id_utilizador, token) {
  let result = false;
  await fetch(
    apiInfo.apiLink +
      "/utilizador/carrinho/cadeia_logistica/sumario?utilizador=" +
      id_utilizador,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.code == 200) {
        result = data.data.cadeia;
      }
    });

  return result;
}

async function removerUserFavoriteProduct(id, token, id_produto) {
  let result = false;
  await fetch(apiInfo.apiLink + "/utilizador/favoritos/produto", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      utilizador: id,
      favorito: id_produto,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.code == 200) {
        result = true;
      }
    });

  return result;
}

async function getUsersShoppingCart(id_utilizador, token) {
  let result = false;
  await fetch(
    apiInfo.apiLink + "/utilizador/carrinho?utilizador=" + id_utilizador,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = data.data.carrinho;
      }
    });

  if (result != false) {
    for (let k = 0; k < result.produtos.length; k++) {
      result.produtos[k].produto = await getProdutoEspecifico(
        result.produtos[k].produto
      );
    }
  }

  return result;
}

async function adicionarProdutoAoCarrinho(
  id_utilizador,
  token,
  id_produto_especifico,
  quantidade
) {
  let result = false;
  await fetch(apiInfo.apiLink + "/utilizador/carrinho/produto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      utilizador: id_utilizador,
      produto_especifico: id_produto_especifico,
      quantidade: quantidade,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.code == 200) {
        result = true;
      }
    });

  return result;
}

async function getFornecedor(id) {
  let result = false;
  await fetch(apiInfo.apiLink + "/utilizador/fornecedor?id=" + id)
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = data.data[0];
      } else {
        console.log("BAD ID");
      }
    });

  return result;
}

async function getTransportador(id) {
  let result = false;
  await fetch(apiInfo.apiLink + "/utilizador/transportador?id=" + id)
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = data.data[0];
      } else {
        console.log("BAD ID");
      }
    });

  return result;
}

async function getAllConsumidores() {
  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador/consumidor")
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = data.data;
      } else {
        console.log("BAD ID");
      }
    });

  return result;
}

async function getAllFornecedores() {
  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador/fornecedor")
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = data.data;
      } else {
        console.log("BAD ID");
      }
    });

  return result;
}

async function getAllTransportadores() {
  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador/transportador")
    .then((response) => response.json())
    .then((data) => {
      console.log(data.data);
      if (data.code == 200) {
        result = data.data;
      } else {
        console.log("BAD ID");
      }
    });

  return result;
}

async function deleteUtilizador(id_utilizador, token) {
  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      id: id_utilizador,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = true;
      }
    });

  return result;
}

async function updateConsumidorGeral(id, nome, email, nif, token) {
  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador/consumidor", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      nome: nome,
      email: email,
      nif: nif,
      id: id,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      window.location.reload();
      if (data.code == 200) {
        result = true;
      }
    });

  return result;
}

async function mudarDadosTransportador(id_utilizador, token, nome,morada,nif,telemovel,portes){

  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador/transportador", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      nome: nome,
      nif: nif,
      id: id_utilizador,
      morada: morada,
      telemovel: telemovel,
      portes: portes
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data)
      // window.location.reload();
      if (data.code == 200) {
        result = true;
      }
    });

  return result;
}

async function mudarDadosFornecedor(id_utilizador, token, nome,morada,nif,telemovel){
  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador/fornecedor", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      nome: nome,
      nif: nif,
      id: id_utilizador,
      morada: morada,
      telemovel: telemovel,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      // window.location.reload();
      if (data.code == 200) {
        result = true;
      }
    });

  return result;
}

async function getLocaisUtilizador(id_utilizador, token) {
  let result = false;

  await fetch(
    apiInfo.apiLink + "/utilizador/local?utilizador=" + id_utilizador,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log(data)
      if (data.code == 200) {
        result = data.data;
      }
    });

  return result;
}

async function deleteLocalUtilizador(id_utilizador, token, id_local) {
  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador/local", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      utilizador: id_utilizador,
      local: id_local,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.code == 200) {
        result = true;
      } else {
        result = data.message;
      }
    });

  return result;
}

async function adminDeleteLocal(token, id_local){

  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador/local", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      local: id_local,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.code == 200) {
        result = true;
      } else {
        result = data.message;
      }
    });

  return result;

}

async function getUtilizadorGeralById(id_utilizador) {
  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador?id=" + id_utilizador)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data)
      if (data.code == 200) {
        result = data.data;
      }
    });

  return result;
}

async function downloadFile(res, id_utilizador, filetype) {
  const data = await res;
  const downloadable = document.createElement("a");

  const blob = new Blob([data], {
    type: "text/csv",
  });
  downloadable.href = URL.createObjectURL(blob);
  downloadable.download = `orders_${id_utilizador}.${filetype}`;

  document.body.appendChild(downloadable);
  downloadable.click();

  return true;
}

async function getRelatorioEncomendasConsumidor(id_utilizador, token, filetype) {
  const response = await fetch(
    `${apiInfo.apiLink}/utilizador/consumidor/encomenda?utilizador=${id_utilizador}&filetype=${filetype}`,
    {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "text/csv",
      },
    }
  );

  const result = downloadFile(response.text(), id_utilizador, filetype);

  return result;
}

async function getRelatorioVendasFornecedor(id_utilizador, token, filetype) {
  const response = await fetch(
    `${apiInfo.apiLink}/utilizador/fornecedor/venda?fornecedor=${id_utilizador}&filetype=${filetype}`,
    {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "text/csv",
      },
    }
  );

  const result = downloadFile(response.text(), id_utilizador, filetype);

  return result;
}

async function mudarPasswordConsumidor(
  id_utilizador,
  token,
  password_antiga,
  password_nova
) {
  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador/consumidor", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      id: id_utilizador,
      password_antiga: password_antiga,
      password_nova: password_nova,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.code == 200) {
        result = true;
      } else {
        result = data.message;
      }
    });

  return result;
}

async function mudarPasswordTransportador(
  id_utilizador,
  token,
  password_antiga,
  password_nova
) {
  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador/transportador", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      id: id_utilizador,
      password_antiga: password_antiga,
      password_nova: password_nova,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.code == 200) {
        result = true;
      } else {
        result = data.message;
      }
    });

  return result;
}

async function mudarPasswordFornecedor(
  id_utilizador,
  token,
  password_antiga,
  password_nova
) {
  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador/fornecedor", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      id: id_utilizador,
      password_antiga: password_antiga,
      password_nova: password_nova,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.code == 200) {
        result = true;
      } else {
        result = data.message;
      }
    });

  return result;
}

async function apagarContaUtilizador(id_utilizador, token) {
  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      id: id_utilizador,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.code == 200) {
        result = true;
      } else {
        result = data.message;
      }
    });

  return result;
}

async function CongelarUser(token, id_utilizador) {
  const response = await fetch(
    `${apiInfo.apiLink}/utilizador/administrador/congelamento`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        utilizador: id_utilizador,
      }),
    }
  );

  if (response.status == 200) {
    return true;
  }
}
async function DescongelarUser(token, id_utilizador) {
  const response = await fetch(
    `${apiInfo.apiLink}/utilizador/administrador/congelamento`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        utilizador: id_utilizador,
      }),
    }
  );

  if (response.status == 200) {
    return true;
  }
}

async function getNotificacoesUtilizador(id_utilizador, token) {
  let result = false;

  await fetch(
    apiInfo.apiLink + "/utilizador/notificacoes?utilizador=" + id_utilizador,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log(data)
      if (data.code == 200) {
        result = data.data.notificacoes;
      }
    });

  return result;
}

async function alterarVistaNotificacoes(id_utilizador, token, notificacoes) {
  let result = false;

  console.log(notificacoes);
  console.log(id_utilizador);

  await fetch(apiInfo.apiLink + "/utilizador/notificacoes", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      utilizador: id_utilizador,
      notificacoes: notificacoes,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.code == 200) {
        result = true;
      }
    });

  return result;
}

export {
  getUserById,
  getUserFavoriteUsers,
  getUserFavoriteProducts,
  adicionarUserFavoriteProduct,
  getUsersShoppingCart,
  adicionarProdutoAoCarrinho,
  getFornecedor,
  getTransportador,
  getAllConsumidores,
  getAllFornecedores,
  getAllTransportadores,
  deleteUtilizador,
  updateConsumidorGeral,
  removerUserFavoriteProduct,
  getLocaisUtilizador,
  getUtilizadorGeralById,
  getUsersShoppingCartCadeia,
  getUtilizadorByEmail,
  getRelatorioEncomendasConsumidor,
  getRelatorioVendasFornecedor,
  mudarPasswordConsumidor,
  apagarContaUtilizador,
  getNotificacoesUtilizador,
  alterarVistaNotificacoes,
  CongelarUser,
  DescongelarUser,
  deleteLocalUtilizador,
  mudarPasswordTransportador,
  mudarPasswordFornecedor,
  adminDeleteLocal,
  mudarDadosTransportador,
  mudarDadosFornecedor,
};
