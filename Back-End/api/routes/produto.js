// importing the dependencies
const express = require('express');
const router = express.Router();
const htmlspecialchars = require('htmlspecialchars');
const utils = require("../../utils");
const api_auth = require('../api_auth');
const file_handler = require('../../handlers/FileHandler').file_handler;
const produto_handler = require('../../handlers/ProdutoHandler').handler_produto;

// multipart data (files)
const multer  = require('multer')
const upload = multer()

// -------------------------------------------------------------
// -------------------------- PRODUTO --------------------------
// -------------------------------------------------------------

router.get("/", async (req, res) => {

    try {
        const body = req.query;
        let produtos = []
        if (body.cadeia){
            if (body.id) {
                const id = htmlspecialchars(body.id);
                let produtosID = await produto_handler.GetProdutoAndCadeiaById(id);
                produtos = produtos.concat(produtosID)
            } else if (body.fornecedor) {
                const fornecedor = htmlspecialchars(body.fornecedor);
                let produtosForn = await produto_handler.GetProdutoAndCadeiaByFornecedor(fornecedor);
                produtos = produtos.concat(produtosForn)
            } else if (body.subcategoria) {
                const subcategoria = htmlspecialchars(body.subcategoria);
                let produtosCat = await produto_handler.GetProdutoAndCadeiaBySubCategoria(subcategoria);
                produtos = produtos.concat(produtosCat)
            } else if (body.categoria) {
                const categoria = htmlspecialchars(body.categoria);
                let produtosCat = await produto_handler.GetProdutoAndCadeiaByCategoria(categoria);
                produtos = produtos.concat(produtosCat)
            } else {
                throw {
                    code: 400,
                    message: "Pedido inválido"
                }
            }

        } else {
            if (body.id) {
                const id = htmlspecialchars(body.id);
                let produtosID = await produto_handler.GetProdutoByID(id);
                produtos = produtos.concat(produtosID)
            } else if (body.fornecedor) {
                const fornecedor = htmlspecialchars(body.fornecedor);
                let produtosForn = await produto_handler.GetProdutoByFornecedor(fornecedor);
                produtos = produtos.concat(produtosForn)
            } else if (body.subcategoria) {
                const subcategoria = htmlspecialchars(body.subcategoria);
                let produtosCat = await produto_handler.GetProdutoBySubCategoria(subcategoria);
                produtos = produtos.concat(produtosCat)
            } else if (body.categoria) {
                const categoria = htmlspecialchars(body.categoria);
                let produtosCat = await produto_handler.GetProdutoByCategoria(categoria);
                produtos = produtos.concat(produtosCat)
            } else {
                throw {
                    code: 400,
                    message: "Pedido inválido"
                }
            }
        }
        
        produtos = utils.uniqueValuesArray(produtos)
        
        if (produtos.length > 0) {
            res.json({
                code: 200,
                message: "Success",
                data: produtos
            })
        } else {
            throw {
                code: 204,
                message: "No content",
            }
        }
  
    } catch (err) {
      res.json({
        code: err.code,
        message: err.message
      });
    }
  });

router.post("/", api_auth.verifyToken, upload.array('fotografias'), async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        try {
            if (authData.user) {
                if (authData.user.tipo == "Fornecedor") {
                    const body = req.body;
        
                    if (body.fornecedor && body.nome &&
                        body.categoria  && body.subcategoria && req.files.length > 0) {
        
                        const fornecedor = htmlspecialchars(body.fornecedor);
                        const nome = htmlspecialchars(body.nome);
                        const categoria = htmlspecialchars(body.categoria);
                        const subcategoria = htmlspecialchars(body.subcategoria)
                        
                        let informacao_adicional = null
                        if (body.informacao_adicional) {
                            informacao_adicional = htmlspecialchars(body.informacao_adicional);
                        }
        
                        let produto
                        try {
                            produto = await produto_handler.InsertProduct(fornecedor, nome, categoria, subcategoria, informacao_adicional);
                        } catch (err) {
                            throw err
                        }
        
                        try {
                            const fotografias = await file_handler.AddProductPictures(req.files);
                            
                            produto = await produto_handler.InsertProductPictures(produto._id, fotografias);
                        
                        } catch (err) {
                            await produto_handler.DeleteProduct(produto._id);
                            throw {
                                code: 400,
                                message: "Erro a inserir produto. Tente novamente."
                            }
                        }
        
                        res.json({
                            code: 201,
                            message: "Created",
                            data: produto
                        })
        
                    } else {
                        throw {
                            code: 400,
                            message: "Pedido inválido"
                        }
                    }
                } else {
                    throw {
                        code: 403,
                        message: "Não tem autorização para efetuar este pedido"
                    }
                }
            } else {
                throw {
                    code: 403,
                    message: "Não tem autorização para efetuar este pedido"
                }
            }
        } catch (err) {
            res.json({
                code: err.code,
                message: err.message
            })
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
    
});

