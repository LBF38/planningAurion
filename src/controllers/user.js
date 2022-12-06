const User = require("../models/User");
const axios = require("axios");
const apiURL = "https://formation.ensta-bretagne.fr/mobile";

exports.login = (req, res, next) => {
  getUserToken(req.body.username, req.body.password)
    .then((token) => {
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
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getToken = (req, res, next) => {
  console.log("Getting token...");
  getUserToken(req.body.username, req.body.password)
    .then(() => {
      console.log("Token sent");
      res.redirect("/planning");
    })
    .catch((error) => {
      res.render("index", { error: error.message });
    });
};

async function getUserToken(username, password) {
  if (!username || !password) {
    throw new Error("Missing username or password");
  }
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
  } catch (error) {
    console.error(error);
    throw error;
  }
}
