router.post("/pagamento", api_auth.verifyToken, async (req, res) => {

    let authData
    try {
        authData = await api_auth.validateToken(req.token);

        if (authData.user.tipo != "Consumidor") {
            throw {
                code: 403,
                message: "Não tem autorização para efetuar este pedido"
            }
        }
    } catch (err) {
        res.json(err)
    }
    try {
        const body = req.body;
        if (body.hasOwnProperty('consumidor') && body.hasOwnProperty('encomenda')
         && body.hasOwnProperty('valor') && body.hasOwnProperty('metodo')) {

            const consumidor = htmlspecialchars(body.consumidor);
            const encomenda = htmlspecialchars(body.encomenda);
            const valor = htmlspecialchars(body.valor);
            const metodo = htmlspecialchars(body.metodo);

            // POR FAZER A PARTIR DAQUI –––––––––––––––––––––––––––––————————————

            if (authData.user.id == consumidor) {
                try {
                    const pagamento = await pagamento_handler.InsertPagamento(consumidor, encomenda, valor, metodo);

                    res.json({
                        code: 200,
                        message: "Success",
                        data: pagamento
                    })
                } catch (err) {
                    throw err
                }
            
            } else {
                throw {
                    code: 403,
                    message: "Não tem autorização para efetuar este pedido"
                }
            }
        } else {
            throw {
                code: 400,
                message: "Pedido inválido"
            }
        }
    } catch (err) {
        res.json({
            code: err.code,
            message: err.message
        })
    }
});