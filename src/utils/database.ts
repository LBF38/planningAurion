import mongoose from "mongoose";
const debug = require("debug")("utils:database");

if (!process.env.MONGODB_URL)
  throw new Error("MONGODB_URL is not defined in .env file");

mongoose.connect(process.env.MONGODB_URL);

const database = mongoose.connection;
database.on(
  "error",
  debug.bind(debug, "Erreur lors de la connexion à MongoDB !")
);
database.once("open", () => {
  debug("Connexion à MongoDB réussie !");
});

mongoose.Promise = Promise;
