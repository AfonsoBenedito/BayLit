import apiInfo from "../apiInfo.json";
// var fs = require('fs');

async function getProduto(id){

    let result = false;

    await fetch(
        apiInfo.apiLink + "/produto?id=" + id
      )
        .then((response) => response.json())
        .then((data) => {
          // console.log(data)
          if (data.code == 200){
            result = data.data[0]
          }
        
        });

    if (result != false){
      result = await adicionarPrecoAoResultUnico(result)
    }

    return result;
}

async function adicionarPrecoAoResultUnico(result){

  await fetch(
    apiInfo.apiLink + "/produto/especifico?produto=" + result._id
  ).then((response) => response.json())
  .then((data) => {

    
    if (data.code == 200){
      if (data.data.especificos.length > 0){
        let especificoPreco = data.data.especificos[0].preco

        result['preco'] = especificoPreco

      } else {
        result = false
      }
      
    }
    
  })

  return result
}

async function adicionarPrecoAoResultMultiplo(result){

  // console.log(result)

  if (result != false){
    for (let i = 0; i < result.length; i++){
      result[i] = await adicionarPrecoAoResultUnico(result[i])
    }
  }
  
  
  return result
  
}

async function getProdutoEspecificoByProduto(id_produto){

    let result = false;

    await fetch(
        apiInfo.apiLink + "/produto/especifico?produto=" + id_produto
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          if(data.code == 200){
            result = data.data.especificos
          }
          
        });

    return result;
}

async function getProdutoEspecifico(id){

    let result = false;

    await fetch(
        apiInfo.apiLink + "/produto/especifico?especifico=" + id
      )
        .then((response) => response.json())
        .then((data) => {
          result = data.data.especifico
        });

    return result;
}

async function getProdutosByCategoria(id_categoria){

    let result = false;

    await fetch(
        apiInfo.apiLink + "/produto?categoria=" + id_categoria
      )
        .then((response) => response.json())
        .then((data) => {
          result = data.data
        });

    if (result != false){
      result = await adicionarPrecoAoResultMultiplo(result)
    }
    
    return result;
}

async function getProdutosByFornecedor(id_fornecedor){

    let result = false;

    await fetch(
        apiInfo.apiLink + "/produto?fornecedor=" + id_fornecedor
      )
        .then((response) => response.json())
        .then((data) => {
          result = data.data
        });
      
    if (result != false){
      result = await adicionarPrecoAoResultMultiplo(result)
    }

    return result;
}

async function getCadeiaByProduto(id_produto){

  let result = false;

  await fetch(
    apiInfo.apiLink + "/produto?id=" + id_produto +"&cadeia=" + true
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200){
        result = data.data[0]
      }
        
    });

    if (result != false){
      
      
      result = await adicionarPrecoAoResultUnico(result)
    }

    return result;
}

async function pesquisa(categoria, subcategoria, preco, ratingEcologico, nome, filtros){

  let result = false;

  let infoPesquisa = ""

  if(categoria != null){
    infoPesquisa += "&categoria=" + categoria
  }

  if(subcategoria != null){
    infoPesquisa += "&subcategoria=" + subcategoria
  }

  if(preco != null){
    infoPesquisa += "&preco=" + JSON.stringify(preco)
  }

  if(ratingEcologico != null){
    infoPesquisa += "&ratingEcologico=" + ratingEcologico
  }

  if(nome != null){
    infoPesquisa += "&nome=" + nome
  }

  if(filtros != null){
    infoPesquisa += "&filtros=" + JSON.stringify(filtros)
  }

  infoPesquisa.substring(1)

  // console.log(infoPesquisa)

  await fetch(
    apiInfo.apiLink + "/produto/pesquisa?" + infoPesquisa
  ).then((response) => response.json())
  .then((data) => {
    // console.log(data)
    if (data.code == 200){
      result = data.data
    }

  })

  if (result != false){
    result = await adicionarPrecoAoResultMultiplo(result)
  }

  return result

}

async function getLocalById(id_utilizador, token, id_local){

  let result = false

  await fetch(
    apiInfo.apiLink + "/utilizador/local?utilizador=" + id_utilizador + "&local=" + id_local,
    {
      headers:{
          "Authorization": 'Bearer ' + token
      }
    }
  )
    .then((response) => response.json())
    .then((data) => {
      result = data.data
    });

  return result;
  
  

}

function adicionarProdutoCompare(id_produto){

  let compareList = JSON.parse(sessionStorage.getItem('baylitCompare')).compareList

  let index = compareList.indexOf(id_produto)

  if (index == -1){
    compareList.push(id_produto)
  }

  let appendInfo = {
    compareList: compareList
  }

  // console.log(appendInfo)

  sessionStorage.setItem('baylitCompare', JSON.stringify(appendInfo))

}

