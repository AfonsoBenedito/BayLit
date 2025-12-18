var axios = require('axios');
const LocalGW = require("../gateway/LocalGat")
const MeioTransporteGW = require("../gateway/MeioTransporteGat")
const TransporteGW = require("../gateway/TransporteGat")
const TransportadorGW = require("../gateway/TransportadorGat")

// dotenv configuration
const dotenv = require('dotenv');
dotenv.config();

const mapbox_token = process.env.MAPBOX_TOKEN;

class GeoHandler {

    async GetCoordinates(morada, codigo_postal, localidade) {

        let searchtext = morada + "," + codigo_postal + "," + localidade

        let response = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+searchtext+'.json?types=address&access_token='+mapbox_token)

        if (response.status == 200 && response.data.features.length > 0) {
            return response.data.features[0].geometry.coordinates
        } else {
            throw {
                code: 400,
                message: "O local não é válido"
            }
        }
    }

    async GetClosestItem(local_entrega, armazens) {

        let clonedArmazens = JSON.parse(JSON.stringify(armazens))
        let allDurations = []

        while (clonedArmazens.length > 0) {
            let locations = []

            locations.push({
                lon: local_entrega.lon,
                lat: local_entrega.lat
            })

            let limite = 0
            if (clonedArmazens.length > 24) {
                limite = 24
            } else {
                limite = clonedArmazens.length
            }
             
            for (let a = 0; a < limite; a++) {
                
                let local_armazem = await LocalGW.getById(clonedArmazens[0].localizacao)

                locations.push({
                    lon: local_armazem.lon,
                    lat: local_armazem.lat
                })
                clonedArmazens.splice(0, 1)
            }

            let response = await this.GetDrivingMatrixWithSource(locations)
            let durationsMatrix = response.data.durations[0]
            allDurations = allDurations.concat(durationsMatrix.slice(1))
        }

        let armazem_result = []
        for (let c = 0; c < armazens.length; c++) {
            armazem_result.push([armazens[c], allDurations[c]])
        }
        armazem_result.sort(function(a, b) {
            return a[1] - b[1];
        });
        
        //let minDuration = Math.min(...allDurations)
        //let indexArmazem = allDurations.indexOf(minDuration)
        //let armazem_result = armazens[indexArmazem]

        return armazem_result
    }

    // As 5 sedes de transportadores mais próximas do consumidor
    async getClosestTransportadores(local_entrega) {

        let pais = local_entrega.pais

        let sedes = await LocalGW.getSedesFromPais(pais);

        if (sedes.length > 5) {
            let clonedSedes = JSON.parse(JSON.stringify(sedes))
            let allDurations = []

            while (clonedSedes.length > 0) {
                let locations = []

                locations.push({
                    lon: local_entrega.lon,
                    lat: local_entrega.lat
                })

                let limite = 0
                if (clonedSedes.length > 24) {
                    limite = 24
                } else {
                    limite = clonedSedes.length
                }
                
                for (let a = 0; a < limite; a++) {
                    locations.push({
                        lon: clonedSedes[0].lon,
                        lat: clonedSedes[0].lat
                    })
                    clonedSedes.splice(0, 1)
                }

                let response = await this.GetDrivingMatrixWithSource(locations)
                let durationsMatrix = response.data.durations[0]
                allDurations = allDurations.concat(durationsMatrix.slice(1))
            }

            let results = []
            let roof
            if (sedes.length < 5) {
                roof = sedes.length
            } else {
                roof = 5
            }

            for (let i = 0; i < roof; i++) {
                let minDuration = Math.min(...allDurations)
                let indexSede = allDurations.indexOf(minDuration)
                let sede_result = sedes[indexSede]
                results.push(sede_result)

                allDurations.splice(indexSede, 1)
                sedes.splice(indexSede, 1)
            }

            return results
        } else {
            return sedes
        }

    }

    async AddLocaisToTransporte(transporte, stops_fornecedores, local_entrega) {

        let items_adicionais = []
        for (let stop of stops_fornecedores) {
            let produto_especifico = stop[0]
            let items = stop[1]
            let armazem = stop[2].localizacao

            for (let item of items) {
                let mercadoria = {
                    produto_especifico: produto_especifico,
                    item: item,
                    local_recolha: armazem,
                    local_entrega: local_entrega._id,
                }

                await TransporteGW.addMercadoria(transporte._id, mercadoria)
            }
        }

        let transporte_depois_mercadoria = await TransporteGW.getById(transporte._id)

        let prev_locais_transporte = []
        
        let sede_local = await LocalGW.getById(transporte.rota[0])
        let sede_local_geo = {
            id: transporte.rota[0],
            lon: sede_local.lon,
            lat: sede_local.lat,
            pickup: [],
            entregar: []
        }
        prev_locais_transporte.push(sede_local_geo)

        let locais = []
        for (let mercado of transporte_depois_mercadoria.mercadoria) {
            if (locais.includes(String(mercado.local_entrega))) {
                for (let local_transporte of prev_locais_transporte) {
                    if (String(local_transporte.id) == String(mercado.local_entrega)) {
                        local_transporte.entregar.push(mercado.item)
                    }
                }
            } else {
                let transporte_local = await LocalGW.getById(mercado.local_entrega)
                let transporte_local_geo = {
                    id: mercado.local_entrega,
                    lon: transporte_local.lon,
                    lat: transporte_local.lat,
                    pickup: [],
                    entregar: [mercado.item]
                }
                prev_locais_transporte.push(transporte_local_geo)
                locais.push(String(mercado.local_entrega))
            }

            if (locais.includes(String(mercado.local_recolha))) {
                for (let local_transporte of prev_locais_transporte) {
                    if (String(local_transporte.id) == String(mercado.local_recolha)) {
                        local_transporte.pickup.push(mercado.item)
                    }
                }
            } else {
                let transporte_local = await LocalGW.getById(mercado.local_recolha)
                let transporte_local_geo = {
                    id: mercado.local_recolha,
                    lon: transporte_local.lon,
                    lat: transporte_local.lat,
                    pickup: [mercado.item],
                    entregar: []
                }
                prev_locais_transporte.push(transporte_local_geo)
                locais.push(String(mercado.local_recolha))
            }
        }

        return await this.CalculateTransporte(transporte, prev_locais_transporte)
    }

    async CalculateTransporte(transporte, prev_locais_transporte) {

        let responseMatrix = await this.GetDrivingMatrix(prev_locais_transporte)

        let matrixDuracoes = responseMatrix.data.durations
        let matrixDistancias = responseMatrix.data.distances

        // locais {local, pickup: [itens], entregar: [itens]}
        
        let path = await this.BestPossiblePathDelivery(matrixDuracoes, matrixDistancias, prev_locais_transporte)

        let distancia_total = 0
        for (let dis of path.distancias) {
            distancia_total += dis
        }
        let km_total = distancia_total / 1000 

        await TransporteGW.updateDistancia(transporte._id, km_total)
        let novo_transporte = await TransporteGW.updateRota(transporte._id, path.path)

        let total_itens = novo_transporte.mercadoria.length

        let meio_transporte = await MeioTransporteGW.getById(novo_transporte.meio_transporte)
        let consumo = + parseFloat(meio_transporte.consumo).toFixed(2)
        let emissao = + parseFloat(meio_transporte.emissao).toFixed(2)
        let consumo_total = consumo / 100 * km_total
        let emissao_total = emissao * km_total

        // tier 1: 50 km, 11 l/100km, 300 gco2/km, >20 itens – TOTAL 50*(11+300) / 20 = 778
        // tier 2: 100 km, 19 l/100km, 504 gco2/km, 20 itens – TOTAL 100*(19+504) / 20 = 2615
        // tier 3: 200 km, 26 l/100km, 708 gco2/km, 10 itens – TOTAL 200*(26+708) / 10 = 14680
        // tier 4: 500 km, 34 l/100km, 912 gco2/km, 5 itens – TOTAL 500*(34+912) / 5 = 94600
        // tier 5: >500 km, >34 l/100km, >912 gco2/km, <5 itens
        let rating = (km_total * (consumo + emissao)) / total_itens 

        let classificacao
        if (rating < 778) {
            classificacao = 5
        } else if (rating < 2615) {
            classificacao = 4
        } else if (rating < 14680) {
            classificacao = 3
        } else if (rating < 94600) {
            classificacao = 2
        } else if (rating >= 94600) {
            classificacao = 1
        }

        novo_transporte = await TransporteGW.updateCadeia(transporte._id, consumo_total, emissao_total, classificacao)

        return novo_transporte
    }

    async GeneratePossibleTransportations(stops_fornecedores, local_entrega) {

        let sedes = await this.getClosestTransportadores(local_entrega)

        if (sedes.length == 0) {
            throw {
                code: 400,
                message: "Infelizmente ainda não existem transportadores registados para transportar a sua encomenda"
            }
        }
        
        let allTransportes = []
        for (const sede of sedes) {

            let meios_transporte = await MeioTransporteGW.getBySede(sede._id)
            let transportes = []

            if (meios_transporte) {
                for (let meio_transporte of meios_transporte) {
                    let transportes_meio = await TransporteGW.getDisponiveisByMeio(meio_transporte._id);
                    if (transportes_meio) {
                        function compare_meios(a, b) {
                            if ( a.classificacao > b.classificacao ){
                              return -1;
                            }
                            if ( a.classificacao < b.classificacao ){
                              return 1;
                            }
                            if ( a.classificacao == b.classificacao ){
                                if (a.data_inicio > b.data_inicio) {
                                    return 1;
                                }
                                if (a.data_inicio < b.data_inicio) {
                                    return -1
                                }
                                if (a.data_inicio == b.data_inicio) {
                                    if (a.custo > b.custo) {
                                        return 1
                                    }
                                    if (a.custo < b.custo) {
                                        return -1
                                    }
                                    return 0
                                }
                                return 0;
                            }
                            return 0;
                        }
                        let sorted_transportes = transportes_meio.sort(compare_meios)
                        transportes = transportes.concat(sorted_transportes[0])
                    }
                }
                allTransportes = allTransportes.concat(transportes)
            }
            
        }

        let possible_transports = []
        if (allTransportes.length > 0) {
            let check_path = []
            let prev_locais_transporte = []
            let produtos_a_entregar = []
            let total_itens_prev = 0
            // stops fornecedores = [produto, armazem]
            for (let stop of stops_fornecedores) {
                if (!check_path.includes(String(stop[1].localizacao))) {
                    let armazem_local = await LocalGW.getById(stop[1].localizacao)
                    let armazem_local_geo = {
                        id: stop[1].localizacao,
                        lon: armazem_local.lon,
                        lat: armazem_local.lat,
                        pickup: [stop[0].produto],
                        entregar: []
                    }

                    prev_locais_transporte.push(armazem_local_geo)
                    check_path.push(String(stop[1].localizacao))
                } else {
                    for (let check of prev_locais_transporte) {
                        if (String(check.id) ==  String(stop[1].localizacao)) {
                            check.pickup.push(stop[0].produto)
                        }
                    }
                }
                total_itens_prev += stop[0].quantidade
                produtos_a_entregar.push(stop[0].produto)
            }
            
            let local_entrega_geo = {
                id: local_entrega._id,
                lon: local_entrega.lon,
                lat: local_entrega.lat,
                pickup: [],
                entregar: produtos_a_entregar
            }

            prev_locais_transporte.push(local_entrega_geo)
            for (let transporte of allTransportes) {

                let prev_transporte = []

                let sede_local = await LocalGW.getById(transporte.rota[0])
                let sede_local_geo = {
                    id: transporte.rota[0],
                    lon: sede_local.lon,
                    lat: sede_local.lat,
                    pickup: [],
                    entregar: []
                }
                
                prev_transporte.push(sede_local_geo)

                prev_transporte = prev_transporte.concat(prev_locais_transporte)

                for (let local_path of transporte.rota.slice(1, transporte.rota.length - 1)) {
                    let local_already_in_path = false

                    let local_path_str = String(local_path)
                    for (let prev_local of prev_locais_transporte) {
                        prev_local = String(prev_local.id)
                        if (local_path_str == prev_local) {
                            local_already_in_path = true
                        }
                    }

                    let a_entregar = []
                    let a_recolher = []
                    for (let merca of transporte.mercadoria) {
                        if (String(merca.local_entrega) == String(local_path)) {
                            a_entregar.push(merca.produto_especifico)
                        }
                        if (String(merca.local_recolha) == String(local_path)) {
                            a_recolher.push(merca.produto_especifico)
                        }
                    }


                    if (!local_already_in_path) {
                        let local_path_bd = await LocalGW.getById(local_path)
                        let local_path_geo = {
                            id: local_path_bd._id,
                            lon: local_path_bd.lon,
                            lat: local_path_bd.lat,
                            pickup: a_recolher,
                            entregar: a_entregar
                        }
                        prev_transporte.push(local_path_geo)
                    } else {
                        for (let prev_t of prev_transporte) {
                            if (String(prev_t.id) == String(local_path)) {
                                prev_t.pickup = prev_t.pickup.concat(a_recolher)
                                prev_t.entregar = prev_t.entregar.concat(a_entregar)
                            }
                        }
                    }
                    
                }            

                if (prev_transporte.length <= 24) {
                    let responseMatrix = await this.GetDrivingMatrix(prev_transporte)

                    let matrixDuracoes = responseMatrix.data.durations
                    let matrixDistancias = responseMatrix.data.distances

                    // locais {local, pickup: [itens], entregar: [itens]}
                    
                    let path = await this.BestPossiblePathDelivery(matrixDuracoes, matrixDistancias, prev_transporte)

                    let meio = transporte.meio_transporte
                    let meio_bd = await MeioTransporteGW.getById(meio)

                    path.transporte = transporte._id
                    path.meio_transporte = meio_bd.tipo + " " + meio_bd.marca + " " + meio_bd.modelo

                    let distancia_total = 0
                    for (let dis of path.distancias) {
                        distancia_total += dis
                    }
                    let km_total = distancia_total / 1000 

                    let total_itens = transporte.mercadoria.length + total_itens_prev

                    path.consumo_total = + parseFloat(meio_bd.consumo / 100 * km_total).toFixed(2)
                    path.emissao_total = + parseFloat(meio_bd.emissao * km_total).toFixed(2)

                    path.consumo_item = + parseFloat((meio_bd.consumo / 100 * km_total) / total_itens).toFixed(2)
                    path.emissao_item = + parseFloat((meio_bd.emissao * km_total) / total_itens).toFixed(2)

                    let transportador = await TransportadorGW.getById(transporte.transportador)
                    path.portes = transportador.portes_encomenda

                    path.transportador = {
                        _id: transportador._id,
                        nome: transportador.nome
                    }

                    var now = new Date();

                    // To calculate the time difference of two dates
                    var Difference_In_Time = transporte.data_inicio.getTime() - now.getTime();
                    
                    // To calculate the no. of days between two dates
                    var Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

                    path.data = transporte.data_inicio.toLocaleString('pt-PT', { timeZone: 'UTC' })
                    path.dias_entrega = Difference_In_Days

                    let rating = (km_total * (meio_bd.consumo + meio_bd.emissao)) / total_itens 
                    
                    let classificacao
                    if (rating < 778) {
                        classificacao = 5
                    } else if (rating < 2615) {
                        classificacao = 4
                    } else if (rating < 14680) {
                        classificacao = 3
                    } else if (rating < 94600) {
                        classificacao = 2
                    } else if (rating >= 94600) {
                        classificacao = 1
                    }
                    path.classificacao = classificacao

                    possible_transports.push(path)
                }
            }
        } else {
            throw {
                code: 400,
                message: "Infelizmente ainda não existem transportes registados para transportar a sua encomenda"
            }
        }
        
        return possible_transports
    }

    async GetDistanceBetween(lon1, lat1, lon2, lat2) {

        let searchtext = lon1 + "," + lat1 + ";" +  lon2 + "," + lat2

        let distance = await axios.get('https://api.mapbox.com/directions/v5/mapbox/driving/'+searchtext+'?alternatives=false&continue_straight=false&geometries=geojson&overview=simplified&steps=false&access_token='+mapbox_token)

        return distance
    }

    async GetDrivingMatrix(locations) {

        let searchtext = await this.GenerateCoordinatesString(locations)

        let response = await axios.get('https://api.mapbox.com/directions-matrix/v1/mapbox/driving/'+searchtext+'?annotations=distance,duration&access_token='+mapbox_token)
        if (response.data.code == "Ok") {
            return response
        } else {
            throw {
                code: 400,
                message: "Não foi possivel calcular o transporte pretendido"
            }
        }
        

    }

    async GetDrivingMatrixWithSource(locations) {

        let searchtext = await this.GenerateCoordinatesString(locations)

        let response = await axios.get('https://api.mapbox.com/directions-matrix/v1/mapbox/driving/'+searchtext+'?sources=0&annotations=distance,duration&access_token='+mapbox_token)

        return response

    }

    async GenerateCoordinatesString(locations) {
        let searchtext = ""
        let counter = 0
        for (const location of locations) {
            counter++
            if (counter == locations.length) {
                searchtext += location.lon + "," + location.lat
            } else {
                searchtext += location.lon + "," + location.lat + ";"
            }
        }
        return searchtext
    }

    async ShortestDistanceArmazens(matrix_distances) {
        let total_distance = 0
        let path = [0]
        let currentLocation = 0

        while (path.length != matrix_distances.length) {

            if (matrix_distances[currentLocation][currentLocation] == 0) {
                matrix_distances[currentLocation][currentLocation] = Infinity
            }

            let min_distance = Infinity
            let location_index = 0
            let next
            for (const distance of matrix_distances[currentLocation]) {
                
                if (distance < min_distance && !path.includes(location_index)) {
                    next = distance
                }
                location_index ++
            }
            path.push(location_index)
            total_distance += next
        }

        return total_distance

    }

    BestPossiblePathDelivery(matrix_durations, matrix_distances, locais) {
        // locais {local, pickup: [itens], entregar: [itens]}
        
        let currentLocation = 0
        let path = [0]
        let path_ids = [locais[0].id]
        let duracoes = []
        let distancias = []
        let mercadoria = []

        while (path.length != matrix_durations.length) {

            if (matrix_durations[currentLocation][currentLocation] == 0) {
                matrix_durations[currentLocation][currentLocation] = Infinity
            }

            let next = [0, Infinity]

            let location_index = 0
            for (const duration of matrix_durations[currentLocation]) {
                
                let entrega_local = locais[location_index].entregar
                if (entrega_local.every(element => mercadoria.indexOf(element) > -1) && !path.includes(location_index)) {
                    
                    if (duration < next[1]) {
                        next = [location_index, duration, matrix_distances[currentLocation][location_index]]
                    }
                }
                location_index++
            }

            path.push(next[0])
            currentLocation = next[0]
            mercadoria = mercadoria.concat(locais[next[0]].pickup)
            path_ids.push(locais[next[0]].id)
            duracoes.push(next[1])
            distancias.push(next[2])

        }

        let last_stop = path[path.length - 1]
        path.push(0)
        duracoes.push(matrix_durations[last_stop][0])
        distancias.push(matrix_distances[last_stop][0])
        path_ids.push(locais[0].id)
        
        //console.log(duracoes)
        return {"path": path_ids,
        "duracoes": duracoes,
        "distancias": distancias}
    }
}

