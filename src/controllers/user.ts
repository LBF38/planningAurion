import User from "../models/User";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
const apiURL = "https://formation.ensta-bretagne.fr/mobile";

function login(req: Request, res: Response, next: NextFunction) {
    getUserToken(req.body.username, req.body.password)
        .then((token: string | void) => {
            if (token === null || token === undefined) {
                return res.status(400).json({ error: "Invalid username or password" });
            }
            User.findOne({ username: req.body.username })
                .then((user) => {
                    if (user) {
                        user.token = token;
                        user.save();
                        res.render("success", { user: user });
                    } else {
                        const user = new User({
                            username: req.body.username,
                            token: token,
                        });
                        user.save();
                        res.render("success", { user: user });
                    }
                })
                .catch((error: any) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(400).json({ error }));
}

function getToken(req: Request, res: Response, next: NextFunction) {
    console.log("Getting token...");
    getUserToken(req.body.username, req.body.password)
        .then(() => {
            console.log("Token sent");
            res.redirect("/planning/form");
        })
        .catch((error) => {
            res.render("index", { error: error.message });
        });
}

async function getUserToken(username: String, password: String) {
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
        process.env.AURION_TOKEN = response.data.normal;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default { login, getToken };
