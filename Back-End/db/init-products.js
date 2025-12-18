// Initialize mock products with images and cadeia data
// Creates products, specific products, and production data

const Mongoose = require("mongoose");
const connectionString = process.env.MONGODB_URI || "mongodb://admin:admin123@mongodb:27017/Baylit?authSource=admin";

const CategoriaModel = require("../models/Categoria.js");
const SubCategoriaModel = require("../models/SubCategoria.js");
const ProdutoModel = require("../models/Produto.js");
const ProdutoEspecificoModel = require("../models/ProdutoEspecifico.js");
const FornecedorModel = require("../models/Fornecedor.js");
const ProducaoModel = require("../models/Producao.js");
const LocalModel = require("../models/Local.js");
const ArmazemModel = require("../models/Armazem.js");
const ItemModel = require("../models/Item.js");

// Gateways will be required inside the function to avoid circular dependencies

// Simple SVG placeholder as data URI (for products that don't have subcategory images)
function createPlaceholderImage(text, width = 400, height = 300, bgColor = "4ECDC4", textColor = "FFFFFF") {
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${bgColor}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

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
    "Tablets": "telemoveis", // Using telemoveis as fallback
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
    "Calçado Desportivo": "acessorios", // Using acessorios as fallback
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
    
    // Fallback to placeholder if no mapping found
    return null;
}

// Helper function to generate size variants for products
function generateSizeVariants(baseProduct, sizeAttribute, sizes) {
    const variants = [];
    for (const size of sizes) {
        const variant = JSON.parse(JSON.stringify(baseProduct)); // Deep copy
        // Find and replace the size attribute value
        const sizeAttr = variant.especificidade.find(attr => 
            attr.atributo === sizeAttribute || attr.atributo.includes("Tamanho")
        );
        if (sizeAttr) {
            sizeAttr.valor = size;
        }
        variants.push(variant);
    }
    return variants;
}

