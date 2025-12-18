// Removed MongoDB Atlas API client dependency
// This is no longer needed for local Docker setup

async function connectToDB() {
  // Connection is handled in conn.js
  console.log("Database connection initialized");
}

module.exports = {
  connectToDB
}

