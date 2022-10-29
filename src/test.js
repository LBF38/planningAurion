require('dotenv').config();
var fs = require("fs");
var moment = require('moment');
var start = moment("2022-11-07");
var end = moment("2022-11-09");
var axios = require('axios');

async function getPlanning() {
    var config = {
        method: 'GET',
        url: '/mon_planning',
        baseURL: 'https://formation.ensta-bretagne.fr/mobile',
        headers: {
            'Authorization': 'Bearer ' + process.env.AURION_TOKEN,
        },

        params: {
            "date_debut": start.format("YYYY-MM-DD"),
            "date_fin": end.format("YYYY-MM-DD"),
        },
    };

    try {
        const response = await axios(config);
        // console.log(response.data[2]);
        var calendar = response.data;
        var ics = [];
        for (let i = 0; i < calendar.length; i++) {
            const event = calendar[i];
            if (event.is_empty) {
                console.log("Pas de cours\n");
                continue
            }
            if (event.is_break) {
                console.log("Pause");
                continue
            }
            event.date_debut=event.date_debut.replace(/[-:]|[.].*/g,'');
            event.date_fin=event.date_fin.replace(/[-:]|[.].*/g,'');
            // console.log(
            //     `Nouveau cours : 
            // ${event.favori.f3}
            // ${event.type_activite}
            // ${event.date_debut}
            // ${event.date_fin}
            // ${event.intervenants}
            // ${event.favori.f2}
            // ${event.description}`
            // );
            ics.push(event);
        }
        var icsMSG = convertToICS(ics);
        writeICS(icsMSG);
    } catch (error) {
        console.error(error);
    }
}

function convertToICS(calendar) {
    // Création du fichier ICS à partir des données récupérées
    // contenu du fichier ICS
    let icsMSG =
        "BEGIN:VCALENDAR\n" +
        "CALSCALE:GREGORIAN\n" +
        "METHOD:PUBLISH\n" +
        "PRODID:-//Aurion//FR\n" +
        "VERSION:2.0\n";

    // on ajoute chaque cours récupéré au contenu ICS
    for (let event of calendar) {
        icsMSG +=
            "BEGIN:VEVENT\n" +
            "DTSTART;TZID=Europe/Paris:" +                            // début de l'événement
            event.date_debut +
            "\n" +
            "DTEND;TZID=Europe/Paris:" +                              // fin de l'événement
            event.date_fin +
            "\n" +
            "SUMMARY:" +                            // titre
            // event.textIfExam + event.ecole + ' ' + event.salle + ' - ' + event.nomDuCours +
            event.favori.f3 +
            "\n" +
            "LOCATION:" +                           // Lieu
            event.favori.f2 +
            "\n" +
            "DESCRIPTION:" +                        // description
            event.type_activite + "\n" + "Intervenants : " + event.intervenants + "\n" + event.description +
            "\n" +
            "END:VEVENT\n";
    }

    // on ferme le calendrier
    icsMSG += "END:VCALENDAR";
    return icsMSG;
}
function writeICS(icsMSG) {
    console.log(icsMSG);
    fs.writeFile('aurion.ics', icsMSG, function (err) {
        if (err) { return console.log(err); }
    });
}
getPlanning();