// Mock products data - covering all major subcategories with multiple products each
const mockProducts = [
    // ========== CRIANÇAS CATEGORY ==========
    // Sapatos - with multiple sizes
    {
        nome: "Sapatos Infantis Ecológicos Azuis",
        categoria: "Crianças",
        subcategoria: "Sapatos",
        preco: 34.99,
        especificidade: [
            { atributo: "Cor", valor: "Azul" },
            { atributo: "Tamanho do Calçado", valor: "28" },
            { atributo: "Idade", valor: "4-6 anos" }
        ],
        fotografia: createPlaceholderImage("Sapatos Azuis", 400, 400, "FF6B9D"),
        informacao_adicional: "Sapatos infantis feitos com materiais ecológicos e sustentáveis.",
        tamanhos: ["28", "29", "30", "31", "32", "33", "34"]
    },
    {
        nome: "Sapatos Infantis Ecológicos Vermelhos",
        categoria: "Crianças",
        subcategoria: "Sapatos",
        preco: 34.99,
        especificidade: [
            { atributo: "Cor", valor: "Vermelho" },
            { atributo: "Tamanho do Calçado", valor: "28" },
            { atributo: "Idade", valor: "4-6 anos" }
        ],
        fotografia: createPlaceholderImage("Sapatos Vermelhos", 400, 400, "E74C3C"),
        informacao_adicional: "Sapatos infantis coloridos e sustentáveis.",
        tamanhos: ["28", "29", "30", "31", "32"]
    },
    {
        nome: "Sapatilhas Infantis Verdes",
        categoria: "Crianças",
        subcategoria: "Sapatos",
        preco: 29.99,
        especificidade: [
            { atributo: "Cor", valor: "Verde" },
            { atributo: "Tamanho do Calçado", valor: "30" },
            { atributo: "Idade", valor: "5-8 anos" }
        ],
        fotografia: createPlaceholderImage("Sapatilhas", 400, 400, "27AE60"),
        informacao_adicional: "Sapatilhas confortáveis para crianças.",
        tamanhos: ["30", "31", "32", "33", "34", "35"]
    },
    // Roupa - with multiple sizes
    {
        nome: "T-Shirt Infantil Orgânica Azul",
        categoria: "Crianças",
        subcategoria: "Roupa",
        preco: 24.99,
        especificidade: [
            { atributo: "Cor", valor: "Azul" },
            { atributo: "Tamanho da Roupa", valor: "XS" },
            { atributo: "Idade", valor: "3-4 anos" }
        ],
        fotografia: createPlaceholderImage("T-Shirt Azul", 400, 400, "3498DB"),
        informacao_adicional: "T-shirt infantil com algodão orgânico certificado.",
        tamanhos: ["XS", "S", "M", "L"]
    },
    {
        nome: "Vestido Infantil Rosa",
        categoria: "Crianças",
        subcategoria: "Roupa",
        preco: 32.99,
        especificidade: [
            { atributo: "Cor", valor: "Rosa" },
            { atributo: "Tamanho da Roupa", valor: "S" },
            { atributo: "Idade", valor: "4-6 anos" }
        ],
        fotografia: createPlaceholderImage("Vestido", 400, 400, "E91E63"),
        informacao_adicional: "Vestido infantil sustentável.",
        tamanhos: ["S", "M", "L", "XL"]
    },
    {
        nome: "Calças Infantis Verdes",
        categoria: "Crianças",
        subcategoria: "Roupa",
        preco: 28.99,
        especificidade: [
            { atributo: "Cor", valor: "Verde" },
            { atributo: "Tamanho da Roupa", valor: "M" },
            { atributo: "Idade", valor: "5-7 anos" }
        ],
        fotografia: createPlaceholderImage("Calças Infantis", 400, 400, "2ECC71"),
        informacao_adicional: "Calças infantis confortáveis.",
        tamanhos: ["M", "L", "XL"]
    },
    // Brinquedos
    {
        nome: "Brinquedo Educativo de Madeira",
        categoria: "Crianças",
        subcategoria: "Brinquedos",
        preco: 19.99,
        especificidade: [
            { atributo: "Idade", valor: "3-6 anos" }
        ],
        fotografia: createPlaceholderImage("Brinquedo Madeira", 400, 400, "8B4513"),
        informacao_adicional: "Brinquedo educativo feito com madeira sustentável."
    },
    {
        nome: "Puzzle Ecológico",
        categoria: "Crianças",
        subcategoria: "Brinquedos",
        preco: 15.99,
        especificidade: [
            { atributo: "Idade", valor: "4-8 anos" }
        ],
        fotografia: createPlaceholderImage("Puzzle", 400, 400, "FFA500"),
        informacao_adicional: "Puzzle feito com materiais reciclados."
    },
    {
        nome: "Boneca Ecológica",
        categoria: "Crianças",
        subcategoria: "Brinquedos",
        preco: 22.99,
        especificidade: [
            { atributo: "Idade", valor: "3-7 anos" }
        ],
        fotografia: createPlaceholderImage("Boneca", 400, 400, "FF69B4"),
        informacao_adicional: "Boneca feita com materiais orgânicos."
    },
    {
        nome: "Carrinho de Brincar",
        categoria: "Crianças",
        subcategoria: "Brinquedos",
        preco: 35.99,
        especificidade: [
            { atributo: "Idade", valor: "2-5 anos" }
        ],
        fotografia: createPlaceholderImage("Carrinho", 400, 400, "FF6347"),
        informacao_adicional: "Carrinho de brincar sustentável."
    },
    // Acessórios
    {
        nome: "Mochila Infantil Rosa",
        categoria: "Crianças",
        subcategoria: "Acessórios",
        preco: 24.99,
        especificidade: [
            { atributo: "Cor", valor: "Rosa" },
            { atributo: "Idade", valor: "5-10 anos" }
        ],
        fotografia: createPlaceholderImage("Mochila", 400, 400, "FF1493"),
        informacao_adicional: "Mochila infantil feita com materiais reciclados."
    },
    {
        nome: "Chapéu Infantil Azul",
        categoria: "Crianças",
        subcategoria: "Acessórios",
        preco: 14.99,
        especificidade: [
            { atributo: "Cor", valor: "Azul" },
            { atributo: "Idade", valor: "3-8 anos" }
        ],
        fotografia: createPlaceholderImage("Chapéu", 400, 400, "4169E1"),
        informacao_adicional: "Chapéu infantil com proteção UV."
    },
    {
        nome: "Cinto Infantil Verde",
        categoria: "Crianças",
        subcategoria: "Acessórios",
        preco: 12.99,
        especificidade: [
            { atributo: "Cor", valor: "Verde" },
            { atributo: "Idade", valor: "4-10 anos" }
        ],
        fotografia: createPlaceholderImage("Cinto", 400, 400, "32CD32"),
        informacao_adicional: "Cinto infantil ajustável."
    },
    
    // ========== ROUPA CATEGORY ==========
    // T-Shirts - with multiple sizes
    {
        nome: "T-Shirt Algodão Orgânico Branca",
        categoria: "Roupa",
        subcategoria: "T-Shirts",
        preco: 24.99,
        especificidade: [
            { atributo: "Cor", valor: "Branco" },
            { atributo: "Tamanho da Roupa", valor: "S" },
            { atributo: "Sexo", valor: "Unissex" }
        ],
        fotografia: createPlaceholderImage("T-Shirt Branca", 400, 400, "FFFFFF"),
        informacao_adicional: "T-shirt feita com algodão 100% orgânico, sustentável e confortável.",
        tamanhos: ["S", "M", "L", "XL", "XXL"]
    },
    {
        nome: "T-Shirt Algodão Orgânico Preta",
        categoria: "Roupa",
        subcategoria: "T-Shirts",
        preco: 24.99,
        especificidade: [
            { atributo: "Cor", valor: "Preto" },
            { atributo: "Tamanho da Roupa", valor: "M" },
            { atributo: "Sexo", valor: "Unissex" }
        ],
        fotografia: createPlaceholderImage("T-Shirt Preta", 400, 400, "000000"),
        informacao_adicional: "T-shirt preta orgânica e sustentável.",
        tamanhos: ["S", "M", "L", "XL", "XXL"]
    },
    {
        nome: "T-Shirt Algodão Orgânico Azul",
        categoria: "Roupa",
        subcategoria: "T-Shirts",
        preco: 24.99,
        especificidade: [
            { atributo: "Cor", valor: "Azul" },
            { atributo: "Tamanho da Roupa", valor: "L" },
            { atributo: "Sexo", valor: "Masculino" }
        ],
        fotografia: createPlaceholderImage("T-Shirt Azul", 400, 400, "0000FF"),
        informacao_adicional: "T-shirt azul masculina orgânica.",
        tamanhos: ["M", "L", "XL", "XXL"]
    },
    {
        nome: "T-Shirt Algodão Orgânico Rosa",
        categoria: "Roupa",
        subcategoria: "T-Shirts",
        preco: 24.99,
        especificidade: [
            { atributo: "Cor", valor: "Rosa" },
            { atributo: "Tamanho da Roupa", valor: "S" },
            { atributo: "Sexo", valor: "Feminino" }
        ],
        fotografia: createPlaceholderImage("T-Shirt Rosa", 400, 400, "FF69B4"),
        informacao_adicional: "T-shirt rosa feminina orgânica.",
        tamanhos: ["XS", "S", "M", "L"]
    },
    // Calças - with multiple sizes
    {
        nome: "Calças Jeans Sustentáveis Azuis",
        categoria: "Roupa",
        subcategoria: "Calças",
        preco: 59.99,
        especificidade: [
            { atributo: "Cor", valor: "Azul" },
            { atributo: "Tamanho da Roupa", valor: "32" },
            { atributo: "Sexo", valor: "Masculino" }
        ],
        fotografia: createPlaceholderImage("Calças Azuis", 400, 400, "1E90FF"),
        informacao_adicional: "Calças jeans produzidas com métodos sustentáveis.",
        tamanhos: ["30", "32", "34", "36", "38", "40"]
    },
    {
        nome: "Calças Jeans Sustentáveis Pretas",
        categoria: "Roupa",
        subcategoria: "Calças",
        preco: 59.99,
        especificidade: [
            { atributo: "Cor", valor: "Preto" },
            { atributo: "Tamanho da Roupa", valor: "34" },
            { atributo: "Sexo", valor: "Feminino" }
        ],
        fotografia: createPlaceholderImage("Calças Pretas", 400, 400, "2C2C2C"),
        informacao_adicional: "Calças pretas femininas sustentáveis.",
        tamanhos: ["28", "30", "32", "34", "36"]
    },
    {
        nome: "Calças de Ganga Orgânicas",
        categoria: "Roupa",
        subcategoria: "Calças",
        preco: 64.99,
        especificidade: [
            { atributo: "Cor", valor: "Azul Claro" },
            { atributo: "Tamanho da Roupa", valor: "36" },
            { atributo: "Sexo", valor: "Unissex" }
        ],
        fotografia: createPlaceholderImage("Calças Ganga", 400, 400, "87CEEB"),
        informacao_adicional: "Calças de ganga orgânicas unissex.",
        tamanhos: ["32", "34", "36", "38", "40"]
    },
    // Camisas - with multiple sizes
    {
        nome: "Camisa Orgânica Branca",
        categoria: "Roupa",
        subcategoria: "Camisas",
        preco: 39.99,
        especificidade: [
            { atributo: "Cor", valor: "Branco" },
            { atributo: "Tamanho da Roupa", valor: "M" },
            { atributo: "Sexo", valor: "Masculino" }
        ],
        fotografia: createPlaceholderImage("Camisa Branca", 400, 400, "F5F5F5"),
        informacao_adicional: "Camisa branca feita com algodão orgânico.",
        tamanhos: ["S", "M", "L", "XL", "XXL"]
    },
    {
        nome: "Camisa Orgânica Azul",
        categoria: "Roupa",
        subcategoria: "Camisas",
        preco: 39.99,
        especificidade: [
            { atributo: "Cor", valor: "Azul" },
            { atributo: "Tamanho da Roupa", valor: "L" },
            { atributo: "Sexo", valor: "Masculino" }
        ],
        fotografia: createPlaceholderImage("Camisa Azul", 400, 400, "4682B4"),
        informacao_adicional: "Camisa azul masculina orgânica.",
        tamanhos: ["M", "L", "XL", "XXL"]
    },
    {
        nome: "Blusa Feminina Orgânica",
        categoria: "Roupa",
        subcategoria: "Camisas",
        preco: 44.99,
        especificidade: [
            { atributo: "Cor", valor: "Branco" },
            { atributo: "Tamanho da Roupa", valor: "S" },
            { atributo: "Sexo", valor: "Feminino" }
        ],
        fotografia: createPlaceholderImage("Blusa", 400, 400, "FFF8DC"),
        informacao_adicional: "Blusa feminina orgânica elegante.",
        tamanhos: ["XS", "S", "M", "L"]
    },
    // Sapatos - with multiple sizes
    {
        nome: "Sapatos Sustentáveis Pretos",
        categoria: "Roupa",
        subcategoria: "Sapatos",
        preco: 79.99,
        especificidade: [
            { atributo: "Cor", valor: "Preto" },
            { atributo: "Tamanho do Calçado", valor: "40" },
            { atributo: "Sexo", valor: "Unissex" }
        ],
        fotografia: createPlaceholderImage("Sapatos Pretos", 400, 400, "1C1C1C"),
        informacao_adicional: "Sapatos produzidos com materiais reciclados.",
        tamanhos: ["38", "39", "40", "41", "42", "43", "44", "45"]
    },
    {
        nome: "Sapatos Sustentáveis Castanhos",
        categoria: "Roupa",
        subcategoria: "Sapatos",
        preco: 79.99,
        especificidade: [
            { atributo: "Cor", valor: "Castanho" },
            { atributo: "Tamanho do Calçado", valor: "42" },
            { atributo: "Sexo", valor: "Masculino" }
        ],
        fotografia: createPlaceholderImage("Sapatos Castanhos", 400, 400, "8B4513"),
        informacao_adicional: "Sapatos castanhos masculinos sustentáveis.",
        tamanhos: ["40", "41", "42", "43", "44", "45"]
    },
    {
        nome: "Sapatilhas Femininas Brancas",
        categoria: "Roupa",
        subcategoria: "Sapatos",
        preco: 69.99,
        especificidade: [
            { atributo: "Cor", valor: "Branco" },
            { atributo: "Tamanho do Calçado", valor: "38" },
            { atributo: "Sexo", valor: "Feminino" }
        ],
        fotografia: createPlaceholderImage("Sapatilhas", 400, 400, "F0F0F0"),
        informacao_adicional: "Sapatilhas femininas confortáveis.",
        tamanhos: ["36", "37", "38", "39", "40", "41"]
    },
    
    // ========== ELETRÓNICA CATEGORY ==========
    {
        nome: "Smartphone Eco-Friendly Preto",
        categoria: "Eletrónica",
        subcategoria: "Smartphones",
        preco: 299.99,
        especificidade: [
            { atributo: "Marca", valor: "EcoPhone" },
            { atributo: "Capacidade", valor: "128GB" },
            { atributo: "Cor", valor: "Preto" }
        ],
        fotografia: createPlaceholderImage("Smartphone Preto", 400, 400, "000000"),
        informacao_adicional: "Smartphone com componentes reciclados e bateria de longa duração."
    },
    {
        nome: "Smartphone Eco-Friendly Branco",
        categoria: "Eletrónica",
        subcategoria: "Smartphones",
        preco: 299.99,
        especificidade: [
            { atributo: "Marca", valor: "EcoPhone" },
            { atributo: "Capacidade", valor: "128GB" },
            { atributo: "Cor", valor: "Branco" }
        ],
        fotografia: createPlaceholderImage("Smartphone Branco", 400, 400, "FFFFFF"),
        informacao_adicional: "Smartphone branco ecológico."
    },
    {
        nome: "Smartphone Eco-Friendly 256GB",
        categoria: "Eletrónica",
        subcategoria: "Smartphones",
        preco: 349.99,
        especificidade: [
            { atributo: "Marca", valor: "EcoPhone" },
            { atributo: "Capacidade", valor: "256GB" },
            { atributo: "Cor", valor: "Preto" }
        ],
        fotografia: createPlaceholderImage("Smartphone 256GB", 400, 400, "2C2C2C"),
        informacao_adicional: "Smartphone com mais capacidade de armazenamento."
    },
    {
        nome: "Laptop Sustentável 16GB",
        categoria: "Eletrónica",
        subcategoria: "Computadores",
        preco: 799.99,
        especificidade: [
            { atributo: "Marca", valor: "GreenTech" },
            { atributo: "RAM", valor: "16GB" },
            { atributo: "Armazenamento", valor: "512GB" }
        ],
        fotografia: createPlaceholderImage("Laptop 16GB", 400, 400, "9B59B6"),
        informacao_adicional: "Laptop com certificação de energia eficiente."
    },
    {
        nome: "Laptop Sustentável 8GB",
        categoria: "Eletrónica",
        subcategoria: "Computadores",
        preco: 649.99,
        especificidade: [
            { atributo: "Marca", valor: "GreenTech" },
            { atributo: "RAM", valor: "8GB" },
            { atributo: "Armazenamento", valor: "256GB" }
        ],
        fotografia: createPlaceholderImage("Laptop 8GB", 400, 400, "8E44AD"),
        informacao_adicional: "Laptop básico e eficiente."
    },
    {
        nome: "Laptop Sustentável 32GB",
        categoria: "Eletrónica",
        subcategoria: "Computadores",
        preco: 999.99,
        especificidade: [
            { atributo: "Marca", valor: "GreenTech" },
            { atributo: "RAM", valor: "32GB" },
            { atributo: "Armazenamento", valor: "1TB" }
        ],
        fotografia: createPlaceholderImage("Laptop 32GB", 400, 400, "7D3C98"),
        informacao_adicional: "Laptop de alta performance."
    },
    {
        nome: "Tablet Ecológico 10 polegadas",
        categoria: "Eletrónica",
        subcategoria: "Tablets",
        preco: 199.99,
        especificidade: [
            { atributo: "Marca", valor: "EcoTab" },
            { atributo: "Tamanho do Ecrã", valor: "10 polegadas" },
            { atributo: "Capacidade", valor: "64GB" }
        ],
        fotografia: createPlaceholderImage("Tablet 10", 400, 400, "3498DB"),
        informacao_adicional: "Tablet com componentes reciclados."
    },
    {
        nome: "Tablet Ecológico 8 polegadas",
        categoria: "Eletrónica",
        subcategoria: "Tablets",
        preco: 149.99,
        especificidade: [
            { atributo: "Marca", valor: "EcoTab" },
            { atributo: "Tamanho do Ecrã", valor: "8 polegadas" },
            { atributo: "Capacidade", valor: "32GB" }
        ],
        fotografia: createPlaceholderImage("Tablet 8", 400, 400, "5DADE2"),
        informacao_adicional: "Tablet compacto e ecológico."
    },
    {
        nome: "Tablet Ecológico 12 polegadas",
        categoria: "Eletrónica",
        subcategoria: "Tablets",
        preco: 249.99,
        especificidade: [
            { atributo: "Marca", valor: "EcoTab" },
            { atributo: "Tamanho do Ecrã", valor: "12 polegadas" },
            { atributo: "Capacidade", valor: "128GB" }
        ],
        fotografia: createPlaceholderImage("Tablet 12", 400, 400, "2874A6"),
        informacao_adicional: "Tablet grande para produtividade."
    },
    
    // ========== CASA CATEGORY ==========
    {
        nome: "Mesa de Madeira Reciclada Pequena",
        categoria: "Casa",
        subcategoria: "Mobília",
        preco: 149.99,
        especificidade: [
            { atributo: "Cor", valor: "Natural" },
            { atributo: "Material", valor: "Madeira Reciclada" },
            { atributo: "Dimensões", valor: "Pequeno" }
        ],
        fotografia: createPlaceholderImage("Mesa Pequena", 400, 400, "E67E22"),
        informacao_adicional: "Mesa pequena feita com madeira 100% reciclada."
    },
    {
        nome: "Mesa de Madeira Reciclada Média",
        categoria: "Casa",
        subcategoria: "Mobília",
        preco: 199.99,
        especificidade: [
            { atributo: "Cor", valor: "Natural" },
            { atributo: "Material", valor: "Madeira Reciclada" },
            { atributo: "Dimensões", valor: "Médio" }
        ],
        fotografia: createPlaceholderImage("Mesa Média", 400, 400, "D35400"),
        informacao_adicional: "Mesa média feita com madeira reciclada."
    },
    {
        nome: "Mesa de Madeira Reciclada Grande",
        categoria: "Casa",
        subcategoria: "Mobília",
        preco: 249.99,
        especificidade: [
            { atributo: "Cor", valor: "Natural" },
            { atributo: "Material", valor: "Madeira Reciclada" },
            { atributo: "Dimensões", valor: "Grande" }
        ],
        fotografia: createPlaceholderImage("Mesa Grande", 400, 400, "C0392B"),
        informacao_adicional: "Mesa grande feita com madeira reciclada."
    },
    {
        nome: "Cadeira de Madeira Sustentável",
        categoria: "Casa",
        subcategoria: "Mobília",
        preco: 89.99,
        especificidade: [
            { atributo: "Cor", valor: "Natural" },
            { atributo: "Material", valor: "Madeira" },
            { atributo: "Dimensões", valor: "Médio" }
        ],
        fotografia: createPlaceholderImage("Cadeira", 400, 400, "A0522D"),
        informacao_adicional: "Cadeira confortável de madeira sustentável."
    },
    {
        nome: "Decoração Sustentável Verde",
        categoria: "Casa",
        subcategoria: "Decoração",
        preco: 49.99,
        especificidade: [
            { atributo: "Cor", valor: "Verde" },
            { atributo: "Estilo", valor: "Moderno" },
            { atributo: "Material", valor: "Bambu" }
        ],
        fotografia: createPlaceholderImage("Decoração Verde", 400, 400, "27AE60"),
        informacao_adicional: "Peça de decoração feita com bambu sustentável."
    },
    {
        nome: "Decoração Sustentável Azul",
        categoria: "Casa",
        subcategoria: "Decoração",
        preco: 49.99,
        especificidade: [
            { atributo: "Cor", valor: "Azul" },
            { atributo: "Estilo", valor: "Clássico" },
            { atributo: "Material", valor: "Vidro Reciclado" }
        ],
        fotografia: createPlaceholderImage("Decoração Azul", 400, 400, "3498DB"),
        informacao_adicional: "Decoração em vidro reciclado."
    },
    {
        nome: "Eletrodoméstico Eficiente A++",
        categoria: "Casa",
        subcategoria: "Eletrodomésticos",
        preco: 299.99,
        especificidade: [
            { atributo: "Marca", valor: "EcoHome" },
            { atributo: "Potência", valor: "1000W" },
            { atributo: "Cor", valor: "Branco" }
        ],
        fotografia: createPlaceholderImage("Eletrodoméstico", 400, 400, "ECF0F1"),
        informacao_adicional: "Eletrodoméstico com classificação energética A++."
    },
    {
        nome: "Eletrodoméstico Eficiente 1500W",
        categoria: "Casa",
        subcategoria: "Eletrodomésticos",
        preco: 349.99,
        especificidade: [
            { atributo: "Marca", valor: "EcoHome" },
            { atributo: "Potência", valor: "1500W" },
            { atributo: "Cor", valor: "Branco" }
        ],
        fotografia: createPlaceholderImage("Eletrodoméstico 1500W", 400, 400, "D5DBDB"),
        informacao_adicional: "Eletrodoméstico de maior potência."
    },
    
    // ========== DESPORTO CATEGORY ==========
    {
        nome: "Sapatos Desportivos Ecológicos Brancos",
        categoria: "Desporto",
        subcategoria: "Calçado Desportivo",
        preco: 89.99,
        especificidade: [
            { atributo: "Tamanho", valor: "40" },
            { atributo: "Cor", valor: "Branco" },
            { atributo: "Tipo", valor: "Corrida" }
        ],
        fotografia: createPlaceholderImage("Sapatos Corrida", 400, 400, "FFFFFF"),
        informacao_adicional: "Sapatos de corrida feitos com materiais reciclados.",
        tamanhos: ["38", "39", "40", "41", "42", "43", "44", "45"]
    },
    {
        nome: "Sapatos Desportivos Ecológicos Azuis",
        categoria: "Desporto",
        subcategoria: "Calçado Desportivo",
        preco: 89.99,
        especificidade: [
            { atributo: "Tamanho", valor: "42" },
            { atributo: "Cor", valor: "Azul" },
            { atributo: "Tipo", valor: "Caminhada" }
        ],
        fotografia: createPlaceholderImage("Sapatos Caminhada", 400, 400, "4169E1"),
        informacao_adicional: "Sapatos de caminhada confortáveis.",
        tamanhos: ["39", "40", "41", "42", "43", "44"]
    },
    {
        nome: "Sapatilhas Desportivas",
        categoria: "Desporto",
        subcategoria: "Calçado Desportivo",
        preco: 69.99,
        especificidade: [
            { atributo: "Tamanho", valor: "41" },
            { atributo: "Cor", valor: "Preto" },
            { atributo: "Tipo", valor: "Tênis" }
        ],
        fotografia: createPlaceholderImage("Sapatilhas", 400, 400, "1C1C1C"),
        informacao_adicional: "Sapatilhas desportivas versáteis.",
        tamanhos: ["38", "39", "40", "41", "42", "43"]
    },
    {
        nome: "Equipamento Desportivo Yoga",
        categoria: "Desporto",
        subcategoria: "Equipamento",
        preco: 59.99,
        especificidade: [
            { atributo: "Tipo", valor: "Yoga" },
            { atributo: "Tamanho", valor: "P" },
            { atributo: "Material", valor: "Borracha Reciclada" }
        ],
        fotografia: createPlaceholderImage("Equipamento Yoga", 400, 400, "16A085"),
        informacao_adicional: "Equipamento desportivo sustentável.",
        tamanhos: ["P", "M", "G"]
    },
    {
        nome: "Equipamento Desportivo Fitness",
        categoria: "Desporto",
        subcategoria: "Equipamento",
        preco: 79.99,
        especificidade: [
            { atributo: "Tipo", valor: "Fitness" },
            { atributo: "Tamanho", valor: "M" },
            { atributo: "Material", valor: "Algodão Orgânico" }
        ],
        fotografia: createPlaceholderImage("Equipamento Fitness", 400, 400, "27AE60"),
        informacao_adicional: "Equipamento de fitness sustentável.",
        tamanhos: ["M", "G", "GG"]
    },
    {
        nome: "Acessórios Desportivos Garrafa",
        categoria: "Desporto",
        subcategoria: "Acessórios",
        preco: 24.99,
        especificidade: [
            { atributo: "Tipo", valor: "Garrafa" },
            { atributo: "Cor", valor: "Azul" },
            { atributo: "Material", valor: "Aço Inoxidável" }
        ],
        fotografia: createPlaceholderImage("Garrafa", 400, 400, "2980B9"),
        informacao_adicional: "Garrafa desportiva reutilizável."
    },
    {
        nome: "Acessórios Desportivos Mochila",
        categoria: "Desporto",
        subcategoria: "Acessórios",
        preco: 44.99,
        especificidade: [
            { atributo: "Tipo", valor: "Mochila" },
            { atributo: "Cor", valor: "Preto" },
            { atributo: "Material", valor: "Poliester Reciclado" }
        ],
        fotografia: createPlaceholderImage("Mochila Desporto", 400, 400, "2C2C2C"),
        informacao_adicional: "Mochila desportiva sustentável."
    },
    
    // ========== LIVROS CATEGORY ==========
    {
        nome: "Livro de Ficção Sustentável",
        categoria: "Livros",
        subcategoria: "Ficção",
        preco: 14.99,
        especificidade: [
            { atributo: "Autor", valor: "Vários" },
            { atributo: "Editora", valor: "Várias" },
            { atributo: "Idioma", valor: "Português" }
        ],
        fotografia: createPlaceholderImage("Livro Ficção", 400, 400, "8B4513"),
        informacao_adicional: "Livro de ficção impresso em papel reciclado."
    },
    {
        nome: "Livro de Não-Ficção Ecológico",
        categoria: "Livros",
        subcategoria: "Não-Ficção",
        preco: 19.99,
        especificidade: [
            { atributo: "Autor", valor: "Vários" },
            { atributo: "Editora", valor: "Várias" },
            { atributo: "Idioma", valor: "Português" }
        ],
        fotografia: createPlaceholderImage("Livro Não-Ficção", 400, 400, "A0522D"),
        informacao_adicional: "Livro de não-ficção sobre sustentabilidade."
    },
    {
        nome: "Livro Educacional Sustentável",
        categoria: "Livros",
        subcategoria: "Educacional",
        preco: 24.99,
        especificidade: [
            { atributo: "Autor", valor: "Vários" },
            { atributo: "Editora", valor: "Várias" },
            { atributo: "Idioma", valor: "Português" }
        ],
        fotografia: createPlaceholderImage("Livro Educacional", 400, 400, "654321"),
        informacao_adicional: "Livro educacional sobre meio ambiente."
    },
    
    // ========== BELEZA CATEGORY ==========
    {
        nome: "Cosmético Natural Rosa",
        categoria: "Beleza",
        subcategoria: "Cosméticos",
        preco: 12.99,
        especificidade: [
            { atributo: "Cor", valor: "Rosa" },
            { atributo: "Tipo", valor: "Batom" },
            { atributo: "Marca", valor: "EcoBeauty" }
        ],
        fotografia: createPlaceholderImage("Cosmético Rosa", 400, 400, "FF69B4"),
        informacao_adicional: "Cosmético natural e sustentável."
    },
    {
        nome: "Cosmético Natural Vermelho",
        categoria: "Beleza",
        subcategoria: "Cosméticos",
        preco: 12.99,
        especificidade: [
            { atributo: "Cor", valor: "Vermelho" },
            { atributo: "Tipo", valor: "Batom" },
            { atributo: "Marca", valor: "EcoBeauty" }
        ],
        fotografia: createPlaceholderImage("Cosmético Vermelho", 400, 400, "DC143C"),
        informacao_adicional: "Batom natural vermelho."
    },
    {
        nome: "Creme de Cuidados da Pele",
        categoria: "Beleza",
        subcategoria: "Cuidados da Pele",
        preco: 29.99,
        especificidade: [
            { atributo: "Tipo", valor: "Hidratante" },
            { atributo: "Marca", valor: "EcoBeauty" },
            { atributo: "Volume", valor: "100ml" }
        ],
        fotografia: createPlaceholderImage("Creme", 400, 400, "F0E68C"),
        informacao_adicional: "Creme hidratante orgânico."
    },
    {
        nome: "Perfume Natural Floral",
        categoria: "Beleza",
        subcategoria: "Perfumes",
        preco: 49.99,
        especificidade: [
            { atributo: "Fragrância", valor: "Floral" },
            { atributo: "Marca", valor: "EcoBeauty" },
            { atributo: "Volume", valor: "50ml" }
        ],
        fotografia: createPlaceholderImage("Perfume Floral", 400, 400, "FFB6C1"),
        informacao_adicional: "Perfume natural com fragrância floral."
    },
    
    // ========== ALIMENTAÇÃO CATEGORY ==========
    {
        nome: "Alimento Orgânico Local",
        categoria: "Alimentação",
        subcategoria: "Orgânico",
        preco: 8.99,
        especificidade: [
            { atributo: "Tipo", valor: "Frutas" },
            { atributo: "Origem", valor: "Local" },
            { atributo: "Peso", valor: "500g" }
        ],
        fotografia: createPlaceholderImage("Alimento Orgânico", 400, 400, "90EE90"),
        informacao_adicional: "Alimento orgânico de origem local."
    },
    {
        nome: "Alimento Vegano Sustentável",
        categoria: "Alimentação",
        subcategoria: "Vegan",
        preco: 12.99,
        especificidade: [
            { atributo: "Tipo", valor: "Vegetais" },
            { atributo: "Origem", valor: "Nacional" },
            { atributo: "Peso", valor: "1kg" }
        ],
        fotografia: createPlaceholderImage("Alimento Vegano", 400, 400, "98FB98"),
        informacao_adicional: "Alimento vegano sustentável."
    },
    {
        nome: "Alimento Local Fresco",
        categoria: "Alimentação",
        subcategoria: "Local",
        preco: 6.99,
        especificidade: [
            { atributo: "Tipo", valor: "Hortaliças" },
            { atributo: "Origem", valor: "Local" },
            { atributo: "Peso", valor: "250g" }
        ],
        fotografia: createPlaceholderImage("Alimento Local", 400, 400, "7CFC00"),
        informacao_adicional: "Alimento local e fresco."
    }
];

