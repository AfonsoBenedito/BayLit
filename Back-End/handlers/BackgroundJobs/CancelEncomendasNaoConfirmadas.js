const EncomendaGW = require("../../gateway/EncomendaGat")
require("../../conn");

async function CancelEncomendasNaoConfirmadas() {

    try {
        let encomendas = await EncomendaGW.getAllNaoConfirmadas()

        let now = new Date();
        for (let encomenda of encomendas) {
            var Difference_In_Time = now.getTime() - encomenda.data_encomenda.getTime();
            var Difference_In_Hours = Difference_In_Time / (60* 60 * 1000);

            if (Difference_In_Hours > 1) {
                await EncomendaGW.updateEstado(encomenda._id, "Cancelada")
            }
        }

        return "Atualização de encomendas canceladas completa"
    } catch (err) {
        console.log("ERROR! Não foi possivel cancelar encomendas – "+err)
    }
    
}

CancelEncomendasNaoConfirmadas().then((result) => console.log(result))