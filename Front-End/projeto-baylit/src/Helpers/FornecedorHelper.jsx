import apiInfo from "../apiInfo.json";

async function getProduto(id) {
  let result = false;

  await fetch(apiInfo.apiLink + "/produto?id=" + id)
    .then((response) => response.json())
    .then((data) => {
      result = data.data[0];
    });

  return result;
}

async function getProdutoEspecificoByProduto(id_produto) {
  let result = false;

  await fetch(apiInfo.apiLink + "/produto/especifico?produto=" + id_produto)
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = data.data.especificos;
      }
    });

  return result;
}

async function getProdutoEspecifico(id) {
  let result = false;

  await fetch(apiInfo.apiLink + "/produto/especifico?especifico=" + id)
    .then((response) => response.json())
    .then((data) => {
      if (data.code==200){
        result = data.data.especifico;
      }
    });

  return result;
}

async function getItemsByEspecifico(id_fornecedor, token, id_especifico) {
  let listaItens = [];

  let armazens = await getArmazensByFornecedor(id_fornecedor, token);

  for (let i = 0; i < armazens.length; i++) {
    for (let k = 0; k < armazens[i].inventario.length; k++) {
      if (armazens[i].inventario[k].produto == id_especifico) {
        listaItens = listaItens.concat(armazens[i].inventario[k].itens);
      }
    }
  }

  return listaItens;
}

async function adicionarInventario(
  token,
  id_armazem,
  id_especifico,
  quantidade,
  prazo_de_validade,
  meio_transporte,
  desperdicio
) {
  //   "meio_transporte": {
  //     "marca": "VOLVO",
  //     "modelo": "FE 62TR A",
  //     "tipo": "SEMI TRUCK"
  //    }
  //    "prazo_validade": "03/07/2022"
  //    "desperdicio": 1

  let result = false;

  let produtos;

  if (prazo_de_validade != null){
    produtos = [
      {
        produto_especifico: id_especifico,
        quantidade: quantidade,
        prazo_de_validade: prazo_de_validade,
      },
    ];
  } else {
    produtos = [
      {
        produto_especifico: id_especifico,
        quantidade: quantidade
      },
    ];
  }

  

  await fetch(apiInfo.apiLink + "/utilizador/fornecedor/armazem/inventario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      armazem: id_armazem,
      produtos: produtos,
      meio_transporte: meio_transporte,
      desperdicio: desperdicio,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data)
      if (data.code == 200) {
        result = data.data;
      }
    });

  return result;
}

async function getProdutosByCategoria(id_categoria) {
  let result = false;

  await fetch(apiInfo.apiLink + "/produto?categoria=" + id_categoria)
    .then((response) => response.json())
    .then((data) => {
      result = data.data;
    });

  return result;
}

async function getProdutosByFornecedor(id_fornecedor) {
  let result = false;

  await fetch(apiInfo.apiLink + "/produto?fornecedor=" + id_fornecedor)
    .then((response) => response.json())
    .then((data) => {
      result = data.data;
    });

  return result;
}

async function adicionarProduto(
  id_fornecedor,
  token,
  nome,
  id_categoria,
  id_subcategoria,
  informacao_adicional,
  fotografias
) {
  let result = false;

  let data = new FormData();
  data.append("fornecedor", id_fornecedor);
  data.append("nome", nome);
  data.append("categoria", id_categoria);
  data.append("subcategoria", id_subcategoria);
  data.append("informacao_adicional", informacao_adicional);

  if (fotografias != null && fotografias != []){
    for (let i = 0; i < fotografias.length; i++){
      data.append('fotografias', fotografias[i])
    }
  }

  await fetch(apiInfo.apiLink + "/produto", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 201) {
        result = data.data;
      }
    });

  return result;
}

async function adicionarProdutoEspecifico(
  id_fornecedor,
  token,
  id_produto,
  preco,
  caracteristicas
) {
  // caracteristicas : [{ atributo , valor }, { atributo , valor }, ...]

  let result = false;

  await fetch(apiInfo.apiLink + "/produto/especifico", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      fornecedor: id_fornecedor,
      produto: id_produto,
      preco: preco,
      caracteristicas: caracteristicas,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200 || data.code == 200) {
        result = data.data;
      }
    });
  return result;
}

async function getArmazensByFornecedor(id_fornecedor, token) {
  let result = false;

  await fetch(
    apiInfo.apiLink +
      "/utilizador/fornecedor/armazem?fornecedor=" +
      id_fornecedor
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = data.data;
      }
    });

  if (result != false) {
    result = await addInfoLocalMultipleResults(id_fornecedor, token, result);
  }

  return result;
}

async function addInfoLocalMultipleResults(id_utilizador, token, result) {
  result = JSON.parse(JSON.stringify(result));

  for (let i = 0; i < result.length; i++) {
    let local = await getLocalById(id_utilizador, token, result[i].localizacao);

    result[i].localizacao = local;
  }

  return result;
}

async function addInfoLocalSingleResults(id_utilizador, token, result) {
  result = JSON.parse(JSON.stringify(result));

  let local = await getLocalById(id_utilizador, token, result.localizacao);

  result.localizacao = local;

  return result;
}