// Core product initialization logic (doesn't manage connections)
async function initializeProductsCore() {
    // Ensure connection is ready before using models
    if (Mongoose.connection.readyState !== 1) {
        throw new Error('MongoDB connection is not ready. State: ' + Mongoose.connection.readyState);
    }
    
    // Check if products already exist
    const existingProducts = await ProdutoModel.countDocuments();
    if (existingProducts > 0) {
        console.log(`Products already exist (${existingProducts} found). Skipping product initialization.`);
        return;
    }

    // Get or create a mock supplier
    let fornecedor = await FornecedorModel.findOne({ email: "mock@supplier.com" });
    if (!fornecedor) {
        const bcrypt = require("bcrypt");
        const hashedPassword = await bcrypt.hash("supplier123", 10);
        fornecedor = await FornecedorModel.create({
            nome: "Fornecedor Mock",
            email: "mock@supplier.com",
            password: hashedPassword,
            morada: "Rua Mock, 123",
            nif: "123456789",
            telemovel: "912345678",
            validado: true
        });
        console.log("Created mock supplier");
    }

    // Get or create a mock production location
    let local = await LocalModel.findOne({ nome: "Local de Produção Mock" });
    if (!local) {
        local = await LocalModel.create({
            nome: "Local de Produção Mock",
            morada: "Rua Produção, 456",
            localidade: "Lisboa",
            cod_postal: "1000-001",
            pais: "Portugal",
            tipo: "local_producao",
            lon: "-9.1393",
            lat: "38.7223"
        });
        console.log("Created mock production location");
    }

    // Get or create a mock warehouse
    let armazem = await ArmazemModel.findOne({ fornecedor: fornecedor._id });
    if (!armazem) {
        // Create warehouse location
        let localArmazem = await LocalModel.findOne({ nome: "Armazém Mock" });
        if (!localArmazem) {
            localArmazem = await LocalModel.create({
                nome: "Armazém Mock",
                morada: "Rua Armazém, 789",
                localidade: "Lisboa",
                cod_postal: "1000-002",
                pais: "Portugal",
                tipo: "armazem",
                lon: "-9.1500",
                lat: "38.7300"
            });
        }
        
        const ArmazemGW = require("../gateway/ArmazemGat.js");
        armazem = await ArmazemGW.create(
            fornecedor._id.toString(),
            localArmazem._id.toString(),
            1000, // tamanho
            50    // gasto_diario
        );
        console.log("Created mock warehouse");
    }

    console.log('\n=== Initializing Products ===');

    for (const productData of mockProducts) {
        // Find category and subcategory
        const categoria = await CategoriaModel.findOne({ nome: productData.categoria });
        const subcategoria = await SubCategoriaModel.findOne({ 
            nome: productData.subcategoria,
            categoria: categoria._id 
        });

        if (!categoria || !subcategoria) {
            console.log(`Skipping ${productData.nome} - category/subcategory not found`);
            continue;
        }

        console.log(`Creating product: ${productData.nome}`);

        // Use subcategory image if product has placeholder image
        let productImage = productData.fotografia;
        if (productImage && productImage.startsWith('data:image/svg')) {
            // Product has placeholder, use subcategory image instead
            const subcategoryImage = getSubcategoryImage(productData.categoria, productData.subcategoria);
            if (subcategoryImage) {
                productImage = subcategoryImage;
                console.log(`  Using subcategory image: ${subcategoryImage}`);
            }
        }

        // Create product directly using the model
        const produto = await ProdutoModel.create({
            nome: productData.nome,
            fornecedor: fornecedor._id,
            categoria: categoria._id,
            subcategoria: subcategoria._id,
            informacao_adicional: productData.informacao_adicional,
            fotografia: [productImage],
            transporte_armazem: {
                distancia: 50,
                consumo: 2.5,
                emissao: 12.5,
                classificacao: 4,
                n_itens: 10,
                desperdicio: 0.5
            },
            armazenamento: {
                duracao: 30,
                consumo: 1.2,
                classificacao: 4
            }
        });

        // Also create historical record
        const ProdutoHistorico = require("../models/ProdutoHistorico.js");
        await ProdutoHistorico.create({
            _id: produto._id,
            nome: productData.nome,
            fornecedor: fornecedor._id,
            categoria: categoria._id,
            subcategoria: subcategoria._id,
            informacao_adicional: productData.informacao_adicional,
            fotografia: [productImage],
            transporte_armazem: produto.transporte_armazem,
            armazenamento: produto.armazenamento
        });

        // Create production data
        try {
            const CadeiaHandler = require("../handlers/CadeiaHandler.js").handler_cadeia;
            await CadeiaHandler.InsertProducao(
                produto._id.toString(),
                local._id.toString(),
                "Organica",
                [
                    { categoria: "Materiais naturais", nome: "Algodão", quantidade: 500 },
                    { categoria: "Fontes de Energia", nome: "Electricidade", quantidade: 10 }
                ],
                [
                    { nome: "Poluição aérea", quantidade: "baixa" }
                ]
            );
        } catch (err) {
            console.log(`  Warning: Could not create production data: ${err.message}`);
        }

        // Create specific products with price
        const ProdutoEspecificoGW = require("../gateway/ProdutoEspecificoGat.js");
        const AtributoModel = require("../models/Atributo.js");
        const ItemGW = require("../gateway/ItemGat.js");
        const ArmazemGW = require("../gateway/ArmazemGat.js");
        
        // Get all attributes for this subcategory
        let atributos = [];
        let atributoMap = {};
        if (subcategoria && subcategoria.atributos && subcategoria.atributos.length > 0) {
            atributos = await AtributoModel.find({ _id: { $in: subcategoria.atributos } });
            atributos.forEach(attr => {
                atributoMap[attr.nome] = attr._id.toString();
            });
        }

        // Determine if we need to create multiple size variants
        const tamanhos = productData.tamanhos || [];
        const sizeAttributeName = productData.especificidade.find(attr => 
            attr.atributo.includes("Tamanho") || attr.atributo === "Tamanho"
        )?.atributo;

        let variantsToCreate = [];
        if (tamanhos.length > 0 && sizeAttributeName) {
            // Create variants for each size
            for (const tamanho of tamanhos) {
                const variant = JSON.parse(JSON.stringify(productData));
                // Update the size attribute value
                const sizeAttr = variant.especificidade.find(attr => 
                    attr.atributo === sizeAttributeName || attr.atributo.includes("Tamanho")
                );
                if (sizeAttr) {
                    sizeAttr.valor = tamanho;
                }
                variantsToCreate.push(variant);
            }
        } else {
            // Single variant
            variantsToCreate.push(productData);
        }

        // Get current inventory
        const armazemData = await ArmazemGW.getById(armazem._id.toString());
        const inventario = armazemData.inventario || [];

        // Create each variant
        for (const variantData of variantsToCreate) {
            // Map attribute names to IDs
            const especificidade = [];
            if (atributos.length > 0) {
                for (const attrData of variantData.especificidade) {
                    const atributoId = atributoMap[attrData.atributo];
                    if (atributoId) {
                        especificidade.push({
                            atributo: atributoId,
                            valor: attrData.valor
                        });
                    } else {
                        console.log(`  Warning: Attribute "${attrData.atributo}" not found for subcategory "${subcategoria.nome}"`);
                    }
                }
            } else {
                // Fallback: use attribute names (may not work with frontend)
                console.log(`  Warning: Could not find attributes for subcategory "${subcategoria?.nome || 'unknown'}", using names as fallback`);
                variantData.especificidade.forEach(attr => {
                    especificidade.push({
                        atributo: attr.atributo,
                        valor: attr.valor
                    });
                });
            }

            const produtoEspecifico = await ProdutoEspecificoGW.create(
                fornecedor._id.toString(),
                produto._id.toString(),
                variantData.preco,
                especificidade
            );

            // Create items (stock) for this variant - 3-5 items per variant
            const itemsPerVariant = Math.floor(Math.random() * 3) + 3; // 3-5 items
            const items = [];
            for (let i = 0; i < itemsPerVariant; i++) {
                const item = await ItemGW.create(produtoEspecifico._id.toString());
                items.push(item._id);
            }

            // Add items to warehouse inventory
            let inventarioEntry = inventario.find(entry => 
                String(entry.produto) === String(produtoEspecifico._id)
            );
            
            if (inventarioEntry) {
                inventarioEntry.quantidade += itemsPerVariant;
                inventarioEntry.itens = inventarioEntry.itens.concat(items);
            } else {
                inventario.push({
                    produto: produtoEspecifico._id,
                    quantidade: itemsPerVariant,
                    itens: items
                });
            }
        }
        
        await ArmazemGW.updateInventario(armazem._id.toString(), inventario);

        const variantInfo = tamanhos.length > 0 ? ` (${tamanhos.length} tamanhos)` : "";
        console.log(`  ✓ Created: ${productData.nome} - €${productData.preco}${variantInfo} (with stock)`);
    }

    console.log('\n✓ Products initialized successfully!');
}

