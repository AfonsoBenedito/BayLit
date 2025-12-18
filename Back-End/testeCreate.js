const Mongoose = require("mongoose");
const Administrador = require("./models/Administrador");
const Armazem = require("./models/Armazem");
const Armazenamento = require("./models/Armazenamento");
const Cartao = require("./models/Cartao");
const Condutor = require("./models/Condutor");
const Consumidor = require("./models/Consumidor");
const Desconto = require("./models/Desconto");
const Encomenda = require("./models/Encomenda");
const Etapa = require("./models/Etapa");
const Fornecedor = require("./models/Fornecedor");
const FuncionarioArmazem = require("./models/FuncionarioArmazem");
const Item = require("./models/Item");
const MeioTransporte = require("./models/MeioTransporte");
const Mensagem = require("./models/Mensagem");
const MetodoPagamento = require("./models/MetodoPagamento");
const Pagamento = require("./models/Pagamento");
const PayPal = require("./models/PayPal");
const Poluicao = require("./models/Poluicao");
const Producao = require("./models/Producao");
const Produto = require("./models/Produto");
const ProdutoEspecifico = require("./models/ProdutoEspecifico");
const Promocao = require("./models/Promocao");
const Recurso = require("./models/Recurso");
const Review = require("./models/Review");
const Transportador = require("./models/Transportador");
const Transporte = require("./models/Transporte");
const Utilizador = require("./models/Utilizador");

async function test() {
  await require("./conn");

  testInsert()

  Mongoose.connection.close()
}

async function testInsert(){
  /*
    Consumidor.create({nome:'Afonso', email:'bla', password:'123'})
    Administrador.create({nome:'Admin', password:'123'})
    Fornecedor.create({nome:'Brinquedos Lda.', email:'bla', password:'123'})

    var fornecedor =  await Fornecedor.findOne({nome: "Brinquedos Lda." }).exec();
    console.log(fornecedor._id)
    
    Armazem.create({fornecedor: fornecedor._id, localizacao:'algures', tamanho: 20, gasto_diario: 5})
    */
}

test()








