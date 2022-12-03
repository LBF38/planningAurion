const User = require("../models/User");
const axios = require("axios");

exports.getToken = (req, res, next) => {
  console.log("Getting User token...");
  var config = {
    method: "POST",
    url: "/login",
    baseURL: apiURL,
    data: {
      login: req.body.username,
      password: req.body.password,
    },
  };
  try {
    const response = axios(config);
    process.env.AURION_TOKEN = response.data.normal;
    // return process.env.AURION_TOKEN != null;
  } catch (error) {
    console.error(error);
  }
};
