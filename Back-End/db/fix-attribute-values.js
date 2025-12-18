// Fix attribute values - update attributes that only have "text" with proper values

const Mongoose = require("mongoose");
const connectionString = process.env.MONGODB_URI || "mongodb://admin:admin123@mongodb:27017/Baylit?authSource=admin";

const AtributoModel = require("../models/Atributo.js");

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

async function fixAttributeValuesCore() {
    // Find all attributes
    const atributos = await AtributoModel.find({});
    console.log(`Found ${atributos.length} attributes`);

    let updated = 0;
    for (const atributo of atributos) {
        // Check if attribute only has "text" as value
        if (atributo.valores.length === 1 && atributo.valores[0] === "text") {
            const valores = attributeValuesMap[atributo.nome] || [];
            if (valores.length > 0) {
                await AtributoModel.updateOne(
                    { _id: atributo._id },
                    { $set: { valores: valores } }
                );
                console.log(`Updated "${atributo.nome}" with ${valores.length} values: ${valores.slice(0, 3).join(", ")}...`);
                updated++;
            } else {
                console.log(`Warning: No default values found for "${atributo.nome}"`);
            }
        } else if (!attributeValuesMap[atributo.nome] && atributo.valores.length > 0) {
            // Only warn if attribute has values but no mapping (not critical)
            console.warn(`Warning: No default values found for "${atributo.nome}"`);
        }
    }

    console.log(`\nUpdated ${updated} attributes with proper values.`);
}

async function fixAttributeValues() {
    try {
        await Mongoose.connect(connectionString);
        console.log('Connected to MongoDB');
        await fixAttributeValuesCore();
        await Mongoose.connection.close();
    } catch (error) {
        console.error('Error fixing attribute values:', error);
        if (require.main === module) {
            process.exit(1);
        } else {
            throw error;
        }
    }
}

// Run if called directly
if (require.main === module) {
    fixAttributeValues();
}

module.exports = { fixAttributeValues, fixAttributeValuesCore };

