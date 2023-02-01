import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import helmet from "helmet";
import cookieParser from "cookie-parser";
const debug = require("debug")("express:app");

import mainRoutes from "./routes/main";
import planningRoutes from "./routes/planning";
import userRoutes from "./routes/user";

import "./utils/database";

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(helmet());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/static")));

app.use((request: Request, response: Response, next: NextFunction) => {
  debug(request.method + " " + request.url);
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// allow scripts from https://www.googletagmanager.com
app.use((request: Request, response: Response, next: NextFunction) => {
    response.setHeader(
        "Content-Security-Policy",
        "script-src 'self' https://www.googletagmanager.com"
    );
    next();
});

app.use("/", mainRoutes);
app.use("/planning", planningRoutes);
app.use("/auth", userRoutes);
app.use("/assets", express.static(path.join(__dirname, "assets")));

export default app;