// Wrapper function that manages connection (for standalone use)
async function initializeProductsWrapper(useExistingConnection = false) {
    try {
        // Only create new connection if not using existing one
        if (!useExistingConnection) {
            await Mongoose.connect(connectionString, {
                serverSelectionTimeoutMS: 30000,
                socketTimeoutMS: 45000,
            });
            console.log('Connected to MongoDB');
        } else {
            // Check if already connected
            if (Mongoose.connection.readyState !== 1) {
                await Mongoose.connect(connectionString, {
                    serverSelectionTimeoutMS: 30000,
                    socketTimeoutMS: 45000,
                });
                console.log('Connected to MongoDB');
            } else {
                console.log('Using existing MongoDB connection');
            }
        }

        // Call core initialization logic
        await initializeProductsCore();

        // Only close connection if we created it
        if (!useExistingConnection) {
            await Mongoose.connection.close();
        }
    } catch (error) {
        console.error('Error initializing products:', error);
        console.error('Error details:', error.message);
        if (error.stack) {
            console.error('Error stack:', error.stack);
        }
        // Only close connection if we created it
        if (!useExistingConnection && Mongoose.connection.readyState === 1) {
            await Mongoose.connection.close();
        }
        // Only exit if called directly, not when imported
        if (require.main === module) {
            process.exit(1);
        } else {
            // Re-throw so calling function can handle it
            throw error;
        }
    }
}

// Legacy wrapper - kept for backward compatibility
async function initializeProducts(useExistingConnection = false) {
    return initializeProductsWrapper(useExistingConnection);
}

// Run if called directly
if (require.main === module) {
    initializeProducts();
}

module.exports = { initializeProducts, initializeProductsCore };

