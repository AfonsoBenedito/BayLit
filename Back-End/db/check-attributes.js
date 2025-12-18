// Quick script to check and fix attribute values
const Mongoose = require("mongoose");
const connectionString = process.env.MONGODB_URI || "mongodb://admin:admin123@mongodb:27017/Baylit?authSource=admin";

const AtributoModel = require("../models/Atributo.js");
const AtributoGW = require("../gateway/AtributoGat.js");

const attributeValuesMap = {
    "Cor": ["Azul", "Vermelho", "Verde", "Amarelo", "Preto", "Branco", "Rosa", "Cinza", "Laranja", "Roxo"],
    "Tamanho do Calçado": ["28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
    "Tamanho da Roupa": ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    "Idade": ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10", "10-12", "12+"],
    "Sexo": ["Masculino", "Feminino", "Unissex"],
    "Marca": ["Samsung", "Apple", "Nike", "Adidas", "Zara", "H&M", "Sony", "Microsoft", "Google", "Outra"],
    "Capacidade": ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"],
    "RAM": ["4GB", "8GB", "16GB", "32GB", "64GB"],
    "Armazenamento": ["128GB", "256GB", "512GB", "1TB", "2TB"],
    "Tamanho do Ecrã": ["7 polegadas", "8 polegadas", "10 polegadas", "12 polegadas", "13 polegadas", "15 polegadas", "17 polegadas", "20+ polegadas"],
    "Material": ["Algodão", "Poliester", "Couro", "Madeira", "Metal", "Plástico", "Vidro", "Cerâmica"],
    "Dimensões": ["Pequeno", "Médio", "Grande", "Personalizado"],
    "Estilo": ["Moderno", "Clássico", "Rústico", "Minimalista", "Industrial", "Boho"],
    "Potência": ["500W", "750W", "1000W", "1200W", "1500W", "2000W+"],
    "Tamanho": ["P", "M", "G", "Único"],
    "Tipo": ["Tênis", "Sapatilhas", "Botas", "Sandálias", "Chinelos"],
    "Autor": ["Vários", "Desconhecido"],
    "Editora": ["Várias", "Desconhecida"],
    "Idioma": ["Português", "Inglês", "Espanhol", "Francês", "Alemão"],
    "Fragrância": ["Floral", "Cítrico", "Amadeirado", "Oriental", "Fresco"],
    "Volume": ["30ml", "50ml", "100ml", "150ml", "200ml"],
    "Origem": ["Local", "Nacional", "Importado"]
};

async function checkAndFix() {
    try {
        await Mongoose.connect(connectionString);
        console.log('Connected to MongoDB');

        const atributos = await AtributoModel.find({});
        console.log(`Found ${atributos.length} attributes\n`);

        let updated = 0;
        for (const atributo of atributos) {
            const hasText = atributo.valores.length === 1 && atributo.valores[0] === "text";
            const isEmpty = atributo.valores.length === 0;
            
            if (hasText || isEmpty) {
                const valores = attributeValuesMap[atributo.nome] || [];
                if (valores.length > 0) {
                    await AtributoGW.addValores(atributo._id.toString(), valores);
                    console.log(`✓ Fixed "${atributo.nome}": ${valores.length} values`);
                    updated++;
                } else {
                    console.log(`⚠ No values for "${atributo.nome}"`);
                }
            } else {
                console.log(`✓ "${atributo.nome}": ${atributo.valores.length} values`);
            }
        }

        console.log(`\nUpdated ${updated} attributes`);
        await Mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    checkAndFix();
}

module.exports = { checkAndFix };

