import UserCalendar from "../models/calendar";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
class UserController {
  apiURL = "https://formation.ensta-bretagne.fr/mobile";

  getToken(req: Request, res: Response, next: NextFunction) {
    console.log("Getting token...");
    this.getUserToken(req.body.username, req.body.password)
      .then(() => {
        console.log("Token sent");
        res.redirect("/planning/form");
      })
      .catch((error) => {
        console.error(error);
        res.render("index", { error: error.message });
      });
  }

  async getUserToken(username: string, password: string) {
    if (!username || !password) {
      throw new Error("Missing username or password");
    }
    var config = {
      method: "POST",
      url: "/login",
      baseURL: this.apiURL,
      data: {
        login: username,
        password: password,
      },
    };
    try {
      const response = await axios(config);
      const aurionToken: string = response.data.normal;
      await this.saveUserToken(username, aurionToken);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async saveUserToken(username: string, aurionToken: string) {
    await UserCalendar.findOne({ username: username })
      .then((user) => {
        if (!user) {
          const user = new UserCalendar({
            username: username,
            aurionToken: aurionToken,
            calendarLink: "",
          });
          user.save();
          return;
        }
        user.aurionToken = aurionToken;
        user.save();
      })
      .catch((error) => {
        throw error;
      });
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    await UserCalendar.deleteOne({ username: req.body.username });
  }
}

export default UserController;