router.put("/", api_auth.verifyToken, upload.array('fotografias'), async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user) {
            if (authData.user.tipo != "Fornecedor") {
                throw {
                    code: 403,
                    message: "Não tem autorização para efetuar este pedido"
                }
            }
        } else {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
            if (body.produto) {
    
                let id = htmlspecialchars(body.produto);
    
                let exists
                // verifica se existe
                try {
                    exists = await produto_handler.GetProdutoByID(id);
                } catch (err) {
                    throw {
                        code: 400,
                        message: "Não existe um produto com esse ID"
                    }
                }
    
                if (exists.fornecedor == authData.user.id) {
                    if (body.nome || req.files.length > 0 || body.informacao_adicional || body.remover_fotografias) {
    
                            let nome = null;
                            if (body.nome) {
                                nome = htmlspecialchars(body.nome);
                            }
    
                            let informacao_adicional = null;
                            if (body.informacao_adicional) {
                                informacao_adicional = htmlspecialchars(body.informacao_adicional);
                            }

                            let remover_fotografias = null;
                            if (body.remover_fotografias) {
                                remover_fotografias = JSON.parse(body.remover_fotografias);
                            }

                            
    
                            try {
                                let fotografias
                                if (req.files.length > 0) {
                                    // localizacao onde esta guardada a fotografia
                                    fotografias = await file_handler.AddProductPictures(req.files);
                                    await produto_handler.InsertProductPictures(id, fotografias);
                                }
    
                                let produto = await produto_handler.UpdateProduct(id, nome, informacao_adicional, remover_fotografias);
                                res.json({
                                    code: 200,
                                    message: "Produto atualizado com sucesso",
                                    data: {
                                        produto
                                    }
                                })
                            } catch (err) {
                                throw err
                            }
    
                    } else {
                        throw {
                            code: 400,
                            message: "Pedido inválido"
                        }
                    }
                } else {
                    throw {
                        code: 403,
                        message: "Não tem autorização para efetuar este pedido"
                    }
                }
                
            } else {
                throw {
                    code: 400,
                    message: "Pedido inválido"
                }
            }
      
        } catch (err) {
          res.json({
            code: err.code,
            message: err.message
          });
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
          });
    }
    
  });

router.delete("/", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user) {
            if (authData.user.tipo != "Fornecedor") {
                throw {
                    code: 403,
                    message: "Não tem autorização para efetuar este pedido"
                }
            }
        } else {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
            
            if (body.produto) {
    
                const id = htmlspecialchars(body.produto);
    
                let exists
                // verifica se existe
                try {
                    exists = await produto_handler.GetProdutoByID(id);
                } catch (err) {
                    throw {
                        code: 400,
                        message: "Não existe um produto com esse ID"
                    }
                }
    
                if (exists.fornecedor == authData.user.id) {
                    try {
                        await produto_handler.DeleteProduct(id);
                        res.json({
                            code: 200,
                            message: "Produto eliminado com sucesso"
                        })
                    } catch (err) {
                        throw err
                    }
                } else {
                    throw {
                        code: 403,
                        message: "Não tem autorização para efetuar este pedido"
                    }
                }
            } else {
                throw {
                    code: 400,
                    message: "Pedido inválido"
                }
            }
            
      
        } catch (err) {
          res.json({
            code: err.code,
            message: err.message
          });
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }

    
  });

router.get("/pesquisa", async (req, res) => {

    try{
        const body = req.query

        let categoria = null
        let subcategoria = null
        let preco = null
        let ratingEcologico = null
        let nome = null
        let filtros = null

        // if (body.categoria || body.subcategoria || body.preco ||
        // body.ratingEcologico || body.nome || body.filtros){

        if (body.categoria){
            categoria = body.categoria
        }

        if (body.subcategoria){
            subcategoria = body.subcategoria
        }

        if (body.preco){
            preco = JSON.parse(body.preco)
        }

        if (body.ratingEcologico){
            ratingEcologico = body.ratingEcologico
        }

        if (body.nome){
            nome = body.nome
        }

        if (body.filtros){
            filtros = JSON.parse(body.filtros)
        }

        // }else {

        //     throw {
        //         code: 400,
        //         message: "Pedido inválido"
        //     }
        
        // }

        let produtos = await produto_handler.GetProdutoByFiltros(categoria,subcategoria,preco,ratingEcologico,nome,filtros)

        if (produtos.length > 0) {
            res.json({
                code: 200,
                message: "Success",
                data: produtos
            })
        } else {
            throw {
                code: 204,
                message: "No content",
            }
        }


    }  catch (err) {
        res.json({
          code: err.code,
          message: err.message
        });
    }
});