async function getLocalById(id_utilizador, token, id_local) {
  let result = false;

  await fetch(
    apiInfo.apiLink +
      "/utilizador/local?utilizador=" +
      id_utilizador +
      "&local=" +
      id_local,
    {
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

  return result;
}

async function getArmazemById(id_utilizador, token, id_armazem) {
  let result = false;

  await fetch(
    apiInfo.apiLink + "/utilizador/fornecedor/armazem?armazem=" + id_armazem
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = data.data;
      }
    });

  if (result != false) {
    result = await addInfoLocalSingleResults(id_utilizador, token, result);
  }

  return result;
}

async function adicionarArmazem(
  id_fornecedor,
  token,
  tamanho,
  gasto_diario,
  morada,
  codigo_postal,
  localidade,
  pais
) {
  let result = false;

  const tipo = "armazem";

  let local = await adicionarLocal(
    id_fornecedor,
    token,
    tipo,
    morada,
    codigo_postal,
    localidade,
    pais
  );

  if (local != false) {
    await fetch(apiInfo.apiLink + "/utilizador/fornecedor/armazem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        fornecedor: id_fornecedor,
        local: local._id,
        tamanho: tamanho,
        gasto_diario: gasto_diario,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code == 200 || data.code == 201) {
          result = data.data;
        } else {
        }
      });
  } else {
  }

  return result;
}

async function adicionarLocal(
  id_utilizador,
  token,
  tipo,
  morada,
  codigo_postal,
  localidade,
  pais
) {
  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador/local", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      utilizador: id_utilizador,
      tipo: tipo,
      morada: morada,
      codigo_postal: codigo_postal,
      localidade: localidade,
      pais: pais,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = data.data;
      }
    });

  return result;
}

async function getFuncionarioByFornecedor(id_fornecedor, token) {
  let result = false;

  await fetch(
    apiInfo.apiLink +
      "/utilizador/fornecedor/funcionario?fornecedor=" +
      id_fornecedor,
    {
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

//TESTAR
async function getFuncionarioById(id_funcionario, token) {
  let result = false;

  await fetch(
    apiInfo.apiLink +
      "/utilizador/fornecedor/funcionario?funcionario=" +
      id_funcionario,
    {
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

async function adicionarFuncionario(
  id_fornecedor,
  token,
  id_armazem,
  nome,
  idade
) {
  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador/fornecedor/funcionario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      fornecedor: id_fornecedor,
      armazem: id_armazem,
      nome: nome,
      idade: idade,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = data.data;
      }
    });

  return result;
}

async function deleteProduto(token, id_produto) {
  let result = false;

  await fetch(apiInfo.apiLink + "/produto", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      produto: id_produto,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = data.data;
      }
    });

  return result;
}

async function getVendasJson(id_fornecedor, token, filetype) {
  //filetype: json || csv

  let result = false;

  await fetch(
    apiInfo.apiLink +
      "/utilizador/fornecedor/venda?fornecedor=" +
      id_fornecedor +
      "&filetype=" +
      filetype,
    {
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

async function deleteArmazem(token, id_armazem) {
  let result = false;
  await fetch(apiInfo.apiLink + "/utilizador/fornecedor/armazem", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      armazem: id_armazem,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = data.data;
      }
    });

  return result;
}

async function deleteFuncionario(id_fornecedor, token, id_funcionario) {
  let result = false;

  await fetch(apiInfo.apiLink + "/utilizador/fornecedor/funcionario", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      fornecedor: id_fornecedor,
      funcionario: id_funcionario,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = data.data;
      }
    });

  return result;
}

async function getPossiveisVeiculo(tipo, marca, modelo) {
  let caminhoAPI = "/utilizador/transportador/veiculo?";

  let linkQuery = "";

  if (tipo != null) {
    linkQuery += "&tipo=" + tipo;
  }

  if (marca != null) {
    linkQuery += "&marca=" + marca;
  }

  if (modelo != null) {
    linkQuery += "&modelo=" + modelo;
  }

  if (tipo == null && marca == null && modelo == null) {
    caminhoAPI = caminhoAPI.substring(0, caminhoAPI.length - 1);
  }

  linkQuery.substring(1);

  let result = false;

  await fetch(apiInfo.apiLink + caminhoAPI + linkQuery)
    .then((response) => response.json())
    .then((data) => {
      result = data.data;
    });

  return result;
}

async function adicionarProducao(token, id_produto, id_local, tipo, recursos, poluicao){

  let result = false;

  await fetch(apiInfo.apiLink + "/produto/producao", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      produto: id_produto,
      local: id_local,
      tipo: tipo,
      recursos: recursos,
      poluicao: poluicao
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = data.data;
      }
    });

  return result;

}

export {
  getProduto,
  getProdutoEspecificoByProduto,
  getProdutoEspecifico,
  getProdutosByCategoria,
  getProdutosByFornecedor,
  adicionarProduto,
  getArmazensByFornecedor,
  getArmazemById,
  adicionarArmazem,
  getFuncionarioByFornecedor,
  getItemsByEspecifico,
  adicionarInventario,
  adicionarProdutoEspecifico,
  adicionarFuncionario,
  deleteProduto,
  deleteArmazem,
  deleteFuncionario,
  getVendasJson,
  getPossiveisVeiculo,
  adicionarLocal,
  getLocalById,
  adicionarProducao
};
