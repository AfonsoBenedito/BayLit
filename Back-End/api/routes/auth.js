// importing the dependencies
const express = require('express');
const router = express.Router();
const htmlspecialchars = require('htmlspecialchars');
const api_auth = require('../api_auth');
const auth_handler = require('../../handlers/AutenticacaoHandler').handler_auth;
const ConsumidorGW = require('../../gateway/ConsumidorGat')
const crypto = require("crypto");

// requests

const session = require('express-session');
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "", //    GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "", // GOOGLE_CLIENT_SECRET,
    callbackURL: "https://baylit.store:8080/auth/google/callback",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    let user = await ConsumidorGW.getByEmail(profile.email)
    if (!user) {
      const created = await ConsumidorGW.createGoogle(profile.displayName, profile.email)

      await CarrinhoGW.create(created._id)
    }
    return done(null, profile)
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

router.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());

router.get("/google", 
  passport.authenticate('google', { scope: ['email', 'profile']}))

router.get("/google/callback", 
  passport.authenticate('google', {
    successRedirect: "https://baylit.store:8080/auth/google/success",
    failureRedirect: "https://baylit.store:8080/auth/google/failure"
  }))

router.get("/google/success", async(req, res) => {
    res.redirect('https://baylit.store/SignUp?email='+req.user.email);
}) 

router.get("/google/failure", async(req, res) => {
  res.send({
    code: 400,
    message: "Algo correu mal."
  });
}) 

