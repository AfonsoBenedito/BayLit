// MongoDB initialization script
// This script runs when the MongoDB container is first created

db = db.getSiblingDB('Baylit');

// Create a user for the application
db.createUser({
  user: 'baylit_user',
  pwd: 'baylit_password',
  roles: [
    {
      role: 'readWrite',
      db: 'Baylit'
    }
  ]
});

print('Database initialized successfully');

