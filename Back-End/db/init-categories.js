// Category initialization script with placeholder images
// Creates basic categories with placeholder images

const Mongoose = require("mongoose");
const connectionString = process.env.MONGODB_URI || "mongodb://admin:admin123@mongodb:27017/Baylit?authSource=admin";

const CategoriaModel = require("../models/Categoria.js");
const SubCategoriaModel = require("../models/SubCategoria.js");
const AtributoModel = require("../models/Atributo.js");
const CategoriaGW = require("../gateway/CategoriaGat.js");
const SubCategoriaGW = require("../gateway/SubCategoriaGat.js");
const AtributoGW = require("../gateway/AtributoGat.js");

// Simple SVG placeholder as data URI (works offline, no CORS issues)
function createPlaceholderImage(text, width = 400, height = 300, bgColor = "4ECDC4", textColor = "FFFFFF") {
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${bgColor}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// Map category names to image filenames
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

// Get category image URL (use real image if available, otherwise placeholder)
function getCategoryImage(categoryName) {
    return categoryImageMap[categoryName] || createPlaceholderImage(categoryName, 400, 300, "4ECDC4");
}

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
            { name: "Ficção", attributes: ["Autor", "Editora", "Idioma"], image: subcategoryPlaceholders["Livros"] || createPlaceholderImage("Ficção", 300, 200, "34A853") },
            { name: "Não-Ficção", attributes: ["Autor", "Editora", "Idioma"], image: subcategoryPlaceholders["Livros"] || createPlaceholderImage("Não-Ficção", 300, 200, "34A853") },
            { name: "Educacional", attributes: ["Autor", "Editora", "Idioma"], image: subcategoryPlaceholders["Livros"] || createPlaceholderImage("Educacional", 300, 200, "34A853") }
        ]
    },
    {
        name: "Beleza",
        image: getCategoryImage("Beleza"),
        subcategories: [
            { name: "Cosméticos", attributes: ["Cor", "Tipo", "Marca"], image: subcategoryPlaceholders["Beleza"] || createPlaceholderImage("Cosméticos", 300, 200, "FBBC05") },
            { name: "Cuidados da Pele", attributes: ["Tipo", "Marca", "Volume"], image: subcategoryPlaceholders["Beleza"] || createPlaceholderImage("Cuidados da Pele", 300, 200, "FBBC05") },
            { name: "Perfumes", attributes: ["Fragrância", "Marca", "Volume"], image: subcategoryPlaceholders["Beleza"] || createPlaceholderImage("Perfumes", 300, 200, "FBBC05") }
        ]
    },
    {
        name: "Alimentação",
        image: getCategoryImage("Alimentação"),
        subcategories: [
            { name: "Orgânico", attributes: ["Tipo", "Origem", "Peso"], image: subcategoryPlaceholders["Alimentação"] || createPlaceholderImage("Orgânico", 300, 200, "EA4335") },
            { name: "Vegan", attributes: ["Tipo", "Origem", "Peso"], image: subcategoryPlaceholders["Alimentação"] || createPlaceholderImage("Vegan", 300, 200, "EA4335") },
            { name: "Local", attributes: ["Tipo", "Origem", "Peso"], image: subcategoryPlaceholders["Alimentação"] || createPlaceholderImage("Local", 300, 200, "EA4335") }
        ]
    }
];

async function initializeCategories() {
    try {
        await Mongoose.connect(connectionString);
        console.log('Connected to MongoDB');

        // Check if categories already exist
        const existingCategories = await CategoriaModel.countDocuments();
        if (existingCategories > 0) {
            console.log(`Categories already exist (${existingCategories} found). Skipping initialization.`);
            await Mongoose.connection.close();
            return;
        }

        console.log('Initializing categories...');

        for (const categoryData of basicCategories) {
            console.log(`Creating category: ${categoryData.name}`);
            
                // Create category
                const categoria = await CategoriaGW.create(categoryData.name);
                const categoriaId = categoria._id.toString();

                // Add image to category (use real image if available)
                const categoryImage = getCategoryImage(categoryData.name);
                await CategoriaGW.addFotografia(categoriaId, categoryImage);

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

        console.log('Categories initialized successfully!');
        await Mongoose.connection.close();
    } catch (error) {
        console.error('Error initializing categories:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    initializeCategories();
}

module.exports = { initializeCategories };

