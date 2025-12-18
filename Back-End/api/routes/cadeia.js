// importing the dependencies
const express = require('express');
const router = express.Router();
const htmlspecialchars = require('htmlspecialchars');
const utils = require("../../utils");
const api_auth = require('../api_auth');
const cadeia_handler = require('../../handlers/CadeiaHandler').handler_cadeia;
const produto_handler = require('../../handlers/ProdutoHandler').handler_produto;
const transportador_handler = require('../../handlers/TransportadorHandler').handler_transportador;
const TransporteGW = require('../../gateway/TransporteGat')

// -------------------------------------------------------------------
// -------------------------- ARMAZENAMENTO --------------------------
// -------------------------------------------------------------------

router.get("/armazenamento", async (req, res) => {

    try {
        const body = req.query;
  
        if (body.produto) {
            const produto_id = htmlspecialchars(body.produto);
            const armazenamento = await cadeia_handler.GetArmazenamentoByProduto(produto_id)
            
            if (armazenamento) {
                res.json({
                    code: 200,
                    message: "Success",
                    data: armazenamento
                })
            } else {
                res.json({
                    code: 200,
                    message: "O produto que procura ainda não foi armazenado",
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
  });

// ----------------------------------------------------------------
// -------------------------- TRANSPORTE --------------------------
// ----------------------------------------------------------------

router.get("/transporte", async (req, res) => {

    try {
        const body = req.query;
  
        if (body.transportador) {
            const transportador_id = htmlspecialchars(body.transportador);

            if (body.estado) {
                if (body.estado == "Disponivel" || body.estado == "Cancelado" || body.estado == "Por iniciar" || body.estado == "Em movimento", body.estado == "Terminado") {
                    const estado = htmlspecialchars(body.estado);

                    const transportes = await cadeia_handler.GetTransporteByTransportadorEEstado(transportador_id, estado)
            
                    res.json({
                        code: 200,
                        message: "Success",
                        data: transportes
                    })
                } else {
                    throw {
                        code: 400,
                        message: "Pedido inválido"
                    }
                }
            } else {
                const transportes = await cadeia_handler.GetTransporteByTransportador(transportador_id)
            
                res.json({
                    code: 200,
                    message: "Success",
                    data: transportes
                })
            } 
        } else if (body.transporte) {
            const transporte_id = htmlspecialchars(body.transporte);
            const transporte = await cadeia_handler.GetTransporteByID(transporte_id)
            
            res.json({
                code: 200,
                message: "Success",
                data: transporte
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

router.put("/transporte", api_auth.verifyToken, async (req, res) => {

    try {
        const authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Transportador") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
      
            if (body.id && body.novo_estado) {
    
                let id = htmlspecialchars(body.id);
                let novo_estado = htmlspecialchars(body.novo_estado);

                if (novo_estado != 'Em movimento' && novo_estado != 'Terminado') {
                    throw {
                        code: 400,
                        message: "Pedido inválido"
                    }
                }
    
                let transporte_antes = await TransporteGW.getById(id)
                if (transporte_antes) {
                    if (transporte_antes.transportador == authData.user.id) {
                        let transporte
                        if (novo_estado == 'Em movimento') {
                            transporte = await cadeia_handler.StartTransporte(id);
                        } else if (novo_estado == 'Terminado') {
                            transporte = await cadeia_handler.TerminateTransporte(id);
                        }
    
                        res.json({
                            code: 200,
                            message: "Transporte atualizado com sucesso",
                            data: {
                                transporte
                            }
                        })
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

router.delete("/transporte", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Transportador") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
            if (body.hasOwnProperty('transporte')) {
    
                const transporte_id = htmlspecialchars(body.transporte);
                const transporte = await TransporteGW.getById(transporte_id);
    
                if (authData.user.id == transporte.transportador) {
                    try {
                        await transportador_handler.CancelTransporte(transporte_id);
    
                        res.json({
                            code: 200,
                            message: "Transporte cancelado com sucesso"
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

router.put("/transporte/localizacao", api_auth.verifyToken, async (req, res) => {

    try {
        const authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Transportador") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
      
            if (body.id && body.local && body.estado_local) {

                let id = htmlspecialchars(body.id);
                let local = htmlspecialchars(body.local);
                let estado_local = htmlspecialchars(body.estado_local);

                if (body.estado_local != "A chegar" && body.estado_local != "Concluido") {
                    throw {
                        code: 400,
                        message: "Pedido inválido"
                    }
                }
    
                let transporte_antes = await TransporteGW.getById(id)
                if (transporte_antes) {
                    if (transporte_antes.transportador == authData.user.id) {
                        let transporte
                        transporte = await cadeia_handler.UpdateEstadoLocal(id, local, estado_local);
    
                        res.json({
                            code: 200,
                            message: "Transporte atualizado com sucesso",
                            data: {
                                transporte
                            }
                        })
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

// ----------------------------------------------------------------
// -------------------- TRANSPORTE ARMAZEM ------------------------
// ----------------------------------------------------------------

router.get("/transporte_armazem", async (req, res) => {

    try {
        const body = req.query;
  
        if (body.produto) {
            const produto_id = htmlspecialchars(body.produto);
            const transporte_armazem = await cadeia_handler.GetTransporteArmazemByProduto(produto_id)
            
            if (transporte_armazem) {
                res.json({
                    code: 200,
                    message: "Success",
                    data: transporte_armazem
                })
            } else {
                res.json({
                    code: 200,
                    message: "O produto que procura ainda não foi transportado para armazém",
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
  });

// --------------------------------------------------------------
// -------------------------- PRODUCAO --------------------------
// --------------------------------------------------------------

router.get("/producao", async (req, res) => {

    try {
        const body = req.query;
  
        if (body.produto) {
            const id_produto = htmlspecialchars(body.produto);
            const producao = await cadeia_handler.GetProducaoByProdutoID(id_produto);
            
            res.json({
                code: 200,
                message: "Success",
                data: producao
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

router.get("/producao/recursos", async (req, res) => {

    try {
        const body = req.query;
  
        const recursos = require('../../handlers/resources.json')
        
        res.json({
            code: 200,
            message: "Success",
            data: recursos
        })
  
    } catch (err) {
      res.json({
        code: err.code,
        message: err.message
      });
    }
  });

router.get("/producao/poluicao", async (req, res) => {

    try {
        const body = req.query;
  
        const poluicao = require('../../handlers/pollution.json')
        
        res.json({
            code: 200,
            message: "Success",
            data: poluicao
        })
  
    } catch (err) {
      res.json({
        code: err.code,
        message: err.message
      });
    }
  });


router.post("/producao", api_auth.verifyToken, async (req, res) => {

    try {
        let authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Fornecedor") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
    
            if (body.produto && body.local && body.tipo && body.recursos && body.poluicao) {
    
                const produto_id = htmlspecialchars(body.produto);
                const local_id = htmlspecialchars(body.local);
                const tipo = htmlspecialchars(body.tipo);
                const recursos = body.recursos;
                const poluicao = body.poluicao;
    
                let produto = await produto_handler.GetProdutoByID(produto_id)
                if (authData.user.id == produto.fornecedor) {
                    try {
                        let producao = await cadeia_handler.InsertProducao(produto_id, local_id, tipo, recursos, poluicao);
                        res.json({
                            code: 200,
                            message: "Success",
                            data: producao
                        })
                    } catch (err) {
                        throw {
                            code: 400,
                            message: "Erro a inserir produto. Tente novamente."
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
            })
        }
    } catch (err) {
        res.json({
            code: 403,
            message: "Não tem autorização para efetuar este pedido"
        })
    }
});

// ------------------------------------------------------------
// -------------------------- CADEIA --------------------------
// ------------------------------------------------------------

router.get("/cadeia_logistica", async (req, res) => {

    try {
        const body = req.query;
  
        if (body.item) {
            const id_item = htmlspecialchars(body.item);
            const cadeia = await cadeia_handler.GetCadeiaByItemId(id_item);
            
            res.json({
                code: 200,
                message: "Success",
                data: cadeia
            })
        } else if (body.produto) {
            const id_produto = htmlspecialchars(body.produto);
            const cadeia = await cadeia_handler.GetCadeiaByProdutoId(id_produto);

            res.json({
                code: 200,
                message: "Success",
                data: cadeia
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

router.get("/cadeia_logistica/sumario", async (req, res) => {

    try {
        const body = req.query;
  
        if (body.produto) {
            const id_produto = htmlspecialchars(body.produto);
            const cadeia = await cadeia_handler.GetSumarioCadeiaByProdutoId(id_produto);

            res.json({
                code: 200,
                message: "Success",
                data: cadeia
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

// exporting

module.exports = router