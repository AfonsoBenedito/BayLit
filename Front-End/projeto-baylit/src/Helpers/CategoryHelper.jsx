import apiInfo from "../apiInfo.json";

async function getCategorias() {
  let result = false;

  await fetch(apiInfo.apiLink + "/produto/categoria")
    .then((response) => response.json())
    .then((data) => {
      result = data.data.categorias;
    });

  return result;
}

async function getCategoria(id_categoria) {
  let result = false;

  await fetch(apiInfo.apiLink + "/produto/categoria?categoria=" + id_categoria)
    .then((response) => response.json())
    .then((data) => {
      if (data.code == 200) {
        result = data.data.categoria;
      }
    });

  return result;
}

async function getSubCategoriasByCategoria(id_categoria) {
  let result = false;

  await fetch(
    apiInfo.apiLink +
      "/produto/categoria/subcategoria?categoria=" +
      id_categoria
  )
    .then((response) => response.json())
    .then((data) => {
      result = data.data.subcategorias;
    });

  return result;
}

async function getSubCategoria(id) {
  let result = false;

  try {
    await fetch(
      apiInfo.apiLink + "/produto/categoria/subcategoria?subcategoria=" + id
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200 && data.data && data.data.subcategoria) {
          result = data.data.subcategoria;
        }
      });
  } catch (error) {
    console.error("Error fetching subcategoria:", error);
  }

  return result;
}

async function getAtributo(id) {
  let result = false;

  try {
    await fetch(
      apiInfo.apiLink + "/produto/categoria/subcategoria/atributo?atributo=" + id
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200 && data.data && data.data.atributo) {
          result = data.data.atributo;
        }
      });
  } catch (error) {
    console.error("Error fetching atributo:", error);
  }

  return result;
}

async function getAtributoBySubcategoria(id_subcategoria){
  let result = false

  let subcategoria = await getSubCategoria(id_subcategoria)

  if (subcategoria != false){

    result = []

    for (let i = 0; i < subcategoria.atributos.length; i++){

      result.push(await getAtributo(subcategoria.atributos[i]))

    }

  }

  return result

}

async function getCategoriaByName(name) {
  let listaCategorias = await getCategorias();

  for (let i = 0; i < listaCategorias.length; i++) {
    if (listaCategorias[i].nome == name) {
      return listaCategorias[i];
    }
  }

  return false;
}

async function getSubCategoriaByName(id_categoria, name) {
  let subcategorias = await getSubCategoriasByCategoria(id_categoria);

  for (let i = 0; i < subcategorias.length; i++) {
    if (subcategorias[i].nome == name) {
      return subcategorias[i];
    }
  }

  return false;
}

async function getRecursos() {
  let result = false;

  await fetch(apiInfo.apiLink + "/produto/producao/recursos")
    .then((response) => response.json())
    .then((data) => {
      result = data.data;
    });

  return result;
}

async function getTiposPoluicao() {
  let result = false;

  await fetch(apiInfo.apiLink + "/produto/producao/poluicao")
    .then((response) => response.json())
    .then((data) => {
      result = data.data;
    });

  return result;
}

export {
  getCategorias,
  getRecursos,
  getTiposPoluicao,
  getSubCategoriasByCategoria,
  getSubCategoria,
  getAtributo,
  getCategoria,
  getCategoriaByName,
  getSubCategoriaByName,
  getAtributoBySubcategoria
};
