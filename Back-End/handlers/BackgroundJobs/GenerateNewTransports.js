const MeioTransporteGW = require("../../gateway/MeioTransporteGat")
const TransporteGW = require("../../gateway/TransporteGat")
require("../../conn");

async function GenerateNewTransports() {

    const meios_transporte = await MeioTransporteGW.getAll();

    const today = new Date();
    const day = today.getDate(); 
    const month = today.getMonth();
    const year = today.getFullYear();

    for (let meio of meios_transporte) {
        let tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0)
        
        let tomorrow_transport = await TransporteGW.getByMeioAndDate(meio._id, tomorrow)

        if (tomorrow_transport == false) {
            await TransporteGW.create(meio.transportador, meio._id, [meio.sede, meio.sede], tomorrow)
        }

        let day_after_tomorrow = new Date(today);
        day_after_tomorrow.setDate(today.getDate() + 2);
        day_after_tomorrow.setHours(10, 0, 0, 0)

        let day_after_tomorrow_transport = await TransporteGW.getByMeioAndDate(meio._id, day_after_tomorrow)
        if (day_after_tomorrow_transport == false) {
            await TransporteGW.create(meio.transportador, meio._id, [meio.sede, meio.sede], day_after_tomorrow)
        }

        let days_after_tomorrow = new Date(today);
        days_after_tomorrow.setDate(today.getDate() + 3);
        days_after_tomorrow.setHours(10, 0, 0, 0)

        let days_after_tomorrow_transport = await TransporteGW.getByMeioAndDate(meio._id, days_after_tomorrow)

        if (days_after_tomorrow_transport == false) {
            await TransporteGW.create(meio.transportador, meio._id, [meio.sede, meio.sede], days_after_tomorrow)
        }
    }

    const transportes = await TransporteGW.getAllDisponiveis();

    for (let transporte of transportes) {
        var diff = Math.abs(transporte.data_inicio.getTime() - today.getTime()) / 3600000;

        if (diff < 36) {
            if (transporte.mercadoria.length == 0) {
                await TransporteGW.updateEstado(transporte._id, "Cancelado")
            } else {
                await TransporteGW.updateEstado(transporte._id, "Por iniciar")
            }
        }
    }
    

    return ("Transportes do dia "+day+"/"+month+"/"+year+" definidos.")

}

GenerateNewTransports().then((result) => console.log(result))