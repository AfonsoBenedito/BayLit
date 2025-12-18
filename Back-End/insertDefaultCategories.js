const Mongoose = require("mongoose");
const categoriesJson = require("./handlers/Categories.json")
const CategoriaGW = require("./gateway/CategoriaGat.js")
const SubCategoriaGW = require("./gateway/SubCategoriaGat.js")
const AtributoGW = require("./gateway/AtributoGat.js")
const CategoriaModel = require("./models/Categoria.js")
const SubCategoriaModel = require("./models/SubCategoria.js")
const AtributoModel = require("./models/Atributo.js")
const ProdutoModel = require("./models/Produto.js")
const ProdutoEspecificoModel = require("./models/ProdutoEspecifico")
const FileHandler = require("./handlers/FileHandler").file_handler

async function test() {
    await require("./conn");

    const fs = require('fs')

    console.log(await CategoriaModel.deleteMany({}));
    console.log(await SubCategoriaModel.deleteMany({}));
    console.log(await AtributoModel.deleteMany({}));
    console.log(await ProdutoModel.deleteMany({}));
    console.log(await ProdutoEspecificoModel.deleteMany({}));

    let listaAtributosCriados = []
    let listaIdsAtributosCriados = []

    try {
        for (var categoria in categoriesJson.categories){
            console.log("Categoria " + categoria);
            var categoriaCriada = await CategoriaGW.create(categoria);
            var idCategoria = categoriaCriada._id.toString();
    
            for (var subcategoria in categoriesJson.categories[categoria]){
    
                if (subcategoria == "LinkFotografia") {
                    let filename = categoriesJson.categories[categoria][subcategoria][0]
                    console.log(filename)
                    let fotografia = await fs.createReadStream(filename)
                    //let fotografia = await fs.readFileSync(filename, {encoding: 'base64'})
    
                    let link_fotografia = await FileHandler.AddCategoriaPictureFS(fotografia)
                    await CategoriaGW.addFotografia(idCategoria, link_fotografia)
                } else {

                    console.log("SubCategoria " + subcategoria);
                    var subCategoriaCriada = await SubCategoriaGW.create(subcategoria, idCategoria);
                    var idSubCategoria = subCategoriaCriada._id.toString();

                    let filename = categoriesJson.categories[categoria][subcategoria]["fotografia"][0]
                    console.log(filename)
                    let fotografia = await fs.createReadStream(filename)
                    //let fotografia = await fs.readFileSync(filename, {encoding: 'base64'})
    
                    let link_fotografia_sub = await FileHandler.AddSubCategoriaPictureFS(fotografia)
                    await SubCategoriaGW.addFotografia(idSubCategoria, link_fotografia_sub)
                    
                    for(var i = 0; i < categoriesJson.categories[categoria][subcategoria].atributos.length; i++ ){
                        var nomeAtributo = categoriesJson.categories[categoria][subcategoria].atributos[i];
                        console.log("Atributo " + nomeAtributo)
        
                        if ( listaAtributosCriados.includes(nomeAtributo)){
        
                            let index = listaAtributosCriados.indexOf(nomeAtributo)
        
                            var idAtributo = listaIdsAtributosCriados[index]
        
                        } else {
        
                            var atributoCriado = await AtributoGW.create(nomeAtributo, "Default", categoriesJson.atributos[nomeAtributo]);
                            var idAtributo = atributoCriado._id.toString();
        
                            listaAtributosCriados.push(nomeAtributo)
                            listaIdsAtributosCriados.push(idAtributo)
        
                        }
        
                        await SubCategoriaGW.addAtributo(idSubCategoria, idAtributo);
                    }

                }
    
                
            }
            
        }
    } catch (err) {
        console.log(err)
    }

    Mongoose.connection.close()

  }

  test()
