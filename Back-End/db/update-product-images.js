// Script to update existing products to use subcategory images instead of placeholder images

const Mongoose = require("mongoose");
const connectionString = process.env.MONGODB_URI || "mongodb://admin:admin123@mongodb:27017/Baylit?authSource=admin";

// Load models (must be loaded before use)
const ProdutoModel = require("../models/Produto.js");
const CategoriaModel = require("../models/Categoria.js");
const SubCategoriaModel = require("../models/SubCategoria.js");

// Map category names to their subcategory folder names
const categoryFolderMap = {
    "Crianças": "crianca",
    "Roupa": "roupa",
    "Eletrónica": "eletronicos",
    "Casa": "casa",
    "Desporto": "desporto",
    "Entretenimento": "entretenimento",
    "Alimentação": "comidas",
    "Saúde": "saude",
    "Computadores": "computadores"
};

// Map subcategory names to their image filenames (without extension)
const subcategoryImageMap = {
    // Crianças
    "Sapatos": "sapatos",
    "Roupa": "roupa",
    "Brinquedos": "brinquedos",
    "Acessórios": "acessorios",
    "Disfarce": "disfarce",
    "Mobília": "mobilia",
    
    // Roupa
    "T-Shirts": "tshirts",
    "Calças": "calcas",
    "Camisas": "camisas",
    "Sweatshirts": "sweatshirts",
    "Roupa Interior": "roupaInterior",
    "Chapeus": "chapeus",
    "Oculos": "oculos",
    "Vestidos": "vestidos",
    "Tops": "tops",
    "Calcoes": "calcoes",
    
    // Eletrónica
    "Smartphones": "telemoveis",
    "Computadores": "portateis",
    "Tablets": "telemoveis",
    "Consolas": "consola",
    "Videojogos": "videojogos",
    "Televisoes": "televisoes",
    "Cameras": "cameras",
    "Impressoras": "impressoras",
    "Relogios": "relogios",
    "Acessorios Telemoveis": "acessoriosTelemoveis",
    "Carro": "carro",
    "Leitor Musica": "leitorMusica",
    "LEDs": "leds",
    "Microondas": "microondas",
    "Frigorificos": "frigorificos",
    
    // Casa
    "Mobília": "cama",
    "Decoração": "almofada",
    "Eletrodomésticos": "candeeiro",
    "Cama": "cama",
    "Almofada": "almofada",
    "Arrumacao": "arrumacao",
    "Cadeiras": "cadeiras",
    "Candeeiro": "candeeiro",
    "Colchoes": "colchoes",
    "Cozinha": "cozinha",
    "Escritorio": "escritorio",
    "Exterior": "exterior",
    "Jardinagem": "jardinagem",
    "Limpeza": "limpeza",
    "Mesa": "mesa",
    "Piscina": "piscina",
    "WC": "wc",
    
    // Desporto
    "Calçado Desportivo": "acessorios",
    "Equipamento": "material",
    "Roupa Desportiva": "roupaDesportiva",
    "Acessórios": "acessorios",
    "Material": "material",
    
    // Entretenimento
    "Jogos": "jogos",
    "Instrumentos": "instrumentos",
    "Festas": "festas",
    "Colecionaveis": "colecionaveis",
    "Quadros": "quadros",
    
    // Alimentação
    "Carne": "carne",
    "Peixe": "peixe",
    "Marisco": "marisco",
    "Frutas": "frutas",
    "Queijo": "queijo",
    "Sumos": "sumos",
    
    // Saúde
    "Cabelo": "cabelo",
    "Dentes": "dentes",
    "Olhos": "olhos",
    "Pele": "pele",
    "Sexual": "sexual",
    "Suplementos": "suplementos",
    
    // Computadores
    "Portateis": "portateis",
    "Fixos": "fixos",
    "Perifericos": "perifericos",
    "Acessorios": "acessorios"
};

// Get subcategory image path
function getSubcategoryImage(categoria, subcategoria) {
    const folder = categoryFolderMap[categoria];
    const imageFile = subcategoryImageMap[subcategoria];
    
    if (folder && imageFile) {
        return `/images/subcategories/${folder}/${imageFile}.png`;
    }
    
    return null;
}

async function updateProductImages() {
    try {
        await Mongoose.connect(connectionString);
        console.log('Connected to MongoDB');

        // Get all products
        const produtos = await ProdutoModel.find({});
        
        // Manually populate categories and subcategories
        for (const produto of produtos) {
            // Handle categoria - might already be populated or might be an ID
            if (produto.categoria && typeof produto.categoria === 'object' && produto.categoria._id) {
                // Already populated, keep it
            } else if (produto.categoria) {
                produto.categoria = await CategoriaModel.findById(produto.categoria);
            }
            
            // Handle subcategoria - might be an ID or already populated
            if (produto.subcategoria && typeof produto.subcategoria === 'object' && produto.subcategoria._id) {
                // Already populated, keep it
            } else if (produto.subcategoria) {
                produto.subcategoria = await SubCategoriaModel.findById(produto.subcategoria);
            }
        }
        
        console.log(`Found ${produtos.length} products to check`);

        let updatedCount = 0;
        let skippedCount = 0;

        for (const produto of produtos) {
            // Check if product has placeholder image
            const hasPlaceholder = produto.fotografia && produto.fotografia.length > 0 && 
                                  produto.fotografia[0] && produto.fotografia[0].startsWith('data:image/svg');
            
            if (hasPlaceholder && produto.categoria && produto.subcategoria) {
                // Get names - handle both populated objects and IDs
                let categoriaNome = null;
                let subcategoriaNome = null;
                
                if (produto.categoria && typeof produto.categoria === 'object' && produto.categoria.nome) {
                    categoriaNome = produto.categoria.nome;
                } else if (produto.categoria) {
                    const cat = await CategoriaModel.findById(produto.categoria);
                    categoriaNome = cat ? cat.nome : null;
                }
                
                if (produto.subcategoria && typeof produto.subcategoria === 'object' && produto.subcategoria.nome) {
                    subcategoriaNome = produto.subcategoria.nome;
                } else if (produto.subcategoria) {
                    const subcat = await SubCategoriaModel.findById(produto.subcategoria);
                    subcategoriaNome = subcat ? subcat.nome : null;
                }
                
                if (!categoriaNome || !subcategoriaNome) {
                    console.log(`✗ Missing category/subcategory data: ${produto.nome} (cat: ${categoriaNome}, subcat: ${subcategoriaNome})`);
                    skippedCount++;
                    continue;
                }
                
                const subcategoryImage = getSubcategoryImage(categoriaNome, subcategoriaNome);
                
                if (subcategoryImage) {
                    produto.fotografia = [subcategoryImage];
                    await produto.save();
                    console.log(`✓ Updated: ${produto.nome} (${categoriaNome} > ${subcategoriaNome}) -> ${subcategoryImage}`);
                    updatedCount++;
                } else {
                    console.log(`✗ No mapping found: ${produto.nome} (${categoriaNome} > ${subcategoriaNome})`);
                    skippedCount++;
                }
            } else {
                skippedCount++;
            }
        }

        console.log(`\n✓ Update complete!`);
        console.log(`  Updated: ${updatedCount} products`);
        console.log(`  Skipped: ${skippedCount} products`);
        
        await Mongoose.connection.close();
    } catch (error) {
        console.error('Error updating product images:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    updateProductImages();
}

module.exports = { updateProductImages };
