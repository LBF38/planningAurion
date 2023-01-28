require("dotenv/config");
import axios from "axios";
import path from "path";
import moment from "moment";
import fs from "fs";
import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import ical, { ICalCalendarMethod } from "ical-generator";
const debug = require("debug")("controllers:planning");

import UserCalendar from "../models/calendar";
import mongoose from "mongoose";
import UserController from "./user";

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
  debug("Getting planning...");
  debug(req.body);
  const username: string = req.cookies.username;
  if (username === undefined || username === null) {
    return res
      .status(400)
      .render("planning", { error: "Missing username parameter" });
  }
  const userCalendar = await UserCalendar.findOne({ username: username }).catch(
    (error) => {
      res.status(400).render("planning", { error: error.message });
    }
  );
  const aurionToken: string = userCalendar!.aurionToken;
  const icsLink: string = userCalendar!.calendarLink;

  _getPlanning(aurionToken, req.body.start_date, req.body.end_date)
    .then((calendar) => {
      const icsCalendar = convertToICS(calendar);
      saveToDatabase(icsCalendar, username);
      writeICS(icsCalendar, icsLink);
      debug("Planning sent");
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
  if (
    startDate === undefined ||
    startDate === null ||
    endDate === undefined ||
    endDate === null
  ) {
    throw new Error("Missing start_date or end_date parameter");
  }
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
    fs.writeFileSync(
      path.join(__dirname, "../assets", "raw_data.json"),
      JSON.stringify(calendar)
    );
    var ics = [];
    for (let i = 0; i < calendar.length; i++) {
      const event = calendar[i];
      if (event.is_empty) {
        continue;
      }
      if (event.is_break) {
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
    debug(error);
    throw error;
  }
}

function convertToICS(calendar: any[]) {
  debug("Convert to ics ...");
  // Création du fichier ICS à partir des données récupérées
  let icsMSG = `BEGIN:VCALENDAR
CALSCALE:GREGORIAN
METHOD:PUBLISH
PRODID:-//Aurion//FR
VERSION:2.0
`;
  // const icalendar = ical({ name: "Aurion Synchronizer", prodId: "//aurion-synchronizer.onrender.com//Aurion-Synchronizer//FR" });
  // icalendar.timezone("Europe/Paris");
  try {
    for (let event of calendar) {
      debug(event.date_debut);
      // icalendar.createEvent({
      //   start: new Date(),
      //   end: new Date(),
      //   summary: event.favori.f3,
      //   location: event.favori.f2,
      //   description: `${event.type_activite}\nIntervenants: ${event.intervenants}\n${event.description}`,
      // });
      icsMSG += `BEGIN:VEVENT
UID:${randomUUID()}
DTSTAMP:${moment().format("YYYYMMDDThhmmss")}
DTSTART;TZID=Europe/Paris:${event.date_debut}
DTEND;TZID=Europe/Paris:${event.date_fin}
SUMMARY:${event.favori.f3}
LOCATION:${event.favori.f2}
DESCRIPTION:${event.type_activite}\\nIntervenants: ${event.intervenants}\\n${
        String(event.description).replace(/\n/g, "\\n")
      }
END:VEVENT
`;
    }
  } catch (error) {
    debug(error);
  }
  // icalendar.save(path.join(__dirname, "../assets", "calendar.ics"));
  icsMSG += "END:VCALENDAR";
  debug("ICS converted");
  return icsMSG;
}

function saveToDatabase(icsCalendar: string, username: string) {
  debug("Save to database...");
  UserCalendar.findOneAndUpdate({ username: username })
    .then((userCalendar) => {
      if (!userCalendar) {
        throw new Error("User not found");
      }
      userCalendar.calendarContent = icsCalendar;
    })
    .catch((error) => {
      debug("[INFO] Error saving to database :" + error.message);
      return Error(`Error saving to database : ${error.message}`);
    });
}

function writeICS(icsMSG: string, icsFile: string) {
  debug("Write ics...");
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
  debug("ICS written");
}

async function updatePlannings() {
  const allUsers = await mongoose.connection.db
    .collection("usercalendars")
    .find()
    .toArray();
  for (let user of allUsers) {
    _getPlanning(user.aurionToken, moment().format(), moment().add(1, "year"))
      .then((calendar) => {
        const icsCalendar = convertToICS(calendar);
        saveToDatabase(icsCalendar, user.username);
        writeICS(icsCalendar, user.calendarLink);
      })
      .catch((error) => {
        debug(error);
      });
  }
}

async function updateMyPlanning(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const user = await UserController.getUser(request.cookies.username);
    _getPlanning(user.aurionToken, moment().format(), moment().add(1, "year"))
      .then((calendar) => {
        const icsCalendar = convertToICS(calendar);
        saveToDatabase(icsCalendar, user.username);
        writeICS(icsCalendar, user.calendarLink);
      });
    response.redirect("/planning/link");
  } catch (error: any) {
    response.status(400).render("planning", {
      error: `Error on updating planning :${error.message}`,
    });
  }
}

setTimeout(updatePlannings, 1000 * 60 * 60 * 24);

export default { showPlanningForm, getICSLink, getPlanning, updateMyPlanning };
