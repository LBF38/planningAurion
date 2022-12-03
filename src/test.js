require("dotenv/config");
var fs = require("fs");
var moment = require("moment");
var start = moment("2022-11-07");
var end = moment("2022-11-09");
var axios = require("axios");
const { randomUUID } = require("crypto");
const apiURL = "https://formation.ensta-bretagne.fr/mobile";

async function getUserToken(username, password) {
  console.log("Getting User token...");
  var config = {
    method: "POST",
    url: "/login",
    baseURL: apiURL,
    data: {
      login: username,
      password: password,
    },
  };
  try {
    const response = await axios(config);
    process.env.AURION_TOKEN = response.data.normal;
    // return process.env.AURION_TOKEN != null;
  } catch (error) {
    console.error(error);
  }
}

async function getPlanning() {
  console.log("Get planning...");
  var config = {
    method: "GET",
    url: "/mon_planning",
    baseURL: apiURL,
    headers: {
      Authorization: "Bearer " + process.env.AURION_TOKEN,
    },
    params: {
      date_debut: start.format("YYYY-MM-DD"),
      date_fin: end.format("YYYY-MM-DD"),
    },
  };

  try {
    const response = await axios(config);
    var calendar = response.data;
    var ics = [];
    for (let i = 0; i < calendar.length; i++) {
      const event = calendar[i];
      if (event.is_empty) {
        // console.log("Pas de cours\n");
        continue;
      }
      if (event.is_break) {
        // console.log("Pause");
        continue;
      }
      if (!event.description) {
        event.description = "";
      }
      event.date_debut = event.date_debut.replace(/[-:]|[.].*/g, "");
      event.date_fin = event.date_fin.replace(/[-:]|[.].*/g, "");
      ics.push(event);
    }
    // console.log(ics);
    return ics;
  } catch (error) {
    console.error(error);
  }
}

function convertToICS(calendar) {
  console.log("Convert to ics ...");
  // Création du fichier ICS à partir des données récupérées
  let icsMSG = `BEGIN:VCALENDAR
CALSCALE:GREGORIAN
METHOD:PUBLISH
PRODID:-//Aurion//FR
VERSION:2.0
`;

  for (let event of calendar) {
    icsMSG += `BEGIN:VEVENT
UID:${randomUUID()}
DTSTAMP:${moment().format("YYYYMMDDThhmmss")}
DTSTART;TZID=Europe/Paris:${event.date_debut}
DTEND;TZID=Europe/Paris:${event.date_fin}
SUMMARY:${event.favori.f3}
LOCATION:${event.favori.f2}
DESCRIPTION:${event.type_activite}\\nIntervenants: ${event.intervenants}\\n${
      event.description
    }
END:VEVENT
`;
  }
  icsMSG += "END:VCALENDAR";
  return icsMSG;
}

function writeICS(icsMSG) {
  console.log("Write ics...");
  // console.log(icsMSG);
  fs.writeFile("aurion.ics", icsMSG, function (err) {
    if (err) {
      return console.log(err);
    }
  });
}

getUserToken(process.env.AURION_USERNAME, process.env.AURION_PASSWORD)
  .then(() => {
    console.log(process.env.AURION_TOKEN);
    getPlanning()
      .then((ics) => {
        // console.log(ics);
        var icsMSG = convertToICS(ics);
        console.log(icsMSG);
        writeICS(icsMSG);
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .catch((error) => {
    console.log(error);
  });


  