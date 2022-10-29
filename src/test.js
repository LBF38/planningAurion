require('dotenv').config();
var moment = require('moment');
var start = moment("2022-11-07");
var end = moment("2022-11-09");
var axios = require('axios');


// var data = JSON.stringify({
//   "params": {
//     "date_debut": start.format("YYYY-MM-DD"),
//     "date_fin": end.format("YYYY-MM-DD")
//   }
// });

async function getPlanning() {
    var config = {
        method: 'GET',
        url: '/mon_planning',
        baseURL: 'https://formation.ensta-bretagne.fr/mobile',
        headers: {
            'Authorization': 'Bearer ' + process.env.AURION_TOKEN,
            //     // 'Content-Type': 'application/json',
        },

        params: {
            "date_debut": start.format("YYYY-MM-DD"),
            "date_fin": end.format("YYYY-MM-DD"),
        },
    };

    try {
        const response = await axios(config);
        // console.log(response.data[2]);
        var data = response.data;
        for (let i = 0; i < data.length; i++) {
            if (data[i].is_empty){
                console.log("Pas de cours\n");
                continue
            }
            if (data[i].is_break){
                console.log("Pause");
                continue
            }
            console.log(
                `Nouveau cours : 
            ${data[i].favori.f3}
            ${data[i].type_activite}
            ${data[i].date_debut}
            ${data[i].date_fin}
            ${data[i].intervenants}
            ${data[i].favori.f2}
            ${data[i].description}`
            );
            // if (response.data[i].favori) {
            //     console.log(response.data[i].favori.f2);
            //     console.log(response.data[i].favori.f3);
            // }
        }
        // console.log("test");
    } catch (error) {
        console.error(error);
    }
}

// var response = axios.get(BASE_URL + "/mon_planning", {
//     "params": {
//         "date_debut": start.format("YYYY-MM-DD"),
//         "date_fin": end.format("YYYY-MM-DD")
//     }
// })
// console.log(response);
getPlanning();