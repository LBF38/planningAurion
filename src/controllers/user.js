const User = require("../models/User");
const axios = require("axios");
const apiURL = "https://formation.ensta-bretagne.fr/mobile";

exports.getToken = (req, res, next) => {
  console.log("Getting token...");
  getUserToken(req.body.username, req.body.password)
    .then(() => {
      res.status(200).json({
        message: "Token récupéré",
        token: process.env.AURION_TOKEN,
      });
      console.log("Token sent");
    })
    .catch((error) => {
      res.status(403).json({ error: error.message });
    });
};

async function getUserToken(username, password) {
  var config = {
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
    // return process.env.AURION_TOKEN != null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
