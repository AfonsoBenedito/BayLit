// importing the dependencies
const express = require('express');
const router = express.Router();
const api_auth = require('../api_auth');
const htmlspecialchars = require('htmlspecialchars');
const transportador_handler = require('../../handlers/TransportadorHandler').handler_transportador;
const TransporteGW = require('../../gateway/TransporteGat')

// requests

router.get("/transportador", async (req, res) => {
  try {
    const body = req.query;

    let transportadores = []
    if (body.hasOwnProperty('id')) {
        const id = htmlspecialchars(body.id);
        let transportador = await transportador_handler.GetTransportadorByID(id);
        transportadores = transportadores.concat(transportador)  
    } else if (body.hasOwnProperty('email')) {
        const email = htmlspecialchars(body.email);
        let transportador = await transportador_handler.GetTransportadorByEmail(email);
        transportadores = transportadores.concat(transportador)
    } else {
        transportadores = transportadores = await transportador_handler.GetAllTransportadores();
    }

    res.json({
      code: 200,
      message: "Success",
      data: transportadores
    })

  } catch (err) {
    res.json({
      code: err.code,
      message: err.message
    });
  }
});

router.put("/transportador", api_auth.verifyToken, async (req, res) => {

    try {
        const authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Transportador" && authData.user.tipo != "Administrador") {
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
                    exists = await transportador_handler.GetTransportadorByID(id);
                } catch (err) {
                    throw {
                        code: 400,
                        message: "Não existe um transportador com esse ID"
                    }
                }
    
                if (exists.id == authData.user.id || authData.user.tipo == "Administrador") {
                    if (body.nome || body.email ||
                        body.password_antiga && body.password_nova  || body.morada ||
                        body.nif || body.telemovel || body.portes_encomenda) {
                            
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

                            let portes_encomenda = null;
                            if (body.portes_encomenda) {
                                portes_encomenda = htmlspecialchars(body.portes_encomenda)
                            }
    
                            try {
                                let transportador = await transportador_handler.UpdateTransportador(id, nome, email, password_antiga, password_nova, morada, nif, telemovel, portes_encomenda);
                                res.json({
                                    code: 200,
                                    message: "Transportador atualizado com sucesso",
                                    data: {
                                        transportador
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

router.get("/transportador/relatorio", api_auth.verifyToken, async (req, res) => {
    
    let authData
    try {
        console.log(req.token)
        authData = await api_auth.validateToken(req.token);
        
        if (authData.user.tipo != "Transportador") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }

        try {
            const body = req.query;
        
            if (body.hasOwnProperty('transportador') && body.hasOwnProperty('espaco_temporal')) {
                const id = htmlspecialchars(body.transportador);
                const espaco_temporal = htmlspecialchars(body.espaco_temporal);
                if (espaco_temporal == "semana" || espaco_temporal == "mes" || espaco_temporal == "ano" || espaco_temporal == "5 anos") {
                    let relatorio = await transportador_handler.GetRelatorioTransportadorByID(id, espaco_temporal);

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

router.get("/transportador/veiculo", async (req, res) => {
    try {
        const body = req.query;
    
        const vehicle_emissions_json = require("../../handlers/vehicle_emission.json");

        let result_marca
        if (body.marca) {
            result_marca = {
                marca: [],
                modelo: [],
                tipo: []
            }
            if (vehicle_emissions_json[body.marca]) {
                result_marca.marca.push(body.marca)
                for (let modelo in vehicle_emissions_json[body.marca]) {
                    if (!result_marca.modelo.includes(modelo)) {
                        result_marca.modelo.push(modelo)
                    }
                    for (let tipo in vehicle_emissions_json[body.marca][modelo]) {
                        if (!result_marca.tipo.includes(tipo)) {
                            result_marca.tipo.push(tipo)
                        }
                    }
                }
            }
        } 

        let result_modelo 
        if (body.modelo) {
            result_modelo = {
                marca: [],
                modelo: [],
                tipo: []
            }
            for (let marca in vehicle_emissions_json) {
                if (vehicle_emissions_json[marca][body.modelo]) {
                    if (!result_modelo.marca.includes(marca)) {
                        result_modelo.marca.push(marca)
                    }
                    if (!result_modelo.modelo.includes(body.modelo)) {
                        result_modelo.modelo.push(body.modelo)
                    }
                    for (let tipo in vehicle_emissions_json[marca][body.modelo]) {
                        if (!result_modelo.tipo.includes(tipo)) {
                            result_modelo.tipo.push(tipo)
                        }  
                    }
                }
            }
        }

        let result_tipo
        if (body.tipo) {
            result_tipo = {
                marca: [],
                modelo: [],
                tipo: []
            }
            for (let marca in vehicle_emissions_json) {
                for (let modelo in vehicle_emissions_json[marca]) {
                    if (vehicle_emissions_json[marca][modelo][body.tipo]) {
                        if (!result_tipo.marca.includes(marca)) {
                            result_tipo.marca.push(marca)
                        }
                        if (!result_tipo.modelo.includes(modelo)) {
                            result_tipo.modelo.push(modelo)
                        }
                        if (!result_tipo.tipo.includes(body.tipo)) {
                            result_tipo.tipo.push(body.tipo)
                        }
                    }
                }
            }
        }    
        
        result = {
            marca: [],
            modelo: [],
            tipo: []
        }
        if (body.marca) {
            if (body.modelo) {
                if (body.tipo) {
                    result.marca = result_marca.marca.filter(value => result_modelo.marca.includes(value) && result_tipo.marca.includes(value));
                    result.modelo = result_marca.modelo.filter(value => result_modelo.modelo.includes(value) && result_tipo.modelo.includes(value));
                    result.tipo = result_marca.tipo.filter(value => result_modelo.tipo.includes(value) && result_tipo.tipo.includes(value));
                } else {
                    result.marca = result_marca.marca.filter(value => result_modelo.marca.includes(value));
                    result.modelo = result_marca.modelo.filter(value => result_modelo.modelo.includes(value));
                    result.tipo = result_marca.tipo.filter(value => result_modelo.tipo.includes(value));
                }
            } else if (body.tipo) {
                result.marca = result_marca.marca.filter(value => result_tipo.marca.includes(value));
                result.modelo = result_marca.modelo.filter(value => result_tipo.modelo.includes(value));
                result.tipo = result_marca.tipo.filter(value => result_tipo.tipo.includes(value));
            } else {
                result.marca = result_marca.marca
                result.modelo = result_marca.modelo
                result.tipo = result_marca.tipo
            }
        } else if (body.modelo) {
            if (body.tipo) {
                result.marca = result_modelo.marca.filter(value => result_tipo.marca.includes(value));
                result.modelo = result_modelo.modelo.filter(value => result_tipo.modelo.includes(value));
                result.tipo = result_modelo.tipo.filter(value => result_tipo.tipo.includes(value));
            } else {
                result.marca = result_modelo.marca
                result.modelo = result_modelo.modelo
                result.tipo = result_modelo.tipo
            }
        } else if (body.tipo) {
            result.marca = result_tipo.marca
            result.modelo = result_tipo.modelo
            result.tipo = result_tipo.tipo
        } else {
            for (let marca in vehicle_emissions_json) {
                for (let modelo in vehicle_emissions_json[marca]) {
                    for (let tipo in vehicle_emissions_json[marca][modelo]) {
                        if (!result.marca.includes(marca)) {
                            result.marca.push(marca)
                        }
                        if (!result.modelo.includes(modelo)) {
                            result.modelo.push(modelo)
                        }
                        if (!result.tipo.includes(tipo)) {
                            result.tipo.push(tipo)
                        }
                    }
                }
            }

        }
        
      res.json({
        code: 200,
        message: "Success",
        data: result
      })
  
    } catch (err) {
      res.json({
        code: err.code,
        message: err.message
      });
    }
    
  });

router.get("/transportador/meio_transporte", async (req, res) => {
    try {
      const body = req.query;
  
      let meios_transporte = []
      if (body.hasOwnProperty('meio_transporte')) {
          const meio_transporte_id = htmlspecialchars(body.meio_transporte);
          let meio_transporte = await transportador_handler.GetMeioTransporteByID(meio_transporte_id);
          meios_transporte = meios_transporte.concat(meio_transporte)  
      } else if (body.hasOwnProperty('transportador')) {
          const transportador_id = htmlspecialchars(body.transportador);
          let meios_transporte_transportador = await transportador_handler.GetMeioTransporteByTransportador(transportador_id);
          meios_transporte = meios_transporte.concat(meios_transporte_transportador)
      } else if (body.hasOwnProperty('sede')) {
          const sede_id = htmlspecialchars(body.sede);
          let meios_transporte_sede = await transportador_handler.GetMeioTransporteBySede(sede_id);
          meios_transporte = meios_transporte.concat(meios_transporte_sede)
      } else {
          throw {
              code: 400,
              message: "Pedido inválido"
          }
      }
  
      res.json({
        code: 200,
        message: "Success",
        data: meios_transporte
      })
  
    } catch (err) {
      res.json({
        code: err.code,
        message: err.message
      });
    }
  });

router.post("/transportador/meio_transporte", api_auth.verifyToken, async (req, res) => {

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
            if (body.hasOwnProperty('transportador') && body.hasOwnProperty('sede')
             && body.hasOwnProperty('marca') && body.hasOwnProperty('modelo')
             && body.hasOwnProperty('tipo')) {
    
                const transportador = htmlspecialchars(body.transportador);
                const sede = htmlspecialchars(body.sede);
                const marca = htmlspecialchars(body.marca);
                const modelo = htmlspecialchars(body.modelo);
                const tipo = htmlspecialchars(body.tipo);
    
                if (authData.user.id == transportador) {
                    try {
                        const meio_transporte = await transportador_handler.InsertMeioTransporte(transportador, sede, marca, modelo, tipo);
    
                        res.json({
                            code: 200,
                            message: "Success",
                            data: meio_transporte
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

router.put("/transportador/meio_transporte", api_auth.verifyToken, async (req, res) => {

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
            if (body.meio_transporte && body.sede) {
    
                const meio_transporte_id = htmlspecialchars(body.meio_transporte);
                const meio_transporte = await transportador_handler.GetMeioTransporteByID(meio_transporte_id);
                const sede = htmlspecialchars(body.sede);
    
                if (authData.user.id == meio_transporte.transportador) {
                    try {
                        const meio_transporte = await transportador_handler.UpdateSedeMeioTransporte(meio_transporte_id, sede);
    
                        res.json({
                            code: 200,
                            message: "Meio de transporte atualizado com sucesso",
                            data: meio_transporte
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

router.delete("/transportador/meio_transporte", api_auth.verifyToken, async (req, res) => {

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
            if (body.meio_transporte) {
    
                const meio_transporte_id = htmlspecialchars(body.meio_transporte);
                const meio_transporte = await transportador_handler.GetMeioTransporteByID(meio_transporte_id);
    
                if (authData.user.id == meio_transporte.transportador) {
                    try {
                        await transportador_handler.DeleteMeioTransporte(meio_transporte_id);
    
                        res.json({
                            code: 200,
                            message: "Meio de transporte eliminado com sucesso"
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

router.get("/transportador/condutor", async (req, res) => {
    try {
      const body = req.query;
  
      if (body.transportador) {
          const transportador_id = htmlspecialchars(body.transportador);
          let condutores
          if (body.nome) {
            const nome = htmlspecialchars(body.nome);
            condutores = await transportador_handler.GetCondutorByTransportadorENome(transportador_id, nome);
          } else if (body.id) {
            const id = htmlspecialchars(body.id)
            let condutor = await transportador_handler.GetCondutorByID(id)
            condutores = [condutor]
          } else {
            condutores = await transportador_handler.GetCondutorByTransportador(transportador_id);
          }

          res.json({
            code: 200,
            message: "Success",
            data: condutores
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

router.post("/transportador/condutor", api_auth.verifyToken, async (req, res) => {

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
            if (body.transportador && body.nome && body.idade) {
    
                const transportador = htmlspecialchars(body.transportador);
                const nome = htmlspecialchars(body.nome);
                const idade = htmlspecialchars(body.idade);
                
    
                if (authData.user.id == transportador) {
                    try {
                        const condutor = await transportador_handler.InsertCondutor(transportador, nome, idade);
    
                        res.json({
                            code: 200,
                            message: "Success",
                            data: condutor
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

router.delete("/transportador/condutor", api_auth.verifyToken, async (req, res) => {

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
            if (body.transportador && body.condutor) {
    
                const transportador = htmlspecialchars(body.transportador);
                const condutor = htmlspecialchars(body.condutor);
                
                if (authData.user.id == transportador) {
                    try {
                        await transportador_handler.DeleteCondutor(condutor);
    
                        res.json({
                            code: 200,
                            message: "Condutor eliminado com sucesso"
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