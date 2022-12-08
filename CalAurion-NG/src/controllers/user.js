const axios = require("axios");
const apiURL = "https://formation.ensta-bretagne.fr/mobile";

let cipher = require("cipher")(process.env.REACT_APP_CIPHER_SECRET);

export async function getUserToken(username, pswd) {
  let password = cipher.decrypt(pswd);
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
    const response = await axios(config); //TODO: handle error 'axios is not a function'
    process.env.REACT_APP_AURION_TOKEN = response.data.normal;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
