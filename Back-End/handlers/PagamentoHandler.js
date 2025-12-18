// const AdministradorGW = require("../gateway/AdministradorGat")
const ConsumidorGW = require("../gateway/ConsumidorGat")
const EncomendaGW = require("../gateway/EncomendaGat")

const { isObjectIdOrHexString } = require("mongoose")

// dotenv configuration
const dotenv = require('dotenv');
dotenv.config();

// Stripe disabled for Docker setup - using mock
// const stripe = require('stripe')(process.env.STRIPE_KEY);

// Mock Stripe for Docker setup
const stripe = {
    charges: {
        create: async (params) => {
            console.log('Mock Stripe charge:', params);
            return {
                id: `ch_mock_${Date.now()}`,
                status: 'succeeded',
                amount: params.amount,
                currency: params.currency || 'eur'
            };
        }
    },
    paymentIntents: {
        create: async (params) => {
            console.log('Mock Stripe payment intent:', params);
            return {
                id: `pi_mock_${Date.now()}`,
                status: 'succeeded',
                amount: params.amount,
                currency: params.currency || 'eur',
                client_secret: `pi_mock_${Date.now()}_secret`
            };
        }
    }
};

class HandlerPagamento {

    // Por acabar, necessário conexão com o front-end para incluir o stripe
    async InsertPagamento(consumidor_id, encomenda_id, valor, metodo){
        
        let consumidor = await ConsumidorGW.getById(consumidor_id);
        let encomenda = await EncomendaGW.getById(encomenda_id);

        if (consumidor) {
            if (encomenda) {
                if (consumidor._id == encomenda.comprador) {
                    if (valor == encomenda.valor.total) {
                        
                        // Realizar aqui o pagamento


                    } else {
                        throw {
                            code: 400,
                            message: "O valor não corresponde ao valor total da encomenda"
                        }
                    }
                } else {
                    throw {
                        code: 400,
                        message: "Esta encomenda não pertence a este consumidor"
                    }
                }
            } else {
                throw {
                    code: 400,
                    message: "Não existe nenhuma encomenda com esse ID"
                }
            }
        } else {
            throw {
                code: 400,
                message: "Não existe nenhum consumidor com esse ID"
            }
        }
        

        
    }
}

module.exports = {
    handler_pagamento: new HandlerPagamento()
}
