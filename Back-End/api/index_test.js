// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// defining the Express app
const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
})); // adding Helmet to enhance API's security
app.use(bodyParser.json()); // using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors()); // enabling CORS for all requests
app.use(morgan('combined')); // adding morgan to log HTTP requests

// Serve static files from uploads directory (before routes to avoid conflicts)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
// Keep /Fotografias for backward compatibility
app.use('/Fotografias', express.static(path.join(__dirname, '..', 'images')));

// importing routes

const auth = require('./routes/auth')
const cadeia = require('./routes/cadeia')
const consumidor = require('./routes/consumidor')
const fornecedor = require('./routes/fornecedor')
const checkout = require('./routes/checkout')
const produto = require('./routes/produto')
const transportador = require('./routes/transportador')
const utilizador = require('./routes/utilizador')
const compra = require('./routes/compra')


// using the routes

app.use("/auth", auth);
app.use("/produto", cadeia);
app.use("/utilizador", consumidor);
app.use("/utilizador", fornecedor);
app.use("/utilizador", checkout);
app.use("/produto", produto);
app.use("/utilizador", transportador);
app.use("/utilizador", utilizador);
app.use("/utilizador", compra);

// Health check endpoint - simple check if server is running
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "backend" });
});

// starting the server
app.listen(8080, async () => {
  require("../conn");
  console.log('listening on port 8080');
});
