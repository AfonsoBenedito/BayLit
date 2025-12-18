import apiInfo from "../apiInfo.json";
import { getProduto, getProdutoEspecifico } from "./FornecedorHelper";

async function getEncomendasByConsumidor(id_consumidor, token){
      
    let result = false;
    
    await fetch(
        apiInfo.apiLink +
        "/utilizador/consumidor/encomenda?utilizador="+id_consumidor,
        {
        headers: {
            Authorization: "Bearer " + token,
        },
        }
    )
        .then((response) => response.json())
        .then((data) => {
            if (data.code == 200){
                result = data.data;
            }
        });
    
    return result;
      
      
}

async function getEncomendaById(id_consumidor, token, id_encomenda){

    let result = false;
    
    await fetch(
        apiInfo.apiLink +
        "/utilizador/consumidor/encomenda?utilizador="+id_consumidor + "&encomenda=" + id_encomenda,
        {
        headers: {
            Authorization: "Bearer " + token,
        },
        }
    )
        .then((response) => response.json())
        .then((data) => {
            if (data.code == 200){
                result = data.data;
            }
        });
    
    return result;

}

async function getVendasByFornecedor(id_fornecedor, token){
      
    let result = false;
    
    await fetch(
        apiInfo.apiLink +
        "/utilizador/fornecedor/venda?fornecedor="+id_fornecedor,
        {
        headers: {
            Authorization: "Bearer " + token,
        },
        }
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.code == 200){
                result = data.data;
            }
        });
    
    return result;
      
      
}

async function getTransportesByTransportador(id_transportador, token, estado){

    let stringEstado = ""

    if (estado != null){
        stringEstado = "&estado=" + estado
    }
      
    let result = false;
    
    await fetch(
        apiInfo.apiLink +
        "/produto/transporte?transportador="+id_transportador + stringEstado,
        {
        headers: {
            Authorization: "Bearer " + token,
        },
        }
    )
        .then((response) => response.json())
        .then((data) => {
            if (data.code == 200){
                result = data.data;
            }
        });
    
    return result;
      
      
}


async function getTransportesPossiveis(id_consumidor, token, id_local){

    let result = false;
    
    await fetch(
        apiInfo.apiLink +
        "/utilizador/carrinho/transportes_possiveis?consumidor=" + id_consumidor + "&local_entrega=" + id_local,
        {
        headers: {
            Authorization: "Bearer " + token,
        },
        }
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            if (data.code == 200){
                result = data.data.transportes;
            }
        });
    
    return result;

}

async function getTransporteById(id_transporte){

    let result = false;
    
    await fetch(
        apiInfo.apiLink +
        "/produto/transporte?transporte=" + id_transporte
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            if (data.code == 200){
                result = data.data;
            }
        });
    
    return result;

}

async function criarEncomenda(token, id_consumidor, id_local, id_transporte){


    let result = false;
    
    await fetch(apiInfo.apiLink + "/utilizador/carrinho/compra", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
            consumidor: id_consumidor,
            local_entrega: id_local,
            transporte: id_transporte
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.code == 200) {
                result = data.data;
            }
        });
    
    return result;
   

}

async function mudarEstadoTransporte(token, id_transporte, novo_estado){

    let result = false;
    
    await fetch(apiInfo.apiLink + "/produto/transporte", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
            id: id_transporte,
            novo_estado: novo_estado
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.code == 200) {
                result = data.data;
            }
        });
    
    return result;

}

async function mudarEstadoLocalizacaoTransporte(token, id_transporte, id_local, novo_estado){

    let result = false;
    
    await fetch(apiInfo.apiLink + "/produto/transporte/localizacao", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
            id: id_transporte,
            local: id_local,
            estado_local: novo_estado
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.code == 200) {
                result = data.data;
            }
        });
    
    return result;

}

async function cancelarTransporte(token, id_transporte){

    let result = false;
    
    await fetch(apiInfo.apiLink + "/produto/transporte", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
            transporte: id_transporte,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.code == 200) {
                result = data.data;
            }
        });
    
    return result;

}

async function cancelarEncomenda(id_consumidor, token, id_encomenda){

    let result = false;
    
    await fetch(apiInfo.apiLink + "/utilizador/consumidor/encomenda", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
            consumidor:id_consumidor,
            encomenda: id_encomenda
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.code == 200) {
                result = true
            }
        });
    
    return result;

}



export {getEncomendasByConsumidor, getTransportesPossiveis, getVendasByFornecedor, getTransportesByTransportador, getTransporteById, criarEncomenda, getEncomendaById, mudarEstadoTransporte, mudarEstadoLocalizacaoTransporte, cancelarTransporte, cancelarEncomenda}