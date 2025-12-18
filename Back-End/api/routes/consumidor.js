// importing the dependencies
const express = require('express');
const router = express.Router();
const api_auth = require('../api_auth');
const consumidor_handler = require('../../handlers/ConsumidorHandler').handler_consumidor;
const compra_handler = require('../../handlers/CompraHandler').handler_compra;
const EncomendaGW = require('../../gateway/EncomendaGat')
const htmlspecialchars = require('htmlspecialchars');

// requests

router.get("/consumidor", async (req, res) => {
  try {
    const body = req.query;
    
    let consumidores = []
    if (body.id) {
        const id = htmlspecialchars(body.id);
        let consumidor = await consumidor_handler.GetConsumidorByID(id);
        consumidores = consumidores.concat(consumidor)  
    } else if (body.email) {
        const email = htmlspecialchars(body.email);
        let consumidor = await consumidor_handler.GetConsumidorByEmail(email);
        consumidores = consumidores.concat(consumidor)
    } else {
        consumidores = await consumidor_handler.GetAllConsumidores();
    }

    res.json({
      code: 200,
      message: "Success",
      data: consumidores
    })

  } catch (err) {
    res.json({
      code: err.code,
      message: err.message
    });
  }
});

router.put("/consumidor", api_auth.verifyToken, async (req, res) => {

    try {
        let authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Consumidor" && authData.user.tipo != "Administrador") {
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
                    exists = await consumidor_handler.GetConsumidorByID(id);
                } catch (err) {
                    throw {
                        code: 400,
                        message: "Não existe um consumidor com esse ID"
                    }
                }
    
                if (id == authData.user.id || authData.user.tipo == "Administrador") {
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
                                let consumidor = await consumidor_handler.UpdateConsumidor(id, nome, email, password_antiga, password_nova, morada, nif, telemovel);
                                res.json({
                                    code: 200,
                                    message: "Consumidor atualizado com sucesso",
                                    data: {
                                        consumidor
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

router.get("/consumidor/encomenda", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Consumidor") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.query;
      
            if (body.utilizador) {
                const utilizador = htmlspecialchars(body.utilizador);
                if (authData.user.id == utilizador) {
                    if (body.encomenda) {
                        console.log("entrei fds")
                        const encomenda_id = htmlspecialchars(body.encomenda);
    
                        try {
                            let encomenda = await consumidor_handler.GetEncomendaConsumidor(utilizador, encomenda_id)
                        
                            res.json({
                                code: 200,
                                message: "Success",
                                data: encomenda
                            })
                        } catch (err) {
                            throw err
                        }
                         
                    } else {
                        if (body.filetype) {
                            let filetype = htmlspecialchars(body.filetype)
                            
                            try {
                                let encomendas
                                if (filetype == "csv") {
                                    encomendas = await consumidor_handler.GetEncomendasConsumidorCSV(utilizador)
                                    res.attachment('encomendas.csv').send(encomendas)
                                } else if (filetype == "json") {
                                    encomendas = await consumidor_handler.GetEncomendasConsumidorJSON(utilizador)
                                    res.attachment('encomendas.json').send(encomendas)
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
                                let encomendas = await consumidor_handler.GetEncomendasConsumidor(utilizador)
                            
                                res.json({
                                    code: 200,
                                    message: "Success",
                                    data: encomendas
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

router.delete("/consumidor/encomenda", api_auth.verifyToken, async (req, res) => {
    
    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Consumidor") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
            
            if (body.consumidor) {
                const consumidor = htmlspecialchars(body.consumidor);
    
                if (authData.user.id == consumidor) {

                    if (body.encomenda) {
                        const encomenda_id = htmlspecialchars(body.encomenda);

                        try {
                            await consumidor_handler.CancelEncomenda(consumidor, encomenda_id)
                        } catch (err) {
                            throw err
                        }                        

                        res.json({
                            code: 200,
                            message: "Encomenda cancelada com sucesso"
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
})

router.get("/consumidor/encomenda/cadeia_logistica", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Consumidor") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.query;
      
            if (body.encomenda) {
                const id_encomenda = htmlspecialchars(body.encomenda);

                let encomenda = await EncomendaGW.getById(id_encomenda)
                if (encomenda != false) {
                    if (authData.user.id == String(encomenda.comprador)) {
                        try {
                            const cadeia = await consumidor_handler.GetCadeiaEncomenda(encomenda);
                            
                            res.json({
                                code: 200,
                                message: "Success",
                                data: {
                                    cadeia
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
                        message: "Não existe encomenda com este id."
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

router.get("/consumidor/encomenda/cadeia_logistica/sumario", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Consumidor") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.query;
      
            if (body.encomenda) {
                const id_encomenda = htmlspecialchars(body.encomenda);

                let encomenda = await EncomendaGW.getById(id_encomenda)
                if (encomenda != false) {
                    if (authData.user.id == String(encomenda.comprador)) {
                        try {
                            const cadeia = await consumidor_handler.GetSumarioCadeiaEncomenda(encomenda);
                            
                            res.json({
                                code: 200,
                                message: "Success",
                                data: {
                                    cadeia
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
                        message: "Não existe encomenda com este id."
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

router.get("/favoritos", api_auth.verifyToken, async (req, res) => {
  
    let authData
      try {
          authData = await api_auth.validateToken(req.token);

          try {
            const body = req.query;
        
            if (body.utilizador) {
                const utilizador_id = htmlspecialchars(body.utilizador);
        
                if (authData.user.id == utilizador_id) {
                    try {
                        const favoritos = await consumidor_handler.GetFavoritosConsumidor(utilizador_id);
                        res.json({
                            code: 200,
                            message: "Success",
                            data: {
                                favoritos
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
  
router.get("/favoritos/utilizador", api_auth.verifyToken, async (req, res) => {
    
    let authData
      try {
          authData = await api_auth.validateToken(req.token);

          try {
            const body = req.query;
        
            if (body.utilizador) {
                const utilizador_id = htmlspecialchars(body.utilizador);
        
                if (authData.user.id == utilizador_id) {
                    try {
                        const favoritos = await consumidor_handler.GetUtilizadoresFavoritosConsumidor(utilizador_id);
                        res.json({
                            code: 200,
                            message: "Success",
                            data: {
                                favoritos
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
  
router.get("/favoritos/produto", api_auth.verifyToken, async (req, res) => {
    
    let authData
      try {
          authData = await api_auth.validateToken(req.token);

          try {
            const body = req.query;
        
            if (body.utilizador) {
                const utilizador_id = htmlspecialchars(body.utilizador);
        
                if (authData.user.id == utilizador_id) {
                    try {
                        const favoritos = await consumidor_handler.GetProdutosFavoritosConsumidor(utilizador_id);
                        res.json({
                            code: 200,
                            message: "Success",
                            data: {
                                favoritos
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
  
router.post("/favoritos/utilizador", api_auth.verifyToken, async (req, res) => {
    
    let authData
      try {
          authData = await api_auth.validateToken(req.token);

          try {
            const body = req.body;
        
            if (body.utilizador && body.favorito) {
                const utilizador_id = htmlspecialchars(body.utilizador);
                const favorito_id = htmlspecialchars(body.favorito);
        
                if (authData.user.id == utilizador_id) {
                    try {
                        await consumidor_handler.AddUtilizadorFavorito(utilizador_id, favorito_id);
                        res.json({
                            code: 200,
                            message: "Novo favorito adicionado com sucesso",
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
  
router.post("/favoritos/produto", api_auth.verifyToken, async (req, res) => {
    
    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        try {
            const body = req.body;
        
            if (body.utilizador && body.favorito) {
                const utilizador_id = htmlspecialchars(body.utilizador);
                const favorito_id = htmlspecialchars(body.favorito);
        
                if (authData.user.id == utilizador_id) {
                    try {
                        await consumidor_handler.AddProdutoFavorito(utilizador_id, favorito_id);
                        res.json({
                            code: 200,
                            message: "Novo favorito adicionado com sucesso",
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
  
router.delete("/favoritos/utilizador", api_auth.verifyToken, async (req, res) => {
    
    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        try {
            const body = req.body;
        
            if (body.utilizador && body.favorito) {
                const utilizador_id = htmlspecialchars(body.utilizador);
                const favorito_id = htmlspecialchars(body.favorito);
        
                if (authData.user.id == utilizador_id) {
                    try {
                        await consumidor_handler.RemoveUtilizadorFavorito(utilizador_id, favorito_id);
                        res.json({
                            code: 200,
                            message: "Utilizador favorito eliminado com sucesso",
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
        res.json(err)
    }
  });
  
router.delete("/favoritos/produto", api_auth.verifyToken, async (req, res) => {
    
    let authData
      try {
          authData = await api_auth.validateToken(req.token);

          try {
            const body = req.body;
        
            if (body.utilizador && body.favorito) {
                const utilizador_id = htmlspecialchars(body.utilizador);
                const favorito_id = htmlspecialchars(body.favorito);
        
                if (authData.user.id == utilizador_id) {
                    try {
                        await consumidor_handler.RemoveProdutoFavorito(utilizador_id, favorito_id);
                        res.json({
                            code: 200,
                            message: "Produto favorito eliminado com sucesso",
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

module.exports = router