// ---------------------------------------------------------------
// -------------------------- CATEGORIA --------------------------
// ---------------------------------------------------------------

router.get("/categoria", async (req, res) => {

    try {
        const body = req.query;
  
        if (body.categoria) {
            const id = htmlspecialchars(body.categoria);

            try {
                const categoria = await produto_handler.GetCategoriaByID(id);
                res.json({
                    code: 200,
                    message: "Success",
                    data: {
                        categoria
                    }
                })
            } catch (err) {
                throw err
            }
        } else {
            try {
                const categorias = await produto_handler.GetAllCategorias();
                res.json({
                    code: 200,
                    message: "Success",
                    data: {
                        categorias
                    }
                })
            } catch (err) {
                throw err
            }
        }
    } catch (err) {
        res.json({
            code: err.code,
            message: err.message
        });
    }
  });

router.post("/categoria", api_auth.verifyToken, upload.single('fotografia'), async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        try {
            let body = req.body
    
            // Fazer pedido de nove categoria – Fornecedor
            if (authData.user) {
    
                if (authData.user.tipo == "Fornecedor") {
    
                    if (body.nome && req.file) {
                        const nome = htmlspecialchars(body.nome);
                        try {
                            let categoria = await produto_handler.FornecedorInsertNovaCategoria(nome);
                            try {
                                const fotografia = await file_handler.AddCategoriaPicture(req.file);
                                
                                categoria = await produto_handler.InsertCategoriaPicture(categoria._id, fotografia);
                            
                            } catch (err) {
                                await produto_handler.DeleteCategoria(categoria._id)
                                throw {
                                    code: 400,
                                    message: "Erro a inserir categoria. Tente novamente."
                                }
                            }

                            res.json({
                                code: 200,
                                message: "Success",
                                data: {
                                    categoria
                                }
                            })
                        } catch (err) {
                            throw err
                        }
                    } else {
                        throw {
                            code: 400,
                            message: "Pedido inválido."
                        }
                    }
                } else if (authData.user.tipo == "Administrador") {
                    if (body.nome && req.file) {
                        const nome = htmlspecialchars(body.nome);
                        try {
                            let categoria = await produto_handler.AdministradorInsertNovaCategoria(nome);
                            try {
                                const fotografia = await file_handler.AddCategoriaPicture(req.file);
                                
                                categoria = await produto_handler.InsertCategoriaPicture(categoria._id, fotografia);
                            
                            } catch (err) {
                                await produto_handler.DeleteCategoria(categoria._id)
                                throw {
                                    code: 400,
                                    message: "Erro a inserir categoria. Tente novamente."
                                }
                            }
                            res.json({
                                code: 200,
                                message: "Success",
                                data: {
                                    categoria
                                }
                            })
                        } catch (err) {
                            throw err
                        }
                    } else {
                        throw {
                            code: 400,
                            message: "Pedido inválido."
                        }
                    }
                } else {
                    throw {
                        code: 403,
                        message: "Não tem autorização para efetuar este pedido"
                    }
                }
            }
        } catch (err) {
            res.json({
                code: err.code,
                message: err.message
            })
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
    
    
});

