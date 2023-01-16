import UserCalendar from "../models/calendar";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";

// function login(req: Request, res: Response, next: NextFunction) {
//   getUserToken(req.body.username, req.body.password)
//     .then((token: string | void) => {
//       if (token === null || token === undefined) {
//         return res.status(400).json({ error: "Invalid username or password" });
//       }
//       User.findOne({ username: req.body.username })
//         .then((user) => {
//           if (user) {
//             user.token = token;
//             user.save();
//             res.render("success", { user: user });
//           } else {
//             const user = new User({
//               username: req.body.username,
//               token: token,
//             });
//             user.save();
//             res.render("success", { user: user });
//           }
//         })
//         .catch((error: any) => res.status(400).json({ error }));
//     })
//     .catch((error) => res.status(400).json({ error }));
// }

const apiURL = "https://formation.ensta-bretagne.fr/mobile";
function getToken(req: Request, res: Response, next: NextFunction) {
  console.log("Getting token...");
  _getUserToken(req.body.username, req.body.password)
    .then(() => {
      console.log("Token sent");
      console.log(req.body.username);
      res.json({ username: req.body.username }).redirect("/planning/form");
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
    return _saveUserToken(username, aurionToken);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function _saveUserToken(username: string, aurionToken: string) {
  await UserCalendar.findOne({ username: username })
    .then(async (user) => {
      if (!user) {
        const user = new UserCalendar({
          username: username,
          aurionToken: aurionToken,
          calendarLink: `/assets/${randomUUID()}/calendar.ics`,
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

async function getUser(req: Request, res: Response, next: NextFunction) {
  await UserCalendar.findOne({ username: req.body.username }).then((user) => {
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  });
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
  await UserCalendar.deleteOne({ username: req.body.username });
}

export default { getToken, getUser, deleteUser };
