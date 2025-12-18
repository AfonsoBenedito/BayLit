const jwt = require('jsonwebtoken');

// dotenv configuration
const dotenv = require('dotenv');
dotenv.config();

const token_secret = process.env.TOKEN_SECRET;

async function signUser(user) {
  try {
    const token = await jwt.sign({user}, token_secret, { expiresIn: '120m' });
    return token
  } catch (err) {
    console.log(err)
    throw {
      code: 400,
      message: "Não foi possivel efectuar a autenticação"
    }
  }
}

async function signAdmin(user) {
  try {
    const token = await jwt.sign({user}, token_secret, { expiresIn: '120m' });
    return token
  } catch (err) {
    throw {
      code: 400,
      message: "Não foi possivel efectuar a autenticação"
    }
  }
}

async function validateToken(token) {

  try {
    const authData = await jwt.verify(token, token_secret)
    return authData
  } catch (err) {
    throw {
      code: 403,
      message: "Não tem autorização para efectuar este pedido " + err.message
    }
  }

}

// Verify Token
async function verifyToken(req, res, next) {

  // console.log(req.headers)
  // console.log("----------------")
  // console.log(req.params)
    // Get auth header value
    console.log(req.headers)
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      // Forbidden
      res.json({
        code: 403,
        message: "Insira um token válido"
      });
    }
  }

module.exports = {
    signUser,
    signAdmin,
    validateToken,
    verifyToken
}