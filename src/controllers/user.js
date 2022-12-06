const User = require("../models/User");
const axios = require("axios");
const apiURL = "https://formation.ensta-bretagne.fr/mobile";
// const successPage = require("../views/success.html");

exports.login = (req, res, next) => {
  getUserToken(req.body.username, req.body.password)
    .then((token) => {
      User.findOne({ username: req.body.username })
        .then((user) => {
          if (user) {
            user.token = token;
            user.save();
            res.render("/");
          } else {
            const user = new User({
              username: req.body.username,
              token: token,
            });
            user.save();
            res.render("/");
          }
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getToken = (req, res, next) => {
  console.log("Getting token...");
  getUserToken(req.body.username, req.body.password)
    .then(() => {
      // res.status(200).json({
      //   message: "Token récupéré",
      //   token: process.env.AURION_TOKEN,
      // });
      console.log("Token sent");
      // res.redirect("/views/success.html");
      res.render("success");
    })
    .catch((error) => {
      // res.status(403).json({ error: error.message });
      res.render("success");
      // res.redirect("/views/success.html");
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
