require("dotenv/config");
import axios from "axios";
import moment from "moment";
import fs from "fs";
import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";

class PlanningController {
  apiURL: string = "https://formation.ensta-bretagne.fr/mobile";

  showPlanningForm(req: Request, res: Response, next: NextFunction) {
    res.render("planning");
  }

  getICSLink(req: Request, res: Response, next: NextFunction) {
    res.render("planning", { icsLink: "/assets/aurion.ics" });
  }

  getPlanning(req: Request, res: Response, next: NextFunction) {
    console.log("Getting planning...");
    console.log(req.body);
    this._getPlanning(req.body.start_date, req.body.end_date)
      .then((calendar) => {
        const icsMSG = this.convertToICS(calendar);
        this.writeICS(icsMSG);
        console.log("Planning sent");
        res.redirect("/planning/link");
      })
      .catch((error) => {
        // res.status(400).json({ error: error });
        res
          .status(400)
          .render("planning", { error: "Error retrieving planning" });
        // res.status(400).redirect("/planning?start_date=" + req.body.start_date + "&end_date=" + req.body.end_date);
      });
  }

  async _getPlanning(
    startDate: moment.MomentInput,
    endDate: moment.MomentInput
  ) {
    try {
      var config = {
        method: "GET",
        url: "/mon_planning",
        baseURL: this.apiURL,
        headers: {
          Authorization: "Bearer " + process.env.AURION_TOKEN,
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

  convertToICS(calendar: any[]) {
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

  writeICS(icsMSG: string) {
    console.log("Write ics...");
    fs.writeFile("src/assets/aurion.ics", icsMSG, function (err) {
      if (err) {
        return console.log(err);
      }
    });
    console.log("ICS written");
  }
}
export default PlanningController;
