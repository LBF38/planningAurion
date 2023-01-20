require("dotenv/config");
import axios from "axios";
import path from "path";
import moment from "moment";
import fs from "fs";
import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import UserCalendar from "../models/calendar";

const apiURL: string = "https://formation.ensta-bretagne.fr/mobile";

function showPlanningForm(req: Request, res: Response, next: NextFunction) {
  res.render("planning", { username: req.cookies.username });
}

async function getICSLink(req: Request, res: Response, next: NextFunction) {
  const username: string = req.cookies.username;
  if (!username) {
    return res.status(400).render("planning", { error: "Missing username" });
  }
  try {
    const calendarLink: string = await UserCalendar.findOne({
      username: username,
    }).then((userCalendar) => {
      if (!userCalendar) {
        throw new Error("User not found");
      }
      return userCalendar.calendarLink;
    });
    res.render("planning", { icsLink: `/assets/${calendarLink}` });
  } catch (error: any) {
    res.status(400).render("planning", { error: error.message });
  }
}

async function getPlanning(req: Request, res: Response, next: NextFunction) {
  console.log("Getting planning...");
  console.log(req.body);
  const username: string = req.cookies.username;
  console.log(username);
  console.log(req.cookies.username);
  if (username === undefined || username === null) {
    return res
      .status(400)
      .render("planning", { error: "Missing username parameter" });
  }
  const userCalendar = await UserCalendar.findOne({ username: username });
  const aurionToken: string = userCalendar!.aurionToken;
  const icsLink: string = userCalendar!.calendarLink;

  _getPlanning(aurionToken, req.body.start_date, req.body.end_date)
    .then((calendar) => {
      const icsMSG = convertToICS(calendar);
      writeICS(icsMSG, icsLink);
      console.log("Planning sent");
      res.redirect("/planning/link");
    })
    .catch((error) => {
      res.status(400).render("planning", {
        error: `Error retrieving planning :${error.message}`,
      });
    });
}

async function _getPlanning(
  aurionToken: string,
  startDate: moment.MomentInput,
  endDate: moment.MomentInput
) {
  // @ts-ignore
  if (startDate > endDate) {
    throw new Error("start_date must be before end_date");
  }
  try {
    var config = {
      method: "GET",
      url: "/mon_planning",
      baseURL: apiURL,
      headers: {
        Authorization: `Bearer ${aurionToken}`,
      },
      params: {
        date_debut: moment(startDate).format("YYYY-MM-DD"),
        date_fin: moment(endDate).format("YYYY-MM-DD"),
      },
    };

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
    return ics;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function convertToICS(calendar: any[]) {
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
  console.log("ICS converted");
  return icsMSG;
}

function writeICS(icsMSG: string, icsFile: string) {
  console.log("Write ics...");
  const filePath = path.join(__dirname, "../assets", icsFile);
  const assetsDir = path.dirname(filePath);
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
  }
  fs.writeFile(filePath, icsMSG, function (err) {
    if (err) {
      throw new Error(`Error writing ICS file : ${err.message}`);
    }
  });
  console.log("ICS written");
}

export default { showPlanningForm, getICSLink, getPlanning };
