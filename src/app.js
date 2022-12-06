require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const mainRoutes = require("./routes/main");
const dataRoutes = require("./routes/data");
const userRoutes = require("./routes/user");

mongoose
  .connect(
    `mongodb+srv://${process.env.BDD_USERNAME}:${process.env.BDD_PASSWORD}@cluster.ztumyqi.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs");

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/", mainRoutes);
app.use("/data", dataRoutes);
app.use("/auth", userRoutes);
app.use("/assets", express.static(path.join(__dirname, "assets")));

module.exports = app;