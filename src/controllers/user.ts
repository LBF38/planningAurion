import UserCalendar from "../models/calendar";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";
import fs from "fs";

const apiURL = "https://formation.ensta-bretagne.fr/mobile";

function getToken(req: Request, res: Response, next: NextFunction) {
  console.log("Getting token...");
  _getUserToken(req.body.username, req.body.password)
    .then(() => {
      console.log("Token sent");
      console.log(req.body.username);
      res.cookie("username", req.body.username, { httpOnly: true });
      res.redirect("/planning/form");
    })
    .catch((error) => {
      console.error(error);
      res.render("index", { error: error.message });
    });
}

async function _getUserToken(username: string, password: string) {
  if (!username || !password) {
    throw new Error("Missing username or password");
  }
  const config = {
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
    const aurionToken: string = response.data.normal;
    console.log("Token received");
    return await _saveUserToken(username, aurionToken);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function _saveUserToken(username: string, aurionToken: string) {
  return await UserCalendar.findOne({ username: username })
    .then(async (user) => {
      if (!user) {
        const user = new UserCalendar({
          username: username,
          aurionToken: aurionToken,
          calendarLink: `${randomUUID()}_calendar.ics`,
        });
        await user.save();
        return user.aurionToken;
      }
      user.aurionToken = aurionToken;
      await user.save();
      return user.aurionToken;
    })
    .catch((error) => {
      throw error;
    });
}

async function getUser(username: string) {
  return await UserCalendar.findOne({ username: username }).then((user) => {
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  });
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
  await UserCalendar.findOne({ username: req.cookies.username }).then(
    async (user) => {
      if (!user) {
        throw new Error("User not found");
      }
      fs.unlink(user.calendarLink, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  );
  await UserCalendar.deleteOne({ username: req.body.username });
  res.clearCookie("username");
  res.redirect("/");
}

export default { getToken, getUser, deleteUser };
