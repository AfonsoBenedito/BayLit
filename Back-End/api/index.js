// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
let atlas_access = require('../db/atlas_access')
const fs = require('fs')
const https = require('https');
https.globalAgent.options.ca = require('ssl-root-cas').create();

// defining the Express app
const app = express();

app.use(helmet()); // adding Helmet to enhance API's security
app.use(bodyParser.json()); // using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors()); // enabling CORS for all requests
app.use(morgan('combined')); // adding morgan to log HTTP requests

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


const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}


// app.listen(8080, async () => {
//   require("../conn");
//   await atlas_access.connectToDB()
//   console.log('listening on port 8080');
// });

var metadata = require("node-ec2-metadata");

metadata.isEC2().then(function (onEC2) {
  console.log("Running on EC2? " + onEC2);

  if (onEC2){
    console.log("Dentro da AWS.")

    var privateKey = fs.readFileSync('/etc/ssl/certs/private.key');
    var certificate = fs.readFileSync('/etc/ssl/certs/certificate.crt');
  
    https.createServer({
        key: privateKey,
        cert: certificate
    }, app).listen(8080, async () => {
      require("../conn");
      await atlas_access.connectToDB()
      console.log('listening on port 8080');
    });
  } else {
    // starting the server
    app.listen(8080, async () => {
      require("../conn");
      await atlas_access.connectToDB()
      console.log('listening on port 8080');
    });
  }
});
