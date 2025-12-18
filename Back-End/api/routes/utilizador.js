// importing the dependencies
const express = require('express');
const htmlspecialchars = require('htmlspecialchars');
const router = express.Router();
const api_auth = require('../api_auth');
const utilizador_handler = require('../../handlers/UtilizadorHandler').handler_utilizador;

// requests

// -------------------------------------------------------------
// ------------------------- UTILIZADOR ------------------------
// -------------------------------------------------------------

router.get("/", async (req, res) => {
  try {
    const body = req.query;

    let utilizadores = []
    if (body.id) {
        const id = htmlspecialchars(body.id);
        let utilizador = await utilizador_handler.GetUtilizadorByID(id);
        utilizadores = utilizadores.concat(utilizador)  
    } else if (body.email) {
        const email = htmlspecialchars(body.email);
        let utilizador = await utilizador_handler.GetUtilizadorByEmail(email);
        utilizadores = utilizadores.concat(utilizador)
    } else {
        utilizadores = await utilizador_handler.GetAllUtilizadores();
    }

    res.json({
      code: 200,
      message: "Success",
      data: utilizadores
    })

  } catch (err) {
    res.json({
      code: err.code,
      message: err.message
    });
  }
});

router.delete("/", api_auth.verifyToken, async (req, res) => {
  
  let authData
  try {
      authData = await api_auth.validateToken(req.token);

      try {
        const body = req.body;
  
        if (body.id && body.password) {
  
          const id = htmlspecialchars(body.id);
          const password = htmlspecialchars(body.password);

          let exists = await utilizador_handler.GetUtilizadorByID(id);
  
          if (authData.user && authData.user.tipo != "Administrador"){
              if (exists.id == authData.user.id) {
                  try {
                      await utilizador_handler.DeleteUtilizador(id, password);
                      res.json({
                          code: 200,
                          message: "Utilizador eliminado com sucesso"
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
          } else if (authData.user.tipo == "Administrador") {
                  try {
                      await utilizador_handler.DeleteUtilizador(id);
                      res.json({
                          code: 200,
                          message: "Utilizador eliminado com sucesso"
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

router.get("/notificacoes", api_auth.verifyToken, async (req, res) => {
  
  let authData
    try {
        authData = await api_auth.validateToken(req.token);

        try {
            const body = req.query;
        
            if (body.utilizador) {
                const utilizador_id = htmlspecialchars(body.utilizador);
        
                if (authData.user.id == utilizador_id) {
                    try {
                        let notificacoes = await utilizador_handler.GetNotificacoesUtilizador(utilizador_id);
                        res.json({
                            code: 200,
                            message: "Success",
                            data: {
                                notificacoes
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

router.put("/notificacoes", api_auth.verifyToken, async (req, res) => {
  
    let authData
      try {
          authData = await api_auth.validateToken(req.token);
  
          try {
              const body = req.body;
          
              if (body.utilizador && body.notificacoes) {
                  const utilizador_id = htmlspecialchars(body.utilizador);
          
                  if (authData.user.id == utilizador_id) {
                      try {
                          const notificacoes = await utilizador_handler.ViewNotificacoesUtilizador(utilizador_id, body.notificacoes);
                          res.json({
                              code: 200,
                              message: "As notificações foram atualizadas com sucesso"
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

router.get("/local", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        try {
            const body = req.query;
      
            if (body.utilizador) {
                const utilizador = htmlspecialchars(body.utilizador);
    
                if (authData.user.id == utilizador || authData.user.tipo == "Transportador" || authData.user.tipo == "Administrador") {
    
                    if (body.local) {
                        const local_id = htmlspecialchars(body.local);
    
                        try {
                            const local = await utilizador_handler.GetLocalByID(local_id);
                            res.json({
                                code: 200,
                                message: "Success",
                                data: {
                                    local
                                }
                            })
                        } catch (err) {
                            throw err
                        }
                    } else {
                        try {
                            const locais = await utilizador_handler.GetLocaisByUtilizador(utilizador);
                            res.json({
                                code: 200,
                                message: "Success",
                                data: {
                                    locais
                                }
                            })
                        } catch (err) {
                            throw err
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

router.post("/local", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Consumidor" && authData.user.tipo != "Transportador" && authData.user.tipo != "Fornecedor") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
            if (body.tipo && body.utilizador && body.morada && 
                body.codigo_postal && body.localidade && body.pais) {
    
                const tipo = htmlspecialchars(body.tipo);
                const utilizador = htmlspecialchars(body.utilizador);
                const morada = htmlspecialchars(body.morada);
                const codigo_postal = htmlspecialchars(body.codigo_postal);
                const localidade = htmlspecialchars(body.localidade);
                const pais = htmlspecialchars(body.pais);
    
                if (authData.user.id == utilizador) {
                    try {
                        const local = await utilizador_handler.InsertLocal(tipo, utilizador, morada, codigo_postal, localidade, pais);
    
                        res.json({
                            code: 200,
                            message: "Success",
                            data: local
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

router.delete("/local", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        try {
            const body = req.body;
            if (body.hasOwnProperty('utilizador') && body.hasOwnProperty('local')) {
    
                const utilizador = htmlspecialchars(body.utilizador);
                const local = htmlspecialchars(body.local);

                const localBuscado = await utilizador_handler.GetLocalByID(local)

                const utilizadorLocal = String(localBuscado.utilizador)
    
                if (authData.user.id == utilizador && utilizadorLocal == utilizador) {
                    try {
                        await utilizador_handler.DeleteLocal(local);
                        res.json({
                            code: 200,
                            message: "Local eliminado com sucesso"
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
            } else if (body.hasOwnProperty('local') && authData.user.tipo == "Administrador"){

                const local = htmlspecialchars(body.local);

                try {
                    await utilizador_handler.DeleteLocal(local);
                    res.json({
                        code: 200,
                        message: "Local eliminado com sucesso"
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

router.get("/administrador/relatorio", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Administrador") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            
            const relatorio = await utilizador_handler.GetRelatorioAdministrador();
            res.json({
                code: 200,
                message: "Success",
                data: {
                    relatorio
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

router.post("/administrador/congelamento", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);
        if (authData.user.tipo != "Administrador") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            if (req.body.utilizador) {
                const congelou = await utilizador_handler.CongelarUtilizador(req.body.utilizador);
                if(congelou){
                    res.json({
                    code: 200,
                    message: "Utilizador congelado com sucesso."
                    })
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

  router.delete("/administrador/congelamento", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Administrador") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            if (req.body.utilizador) {
                
                const descongelou = await utilizador_handler.DescongelarUtilizador(req.body.utilizador);
                res.json({
                    code: 200,
                    message: "Utilizador descongelado com sucesso."
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
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
  });

module.exports = router