router.get("/categoria/admin", api_auth.verifyToken, async (req, res) => {

    try {
        const authData = await api_auth.validateToken(req.token);
        if (authData.user.tipo != 'Administrador') {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const categorias = await produto_handler.GetAllAdministradorCategorias(id);
            res.json({
                code: 200,
                message: "Success",
                data: {
                    categorias
                }
            })
        } catch (err) {
            res.json({
                code: err.code,
                message: err.message
            });
        } 
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
  
});

router.put("/categoria/admin", api_auth.verifyToken, async (req, res) => {

    try {
        const authData = await api_auth.validateToken(req.token);
        if (authData.user.tipo != 'Administrador') {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            };
        }

        try {
            const body = req.body;
        
            if (body.hasOwnProperty('categoria') || body.hasOwnProperty('novo_estado')) {
    
                const id_categoria = htmlspecialchars(body.categoria);
                const novo_estado = htmlspecialchars(body.novo_estado);
    
                const categoria = await produto_handler.UpdateEstadoCategoria(id_categoria, novo_estado);
                res.json({
                    code: 200,
                    message: "Success",
                    data: {
                        categoria
                    }
                })
            }
        } catch (err) {
            res.json({
                code: err.code,
                message: err.message
            });
        } 
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
});

router.delete("/categoria/admin", api_auth.verifyToken, async (req, res) => {

    try {
        const authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != 'Administrador') {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
      
            if (body.hasOwnProperty('categoria')) {
    
                const id_categoria = htmlspecialchars(body.categoria);
    
                try {
                    let deleted = await produto_handler.DeleteCategoria(id_categoria);
                    
                    res.json({
                        code: 200,
                        message: "Categoria eliminada com sucesso"
                    })
                    
                } catch (err) {
                    throw err
                }       
            } else {
                throw {
                    code: 400,
                    message: "Pedido inválido."
                }
            }
      
        } catch (err) {
            res.json({
                code: err.code,
                message: err.message
            })
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
  });

// ------------------------------------------------------------------
// -------------------------- SUBCATEGORIA --------------------------
// ------------------------------------------------------------------

router.get("/categoria/subcategoria", async (req, res) => {

    try {
        const body = req.query;
  
        if (body.subcategoria) {
            const subcategoria_id = htmlspecialchars(body.subcategoria);
            try {
                const subcategoria = await produto_handler.GetSubcategoriaByID(subcategoria_id);
                res.json({
                    code: 200,
                    message: "Success",
                    data: {
                        subcategoria
                    }
                })
            } catch (err) {
                throw err
            }
        } else if (body.categoria) {
            const categoria_id = htmlspecialchars(body.categoria);
            try {
                const subcategorias = await produto_handler.GetSubcategoriasByCategoriaID(categoria_id);
                res.json({
                    code: 200,
                    message: "Success",
                    data: {
                        subcategorias
                    }
                })
            } catch (err) {
                throw err
            }
        } else {
            try {
                const subcategorias = await produto_handler.GetAllSubcategorias();
                res.json({
                    code: 200,
                    message: "Success",
                    data: {
                        subcategorias
                    }
                })
            } catch (err) {
                throw err
            }
        }
    } catch (err) {
        res.json({
            code: err.code,
            message: err.message
        });
    }
  });

router.post("/categoria/subcategoria", api_auth.verifyToken, upload.single('fotografia'), async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        const body = req.body;

        try {
            // Fazer pedido de nove categoria – Fornecedor
            if (authData.user) {
                if (authData.user.tipo == "Fornecedor") {
                    if (body.nome && body.categoria && req.file) {
                        const nome = htmlspecialchars(body.nome);
                        const categoria_id = htmlspecialchars(body.categoria);
                        try {
                            let subcategoria = await produto_handler.FornecedorInsertNovaSubcategoria(nome, categoria_id);
                            try {
                                const fotografia = await file_handler.AddSubCategoriaPicture(req.file);
                                
                                subcategoria = await produto_handler.InsertSubCategoriaPicture(subcategoria._id, fotografia);
                            
                            } catch (err) {
                                await produto_handler.DeleteSubCategoria(subcategoria._id)
                                throw {
                                    code: 400,
                                    message: "Erro a inserir subcategoria. Tente novamente."
                                }
                            }
                            res.json({
                                code: 200,
                                message: "Success",
                                data: {
                                    subcategoria
                                }
                            })
                        } catch (err) {
                            throw err
                        }
                    } else {
                        throw {
                            code: 400,
                            message: "Pedido inválido."
                        }
                    }
                } else if (authData.user.tipo == "Administrador") {
                    if (body.nome && body.categoria && req.file) {
                        const nome = htmlspecialchars(body.nome);
                        const categoria_id = htmlspecialchars(body.categoria);
                        try {
                            let subcategoria = await produto_handler.AdministradorInsertNovaSubcategoria(nome, categoria_id);
                            try {
                                const fotografia = await file_handler.AddSubCategoriaPicture(req.file);
                                
                                subcategoria = await produto_handler.InsertSubCategoriaPicture(subcategoria._id, fotografia);
                            
                            } catch (err) {
                                await produto_handler.DeleteSubCategoria(subcategoria._id)
                                throw {
                                    code: 400,
                                    message: "Erro a inserir subcategoria. Tente novamente."
                                }
                            }
                            res.json({
                                code: 200,
                                message: "Success",
                                data: {
                                    subcategoria
                                }
                            })
                        } catch (err) {
                            throw err
                        }
                    } else {
                        throw {
                            code: 400,
                            message: "Pedido inválido."
                        }
                    }
                } else {
                    throw {
                        code: 403,
                        message: "Não tem autorização para efetuar este pedido"
                    }
                }
            } else {
                throw {
                    code: 403,
                    message: "Não tem autorização para efetuar este pedido"
                }
            }
        } catch (err) {
            res.json({
                code: err.code,
                message: err.message
            })
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
    
});

router.get("/categoria/subcategoria/admin", api_auth.verifyToken, async (req, res) => {

    try {
        const authData = await api_auth.validateToken(req.token);
        if (authData.user.tipo != "Administrador") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const subcategorias = await produto_handler.GetAllAdministradorSubcategorias();
            res.json({
                code: 200,
                message: "Success",
                data: {
                    subcategorias
                }
            })
        } catch (err) {
            res.json({
                code: err.code,
                message: err.message
            });
        } 
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
});

router.put("/categoria/subcategoria/admin", api_auth.verifyToken, async (req, res) => {

    try {
        const authData = await api_auth.validateToken(req.token);
        if (authData.user.tipo == "Administrador") {
            try {
                const body = req.body;
            
                if (body.hasOwnProperty('subcategoria') || body.hasOwnProperty('novo_estado')) {
        
                    const id_subcategoria = htmlspecialchars(body.subcategoria);
                    const novo_estado = htmlspecialchars(body.novo_estado);
        
                    const subcategoria = await produto_handler.UpdateEstadoSubcategoria(id_subcategoria, novo_estado);
                    res.json({
                        code: 200,
                        message: "Success",
                        data: {
                            subcategoria
                        }
                    })
                } else {
                    throw {
                        code: 400,
                        message: "Pedido inválido."
                    }
                }
            } catch (err) {
                res.json({
                    code: err.code,
                    message: err.message
                });
            } 
        } else {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
  
    
});

router.delete("/categoria/subcategoria/admin", api_auth.verifyToken, async (req, res) => {

    try {
        const authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo == "Administrador") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
      
            if (body.hasOwnProperty('subcategoria')) {
    
                const id_subcategoria = htmlspecialchars(body.subcategoria);
    
                const subcategoria = await produto_handler.GetSubcategoriaByID(id_subcategoria);
                if (subcategoria) {
                    try {
                        await produto_handler.DeleteSubcategoria(id_subcategoria);
                        res.json({
                            code: 200,
                            message: "Subcategoria eliminada com sucesso"
                        })
                    } catch (err) {
                        throw err
                    }
                } else {
                    throw {
                        code: 400,
                        message: "Não existe uma subcategoria com esse ID"
                    }
                }
                       
            }
      
        } catch (err) {
          res.json({
            code: err.code,
            message: err.message
          });
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
  });

// --------------------------------------------------------------
// -------------------------- ATRIBUTO --------------------------
// --------------------------------------------------------------

router.get("/categoria/subcategoria/atributo", async (req, res) => {

    try {
        const body = req.query;
  
        if (body.atributo) {
            const atributo_id = htmlspecialchars(body.atributo);
            try {
                const atributo = await produto_handler.GetAtributoByID(atributo_id);
                res.json({
                    code: 200,
                    message: "Success",
                    data: {
                        atributo
                    }
                })
            } catch (err) {
                throw err
            }
        } else if (body.subcategoria) {
            const subcategoria_id = htmlspecialchars(body.subcategoria);
            try {
                const atributos = await produto_handler.GetAtributosBySubcategoriaID(subcategoria_id);
                res.json({
                    code: 200,
                    message: "Success",
                    data: {
                        atributos
                    }
                })
            } catch (err) {
                throw err
            }
        } else {
            throw {
                code: 400,
                message: "Pedido inválido."
            }
        }
    } catch (err) {
        res.json({
            code: err.code,
            message: err.message
        });
    }
  });

router.post("/categoria/subcategoria/atributo", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        try {
            let body = req.body
            
            if (body.atributo &&
                body.atributo.nome && body.atributo.descricao &&
                body.atributo.valores) { 
                
                const nome_atributo = htmlspecialchars(body.atributo.nome);
                const descricao_atributo = htmlspecialchars(body.atributo.descricao);
                const valores_atributo = body.atributo.valores;
            
                // Fazer pedido de nove categoria – Fornecedor
                if (authData.user) {
                    if (authData.user.tipo == "Fornecedor") {
                        
                        try {
                            const atributo = await produto_handler.FornecedorInsertNovoAtributo( nome_atributo, descricao_atributo, valores_atributo);
                            res.json({
                                code: 200,
                                message: "Success",
                                data: {
                                    atributo
                                }
                            })
                        } catch (err) {
                            throw err
                        }
                    } else if (authData.user.tipo == "Administrador") {
                        try {
                            const atributo = await produto_handler.AdministradorInsertNovoAtributo( nome_atributo, descricao_atributo, valores_atributo);
                            res.json({
                                code: 200,
                                message: "Success",
                                data: {
                                    atributo
                                }
                            })
                        } catch (err) {
                            throw err
                        }
                    } else {
                        throw {
                            code: 403,
                            message: "Não tem autorização para efetuar este pedido"
                        }
                    }
                } else {
                    throw {
                        code: 403,
                        message: "Não tem autorização para efetuar este pedido"
                    }
                }
            } else {
                throw {
                    code: 400,
                    message: "Pedido inválido."
                }
            }
        } catch (err) {
            res.json({
                code: err.code,
                message: err.message
            })
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
});

router.get("/categoria/subcategoria/atributo/admin", api_auth.verifyToken, async (req, res) => {

    try {
        const authData = await api_auth.validateToken(req.token);
        if (authData.user.tipo != "Administrador") {
            throw ({
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            });
        }

        try {
            const body = req.query;
      
            if (body.hasOwnProperty('atributo')) {
                const atributo_id = htmlspecialchars(body.atributo);
                try {
                    const atributo = await produto_handler.GetAtributoByIDAdministrador(atributo_id);
                    res.json({
                        code: 200,
                        message: "Success",
                        data: {
                            atributo
                        }
                    })
                } catch (err) {
                    throw err
                }
            } else if (body.hasOwnProperty('subcategoria')) {
                const subcategoria_id = htmlspecialchars(body.subcategoria);
                try {
                    const atributos = await produto_handler.GetAtributosBySubcategoriaIDAdministrador(subcategoria_id);
                    res.json({
                        code: 200,
                        message: "Success",
                        data: {
                            atributos
                        }
                    })
                } catch (err) {
                    throw err
                }
            } else {
                throw {
                    code: 400,
                    message: "Pedido inválido."
                }
            }
        } catch (err) {
            res.json({
                code: err.code,
                message: err.message
            });
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
});

router.put("/categoria/subcategoria/atributo/admin", api_auth.verifyToken, async (req, res) => {

    try {
        const authData = await api_auth.validateToken(req.token);
        if (authData.user.tipo != "Administrador") {
            res.json({
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            });
        }

        try {
            const body = req.body;
        
            if (body.hasOwnProperty('atributo') || body.hasOwnProperty('novo_estado')) {
    
                const id_atributo = htmlspecialchars(body.atributo);
                const novo_estado = htmlspecialchars(body.novo_estado);
    
                const atributo = await produto_handler.UpdateEstadoAtributo(id_atributo, novo_estado);
                res.json({
                    code: 200,
                    message: "Success",
                    data: {
                        atributo
                    }
                })
            }
        } catch (err) {
            res.json({
                code: err.code,
                message: err.message
            });
        } 
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
    
});

router.delete("/categoria/subcategoria/atributo/admin", api_auth.verifyToken, async (req, res) => {

    try {
        const authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Administrador") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
      
            if (body.hasOwnProperty('atributo')) {
    
                const id_atributo = htmlspecialchars(body.atributo);
    
                // verifica se existe
                try {
                    const exists = await produto_handler.GetAtributoByID(id_atributo);
                } catch (err) {
                    throw {
                        code: 400,
                        message: "Não existe um atributo com esse ID"
                    }
                }
    
                try {
                    await produto_handler.DeleteAtributo(id_atributo);
                    res.json({
                        code: 200,
                        message: "Atributo eliminado com sucesso"
                    })
                } catch (err) {
                    throw err
                }       
            }
      
        } catch (err) {
          res.json({
            code: err.code,
            message: err.message
          });
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }

  });

// ----------------------------------------------------------------
// ---------------------------- VALORES ---------------------------
// ----------------------------------------------------------------

router.post("/categoria/subcategoria/atributo/valor", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);
    
        try {

            let body = req.body
            if (body.atributo && body.valor) {
                
                const id_atributo = htmlspecialchars(body.atributo);
                const valor = htmlspecialchars(body.valor);
    
                // Fazer pedido de nove categoria – Fornecedor
                if (authData.user) {
                    if (authData.user.tipo == "Fornecedor") {
                        try {
                            const atributo = await produto_handler.FornecedorInsertNovoValorAtributo(id_atributo, valor);
                            res.json({
                                code: 200,
                                message: "Success"
                            })
                        } catch (err) {
                            throw err
                        }
                    } else if (authData.user.tipo == "Administrador") {
                        try {
                            const atributo = await produto_handler.AdministradorInsertNovoValorAtributo(id_atributo, valor);
                            res.json({
                                code: 200,
                                message: "Success"
                            })
                        } catch (err) {
                            throw err
                        }
                    } else {
                        throw {
                            code: 403,
                            message: "Não tem autorização para efetuar este pedido"
                        }
                    }
                } else {
                    throw {
                        code: 403,
                        message: "Não tem autorização para efetuar este pedido"
                    }
                }
            } else {
                throw {
                    code: 400,
                    message: "Pedido inválido."
                }
            }
        } catch (err) {
            res.json({
                code: err.code,
                message: err.message
            })
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
});

router.put("/categoria/subcategoria/atributo/valor/admin", api_auth.verifyToken, async (req, res) => {

    try {
        const authData = await api_auth.validateToken(req.token);
        if (authData.user.tipo != "Administrador") {
            res.json({
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            });
        }

        try {
            const body = req.body;
        
            if (body.hasOwnProperty('atributo') || body.hasOwnProperty('valor') || body.hasOwnProperty('novo_estado')) {
    
                const id_atributo = htmlspecialchars(body.atributo);
                const nome_valor = htmlspecialchars(body.valor);
                const novo_estado = htmlspecialchars(body.novo_estado);
    
                const atributo = await produto_handler.UpdateEstadoValor(id_atributo, nome_valor, novo_estado);
                res.json({
                    code: 200,
                    message: "Success",
                    data: {
                        atributo
                    }
                })
            }
        } catch (err) {
            res.json({
                code: err.code,
                message: err.message
            });
        } 
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
});

router.delete("/categoria/subcategoria/atributo/valor/admin", api_auth.verifyToken, async (req, res) => {

    try {
        const authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Administrador") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
      
            if (body.hasOwnProperty('atributo') && body.hasOwnProperty('valor')) {
    
                const id_atributo = htmlspecialchars(body.atributo);
                const nome_valor = htmlspecialchars(body.valor);
    
                // verifica se existe
                try {
                    const exists = await produto_handler.GetValor(id_atributo, nome_valor)
                } catch (err) {
                    throw {
                        code: 400,
                        message: "Não existe um atributo com esse ID"
                    }
                }
    
                try {
                    await produto_handler.DeleteValor(id_atributo, nome_valor);
                    res.json({
                        code: 200,
                        message: "Atributo eliminado com sucesso"
                    })
                } catch (err) {
                    throw err
                }       
            }
      
        } catch (err) {
          res.json({
            code: err.code,
            message: err.message
          });
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }

  });

// ----------------------------------------------------------------
// -------------------------- ESPECIFICO --------------------------
// ----------------------------------------------------------------

router.get("/especifico", async (req, res) => {

    try {
        const body = req.query;
  
        if (body.especifico) {
            const especifico_id = htmlspecialchars(body.especifico);
            try {
                const especifico = await produto_handler.GetProdutoEspecificoByID(especifico_id);
                res.json({
                    code: 200,
                    message: "Success",
                    data: {
                        especifico
                    }
                })
            } catch (err) {
                throw err
            }
        } else if (body.produto) {
            const produto_id = htmlspecialchars(body.produto);
            try {
                const especificos = await produto_handler.GetEspecificosByProdutoID(produto_id);
                res.json({
                    code: 200,
                    message: "Success",
                    data: {
                        especificos
                    }
                })
            } catch (err) {
                throw err
            }
        } else {
            try {
                const especificos = await produto_handler.GetAllEspecificos();
                res.json({
                    code: 200,
                    message: "Success",
                    data: {
                        especificos
                    }
                })
            } catch (err) {
                throw err
            }
        }
    } catch (err) {
        res.json({
            code: err.code,
            message: err.message
        });
    }
  });

router.post("/especifico", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Fornecedor") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            let body = req.body
            if (body.fornecedor && body.produto && body.preco && body.caracteristicas) {
                    // caracteristicas : { atributo , valor }
                
                    const fornecedor_id = htmlspecialchars(body.fornecedor);
                    const produto_id = htmlspecialchars(body.produto);
                    const preco = htmlspecialchars(body.preco); 
                    
                    const caracteristicas = body.caracteristicas;
                
                    if (authData.user.id == fornecedor_id) {
                        try {
                            let especifico = await produto_handler.InsertNovoProdutoEspecifico(fornecedor_id, produto_id, preco, caracteristicas);
                            console.log(especifico)

                            res.json({
                                code: 200,
                                message: "Success",
                                data: {
                                    especifico
                                }
                            })
                        } catch (err) {
                            throw err
                        }
                    } else {
                        throw {
                            code: 403,
                            message: "Não tem autorização para efetuar este pedido"
                        }
                    }
            } else {
                throw {
                    code: 400,
                    message: "Pedido inválido."
                }
            }
        } catch (err) {
            res.json({
                code: err.code,
                message: err.message
            })
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
    
});

router.put("/especifico", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Fornecedor") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
      
            if (body.especifico) {
    
                let id = htmlspecialchars(body.especifico);
    
                let exists
                // verifica se existe
                try {
                    exists = await produto_handler.GetProdutoEspecificoByID(id);
                } catch (err) {
                    throw {
                        code: 400,
                        message: "Não existe um produto com esse ID"
                    }
                }
    
                if (exists.fornecedor == authData.user.id) {
                    if (body.preco) { 
                        let preco = null;
                        if (body.preco) {
                            preco = htmlspecialchars(body.preco);
                        }
    
                        try {
    
                            let especifico = await produto_handler.UpdateProdutoEspecifico(id, preco);
                            res.json({
                                code: 200,
                                message: "Produto especifico atualizado com sucesso",
                                data: {
                                    especifico
                                }
                            })
                        } catch (err) {
                            throw err
                        }
    
                    } else {
                        throw {
                            code: 400,
                            message: "Pedido inválido"
                        }
                    }
                } else {
                    throw {
                        code: 403,
                        message: "Não tem autorização para efetuar este pedido"
                    }
                }
                
            }
      
        } catch (err) {
          res.json({
            code: err.code,
            message: err.message
          });
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
    
  });

router.delete("/especifico", api_auth.verifyToken, async (req, res) => {

    try {
        const authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Fornecedor") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
            
            if (body.especifico) {
    
                const id = htmlspecialchars(body.especifico);
    
                // verifica se existe
                try {
                    const exists = await produto_handler.GetProdutoEspecificoByID(id);
                } catch (err) {
                    throw {
                        code: 400,
                        message: "Não existe um produto com esse ID"
                    }
                }
                if (exists.fornecedor == authData.user.id) {
                    try {
                        let idProduto = await produto_handler.DeleteProdutoEspecifico(id);
                        res.json({
                            code: 200,
                            message: "Produto eliminado com sucesso"
                        })
                    } catch (err) {
                        throw err
                    }
                } else {
                    throw {
                        code: 403,
                        message: "Não tem autorização para efetuar este pedido"
                    }
                }
            }
            
      
        } catch (err) {
          res.json({
            code: err.code,
            message: err.message
          });
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }

  });

router.post("/especifico/desconto", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Fornecedor") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            let body = req.body
            if (body.fornecedor && body.produto_especifico && body.desconto && body.data_fim) {

                    const fornecedor = htmlspecialchars(body.fornecedor);
                    const produto_especifico = htmlspecialchars(body.produto_especifico);
                    const desconto = htmlspecialchars(body.desconto); 
                    const data_fim = htmlspecialchars(body.data_fim);

                    if (authData.user.id == fornecedor) {
                        try {
                            let especifico = await produto_handler.InsertDescontoProdutoEspecifico(fornecedor, produto_especifico, desconto, data_fim);

                            res.json({
                                code: 201,
                                message: "Success",
                                data: {
                                    especifico
                                }
                            })
                        } catch (err) {
                            throw err
                        }
                    } else {
                        throw {
                            code: 403,
                            message: "Não tem autorização para efetuar este pedido"
                        }
                    }
            } else {
                throw {
                    code: 400,
                    message: "Pedido inválido."
                }
            }
        } catch (err) {
            res.json({
                code: err.code,
                message: err.message
            })
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
    
});

module.exports = router;