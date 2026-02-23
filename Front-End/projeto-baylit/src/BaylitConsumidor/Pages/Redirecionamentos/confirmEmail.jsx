import React, { Component } from "react";

import apiInfo from "../../../apiInfo.json";

import { useSearchParams } from "react-router-dom";

function withSearch(Component) {
    return (props) => <Component {...props} params={useSearchParams()} />;
  }

class confirmEmail extends Component {
    constructor(props){
        super(props)

        let code = this.props.params[0].get("code");

        this.state = {
            code: code
        }

    }

    async componentDidMount(){

        let info = JSON.parse(localStorage.getItem('baylitInfo'))


        let result = false


        if (info){

            if (info.logged == "false" && info.tipo == "NaoAutenticado"){

                let mensagem = {
                    verificacao: this.state.code,
                    id_nao_autenticado: info.id
                }
                
    
                await fetch(
                    apiInfo.apiLink + "/auth/register/verificar",
                    {
                        method: "POST",
                        headers:{
                            "Content-Type": "application/json"
                        },
                        body:JSON.stringify(mensagem)
                    }
                ).then((response) => response.json())
                .then((data) => {
                    if (data.code == 201){
    
                        localStorage.removeItem('baylitInfo');
    
                        let toStorage = {
                            token: data.data.auth_token,
                            id: data.data.user.id,
                            logged: "true",
                            tipo: data.data.user.tipo,
                        };
    
                        localStorage.setItem("baylitInfo", JSON.stringify(toStorage));
    
    
    
                        result = data.data.user.tipo
                    }
                    
                })
    
                if (result != false){
    
                    switch (result){
                        case "Consumidor":
                            window.location.href = "/Shop"
                            break;
                        case "Fornecedor":
                        case "Transportador":
                            window.location.href = "/Dashboard"
                            break;
                    }
    
                } else {
                    window.location.href = "/"
                }

                
    
            } else {
                window.location.href = "/"
    
            }

        } else {

            let mensagem = {
                verificacao: this.state.code,
            }
        

            await fetch(
                apiInfo.apiLink + "/auth/register/verificar",
                {
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body:JSON.stringify(mensagem)
                }
            ).then((response) => response.json())
            .then((data) => {
                if (data.code == 201){

                    localStorage.removeItem('baylitInfo');

                    let toStorage = {
                        token: data.data.auth_token,
                        id: data.data.user.id,
                        logged: "true",
                        tipo: data.data.user.tipo,
                    };

                    localStorage.setItem("baylitInfo", JSON.stringify(toStorage));



                    result = data.data.user.tipo
                }
                
            })

            if (result != false){

                switch (result){
                    case "Consumidor":
                        window.location.href = "/Shop"
                        break;
                    case "Fornecedor":
                    case "Transportador":
                        window.location.href = "/Dashboard"
                        break;
                }

            } else {
                window.location.href = "/"
            }

        }

    }


    render(){

        return <div>Página de Redirecionamento Email</div>
    }

}

export default withSearch(confirmEmail);