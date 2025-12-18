// Database initialization script
// This can be run manually to initialize the database with default data

const Mongoose = require("mongoose");
const connectionString = process.env.MONGODB_URI || "mongodb://admin:admin123@localhost:27017/Baylit?authSource=admin";

async function initializeDatabase() {
    try {
        await Mongoose.connect(connectionString);
        console.log('Connected to MongoDB');

        // Import models
        const CategoriaModel = require("../models/Categoria.js");
        const SubCategoriaModel = require("../models/SubCategoria.js");
        const AtributoModel = require("../models/Atributo.js");
        const AdministradorModel = require("../models/Administrador.js");
        const bcrypt = require("bcrypt");

        // Create default admin user if it doesn't exist
        const adminExists = await AdministradorModel.findOne({ nome: "admin" });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await AdministradorModel.create({
                nome: "admin",
                password: hashedPassword
            });
            console.log("Default admin user created: admin / admin123");
        }

        // You can add more initialization logic here
        // For example, loading default categories from insertDefaultCategories.js

        console.log("Database initialization completed");
        await Mongoose.connection.close();
    } catch (error) {
        console.error("Database initialization error:", error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    initializeDatabase();
}

module.exports = { initializeDatabase };