router.post("/google/carrinho", api_auth.verifyToken, async (req, res) => {

  let authData
  try {
      authData = await api_auth.validateToken(req.token);

      try {
          const body = req.body;

          if (body.id_nao_autenticado && body.id_utilizador) {

            const id_utilizador = htmlspecialchars(body.id_utilizador);
            const id_nao_autenticado = htmlspecialchars(body.id_nao_autenticado);
            
            if (authData.user.id == id_nao_autenticado) {
                try {
                  await auth_handler.AutenticaCarrinho(id_utilizador, id_nao_autenticado)
                  
                  user = {
                    tipo: 'Consumidor',
                    id_utilizador
                  }
  
                  const token = await api_auth.signUser(user);
                
                  res.json({
                    code: 200,
                    message: "Success",
                    data: {
                      user,
                      auth_token: token,
                      expires: '120m'
                    }
                  });
                  
                } catch (err) {
                  throw (err)
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
        });
      }
  } catch (err) {
    res.json({
        code: 403,
        message: "Não tem autorização para efetuar este pedido"
    })
  }
  
});

router.post("/register/consumidor", async (req, res) => {

  try {
    const body = req.body;

    if (body.nome && body.email && body.password) {

      const nome = htmlspecialchars(body.nome);
      const email = htmlspecialchars(body.email);
      const password = htmlspecialchars(body.password);

      try {
        const consumidor = await auth_handler.RegistarConsumidorNaoVerificado(nome, email, password);
      
        await auth_handler.sendEmailVerification(consumidor)

        res.json({
          code: 201,
          message: "Success",
          data: {
            message: "Olá, "+nome+"! Obrigado por se registar na nossa plataforma. Antes de prosseguirmos pedimos que verifique o seu email e o valide. Obrigado!"
          }
        });
        
      } catch (err) {
        throw (err)
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

router.post("/register/verificar", async (req, res) => {

  try {
    const body = req.body;

    if (body.verificacao) {

      const verificacao = htmlspecialchars(body.verificacao);

      try {
        const utilizador_nao_verificado = await auth_handler.GetNaoVerificado(verificacao);

        let user
        if (utilizador_nao_verificado) {
          if (utilizador_nao_verificado.tipo == "Consumidor") {

            const id = await auth_handler.RegistarVerificacaoConsumidor(utilizador_nao_verificado);

            if (body.id_nao_autenticado) {
              const id_nao_autenticado = htmlspecialchars(body.id_nao_autenticado);
              await auth_handler.AutenticaCarrinho(id, id_nao_autenticado)
            }

            user = {
              tipo: 'Consumidor',
              id
            }

          } else if (utilizador_nao_verificado.tipo == "Fornecedor") {

            const id = await auth_handler.RegistarVerificacaoFornecedor(utilizador_nao_verificado);

            user = {
              tipo: 'Fornecedor',
              id
            }

          } else if (utilizador_nao_verificado.tipo == "Transportador") {

            const id = await auth_handler.RegistarVerificacaoTransportador(utilizador_nao_verificado);

            user = {
              tipo: 'Transportador',
              id
            }

          } else {
            throw {
              code: 400,
              message: "Pedido inválido."
            }
          }
        } else {
          throw {
            code: 400,
            message: "Pedido inválido."
          }
        }

        const token = await api_auth.signUser(user);
      
        res.json({
          code: 201,
          message: "Success",
          data: {
            user,
            auth_token: token,
            expires: '120m'
          }
        });
        
      } catch (err) {
        throw (err)
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

router.post("/register/consumidor/sem_verificacao", async (req, res) => {

  try {
    const body = req.body;

    if (body.nome && body.email && body.password) {

      const nome = htmlspecialchars(body.nome);
      const email = htmlspecialchars(body.email);
      const password = htmlspecialchars(body.password);

      try {
        const id = await auth_handler.RegistarConsumidor(nome, email, password);

        if (body.id_nao_autenticado) {
          const id_nao_autenticado = htmlspecialchars(body.id_nao_autenticado);
          await auth_handler.AutenticaCarrinho(id, id_nao_autenticado)
        }

        user = {
          tipo: 'Consumidor',
          id
        }

        const token = await api_auth.signUser(user);
      
        res.json({
          code: 201,
          message: "Success",
          data: {
            user,
            auth_token: token,
            expires: '120m'
          }
        });
        
      } catch (err) {
        throw (err)
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

router.post("/register/nao_autenticado", async (req, res) => {

  try {
      const id = await auth_handler.RegistarNaoAutenticado();

      user = {
        tipo: 'NaoAutenticado',
        id
      }

      const token = await api_auth.signUser(user);
      
      res.json({
        code: 201,
        message: "Success",
        data: {
          user,
          auth_token: token,
          expires: '120m'
        }
      });
  } catch (err) {
    res.json({
      code: err.code,
      message: err.message
    });
  }
  
});

router.post("/register/fornecedor/sem_verificacao", async (req, res) => {

  try {
    const body = req.body;

    if (body.nome && body.email && body.password &&
    body.morada && body.nif && body.telemovel) {

      const nome = htmlspecialchars(body.nome);
      const email = htmlspecialchars(body.email);
      const password = htmlspecialchars(body.password);
      const morada = htmlspecialchars(body.morada);
      const nif = htmlspecialchars(body.nif);
      const telemovel = htmlspecialchars(body.telemovel);

      try {
        const id = await auth_handler.RegistarFornecedor(nome, email, password, morada, nif, telemovel);
        user = {
          tipo: 'Fornecedor',
          id
        }

        const token = await api_auth.signUser(user);

        res.json({
          code: 201,
          message: "Success",
          data: {
            user,
            auth_token: token,
            expires: '120m'
          }
        });
      } catch (err) {
        throw (err)
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

router.post("/register/fornecedor", async (req, res) => {

  try {
    const body = req.body;

    if (body.nome && body.email && body.password &&
    body.morada && body.nif && body.telemovel) {

      const nome = htmlspecialchars(body.nome);
      const email = htmlspecialchars(body.email);
      const password = htmlspecialchars(body.password);
      const morada = htmlspecialchars(body.morada);
      const nif = htmlspecialchars(body.nif);
      const telemovel = htmlspecialchars(body.telemovel);

      try {
        const fornecedor = await auth_handler.RegistarFornecedorNaoVerificado(nome, email, password, morada, nif, telemovel);
        console.log(fornecedor)
        await auth_handler.sendEmailVerification(fornecedor)

        res.json({
          code: 201,
          message: "Success",
          data: {
            message: "Olá, "+nome+"! Obrigado por se registar na nossa plataforma. Antes de prosseguirmos pedimos que verifique o seu email e o valide. Obrigado!"
          }
        });
      } catch (err) {
        throw (err)
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

router.post("/register/transportador/sem_verificacao", async (req, res) => {

  try {
    const body = req.body;

    if (body.nome && body.email && body.password && body.morada && body.nif && body.telemovel && body.portes_encomenda) {

      const nome = htmlspecialchars(body.nome);
      const email = htmlspecialchars(body.email);
      const password = htmlspecialchars(body.password);
      const morada = htmlspecialchars(body.morada);
      const nif = htmlspecialchars(body.nif);
      const telemovel = htmlspecialchars(body.telemovel);
      const portes_encomenda = htmlspecialchars(body.portes_encomenda);

      try {
        let id = await auth_handler.RegistarTransportador(nome, email, password, morada, nif, telemovel, portes_encomenda);

        user = {
          tipo: 'Transportador',
          id
        }
      
        const token = await api_auth.signUser(user);
        
        res.json({
          code: 201,
          message: "Success",
          data: {
            user,
            auth_token: token,
            expires: '120m'
          }
        });
      } catch (err) {
        throw (err)
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

router.post("/register/transportador", async (req, res) => {

  try {
    const body = req.body;

    if (body.nome && body.email && body.password && body.morada && body.nif && body.telemovel && body.portes_encomenda) {

      const nome = htmlspecialchars(body.nome);
      const email = htmlspecialchars(body.email);
      const password = htmlspecialchars(body.password);
      const morada = htmlspecialchars(body.morada);
      const nif = htmlspecialchars(body.nif);
      const telemovel = htmlspecialchars(body.telemovel);
      const portes_encomenda = htmlspecialchars(body.portes_encomenda);

      try {
        let transportador = await auth_handler.RegistarTransportadorNaoVerificado(nome, email, password, morada, nif, telemovel, portes_encomenda);

        await auth_handler.sendEmailVerification(transportador)

        res.json({
          code: 201,
          message: "Success",
          data: {
            message: "Olá, "+nome+"! Obrigado por se registar na nossa plataforma. Antes de prosseguirmos pedimos que verifique o seu email e o valide. Obrigado!"
          }
        });
      } catch (err) {
        throw (err)
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

router.post("/register/administrador", api_auth.verifyToken, async (req, res) => {

  let authData;
  try {
    authData = await api_auth.validateToken(req.token);
  } catch (err) {
    res.json(err)
  }
  
  if (authData.user.tipo == 'Administrador') {
    try {
      const body = req.body;
  
      if (body.nome && body.password) {
  
        const nome = htmlspecialchars(body.nome);
        const password = htmlspecialchars(body.password);
  
        try {
          const id = await auth_handler.RegistarAdministrador(nome, password);
  
          user = {
            tipo: 'Administrador',
            id: id
          }
        
          const token = await api_auth.signAdmin(user);

          res.json({
            code: 201,
            message: "Success",
            data: {
              user,
              auth_token: token,
              expires: '120m'
            }
          });
        
        } catch (err) {
          throw (err)
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
  } else {
    res.json({
      code: 403,
      message: "Apenas os administradores têm permissões para criar novos administradores"
    });
  }
  
});

router.post("/login", async (req, res) => {

  try {
    const body = req.body;
        
    if (body.email && body.password) {

      const email = htmlspecialchars(body.email);
      const password = htmlspecialchars(body.password);
      
      try {
        const user = await auth_handler.Login(email, password);
        const token = await api_auth.signUser(user);
        
        if (user.tipo == "Consumidor") {
            if (body.id_nao_autenticado) {
              const id_nao_autenticado = htmlspecialchars(body.id_nao_autenticado);
              await auth_handler.AutenticaCarrinho(user.id, id_nao_autenticado)
            }
        }

        res.json({
          code: 200,
          message: "Success",
          data: {
            user,
            auth_token: token,
            expires: '120m'
          }
        });
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

router.post("/login/administrador", async (req, res) => {

  try {
    const body = req.body;
        
    if (body.nome && body.password) {

      const nome = htmlspecialchars(body.nome);
      const password = htmlspecialchars(body.password);
      
      try {

        const user = await auth_handler.LoginAdministrador(nome, password);

        const token = await api_auth.signAdmin(user);

        res.json({
          code: 200,
          message: "Success",
          data: {
            user,
            auth_token: token,
            expires: '120m'
          }
        });
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

router.post("/login/verify_token", api_auth.verifyToken, async (req, res) => {

  try {
    const authData = await api_auth.validateToken(req.token);

    if (authData) {
      res.json({
        code: 200,
        message: "Token válido."
      });
    } else {
      throw {
        code: 400,
        message: "Não foi possivel verificar o token."
      }

    }
  } catch (err) {
    res.json({
      code: 400,
      message: "Não foi possivel verificar o token."
    });
  }
  
  
});



// exporting

module.exports = router