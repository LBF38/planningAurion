require("dotenv/config");
const Data = require("../models/data");
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const { randomUUID } = require("crypto");
const apiURL = "https://formation.ensta-bretagne.fr/mobile";

exports.getPlanning = (req, res, next) => {
  console.log("Getting planning...");
  getPlanning()
    .then((calendar) => {
      const icsMSG = convertToICS(calendar);
      writeICS(icsMSG);
      res.status(200).json({
        message: "Planning récupéré",
        data: calendar,
      });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

async function getPlanning() {
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
    throw error;
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
  fs.writeFile("assets/aurion.ics", icsMSG, function (err) {
    if (err) {
      return console.log(err);
    }
  });
}