function removeProdutoCompare(id_produto){

  let compareList = JSON.parse(sessionStorage.getItem('baylitCompare')).compareList

  let index = compareList.indexOf(id_produto)

  if (index != -1){
    compareList.splice(index,1)
  }

  let appendInfo = {
    compareList: compareList
  }

  sessionStorage.setItem('baylitCompare', JSON.stringify(appendInfo))

}

function verificarCompare(id_produto){

  let compareList = JSON.parse(sessionStorage.getItem('baylitCompare')).compareList

  let index = compareList.indexOf(id_produto)

  if (index != -1){
    return true
  } else {
    return false
  }

}

async function getProdutoByEspecifico(id_especifico){

  let especifico = await getProdutoEspecifico(id_especifico)

  let produto = await getProduto(especifico.produto)

  return produto

}

async function adicionarProdutoCarrinho(id_utilizador, token, id_especifico, quantidade){
  let result = false

  await fetch (
    apiInfo.apiLink + "/utilizador/carrinho/produto",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        utilizador: id_utilizador,
        produto_especifico: id_especifico,
        quantidade: quantidade
      })
    }
    ).then((response) => response.json())
    .then((data) => {

      if (data.code == 200){
        result = data.data
      }

    })

    return result
}

async function removerProdutoCarrinho(id_utilizador, token, id_especifico){
  let result = false

  await fetch (
    apiInfo.apiLink + "/utilizador/carrinho/produto",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        utilizador: id_utilizador,
        produto_especifico: id_especifico
      })
    }
    ).then((response) => response.json())
    .then((data) => {

      if (data.code == 200){
        result = data.data
      }

    })

    return result
}

async function atualizarProdutoCarrinho(id_utilizador, token, id_especifico, quantidade){
  let result = false

  await fetch (
    apiInfo.apiLink + "/utilizador/carrinho/produto",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        utilizador: id_utilizador,
        produto_especifico: id_especifico,
        quantidade: quantidade
      })
    }
    ).then((response) => response.json())
    .then((data) => {

      if (data.code == 200){
        result = data.data
      }

    })

    return result
}

async function getStockProdutoEspecifico(id_produto_especifico, tempo){
  //tempo: now || ever

  let result = false

  await fetch(
    apiInfo.apiLink + "/utilizador/fornecedor/armazem/inventario/stock?produto_especifico=" + id_produto_especifico + "&time=" + tempo
  )
    .then((response) => response.json())
    .then((data) => {
      result = data.data
    });

  return result;

}

async function alterarPrecoEspecifico(token, id_especifico, preco){

  let result = false

  await fetch (
    apiInfo.apiLink + "/produto/especifico",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        especifico: id_especifico,
        preco: preco
      })
    }
    ).then((response) => response.json())
    .then((data) => {

      if (data.code == 200){
        result = data.data
      }

    })

  return result

}

async function alterarProduto(token, id_produto, nome, informacao_adicional, fotografias, remover_fotografias){

  let result = false

  let form = new FormData()

  form.append('produto',id_produto)

  if (nome != null){
    form.append('nome',nome)
  }

  if (informacao_adicional != null){
    form.append('informacao_adicional',informacao_adicional)
  }

  if (remover_fotografias != null && remover_fotografias != []){
    form.append('remover_fotografias',JSON.stringify(remover_fotografias))
  }

  if (fotografias != null && fotografias != []){
    for (let i = 0; i < fotografias.length; i++){
      console.log(fotografias[i])
      form.append('fotografias', fotografias[i])
    }
  }
  
  console.log(form.get('fotografias'))

  await fetch (
    apiInfo.apiLink + "/produto",
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: form
    }
    ).then((response) => response.json())
    .then((data) => {
      console.log(data)
      if (data.code == 200){
        result = data.data
      }

    })

  return result

}

export {getProduto, getProdutoEspecificoByProduto, getProdutoEspecifico, getProdutosByCategoria, getProdutosByFornecedor, getCadeiaByProduto,adicionarPrecoAoResultMultiplo, adicionarPrecoAoResultUnico, pesquisa, getLocalById, removeProdutoCompare, getProdutoByEspecifico, adicionarProdutoCompare, verificarCompare, adicionarProdutoCarrinho, removerProdutoCarrinho, atualizarProdutoCarrinho, getStockProdutoEspecifico, alterarPrecoEspecifico, alterarProduto}