let local = {
    nome: "sede",
    lon: -8.018327,
    lat: 39.254415,
    pickup: [],
    entregar: []
}

let armazem1 = {
    nome: "armazem1",
    lon: -7.885969,
    lat: 39.053722,
    pickup: [1234, 12],
    entregar: []
}

let armazem2 = {
    nome: "armazem2",
    lon: -9.182652,
    lat: 38.744248,
    pickup: [123],
    entregar: []
}

let cliente1 = {
    nome: "cliente1",
    lon: -8.018960,
    lat: 39.254406,
    pickup: [],
    entregar: [12, 123, 1234]
}

let armazem3 = {
    nome: "armazem3",
    lon: -8.246986,
    lat: 39.179661,
    pickup: [1],
    entregar: []
}

let cliente2 = {
    nome: "cliente2",
    lon: -8.169836,
    lat: 39.077851,
    pickup: [],
    entregar: [1, 123]
}


let arma = []
arma.push(local)
arma.push(armazem1)
arma.push(armazem2)
arma.push(armazem3)
arma.push(cliente1)
arma.push(cliente2)

let hand = new GeoHandler()
//hand.GetClosestItem(local, arma).then((result) => {console.log(result)})
//hand.getClosestTransportadores(local).then((result) => {console.log(result)})
//hand.GetDrivingMatrix(arma).then((result) => {console.log(result.data)})

/*
hand.GetDrivingMatrix(arma).then((result) => {

    let matrix_durations = result.data.durations
    let matrix_distances = result.data.distances

    let locais = [local, armazem1, armazem2, armazem3, cliente1, cliente2]

    console.log(hand.BestPossiblePath(matrix_durations, matrix_distances, locais))
})
*/
/*
let matrix = [[0, 20, 25, 30], 
                [35, 0, 30, 45], 
                [15, 35, 0, 20], 
                [20, 35, 50, 0]]

let locais = [local, armazem1, armazem2, armazem3]

console.log(hand.BestPossiblePath(matrix, locais))
*/

module.exports = {
    geo_handler: new GeoHandler()
}