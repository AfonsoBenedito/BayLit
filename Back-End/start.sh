#!/bin/sh

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
until nc -z mongodb 27017; do
  echo "MongoDB is unavailable - sleeping"
  sleep 2
done

echo "MongoDB is up - checking database initialization..."

# Check if database needs initialization (if no categories exist) and initialize if needed
node -e "
const m = require('mongoose');
const C = require('./models/Categoria');
const connectionString = process.env.MONGODB_URI || 'mongodb://admin:admin123@mongodb:27017/Baylit?authSource=admin';

(async () => {
  try {
    await m.connect(connectionString);
    const count = await C.countDocuments();
    if (count === 0) {
      console.log('Database is empty - initializing...');
      const { initializeAll } = require('./db/init-all.js');
      await initializeAll();
      console.log('Database initialization completed!');
    } else {
      console.log('Database already initialized (' + count + ' categories found)');
    }
    await m.connection.close();
  } catch (err) {
    console.error('Error during database initialization:', err);
    process.exit(1);
  }
})();
"

# Wait a moment for initialization to complete
sleep 2

# Start the main application
echo "Starting backend server..."
exec npm start

