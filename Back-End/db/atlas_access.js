

var http = require('http');

// dotenv configuration
const dotenv = require('dotenv');
dotenv.config();

const public_key = process.env.ATLAS_PUBLIC_KEY;
const private_key = process.env.ATLAS_PRIVATE_KEY;
const project_id = process.env.ATLAS_PROJECT_ID;

async function connectToDB() {

  http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
    resp.on('data', function(ip) {
      const getClient = require("mongodb-atlas-api-client");
  
      const {projectAccesslist} = getClient({
          "publicKey": public_key,
          "privateKey": private_key,
          "baseUrl": "https://cloud.mongodb.com/api/atlas/v1.0",
          "projectId": project_id
      });
      
      const data = [{
          "ipAddress" : String(ip),
          "comment" : "Some connection that is running the API"
      }]
      
      projectAccesslist.create(data).then(res => {
        if (res.error) {
          console.log("connection to database failed, shutting down")
          process.exit(0)
        } else {
          console.log("connection to database succeeded")      
        }
      })
  
      
    });
  });
}

module.exports = {
  connectToDB
}

