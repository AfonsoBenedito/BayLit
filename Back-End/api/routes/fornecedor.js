// importing the dependencies
const express = require('express');
const htmlspecialchars = require('htmlspecialchars');
const router = express.Router();
const api_auth = require('../api_auth');
const fornecedor_handler = require('../../handlers/FornecedorHandler').handler_fornecedor;

// requests

router.get("/fornecedor", async (req, res) => {
  try {
    const body = req.query;

    let fornecedores = []
    if (body.hasOwnProperty('id')) {
        const id = htmlspecialchars(body.id);
        let fornecedor = await fornecedor_handler.GetFornecedorByID(id);
        fornecedores = fornecedores.concat(fornecedor)  
    } else if (body.hasOwnProperty('email')) {
        const email = htmlspecialchars(body.email);
        let fornecedor = await fornecedor_handler.GetFornecedorByEmail(email);
        fornecedores = fornecedores.concat(fornecedor)
    } else {
        fornecedores = await fornecedor_handler.GetAllFornecedores();
    }

    res.json({
      code: 200,
      message: "Success",
      data: fornecedores
    })

  } catch (err) {
    res.json({
      code: err.code,
      message: err.message
    });
  }
});

router.put("/fornecedor", api_auth.verifyToken, async (req, res) => {

    try {
        const authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Fornecedor" && authData.user.tipo != "Administrador") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
      
            if (body.id) {
    
                let id = htmlspecialchars(body.id);
    
                let exists
                // verifica se existe
                try {
                    exists = await fornecedor_handler.GetFornecedorByID(id);
                } catch (err) {
                    throw {
                        code: 400,
                        message: "Não existe um fornecedor com esse ID"
                    }
                }
    
                if (exists.id == authData.user.id || authData.user.tipo == "Administrador") {
                    if (body.nome || body.email ||
                        body.password_antiga && body.password_nova  || body.morada ||
                        body.nif || body.telemovel) {
                            
                            let nome = null;
                            if (body.nome) {
                                nome = htmlspecialchars(body.nome);
                            }
    
                            let email = null;
                            if (body.email) {
                                email = htmlspecialchars(body.email);
                            }
    
                            let password_antiga = null;
                            let password_nova = null
                            if (body.password_antiga && body.password_nova) {
                                password_antiga = htmlspecialchars(body.password_antiga);
                                password_nova = htmlspecialchars(body.password_nova);
                            }
    
                            let morada = null;
                            if (body.morada) {
                                morada = htmlspecialchars(body.morada);
                            }
    
                            let nif = null;
                            if (body.nif) {
                                nif = htmlspecialchars(body.nif);
                            }
    
                            let telemovel = null;
                            if (body.telemovel) {
                                telemovel = htmlspecialchars(body.telemovel);
                            }
    
                            try {
                                let fornecedor = await fornecedor_handler.UpdateFornecedor(id, nome, email, password_antiga, password_nova, morada, nif, telemovel);
                                res.json({
                                    code: 200,
                                    message: "Fornecedor atualizado com sucesso",
                                    data: {
                                        fornecedor
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

router.get("/fornecedor/relatorio", api_auth.verifyToken, async (req, res) => {
    
    let authData
    try {
        console.log(req.token)
        authData = await api_auth.validateToken(req.token);
        
        if (authData.user.tipo != "Fornecedor") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.query;
        
            if (body.fornecedor && body.espaco_temporal) {
                const id = htmlspecialchars(body.fornecedor);
                const espaco_temporal = htmlspecialchars(body.espaco_temporal);
                if (espaco_temporal == "semana" || espaco_temporal == "mes" || espaco_temporal == "ano" || espaco_temporal == "5 anos") {
                    let relatorio = await fornecedor_handler.GetRelatorioFornecedorByID(id, espaco_temporal);

                    res.json({
                        code: 200,
                        message: "Success",
                        data: relatorio
                    })
                } else {
                    throw {
                        code: 400,
                        message: "Pedido inválido"
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

router.get("/fornecedor/venda", api_auth.verifyToken, async (req, res) => {

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
            const body = req.query;
      
            if (body.fornecedor) {
                const fornecedor = htmlspecialchars(body.fornecedor);
    
                if (authData.user.id == fornecedor) {
                    if (body.venda) {
                        const venda_id = htmlspecialchars(body.venda);

                        try {
                            let venda = await fornecedor_handler.GetVendaFornecedor(fornecedor, venda_id)
                        
                            res.json({
                                code: 200,
                                message: "Success",
                                data: venda
                            })
                        } catch (err) {
                            throw err
                        }
                            
                    } else {
                        if (body.filetype) {
                            let filetype = htmlspecialchars(body.filetype)
                            
                            try {
                                let vendas
                                if (filetype == "csv") {
                                    vendas = await fornecedor_handler.GetVendasFornecedorCSV(fornecedor)
                                    res.attachment('vendas.csv').send(vendas)
                                } else if (filetype == "json") {
                                    vendas = await fornecedor_handler.GetVendasFornecedorJSON(fornecedor)
                                    res.attachment('vendas.json').send(vendas)
                                } else {
                                    throw {
                                        code: 400,
                                        message: "Tipo de ficheiro inválido"
                                    }
                                }
                    
                            } catch (err) {
                                throw err
                            }
                            
                        } else {
    
                            try {
                                let vendas = await fornecedor_handler.GetVendasFornecedor(fornecedor)
                            
                                res.json({
                                    code: 200,
                                    message: "Success",
                                    data: vendas
                                })
                            } catch (err) {
                                throw err
                            }
                            
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
        })
    }

  });

router.get("/fornecedor/armazem", async (req, res) => {
    try {
      const body = req.query;
  
      let armazens = []
      if (body.armazem) {
          const armazem_id = htmlspecialchars(body.armazem);
          let armazem = await fornecedor_handler.GetArmazemByID(armazem_id);
          armazens = armazens.concat(armazem)  
      } else if (body.fornecedor) {
          const fornecedor_id = htmlspecialchars(body.fornecedor);
          let list_armazem = await fornecedor_handler.GetArmazemByFornecedor(fornecedor_id);
          armazens = armazens.concat(list_armazem)
      } else {
          throw {
              code: 400,
              message: "Pedido inválido"
          }
      }
  
      res.json({
        code: 200,
        message: "Success",
        data: armazens
      })
  
    } catch (err) {
      res.json({
        code: err.code,
        message: err.message
      });
    }
  });

router.post("/fornecedor/armazem", api_auth.verifyToken, async (req, res) => {

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
            if (body.fornecedor && body.local
             && body.tamanho && body.gasto_diario) {
    
                const fornecedor = htmlspecialchars(body.fornecedor);
                const local = htmlspecialchars(body.local);
                const tamanho = htmlspecialchars(body.tamanho);
                const gasto_diario = htmlspecialchars(body.gasto_diario);
    
                if (authData.user.id == fornecedor) {
                    try {
                        const armazem = await fornecedor_handler.InsertArmazem(fornecedor, local, tamanho, gasto_diario);
    
                        res.json({
                            code: 200,
                            message: "Success",
                            data: armazem
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
            })
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
});

router.put("/fornecedor/armazem", api_auth.verifyToken, async (req, res) => {

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
            if (body.armazem && body.gasto_diario) {
    
                const armazem_id = htmlspecialchars(body.armazem);
                const fornecedor = await fornecedor_handler.GetFornecedorArmazem(armazem_id);
                const gasto_diario = htmlspecialchars(body.gasto_diario);
    
                if (authData.user.id == fornecedor) {
                    try {
                        const armazem = await fornecedor_handler.UpdateGastoDiarioArmazem(armazem_id, gasto_diario);
    
                        res.json({
                            code: 200,
                            message: "Armazém atualizado com sucesso",
                            data: armazem
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
            })
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
});

router.delete("/fornecedor/armazem", api_auth.verifyToken, async (req, res) => {

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
            if (body.armazem) {
    
                const armazem_id = htmlspecialchars(body.armazem);
                const fornecedor = await fornecedor_handler.GetFornecedorArmazem(armazem_id);
    
                if (authData.user.id == fornecedor) {
                    try {
                        await fornecedor_handler.DeleteArmazem(armazem_id);
    
                        res.json({
                            code: 200,
                            message: "Armazém eliminado com sucesso"
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
            })
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
    
});

// PRODUTOS EM INVENTARIO

router.post("/fornecedor/armazem/inventario", api_auth.verifyToken, async (req, res) => {

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
            if (body.armazem && body.produtos && body.meio_transporte && body.desperdicio) {
    
                // produtos = [ {produto_especifico, quantidade, prazo_validade} ]
                // meio_transporte = [ {marca, modelo, tipo} ]
                const armazem = htmlspecialchars(body.armazem);
                const produtos = body.produtos;
                const meio_transporte = body.meio_transporte;
                const desperdicio = body.desperdicio;

                let fornecedor = await fornecedor_handler.GetFornecedorArmazem(armazem);
                
                if (authData.user.id == fornecedor) {
                    try {
                        const inventario = await fornecedor_handler.InsertProdutosInventario(armazem, produtos, meio_transporte, desperdicio);
    
                        res.json({
                            code: 200,
                            message: "Success",
                            data: inventario
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
            })
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
});

router.get("/fornecedor/armazem/inventario/stock", async (req, res) => {
    try {
      const body = req.query;
  
        if (body.produto_especifico) {
            if (body.time) {
                if (body.time == "now") {
                    const produto_especifico = htmlspecialchars(body.produto_especifico);
                    let stock = await fornecedor_handler.ProdutoStock(produto_especifico);
                    
                    res.json({
                        code: 200,
                        message: "Success",
                        data: stock
                    })
                } else if (body.time == "ever") {
                    const produto_especifico = htmlspecialchars(body.produto_especifico);
                    let stock = await fornecedor_handler.ProdutoTeveStock(produto_especifico);
                    
                    res.json({
                        code: 200,
                        message: "Success",
                        data: stock
                    })
                } else {
                    throw {
                        code: 400,
                        message: "Pedido inválido"
                    }
                }
            } else {
                throw {
                    code: 400,
                    message: "Pedido inválido"
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
  });

router.get("/fornecedor/funcionario", async (req, res) => {
    try {
      const body = req.query;
  
      if (body.fornecedor) {
          const fornecedor_id = htmlspecialchars(body.fornecedor);
          let funcionarios
          if (body.armazem) {
            const armazem = htmlspecialchars(body.armazem);
            funcionarios = await fornecedor_handler.GetFuncionariosByArmazem(armazem);
          } else if (body.nome) {
            const nome = htmlspecialchars(body.nome);
            funcionarios = await fornecedor_handler.GetFuncionarioByFornecedorENome(fornecedor_id, nome);
          } else if (body.id) {
            const id = htmlspecialchars(body.id)
            let funcionario = await fornecedor_handler.GetFuncionarioByID(id)
            funcionarios = [funcionario]
          } else {
            funcionarios = await fornecedor_handler.GetFuncionariosByFornecedor(fornecedor_id);
          }

          res.json({
            code: 200,
            message: "Success",
            data: funcionarios
          })

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
  });

router.post("/fornecedor/funcionario", api_auth.verifyToken, async (req, res) => {

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
            if (body.fornecedor && body.armazem && body.nome && body.idade) {
    
                const fornecedor = htmlspecialchars(body.fornecedor);
                const armazem = htmlspecialchars(body.armazem);
                const nome = htmlspecialchars(body.nome);
                const idade = htmlspecialchars(body.idade);
                
    
                if (authData.user.id == fornecedor) {
                    try {
                        const funcionario = await fornecedor_handler.InsertFuncionario(fornecedor, armazem, nome, idade);
    
                        res.json({
                            code: 200,
                            message: "Success",
                            data: funcionario
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
            })
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
});

router.delete("/fornecedor/funcionario", api_auth.verifyToken, async (req, res) => {

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
            if (body.fornecedor && body.funcionario) {
    
                const fornecedor = htmlspecialchars(body.fornecedor);
                const funcionario = htmlspecialchars(body.funcionario);
                
                if (authData.user.id == fornecedor) {
                    try {
                        await fornecedor_handler.DeleteFuncionario(funcionario);
    
                        res.json({
                            code: 200,
                            message: "Funcionario eliminado com sucesso"
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
            })
        }

    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
});


module.exports = router
