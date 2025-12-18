const express = require('express');
const router = express.Router();
const EncomendaGW = require('../../gateway/EncomendaGat')
const PagoGW = require('../../gateway/PagoGat')
const dotenv = require('dotenv');
dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_KEY)

router.post('/checkout-stripe', async (req, res) => {
    try{
        console.log(req.body)
        const encomenda = req.body.encomenda
        const encomenda_body = await EncomendaGW.getById(encomenda)
        const encomenda_price = encomenda_body["valor"]["total"]

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
                currency: "eur", 
                name: "Baylit", 
                amount: (encomenda_price * 100),
                quantity: 1
            }],
            success_url: 'https://baylit.store/Sucess?session_id={CHECKOUT_SESSION_ID}' + "&encomenda_id=" + encomenda,
            cancel_url: 'https://baylit.store/ShoppingCar'
        })

        res.send({
            id: session.id,
            url: session.url
        })
    } catch(e){
        console.error(e.message)
        res.status(500).send({error: e.message})
    }
})

router.post('/checkout-confirm', async (req, res) => {
    const id = req.body.id
    const encomenda = req.body.encomenda_id
    const session = await stripe.checkout.sessions.retrieve( id );

    if(session["payment_status"] == "paid"){
        try {
            await PagoGW.create(encomenda)

            res.status(200).send({
                code: 200,
                message:"Success",
            })
        } catch (err) {
            res.status(400).send({
                code: 400,
                message: "Pedido inválido",
            })
        }
    } else {
        res.status(400).send({
            code: 400,
            message: "Pedido inválido",
        })
    }

})

module.exports = router