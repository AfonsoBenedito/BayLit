// Comprehensive database initialization script for Docker
// Initializes all necessary data: admin, categories with images, and other required data

const Mongoose = require("mongoose");
const connectionString = process.env.MONGODB_URI || "mongodb://admin:admin123@mongodb:27017/Baylit?authSource=admin";

const CategoriaModel = require("../models/Categoria.js");
const SubCategoriaModel = require("../models/SubCategoria.js");
const AtributoModel = require("../models/Atributo.js");
const AdministradorModel = require("../models/Administrador.js");
const CategoriaGW = require("../gateway/CategoriaGat.js");
const SubCategoriaGW = require("../gateway/SubCategoriaGat.js");
const AtributoGW = require("../gateway/AtributoGat.js");
const bcrypt = require("bcrypt");

// Simple SVG placeholder as data URI (works offline, no CORS issues)
function createPlaceholderImage(text, width = 400, height = 300, bgColor = "4ECDC4", textColor = "FFFFFF") {
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${bgColor}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// Map category names to image filenames (real images)
const categoryImageMap = {
    "Crianças": "/images/categories/criancas.jpg",
    "Roupa": "/images/categories/roupa.jpg",
    "Eletrónica": "/images/categories/eletronica.jpg",
    "Casa": "/images/categories/casa.jpg",
    "Desporto": "/images/categories/desporto.jpg",
    "Livros": "/images/categories/livros.jpg",
    "Beleza": "/images/categories/beleza.jpg",
    "Alimentação": "/images/categories/alimentacao.jpg"
};

// Get category image URL (use real image if available, otherwise placeholder)
function getCategoryImage(categoryName) {
    return categoryImageMap[categoryName] || createPlaceholderImage(categoryName, 400, 300, "4ECDC4");
}

// Map attribute names to their default values
const attributeValuesMap = {
    "Cor": ["Azul", "Vermelho", "Verde", "Amarelo", "Preto", "Branco", "Rosa", "Cinza", "Laranja", "Roxo"],
    "Tamanho do Calçado": ["28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
    "Tamanho da Roupa": ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    "Idade": ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10", "10-12", "12+"],
    "Sexo": ["Masculino", "Feminino", "Unissex"],
    "Marca": ["Samsung", "Apple", "Nike", "Adidas", "Sony", "LG", "HP", "Dell", "Lenovo", "Asus"],
    "Capacidade": ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"],
    "RAM": ["4GB", "8GB", "16GB", "32GB", "64GB"],
    "Armazenamento": ["128GB", "256GB", "512GB", "1TB", "2TB"],
    "Tamanho do Ecrã": ["7 polegadas", "8 polegadas", "10 polegadas", "11 polegadas", "12 polegadas", "13 polegadas", "14 polegadas", "15 polegadas"],
    "Material": ["Algodão", "Poliester", "Couro", "Sintético", "Madeira", "Metal", "Plástico", "Vidro"],
    "Dimensões": ["Pequeno", "Médio", "Grande", "Extra Grande"],
    "Estilo": ["Moderno", "Clássico", "Rústico", "Minimalista", "Vintage", "Industrial"],
    "Potência": ["500W", "750W", "1000W", "1500W", "2000W", "3000W"],
    "Tamanho": ["P", "M", "G", "GG", "XG"],
    "Tipo": ["Tênis", "Sapatilhas", "Botas", "Sandálias", "Chinelos"],
    "Autor": ["Vários", "Desconhecido"],
    "Editora": ["Várias", "Desconhecida"],
    "Idioma": ["Português", "Inglês", "Espanhol", "Francês", "Alemão"],
    "Fragrância": ["Floral", "Amadeirado", "Cítrico", "Doce", "Fresco", "Oriental"],
    "Volume": ["30ml", "50ml", "100ml", "200ml", "500ml"],
    "Origem": ["Local", "Nacional", "Importado"],
    "Peso": ["100g", "250g", "500g", "1kg", "2kg", "5kg"]
};

// Subcategory placeholder images
const subcategoryPlaceholders = {
    "Sapatos": createPlaceholderImage("Sapatos", 300, 200, "FF6B9D"),
    "Roupa": createPlaceholderImage("Roupa", 300, 200, "4ECDC4"),
    "Brinquedos": createPlaceholderImage("Brinquedos", 300, 200, "95E1D3"),
    "Acessórios": createPlaceholderImage("Acessórios", 300, 200, "F38181"),
    "Calças": createPlaceholderImage("Calças", 300, 200, "AA96DA"),
    "T-Shirts": createPlaceholderImage("T-Shirts", 300, 200, "FCBAD3"),
    "Camisas": createPlaceholderImage("Camisas", 300, 200, "FFD93D"),
    "Smartphones": createPlaceholderImage("Smartphones", 300, 200, "6BCB77"),
    "Computadores": createPlaceholderImage("Computadores", 300, 200, "4D96FF"),
    "Tablets": createPlaceholderImage("Tablets", 300, 200, "FF6B6B"),
    "Mobília": createPlaceholderImage("Mobília", 300, 200, "95A5A6"),
    "Decoração": createPlaceholderImage("Decoração", 300, 200, "E74C3C"),
    "Eletrodomésticos": createPlaceholderImage("Eletrodomésticos", 300, 200, "3498DB"),
    "Calçado Desportivo": createPlaceholderImage("Calçado Desportivo", 300, 200, "1ABC9C"),
    "Equipamento": createPlaceholderImage("Equipamento", 300, 200, "9B59B6")
};

// Basic categories to create
const basicCategories = [
    {
        name: "Crianças",
        image: getCategoryImage("Crianças"),
        subcategories: [
            { name: "Sapatos", attributes: ["Cor", "Tamanho do Calçado", "Idade"], image: subcategoryPlaceholders["Sapatos"] },
            { name: "Roupa", attributes: ["Cor", "Tamanho da Roupa", "Idade"], image: subcategoryPlaceholders["Roupa"] },
            { name: "Brinquedos", attributes: ["Idade"], image: subcategoryPlaceholders["Brinquedos"] },
            { name: "Acessórios", attributes: ["Cor", "Idade"], image: subcategoryPlaceholders["Acessórios"] }
        ]
    },
    {
        name: "Roupa",
        image: getCategoryImage("Roupa"),
        subcategories: [
            { name: "Sapatos", attributes: ["Cor", "Tamanho do Calçado", "Sexo"], image: subcategoryPlaceholders["Sapatos"] },
            { name: "Calças", attributes: ["Cor", "Tamanho da Roupa", "Sexo"], image: subcategoryPlaceholders["Calças"] },
            { name: "T-Shirts", attributes: ["Cor", "Tamanho da Roupa", "Sexo"], image: subcategoryPlaceholders["T-Shirts"] },
            { name: "Camisas", attributes: ["Cor", "Tamanho da Roupa", "Sexo"], image: subcategoryPlaceholders["Camisas"] }
        ]
    },
    {
        name: "Eletrónica",
        image: getCategoryImage("Eletrónica"),
        subcategories: [
            { name: "Smartphones", attributes: ["Marca", "Capacidade", "Cor"], image: subcategoryPlaceholders["Smartphones"] },
            { name: "Computadores", attributes: ["Marca", "RAM", "Armazenamento"], image: subcategoryPlaceholders["Computadores"] },
            { name: "Tablets", attributes: ["Marca", "Tamanho do Ecrã", "Capacidade"], image: subcategoryPlaceholders["Tablets"] }
        ]
    },
    {
        name: "Casa",
        image: getCategoryImage("Casa"),
        subcategories: [
            { name: "Mobília", attributes: ["Cor", "Material", "Dimensões"], image: subcategoryPlaceholders["Mobília"] },
            { name: "Decoração", attributes: ["Cor", "Estilo", "Material"], image: subcategoryPlaceholders["Decoração"] },
            { name: "Eletrodomésticos", attributes: ["Marca", "Potência", "Cor"], image: subcategoryPlaceholders["Eletrodomésticos"] }
        ]
    },
    {
        name: "Desporto",
        image: getCategoryImage("Desporto"),
        subcategories: [
            { name: "Calçado Desportivo", attributes: ["Tamanho", "Cor", "Tipo"], image: subcategoryPlaceholders["Calçado Desportivo"] },
            { name: "Equipamento", attributes: ["Tipo", "Tamanho", "Material"], image: subcategoryPlaceholders["Equipamento"] },
            { name: "Acessórios", attributes: ["Tipo", "Cor", "Material"], image: subcategoryPlaceholders["Acessórios"] }
        ]
    },
    {
        name: "Livros",
        image: getCategoryImage("Livros"),
        subcategories: [
            { name: "Ficção", attributes: ["Autor", "Editora", "Idioma"] },
            { name: "Não-Ficção", attributes: ["Autor", "Editora", "Idioma"] },
            { name: "Educacional", attributes: ["Nível", "Editora", "Idioma"] }
        ]
    },
    {
        name: "Beleza",
        image: getCategoryImage("Beleza"),
        subcategories: [
            { name: "Cosméticos", attributes: ["Tipo", "Marca", "Cor"] },
            { name: "Cuidados da Pele", attributes: ["Tipo", "Marca", "Tipo de Pele"] },
            { name: "Perfumes", attributes: ["Marca", "Família Olfativa", "Volume"] }
        ]
    },
    {
        name: "Alimentação",
        image: getCategoryImage("Alimentação"),
        subcategories: [
            { name: "Orgânico", attributes: ["Tipo", "Origem", "Validade"] },
            { name: "Vegan", attributes: ["Tipo", "Origem", "Validade"] },
            { name: "Local", attributes: ["Tipo", "Origem", "Validade"] }
        ]
    }
];

async function initializeAll() {
    try {
        await Mongoose.connect(connectionString, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log('Connected to MongoDB');
        
        // Wait for connection to be fully ready - ensure models can use it
        await new Promise((resolve, reject) => {
            if (Mongoose.connection.readyState === 1) {
                // Connection is ready, but wait a bit more for models to be ready
                setTimeout(resolve, 1000);
            } else {
                Mongoose.connection.once('connected', () => {
                    setTimeout(resolve, 1000);
                });
                Mongoose.connection.once('error', reject);
            }
        });

        // 1. Initialize Admin User
        console.log('\n=== Initializing Admin User ===');
        const adminExists = await AdministradorModel.findOne({ nome: "admin" });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await AdministradorModel.create({
                nome: "admin",
                password: hashedPassword
            });
            console.log("✓ Default admin user created: admin / admin123");
        } else {
            console.log("✓ Admin user already exists");
        }

        // 2. Initialize Categories
        console.log('\n=== Initializing Categories ===');
        const existingCategories = await CategoriaModel.countDocuments();
        if (existingCategories > 0) {
            console.log(`Categories already exist (${existingCategories} found). Skipping category initialization.`);
        } else {
            for (const categoryData of basicCategories) {
                console.log(`Creating category: ${categoryData.name}`);
                
                // Create category
                const categoria = await CategoriaGW.create(categoryData.name);
                const categoriaId = categoria._id.toString();

                // Add image to category
                if (categoryData.image) {
                    await CategoriaGW.addFotografia(categoriaId, categoryData.image);
                }

                // Create subcategories
                for (const subcatData of categoryData.subcategories) {
                    console.log(`  Creating subcategory: ${subcatData.name}`);
                    
                    const subcategoria = await SubCategoriaGW.create(subcatData.name, categoriaId);
                    const subcategoriaId = subcategoria._id.toString();

                    // Add image to subcategory
                    if (subcatData.image) {
                        await SubCategoriaGW.addFotografia(subcategoriaId, subcatData.image);
                    }

                    // Create attributes
                    for (const attrName of subcatData.attributes) {
                        // Check if attribute already exists
                        let atributo = await AtributoModel.findOne({ nome: attrName });
                        
                        if (!atributo) {
                            // Get default values for this attribute, or use empty array
                            const valores = attributeValuesMap[attrName] || [];
                            atributo = await AtributoGW.create(attrName, `Atributo ${attrName}`, valores);
                        } else {
                            // Update existing attribute if it only has "text" as value
                            if (atributo.valores.length === 1 && atributo.valores[0] === "text") {
                                const valores = attributeValuesMap[attrName] || [];
                                if (valores.length > 0) {
                                    await AtributoModel.updateOne(
                                        { _id: atributo._id },
                                        { $set: { valores: valores } }
                                    );
                                    atributo.valores = valores;
                                }
                            }
                        }
                        
                        await SubCategoriaGW.addAtributo(subcategoriaId, atributo._id.toString());
                    }
                }
            }
            console.log('✓ Categories initialized successfully!');
        }

        // 3. Fix attribute values (ensure no "text" values)
        console.log('\n=== Fixing Attribute Values ===');
        const { fixAttributeValuesCore } = require('./fix-attribute-values');
        try {
            await fixAttributeValuesCore();
        } catch (err) {
            console.log('Note: Attribute values fix skipped or failed:', err.message);
        }

        // 4. Initialize Products
        console.log('\n=== Initializing Products ===');
        const ProdutoModel = require("../models/Produto.js");
        
        // Ensure connection is ready - verify it's actually connected
        if (Mongoose.connection.readyState !== 1) {
            console.log('Connection state:', Mongoose.connection.readyState, '- reconnecting...');
            // If disconnected, reconnect
            if (Mongoose.connection.readyState === 0) {
                await Mongoose.connect(connectionString, {
                    serverSelectionTimeoutMS: 30000,
                    socketTimeoutMS: 45000,
                });
            }
            // Wait for connection to be ready
            await new Promise((resolve, reject) => {
                if (Mongoose.connection.readyState === 1) {
                    resolve();
                } else {
                    const timeout = setTimeout(() => {
                        reject(new Error('Connection timeout waiting for MongoDB'));
                    }, 30000);
                    Mongoose.connection.once('connected', () => {
                        clearTimeout(timeout);
                        resolve();
                    });
                    Mongoose.connection.once('error', (err) => {
                        clearTimeout(timeout);
                        reject(err);
                    });
                }
            });
        }
        
        const existingProducts = await ProdutoModel.countDocuments();
        if (existingProducts > 0) {
            console.log(`Products already exist (${existingProducts} found). Skipping product initialization.`);
        } else {
            // Verify categories and subcategories exist before initializing products
            const categoriaCount = await CategoriaModel.countDocuments();
            const subcategoriaCount = await SubCategoriaModel.countDocuments();
            console.log(`Found ${categoriaCount} categories and ${subcategoriaCount} subcategories`);
            
            if (categoriaCount === 0 || subcategoriaCount === 0) {
                console.error('✗ Cannot initialize products: Categories or subcategories are missing!');
                console.error('   Please ensure categories are initialized before products.');
            } else {
                // Import the core function that doesn't manage connections
                const { initializeProductsCore } = require('./init-products');
                try {
                    // Use core function that works with existing connection
                    await initializeProductsCore();
                    console.log('✓ Products initialization completed');
                } catch (err) {
                    console.error('✗ Products initialization failed:', err);
                    console.error('Error details:', err.message);
                    if (err.stack) {
                        console.error('Error stack:', err.stack);
                    }
                    // Don't fail the entire initialization, but log the error clearly
                }
            }
        }

        console.log('\n=== Database initialization completed successfully! ===');
        // Don't close connection here - let the application use it
        // await Mongoose.connection.close();
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    initializeAll();
}

module.exports = { initializeAll };

