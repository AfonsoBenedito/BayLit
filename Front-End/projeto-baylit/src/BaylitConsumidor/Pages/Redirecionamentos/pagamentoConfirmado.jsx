import React, { Component } from "react";

import apiInfo from "../../../apiInfo.json";

import { useSearchParams } from "react-router-dom";

function withSearch(Component) {
    return (props) => <Component {...props} params={useSearchParams()} />;
}

class confirmPagamento extends Component {
    constructor(props){
        super(props)

        let session = this.props.params[0].get("session_id");
        let encomenda = this.props.params[0].get("encomenda_id");

        this.state = {
            session: session,
            encomenda: encomenda
        }

    }

    async componentDidMount(){

        // let info = JSON.parse(localStorage.getItem('baylitInfo'))

        // console.log("Fui chamado")
        console.log(this.state.session)
        console.log(this.state.encomenda)

        let result = false
        let info = JSON.parse(localStorage.getItem('baylitInfo'))

        await fetch(
            apiInfo.apiLink + "/utilizador/checkout-confirm",
            {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    id: this.state.session,
                    encomenda_id: this.state.encomenda
                })
            }
        ).then((response) => response.json())
        .then((data) => {
            if (!data.code == 200) {
                window.location.href = "/Shoppingcar"
            }
        });

        await fetch(
            apiInfo.apiLink + "/utilizador/carrinho/compra/confirmar",
            {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + info.token,
                },
                body:JSON.stringify({
                    consumidor: info.id,
                    encomenda: this.state.encomenda
                })
            }
        ).then((resp) => resp.json())
        .then((dat) => {
            console.log(dat);
            if (dat.code == 200) {
                //Página de Confirmação de encomenda
                window.location.href = "/Perfil"
            } else {
                window.location.href = "/Shoppingcar"
            }
        });

        console.log(result)

            

    }


    render(){

        return <div>Página de Redirecionamento Pagamento</div>
    }

}

export default withSearch(confirmPagamento);