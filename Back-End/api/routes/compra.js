// importing the dependencies
const express = require('express');
const router = express.Router();
const htmlspecialchars = require('htmlspecialchars');
const api_auth = require('../api_auth');
const compra_handler = require('../../handlers/CompraHandler').handler_compra;

// -------------------------------------------------------------
// -------------------------- CARRINHO -------------------------
// -------------------------------------------------------------

router.get("/carrinho", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Consumidor" && authData.user.tipo != "NaoAutenticado") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.query;
            if (body.utilizador) {
                const id = htmlspecialchars(body.utilizador);
    
                if (authData.user.id == id) {

                    try {
                        const carrinho = await compra_handler.GetCarrinhoByUtilizador(id);
                        res.json({
                            code: 200,
                            message: "Success",
                            data: {
                                carrinho
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

router.delete("/carrinho", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Consumidor" && authData.user.tipo != "NaoAutenticado") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
            if (body.utilizador) {
    
                const id = htmlspecialchars(body.utilizador);
    
                if (authData.user.id == id) {
                    try {
                        await compra_handler.EsvaziaCarrinho(id);
                        res.json({
                            code: 200,
                            message: "Carrinho esvaziado com sucesso"
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

router.get("/carrinho/cadeia_logistica", api_auth.verifyToken, async (req, res) => {

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
      
            if (body.hasOwnProperty('utilizador')) {
                const id = htmlspecialchars(body.utilizador);
    
                if (authData.user.id == id) {
                    try {
                        const cadeia = await compra_handler.GetCadeiaCarrinhoByUtilizador(id);
                        
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

router.get("/carrinho/cadeia_logistica/sumario", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Consumidor" && authData.user.tipo != "NaoAutenticado") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.query;
      
            if (body.hasOwnProperty('utilizador')) {
                const id = htmlspecialchars(body.utilizador);
    
                if (authData.user.id == id) {
                    try {
                        const cadeia = await compra_handler.GetSumarioCadeiaCarrinhoByUtilizador(id);
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

// -------------------------------------------------------------
// -------------------- CARRINHO PRODUTOS ----------------------
// -------------------------------------------------------------

router.post("/carrinho/produto", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Consumidor" && authData.user.tipo != "NaoAutenticado") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
            if (body.utilizador && body.produto_especifico
             && body.quantidade) {
    
                const utilizador = htmlspecialchars(body.utilizador);
                const produto_especifico = htmlspecialchars(body.produto_especifico);
                const quantidade = htmlspecialchars(body.quantidade);
    
                if (authData.user.id == utilizador) {
                    try {
                        const carrinho = await compra_handler.InsertProdutoCarrinho(utilizador, produto_especifico, quantidade);
    
                        res.json({
                            code: 200,
                            message: "Success",
                            data: carrinho
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
        res.json(err)
    }
    
});

router.put("/carrinho/produto", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Consumidor" && authData.user.tipo != "NaoAutenticado") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
            if (body.utilizador && body.produto_especifico && body.quantidade) {
    
                const utilizador = htmlspecialchars(body.utilizador);
                const produto_especifico = htmlspecialchars(body.produto_especifico);
                const quantidade = htmlspecialchars(body.quantidade);
    
                if (authData.user.id == utilizador) {
                    try {
                        const carrinho = await compra_handler.AlterarQuantidadeProdutoCarrinho(utilizador, produto_especifico, quantidade);
    
                        res.json({
                            code: 200,
                            message: "Carrinho atualizado com sucesso",
                            data: carrinho
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

router.delete("/carrinho/produto", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Consumidor" && authData.user.tipo != "NaoAutenticado") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.body;
            if (body.utilizador && body.produto_especifico) {
    
                const utilizador = htmlspecialchars(body.utilizador);
                const produto_especifico = htmlspecialchars(body.produto_especifico);
    
                if (authData.user.id == utilizador) {
                    try {
                        const carrinho = await compra_handler.RemoveProdutoCarrinho(utilizador, produto_especifico);
    
                        res.json({
                            code: 200,
                            message: "Carrinho atualizado com sucesso",
                            data: carrinho
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

router.get("/carrinho/transportes_possiveis", api_auth.verifyToken, async (req, res) => {

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
      
            if (body.consumidor && body.local_entrega) {
                const consumidor = htmlspecialchars(body.consumidor);
                const local_entrega = htmlspecialchars(body.local_entrega);
    
                if (authData.user.id == consumidor) {
                    try {
                        const transportes = await compra_handler.GetTransportesPossiveis(consumidor, local_entrega);
                        
                        res.json({
                            code: 200,
                            message: "Success",
                            data: {
                                transportes
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

router.post("/carrinho/compra", api_auth.verifyToken, async (req, res) => {

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
            if (body.consumidor && body.transporte && body.local_entrega) {
    
                const consumidor = htmlspecialchars(body.consumidor);
                const transporte = htmlspecialchars(body.transporte);
                const local_entrega = htmlspecialchars(body.local_entrega);
    
                if (authData.user.id == consumidor) {
                    try {
                        const compra = await compra_handler.RegisterCompra(consumidor, transporte, local_entrega);
    
                        res.json({
                            code: 200,
                            message: "Success",
                            data: compra
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

router.post("/carrinho/compra/confirmar", api_auth.verifyToken, async (req, res) => {

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
            if (body.consumidor && body.encomenda) {
    
                const consumidor = htmlspecialchars(body.consumidor);
                const encomenda = htmlspecialchars(body.encomenda);
    
                if (authData.user.id == consumidor) {
                    try {
                        const compra = await compra_handler.ConfirmarCompra(consumidor, encomenda);
    
                        res.json({
                            code: 200,
                            message: "Success",
                            data: compra
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


// -------------------------------------------------------------
// ------------------------- ENCOMENDA -------------------------
// -------------------------------------------------------------


// exporting

module.exports = router